// API Proxy Server for AI Transform Feature
// This server handles API calls to avoid CORS issues and protect API keys

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API Keys - 从环境变量读取
// 请创建 .env.local 文件并设置这些环境变量
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

// 检查API密钥
if (!OPENROUTER_API_KEY || !REPLICATE_API_KEY) {
    console.error('警告: API密钥未设置！');
    console.error('请创建 .env.local 文件并设置以下环境变量:');
    console.error('OPENROUTER_API_KEY=your_key_here');
    console.error('REPLICATE_API_KEY=your_key_here');
    console.error('服务器将继续运行，但API调用会失败。');
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Analyze doodle content with Gemini
app.post('/api/analyze-doodle', async (req, res) => {
    try {
        const { imageDataUrl, description } = req.body;
        
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-pro',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: systemPrompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageDataUrl
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API调用失败');
        }
        
        res.json({
            success: true,
            analysis: data.choices[0].message.content
        });
    } catch (error) {
        console.error('Analyze doodle error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate Flux prompt
app.post('/api/generate-prompt', async (req, res) => {
    try {
        const { analysis, style, imageDataUrl } = req.body;
        
        const systemPrompt = `Based on this doodle analysis, create a concise Flux AI image generation prompt.

Doodle Analysis: ${analysis}
Target Art Style: ${style}

Requirements:
1. Keep the EXACT composition, layout, and structure from the original doodle
2. Preserve the original color scheme and color positions precisely
3. Transform the style while maintaining the original scene integrity
4. Make the prompt clear, specific, and under 50 words
5. Include style keywords but maintain the original elements

Generate a prompt that will create an artistic version while keeping all original elements in their exact positions.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-pro',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: systemPrompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageDataUrl
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API调用失败');
        }
        
        res.json({
            success: true,
            prompt: data.choices[0].message.content
        });
    } catch (error) {
        console.error('Generate prompt error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate art with Flux
app.post('/api/generate-art', async (req, res) => {
    try {
        const { imageUrl, prompt, promptStrength = 0.8, aspectRatio } = req.body;
        
        // 构建输入参数
        const inputParams = {
            prompt: prompt,
            image: imageUrl,
            prompt_strength: promptStrength,
            num_outputs: 1
        };
        
        // 如果提供了宽高比，添加到参数中
        if (aspectRatio) {
            inputParams.aspect_ratio = aspectRatio;
        }
        
        const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-krea-dev/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${REPLICATE_API_KEY}`,
                'Prefer': 'wait'
            },
            body: JSON.stringify({
                input: inputParams
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.detail || 'Flux API调用失败');
        }
        
        // Poll for results if still processing
        if (data.status === 'processing' || data.status === 'starting') {
            const result = await pollForResults(data.urls.get);
            res.json({
                success: true,
                artworkUrl: result
            });
        } else if (data.status === 'succeeded' && data.output && data.output.length > 0) {
            res.json({
                success: true,
                artworkUrl: data.output[0]
            });
        } else {
            throw new Error('图片生成失败');
        }
    } catch (error) {
        console.error('Generate art error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Upload image endpoint
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No image file provided');
        }
        
        // In production, upload to cloud storage (S3, Cloudinary, etc.)
        // For now, we'll convert to base64 data URL
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({
            success: true,
            imageUrl: dataUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Poll for Flux results
async function pollForResults(url, maxAttempts = 60, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${REPLICATE_API_KEY}`
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'succeeded' && data.output && data.output.length > 0) {
                return data.output[0];
            } else if (data.status === 'failed') {
                throw new Error('生成失败：' + (data.error || '未知错误'));
            }
            
            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, interval));
        } catch (error) {
            console.error('Polling error:', error);
            throw error;
        }
    }
    
    throw new Error('生成超时');
}

// Start server
const server = app.listen(PORT, () => {
    console.log(`API Proxy Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});