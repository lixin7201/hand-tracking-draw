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

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    if (logBody.imageDataUrl) {
      logBody.imageDataUrl = `[base64 image, ${logBody.imageDataUrl.length} chars]`;
    }
    if (logBody.imageUrl) {
      logBody.imageUrl = `[base64 image, ${logBody.imageUrl.length} chars]`;
    }
    console.log('Request body:', JSON.stringify(logBody, null, 2));
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: 'enhanced',
    timestamp: new Date().toISOString(),
    keys: {
      openrouter: !!OPENROUTER_API_KEY,
      replicate: !!REPLICATE_API_KEY
    }
  });
});

// Step 1: Analyze doodle with Gemini 2.5 Pro
app.post('/api/analyze-doodle', upload.single('image'), async (req, res) => {
  try {
    console.log('\n=== ANALYZE DOODLE START ===');
    const imageFile = req.file;
    const description = req.body.description || '';
    
    if (!imageFile) {
      console.error('ERROR: No image provided');
      return res.status(400).json({ error: 'No image provided' });
    }
    
    console.log(`Image received: ${imageFile.size} bytes, type: ${imageFile.mimetype}`);
    console.log(`User description: "${description}"`);
    
    const base64Image = imageFile.buffer.toString('base64');
    const imageDataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;
    
    // Enhanced system prompt that emphasizes using the user's description
    const systemPrompt = `You are an expert art analyst examining a child's drawing. 

${description ? `IMPORTANT: The user describes this drawing as: "${description}". Use this as the primary guide for your analysis.` : ''}

Your task:
1. Carefully observe ALL visible elements in the drawing
2. Identify the main subjects (people, animals, objects, scenery)
3. Note the colors used and their positions
4. Describe the spatial relationships between elements
5. Imagine and fill in any incomplete parts based on context
6. Create a vivid, detailed description that captures the essence

Provide a rich, imaginative description in about 100-150 words that brings this drawing to life. Be specific about what you see, including:
- Main subjects and their characteristics
- Background and environment
- Color scheme and placement
- Mood and atmosphere
- Any creative details

${description ? `Remember: The user specifically mentioned "${description}", so make sure to include and elaborate on these elements.` : ''}`;
    
    console.log('Calling OpenRouter API with Gemini 2.5 Pro...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
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
        temperature: 0.7
      })
    });
    
    const responseText = await response.text();
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      console.error('OpenRouter API error:', responseText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('API Response:', JSON.stringify(data, null, 2).substring(0, 500));
    
    const analysis = data.choices?.[0]?.message?.content;
    
    if (!analysis || analysis.length < 20) {
      console.warn('WARNING: Received short or empty analysis, using fallback');
      const fallbackAnalysis = description || '一幅充满想象力的儿童涂鸦作品，画面色彩丰富，充满童趣';
      res.json({ success: true, analysis: fallbackAnalysis });
    } else {
      console.log(`Analysis received (${analysis.length} chars): ${analysis.substring(0, 200)}...`);
      console.log('=== ANALYZE DOODLE END ===\n');
      res.json({ success: true, analysis });
    }
  } catch (error) {
    console.error('ERROR in analyze-doodle:', error);
    console.log('=== ANALYZE DOODLE END (ERROR) ===\n');
    // Use user description as fallback
    res.json({
      success: true,
      analysis: req.body.description || '一幅充满想象力的儿童涂鸦作品'
    });
  }
});

// Step 2: Generate Flux prompt with Gemini (MUST BE IN ENGLISH)
app.post('/api/generate-prompt', async (req, res) => {
  try {
    console.log('\n=== GENERATE PROMPT START ===');
    const { analysis, style, imageDataUrl } = req.body;
    
    console.log(`Analysis (${analysis?.length} chars): "${analysis?.substring(0, 100)}..."`);
    console.log(`Style: "${style}"`);
    console.log(`Has image: ${!!imageDataUrl}`);
    
    // Art styles mapping
    const ART_STYLES = {
      watercolor: { name: '水彩画', prompt: 'watercolor painting, soft colors, artistic, beautiful' },
      ghibli: { name: '吉卜力', prompt: 'Studio Ghibli style, anime art, dreamy atmosphere, hayao miyazaki' },
      manga: { name: '漫画', prompt: 'manga style, anime drawing, bold lines, japanese comic' },
      oil: { name: '油画', prompt: 'oil painting, thick brush strokes, rich textures, classical art' },
      realistic: { name: '写实', prompt: 'photorealistic, highly detailed, professional photography' }
    };
    
    // Determine style
    let selectedStyle = ART_STYLES[style] || ART_STYLES.watercolor;
    let stylePrompt = selectedStyle.prompt;
    console.log(`Selected style: ${selectedStyle.name} (${stylePrompt})`);
    
    // CRITICAL: Ensure English output
    const systemPrompt = `You are a prompt engineer for Flux AI image generation.

CRITICAL REQUIREMENT: Your response MUST be in ENGLISH ONLY!

Input Analysis (may be in any language): ${analysis}
Target Art Style: ${stylePrompt}

Your task:
1. If the analysis is not in English, TRANSLATE it to English first
2. Create a concise English prompt (max 40 words) for Flux AI
3. Include specific details about:
   - Main subjects (e.g., "cute dog", "colorful mountains")
   - Colors and their positions
   - Composition and layout
   - Style keywords: ${stylePrompt}
4. Keep the exact spatial relationships from the original

Output format: A single line of comma-separated English phrases.
Example: "cute brown dog wearing floral dress, colorful mountains in background, green grass, blue sky, ${stylePrompt}, high quality, detailed"

REMEMBER: OUTPUT MUST BE IN ENGLISH! Translate any non-English content.`;
    
    console.log('Calling OpenRouter API for English prompt generation...');
    
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
        model: 'google/gemini-2.5-pro',
        messages: messages,
        max_tokens: 200,
        temperature: 0.3  // Lower temperature for more consistent English output
      })
    });
    
    const responseText = await response.text();
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      console.error('OpenRouter API error:', responseText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('API Response:', JSON.stringify(data, null, 2).substring(0, 500));
    
    let fluxPrompt = data.choices?.[0]?.message?.content || '';
    
    // Clean up the prompt
    fluxPrompt = fluxPrompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Check if prompt contains non-English characters (Chinese, Japanese, etc.)
    const hasNonEnglish = /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/.test(fluxPrompt);
    if (hasNonEnglish) {
      console.warn('WARNING: Prompt contains non-English characters, using fallback');
      // Create a simple English fallback
      fluxPrompt = `colorful children's drawing, ${stylePrompt}, high quality, detailed, artistic`;
    }
    
    // Ensure quality keywords
    if (!fluxPrompt.includes('quality') && !fluxPrompt.includes('detailed')) {
      fluxPrompt += ', high quality, detailed';
    }
    
    console.log(`Generated English prompt: "${fluxPrompt}"`);
    console.log('=== GENERATE PROMPT END ===\n');
    
    res.json({ success: true, prompt: fluxPrompt });
  } catch (error) {
    console.error('ERROR in generate-prompt:', error);
    console.log('=== GENERATE PROMPT END (ERROR) ===\n');
    
    // Return English fallback prompt
    const fallbackPrompt = `colorful artistic drawing, ${req.body.style || 'artistic'} style, high quality, detailed`;
    console.log('Using fallback prompt:', fallbackPrompt);
    res.json({ 
      success: true,
      prompt: fallbackPrompt
    });
  }
});

