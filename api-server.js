const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// 从环境变量或 .env.local 文件读取 API keys
// 如果有 dotenv 包就使用，没有就直接从环境变量读取
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, reading from environment variables');
}

// 直接硬编码 API keys（临时解决方案）
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY';
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || 'YOUR_REPLICATE_API_KEY';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Step 1: Analyze doodle with Gemini
app.post('/api/analyze-doodle', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    const description = req.body.description || '';
    
    console.log('Analyze doodle request - has image:', !!imageFile, 'description:', description);
    
    if (!imageFile) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Convert to base64
    const base64Image = imageFile.buffer.toString('base64');
    const imageDataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;
    
    console.log('Image size:', imageFile.size, 'bytes');
    
    if (!OPENROUTER_API_KEY) {
      console.log('No OpenRouter API key, using default analysis');
      return res.json({
        success: true,
        analysis: description || '一幅充满想象力的儿童涂鸦，画面色彩丰富，线条生动活泼'
      });
    }
    
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
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || '一幅充满创意的儿童画';
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error analyzing doodle:', error);
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
    const { analysis, style, imageDataUrl } = req.body;
    
    console.log('Generate prompt request - analysis:', analysis?.substring(0, 100), 'style:', style);
    
    const ART_STYLES = {
      watercolor: { name: '水彩画', prompt: 'watercolor painting, soft colors, artistic, beautiful' },
      ghibli: { name: '吉卜力', prompt: 'Studio Ghibli style, anime art, dreamy atmosphere' },
      manga: { name: '漫画', prompt: 'manga style, anime drawing, bold lines' },
      oil: { name: '油画', prompt: 'oil painting, thick brush strokes, rich textures' },
      realistic: { name: '写实', prompt: 'photorealistic, highly detailed, professional' }
    };
    
    // 兼容处理：style 可能是 ID 或者 prompt 字符串
    let selectedStyle;
    let stylePrompt;
    
    if (ART_STYLES[style]) {
      // style 是 ID
      selectedStyle = ART_STYLES[style];
      stylePrompt = selectedStyle.prompt;
    } else {
      // style 是 prompt 字符串
      stylePrompt = style;
      // 尝试从 prompt 中识别风格
      for (const [key, value] of Object.entries(ART_STYLES)) {
        if (style.includes(value.prompt) || style.includes(value.name)) {
          selectedStyle = value;
          break;
        }
      }
      if (!selectedStyle) {
        selectedStyle = { name: '艺术', prompt: style };
      }
    }
    
    if (!OPENROUTER_API_KEY) {
      const prompt = `${analysis || 'A creative children\'s drawing'}, ${stylePrompt}, high quality, detailed, vibrant colors, child-friendly, masterpiece, best quality`;
      return res.json({ success: true, prompt });
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
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const fluxPrompt = data.choices?.[0]?.message?.content || `${analysis}, ${stylePrompt}`;
    const finalPrompt = `${fluxPrompt}, masterpiece, best quality, highly detailed`;
    
    res.json({ success: true, prompt: finalPrompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    
    // 返回一个基础 prompt，而不是错误状态
    const fallbackPrompt = `${req.body.analysis || 'A creative drawing'}, ${req.body.style || 'artistic style'}, high quality, detailed`;
    res.json({ 
      success: true,  // 改为 true，让流程继续
      prompt: fallbackPrompt,
      warning: 'Using fallback prompt due to error: ' + error.message
    });
  }
});

// Step 3: Generate art with Flux
app.post('/api/generate-art', async (req, res) => {
  try {
    const { prompt, imageUrl, promptStrength = 0.8, aspectRatio = '1:1' } = req.body;
    
    console.log('Generate art request - prompt:', prompt?.substring(0, 100), 'aspectRatio:', aspectRatio);
    
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    if (!REPLICATE_API_KEY) {
      console.log('No Replicate API key, returning placeholder');
      const placeholderSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#bg)"/>
        <text x="50%" y="45%" text-anchor="middle" font-size="48" fill="white" font-family="Arial">
          AI Art Preview
        </text>
        <text x="50%" y="55%" text-anchor="middle" font-size="24" fill="white" opacity="0.8" font-family="Arial">
          Configure API key to generate
        </text>
      </svg>`;
      const base64 = Buffer.from(placeholderSvg).toString('base64');
      return res.json({ success: true, imageUrl: `data:image/svg+xml;base64,${base64}` });
    }
    
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
    
    // 准备请求参数
    const predictionInput = {
      prompt: prompt,
      width: dimensions.width,
      height: dimensions.height,
      num_outputs: 1,
      guidance_scale: 3.5,
      num_inference_steps: 28,
      output_format: 'webp',
      output_quality: 90
    };
    
    // 如果有原图，添加 img2img 参数
    if (imageUrl && imageUrl.startsWith('data:')) {
      // 暂时不使用 img2img，因为 base64 图片可能太大
      console.log('Skipping img2img mode for base64 image');
    }
    
    console.log('Creating Replicate prediction with input:', { 
      prompt: prompt.substring(0, 50), 
      dimensions 
    });
    
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: '7f81ed39e8e8bbcdee14c19a8a81f08b088b5b6e8c4e9d088aed99c899f94026',
        input: predictionInput
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Replicate API error:', errorText);
      throw new Error(`Replicate API error: ${createResponse.statusText}`);
    }
    
    const prediction = await createResponse.json();
    
    // Poll for result
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`
          }
        }
      );
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check prediction status');
      }
      
      result = await statusResponse.json();
    }
    
    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }
    
    const generatedImageUrl = result.output?.[0];
    
    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }
    
    res.json({ success: true, imageUrl: generatedImageUrl });
  } catch (error) {
    console.error('Error generating art:', error);
    const errorSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#f8f8f8"/>
      <text x="50%" y="50%" text-anchor="middle" font-size="20" fill="#999" font-family="Arial">
        生成失败，请重试
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
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('API Keys configured:', {
    OpenRouter: OPENROUTER_API_KEY ? 'Yes' : 'No',
    Replicate: REPLICATE_API_KEY ? 'Yes' : 'No'
  });
});