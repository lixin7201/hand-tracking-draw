const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Load API keys
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, using hardcoded keys');
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY';
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || 'YOUR_REPLICATE_API_KEY';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', keys: {
    openrouter: !!OPENROUTER_API_KEY,
    replicate: !!REPLICATE_API_KEY
  }});
});

// Step 1: Analyze doodle
app.post('/api/analyze-doodle', upload.single('image'), async (req, res) => {
  try {
    console.log('[analyze-doodle] Request received');
    const imageFile = req.file;
    const description = req.body.description || '';
    
    if (!imageFile) {
      console.error('[analyze-doodle] No image provided');
      return res.status(400).json({ error: 'No image provided' });
    }
    
    console.log(`[analyze-doodle] Image size: ${imageFile.size} bytes, description: "${description}"`);
    const base64Image = imageFile.buffer.toString('base64');
    const imageDataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;
    
    const systemPrompt = `你是一个富有想象力的艺术分析师。请仔细观察这幅儿童涂鸦，并进行以下分析：

1. 识别画面中的主要元素（人物、动物、物体、场景等）
2. 根据涂鸦的线条和形状，推断作者想表达的完整场景
3. 发挥想象力，补充画面中可能存在但未完全画出的细节
4. 注意保留原画的色彩特点和构图布局

请用简洁清晰的语言描述这幅画的完整内容，包括：
- 主要对象及其特征
- 场景环境
- 色彩特点
- 情感氛围
- 任何特殊的创意元素

${description ? `用户对这幅画的描述：${description}` : ''}

请在100字以内完成描述。`;
    
    console.log('[analyze-doodle] Calling OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-thinking-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[analyze-doodle] OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || '一幅充满创意的儿童画';
    
    console.log('[analyze-doodle] Success, analysis:', analysis.substring(0, 100) + '...');
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('[analyze-doodle] Error:', error.message);
    res.json({
      success: false,
      error: error.message,
      analysis: '一幅充满想象力的儿童涂鸦作品'
    });
  }
});

// Step 2: Generate Flux prompt
app.post('/api/generate-prompt', async (req, res) => {
  try {
    console.log('[generate-prompt] Request received');
    const { analysis, style, imageDataUrl } = req.body;
    
    console.log(`[generate-prompt] Analysis: "${analysis?.substring(0, 50)}...", Style: "${style}"`);
    
    // Art styles mapping
    const ART_STYLES = {
      watercolor: { name: '水彩画', prompt: 'watercolor painting, soft colors, artistic, beautiful' },
      ghibli: { name: '吉卜力', prompt: 'Studio Ghibli style, anime art, dreamy atmosphere' },
      manga: { name: '漫画', prompt: 'manga style, anime drawing, bold lines' },
      oil: { name: '油画', prompt: 'oil painting, thick brush strokes, rich textures' },
      realistic: { name: '写实', prompt: 'photorealistic, highly detailed, professional' }
    };
    
    // Determine style
    let selectedStyle;
    let stylePrompt;
    
    if (ART_STYLES[style]) {
      selectedStyle = ART_STYLES[style];
      stylePrompt = selectedStyle.prompt;
      console.log(`[generate-prompt] Using predefined style: ${selectedStyle.name}`);
    } else if (typeof style === 'string') {
      // Try to match style from string
      stylePrompt = style;
      for (const [key, value] of Object.entries(ART_STYLES)) {
        if (style.includes(value.prompt) || style.includes(value.name)) {
          selectedStyle = value;
          break;
        }
      }
      if (!selectedStyle) {
        selectedStyle = { name: '艺术', prompt: style };
      }
      console.log(`[generate-prompt] Using custom style: ${stylePrompt}`);
    } else {
      // Default style
      selectedStyle = ART_STYLES.watercolor;
      stylePrompt = selectedStyle.prompt;
      console.log('[generate-prompt] Using default watercolor style');
    }
    
    const systemPrompt = `Based on this doodle analysis, create a concise Flux AI image generation prompt.

Doodle Analysis: ${analysis}
Target Art Style: ${stylePrompt}

Requirements:
1. Keep the EXACT composition, layout, and structure from the original doodle
2. Preserve the original color scheme and color positions precisely
3. Transform the style to: ${selectedStyle.name}
4. Make the prompt clear, specific, and under 50 words
5. Include style keywords but maintain the original scene integrity

Generate a prompt that will create an artistic version while keeping all original elements in their exact positions.`;
    
    console.log('[generate-prompt] Calling OpenRouter API for prompt generation...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-thinking-exp:free',
        messages: [
          {
            role: 'user',
            content: imageDataUrl ? [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ] : systemPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-prompt] OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const fluxPrompt = data.choices?.[0]?.message?.content || `${analysis}, ${stylePrompt}`;
    const finalPrompt = `${fluxPrompt}, masterpiece, best quality, highly detailed`;
    
    console.log('[generate-prompt] Success, prompt:', finalPrompt.substring(0, 100) + '...');
    res.json({ success: true, prompt: finalPrompt });
  } catch (error) {
    console.error('[generate-prompt] Error:', error.message);
    // Return success with fallback prompt to continue the flow
    const fallbackPrompt = `${req.body.analysis || 'A creative drawing'}, ${req.body.style || 'artistic style'}, high quality, detailed`;
    console.log('[generate-prompt] Using fallback prompt:', fallbackPrompt);
    res.json({ 
      success: true,
      prompt: fallbackPrompt,
      warning: 'Using fallback prompt'
    });
  }
});

// Step 3: Generate art with Flux
app.post('/api/generate-art', async (req, res) => {
  try {
    console.log('[generate-art] Request received');
    const { prompt, imageUrl, promptStrength = 0.8, aspectRatio = '1:1' } = req.body;
    
    console.log(`[generate-art] Prompt: "${prompt?.substring(0, 50)}...", Aspect ratio: ${aspectRatio}`);
    
    if (!prompt) {
      console.error('[generate-art] No prompt provided');
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // Aspect ratio dimensions
    const ASPECT_RATIOS = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1365, height: 768 },
      '21:9': { width: 1536, height: 640 },
      '3:2': { width: 1254, height: 836 },
      '2:3': { width: 836, height: 1254 },
      '4:5': { width: 916, height: 1145 },
      '5:4': { width: 1145, height: 916 },
      '3:4': { width: 886, height: 1182 },
      '4:3': { width: 1182, height: 886 },
      '9:16': { width: 768, height: 1365 },
      '9:21': { width: 640, height: 1536 }
    };
    
    const dimensions = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['1:1'];
    console.log(`[generate-art] Using dimensions: ${dimensions.width}x${dimensions.height}`);
    
    // Flux 1.1 Pro version ID
    const FLUX_VERSION = 'e384919e02b9b82dd6038fd5e28a91bf58c7b473b7c91497d0f7e45dc996bc06';
    
    const predictionInput = {
      prompt: prompt,
      width: dimensions.width,
      height: dimensions.height,
      num_outputs: 1,
      guidance: 3.5,
      output_format: 'webp',
      output_quality: 90,
      prompt_upsampling: true
    };
    
    console.log('[generate-art] Creating Replicate prediction...');
    console.log('[generate-art] Using Flux version:', FLUX_VERSION);
    
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: FLUX_VERSION,
        input: predictionInput
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('[generate-art] Replicate API error:', errorText);
      throw new Error(`Replicate API error: ${createResponse.statusText} - ${errorText}`);
    }
    
    const prediction = await createResponse.json();
    console.log(`[generate-art] Prediction created with ID: ${prediction.id}, status: ${prediction.status}`);
    
    // Poll for result
    let result = prediction;
    let pollCount = 0;
    const maxPolls = 60; // 60 seconds max
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      pollCount++;
      
      console.log(`[generate-art] Polling status (${pollCount}/${maxPolls})...`);
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`
          }
        }
      );
      
      if (!statusResponse.ok) {
        console.error('[generate-art] Failed to check prediction status');
        throw new Error('Failed to check prediction status');
      }
      
      result = await statusResponse.json();
      console.log(`[generate-art] Status: ${result.status}`);
    }
    
    if (result.status === 'failed') {
      console.error('[generate-art] Image generation failed:', result.error);
      throw new Error(`Image generation failed: ${result.error}`);
    }
    
    if (pollCount >= maxPolls) {
      console.error('[generate-art] Timeout waiting for image generation');
      throw new Error('Timeout waiting for image generation');
    }
    
    const generatedImageUrl = result.output?.[0];
    
    if (!generatedImageUrl) {
      console.error('[generate-art] No image generated');
      throw new Error('No image generated');
    }
    
    console.log('[generate-art] Success! Image URL:', generatedImageUrl);
    res.json({ success: true, imageUrl: generatedImageUrl });
  } catch (error) {
    console.error('[generate-art] Error:', error.message);
    const errorSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#f8f8f8"/>
      <text x="50%" y="50%" text-anchor="middle" font-size="20" fill="#999" font-family="Arial">
        生成失败: ${error.message}
      </text>
    </svg>`;
    const base64 = Buffer.from(errorSvg).toString('base64');
    res.json({
      success: false,
      error: error.message,
      imageUrl: `data:image/svg+xml;base64,${base64}`
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
=====================================
API Server Started Successfully
=====================================
URL: http://localhost:${PORT}
Time: ${new Date().toISOString()}

API Keys Status:
- OpenRouter: ${OPENROUTER_API_KEY ? '✓ Configured' : '✗ Missing'}
- Replicate: ${REPLICATE_API_KEY ? '✓ Configured' : '✗ Missing'}

Endpoints:
- GET  /health
- POST /api/analyze-doodle
- POST /api/generate-prompt
- POST /api/generate-art
=====================================
  `);
});