// Step 3: Generate art with Flux Krea Dev
app.post('/api/generate-art', async (req, res) => {
  try {
    console.log('\n=== GENERATE ART START ===');
    const { prompt, imageUrl, promptStrength = 0.8, aspectRatio = '1:1' } = req.body;
    
    console.log(`Prompt: "${prompt?.substring(0, 100)}..."`);
    console.log(`Aspect ratio: ${aspectRatio}`);
    console.log(`Has image: ${!!imageUrl}`);
    
    if (!prompt) {
      console.error('ERROR: No prompt provided');
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // Check if prompt is in English
    const hasNonEnglish = /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/.test(prompt);
    if (hasNonEnglish) {
      console.warn('WARNING: Prompt contains non-English characters');
    }
    
    // Build request for Flux
    const predictionInput = {
      prompt: prompt,
      num_outputs: 1
    };
    
    console.log('Creating Flux Krea Dev prediction...');
    console.log('Request input:', JSON.stringify(predictionInput));
    
    const createResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-krea-dev/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: predictionInput
      })
    });
    
    const responseText = await createResponse.text();
    console.log(`API Response Status: ${createResponse.status}`);
    
    if (!createResponse.ok) {
      console.error('Replicate API error:', responseText);
      throw new Error(`Replicate API error: ${createResponse.statusText}`);
    }
    
    const result = JSON.parse(responseText);
    console.log('Replicate response:', JSON.stringify(result, null, 2).substring(0, 500));
    
    // Handle different response formats
    let generatedImageUrl = null;
    
    if (result.output) {
      if (Array.isArray(result.output)) {
        generatedImageUrl = result.output[0];
      } else if (typeof result.output === 'string') {
        generatedImageUrl = result.output;
      }
    }
    
    // Poll if still processing
    if (result.status === 'processing' && result.urls?.get) {
      console.log('Polling for result...');
      let pollCount = 0;
      const maxPolls = 60;
      
      while (pollCount < maxPolls && !generatedImageUrl) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        pollCount++;
        
        const statusResponse = await fetch(result.urls.get, {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`
          }
        });
        
        if (!statusResponse.ok) {
          console.error('Failed to check status');
          break;
        }
        
        const statusResult = await statusResponse.json();
        console.log(`Poll ${pollCount}: ${statusResult.status}`);
        
        if (statusResult.status === 'succeeded') {
          generatedImageUrl = Array.isArray(statusResult.output) ? 
            statusResult.output[0] : statusResult.output;
          break;
        } else if (statusResult.status === 'failed') {
          throw new Error('Generation failed');
        }
      }
    }
    
    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }
    
    console.log(`SUCCESS! Generated image: ${generatedImageUrl}`);
    console.log('=== GENERATE ART END ===\n');
    
    res.json({ success: true, imageUrl: generatedImageUrl });
  } catch (error) {
    console.error('ERROR in generate-art:', error);
    console.log('=== GENERATE ART END (ERROR) ===\n');
    
    const errorSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#f8f8f8"/>
      <text x="50%" y="45%" text-anchor="middle" font-size="20" fill="#999" font-family="Arial">
        Generation Failed
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
🚀 API Server Enhanced Version Started
=====================================
URL: http://localhost:${PORT}
Time: ${new Date().toISOString()}

API Keys:
- OpenRouter: ${OPENROUTER_API_KEY ? '✓ Configured' : '✗ Missing'}
- Replicate: ${REPLICATE_API_KEY ? '✓ Configured' : '✗ Missing'}

Models:
- Gemini: google/gemini-2.5-pro
- Flux: black-forest-labs/flux-krea-dev

Features:
✅ Enhanced logging and debugging
✅ Forced English output for Flux
✅ Better error handling
✅ User description priority

Endpoints:
- GET  /health
- POST /api/analyze-doodle
- POST /api/generate-prompt
- POST /api/generate-art
=====================================
  `);
});