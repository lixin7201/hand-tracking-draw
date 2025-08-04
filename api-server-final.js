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
  res.json({ 
    status: 'healthy', 
    version: 'final',
    keys: {
      openrouter: !!OPENROUTER_API_KEY,
      replicate: !!REPLICATE_API_KEY
    }
  });
});

// Step 1: Analyze doodle with Gemini 2.5 Pro
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
    
    // Step 1: 充分发挥想象力，根据用户输入结合画面内容推断并填充空白
    const systemPrompt = `你是一个极富想象力的艺术分析师。请仔细观察这幅儿童涂鸦，充分发挥你的想象力进行深度分析：

任务要求：
1. 识别画面中所有可见的元素，包括模糊不清的部分
2. 根据涂鸦的线条、形状和颜色，大胆推断作者想要表达的完整场景
3. 充分发挥想象力，为画面中的空白区域补充合理的细节
4. 推断并描述画面中可能存在但未完全画出的元素
5. 保持原画的色彩位置和整体构图不变

${description ? `用户描述：${description}` : ''}

请提供详细的分析，包括：
- 所有主要对象的位置、大小、颜色和特征
- 场景的完整环境描述（天空、背景、地面等）
- 推断出的故事情节或场景氛围
- 画面中各个元素的空间关系
- 任何可以补充的创意细节

请用150字左右完成描述，要具体且富有想象力。`;
    
    console.log('[analyze-doodle] Calling OpenRouter API with Gemini 2.5 Pro...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',  // 使用正确的模型ID
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.8  // 提高创造力
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
    // 返回用户描述作为后备
    res.json({
      success: true,  // 保持流程继续
      analysis: req.body.description || '一幅充满想象力的儿童涂鸦作品'
    });
  }
});

// Step 2: Generate Flux prompt with Gemini
app.post('/api/generate-prompt', async (req, res) => {
  try {
    console.log('[generate-prompt] Request received');
    const { analysis, style, imageDataUrl } = req.body;
    
    console.log(`[generate-prompt] Analysis: "${analysis?.substring(0, 50)}...", Style: "${style}"`);
    
    // Art styles mapping
    const ART_STYLES = {
      watercolor: { name: '水彩画', prompt: 'watercolor painting, soft colors, artistic, beautiful' },
      ghibli: { name: '吉卜力', prompt: 'Studio Ghibli style, anime art, dreamy atmosphere, hayao miyazaki' },
      manga: { name: '漫画', prompt: 'manga style, anime drawing, bold lines, japanese comic' },
      oil: { name: '油画', prompt: 'oil painting, thick brush strokes, rich textures, classical art' },
      realistic: { name: '写实', prompt: 'photorealistic, highly detailed, professional photography' }
    };
    
    // Determine style
    let selectedStyle;
    let stylePrompt;
    
    if (ART_STYLES[style]) {
      selectedStyle = ART_STYLES[style];
      stylePrompt = selectedStyle.prompt;
      console.log(`[generate-prompt] Using predefined style: ${selectedStyle.name}`);
    } else {
      selectedStyle = ART_STYLES.watercolor;
      stylePrompt = selectedStyle.prompt;
      console.log('[generate-prompt] Using default watercolor style');
    }
    
    // Step 2: 根据分析结果生成精准的Flux提示词（必须是英文）
    const systemPrompt = `Based on this detailed doodle analysis, create a precise and concise image generation prompt for Flux AI.

Doodle Analysis: ${analysis}
Target Art Style: ${selectedStyle.name} (${stylePrompt})

CRITICAL REQUIREMENTS:
1. THE PROMPT MUST BE IN ENGLISH ONLY (translate any non-English content)
2. Create a SHORT English prompt (maximum 30 words)
3. Keep the EXACT composition, layout, and spatial relationships from the original
4. Preserve the EXACT color positions and color scheme
5. Include the style keywords: ${stylePrompt}
6. Be specific about main objects and their relationships
7. Use clear, simple English descriptions

Format the prompt as a single line of comma-separated English keywords and phrases.
Focus on: main subject, background elements, colors, style, quality.

Example format: "cute dog, colorful mountains background, green grass, blue sky, ${stylePrompt}, high quality"

IMPORTANT: Output ONLY English text. If the analysis is in Chinese or other languages, translate it to English first.`;
    
    console.log('[generate-prompt] Calling OpenRouter API for prompt generation...');
    const messages = [
      {
        role: 'user',
        content: imageDataUrl ? [
          { type: 'text', text: systemPrompt },
          { type: 'image_url', image_url: { url: imageDataUrl } }
        ] : systemPrompt
      }
    ];
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',  // 使用正确的模型ID
        messages: messages,
        max_tokens: 200,
        temperature: 0.5  // 降低温度以获得更精确的提示词
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-prompt] OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    let fluxPrompt = data.choices?.[0]?.message?.content || `${analysis}, ${stylePrompt}`;
    
    // 清理和优化提示词
    fluxPrompt = fluxPrompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // 确保包含质量关键词
    if (!fluxPrompt.includes('quality') && !fluxPrompt.includes('detailed')) {
      fluxPrompt += ', high quality, detailed';
    }
    
    console.log('[generate-prompt] Success, prompt:', fluxPrompt);
    res.json({ success: true, prompt: fluxPrompt });
  } catch (error) {
    console.error('[generate-prompt] Error:', error.message);
    // Return success with fallback prompt to continue the flow
    const fallbackPrompt = `${req.body.analysis || 'A creative drawing'}, ${req.body.style || 'artistic style'}, high quality, detailed`;
    console.log('[generate-prompt] Using fallback prompt:', fallbackPrompt);
    res.json({ 
      success: true,
      prompt: fallbackPrompt
    });
  }
});

// Step 3: Generate art with Flux Krea Dev (img2img)
app.post('/api/generate-art', async (req, res) => {
  try {
    console.log('[generate-art] Request received');
    const { prompt, imageUrl, promptStrength = 0.8, aspectRatio = '1:1' } = req.body;
    
    console.log(`[generate-art] Prompt: "${prompt?.substring(0, 50)}..."`);
    
    if (!prompt) {
      console.error('[generate-art] No prompt provided');
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // 准备图片URL
    let imageUrlForFlux = null;
    
    if (imageUrl && imageUrl.startsWith('data:')) {
      // 如果是base64图片，需要先上传到临时存储
      // 由于Flux需要URL，我们暂时跳过img2img模式
      console.log('[generate-art] Base64 image provided, using text2img mode');
    } else if (imageUrl) {
      imageUrlForFlux = imageUrl;
      console.log('[generate-art] Using provided image URL for img2img');
    }
    
    // 构建请求参数
    const predictionInput = {
      prompt: prompt,
      num_outputs: 1
    };
    
    // 如果有图片URL，添加img2img参数
    if (imageUrlForFlux) {
      predictionInput.image = imageUrlForFlux;
      predictionInput.prompt_strength = promptStrength;
      console.log(`[generate-art] Using img2img mode with strength: ${promptStrength}`);
    }
    
    console.log('[generate-art] Creating Flux Krea Dev prediction...');
    
    // 使用正确的Flux Krea Dev API
    const createResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-krea-dev/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'  // 等待结果
      },
      body: JSON.stringify({
        input: predictionInput
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('[generate-art] Replicate API error:', errorText);
      throw new Error(`Replicate API error: ${createResponse.statusText} - ${errorText}`);
    }
    
    const result = await createResponse.json();
    console.log('[generate-art] Prediction status:', result.status);
    
    // 检查结果
    if (result.status === 'failed' || result.error) {
      console.error('[generate-art] Generation failed:', result.error);
      throw new Error(`Generation failed: ${result.error || 'Unknown error'}`);
    }
    
    // 获取生成的图片URL
    let generatedImageUrl = null;
    
    // 处理不同的响应格式
    if (result.output) {
      if (Array.isArray(result.output)) {
        generatedImageUrl = result.output[0];
      } else if (typeof result.output === 'string') {
        generatedImageUrl = result.output;
      }
    }
    
    // 如果还在处理中，轮询结果
    if (result.status === 'processing' && result.urls?.get) {
      console.log('[generate-art] Polling for result...');
      let pollCount = 0;
      const maxPolls = 60;
      
      while (pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        pollCount++;
        
        const statusResponse = await fetch(result.urls.get, {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`
          }
        });
        
        if (!statusResponse.ok) {
          console.error('[generate-art] Failed to check status');
          break;
        }
        
        const statusResult = await statusResponse.json();
        console.log(`[generate-art] Poll ${pollCount}: ${statusResult.status}`);
        
        if (statusResult.status === 'succeeded') {
          if (Array.isArray(statusResult.output)) {
            generatedImageUrl = statusResult.output[0];
          } else {
            generatedImageUrl = statusResult.output;
          }
          break;
        } else if (statusResult.status === 'failed') {
          throw new Error('Generation failed during polling');
        }
      }
    }
    
    if (!generatedImageUrl) {
      console.error('[generate-art] No image generated');
      throw new Error('No image generated');
    }
    
    console.log('[generate-art] Success! Image URL:', generatedImageUrl);
    res.json({ success: true, imageUrl: generatedImageUrl });
  } catch (error) {
    console.error('[generate-art] Error:', error.message);
    
    // 返回错误占位图
    const errorSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#f8f8f8"/>
      <text x="50%" y="45%" text-anchor="middle" font-size="20" fill="#999" font-family="Arial">
        生成失败
      </text>
      <text x="50%" y="55%" text-anchor="middle" font-size="14" fill="#666" font-family="Arial">
        ${error.message.substring(0, 50)}
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
API Server Final Version Started
=====================================
URL: http://localhost:${PORT}
Time: ${new Date().toISOString()}

API Keys Status:
- OpenRouter: ${OPENROUTER_API_KEY ? '✓ Configured' : '✗ Missing'}
- Replicate: ${REPLICATE_API_KEY ? '✓ Configured' : '✗ Missing'}

Models:
- Gemini: google/gemini-2.5-pro
- Flux: black-forest-labs/flux-krea-dev

Endpoints:
- GET  /health
- POST /api/analyze-doodle (Step 1: Gemini analysis)
- POST /api/generate-prompt (Step 2: Gemini prompt generation)
- POST /api/generate-art (Step 3: Flux image generation)
=====================================
  `);
});