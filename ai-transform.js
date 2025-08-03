// AI Transform API Integration Module

// Configuration
const API_CONFIG = {
    // Set to true to use proxy server, false for direct API calls
    useProxy: true,  // 使用代理服务器避免CORS问题
    // Proxy server URL (update this if running on a different port or host)
    proxyUrl: 'http://localhost:3001',
    // Direct API keys (only used when useProxy is false)
    // 注意：请不要在代码中硬编码API密钥！
    // 这些密钥应该通过环境变量或配置文件提供
    openRouterKey: 'YOUR_OPENROUTER_API_KEY', // 请替换为实际的API密钥
    replicateKey: 'YOUR_REPLICATE_API_KEY'    // 请替换为实际的API密钥
};

// Check if proxy is available
async function checkProxyAvailable() {
    if (!API_CONFIG.useProxy) return false;
    
    try {
        const response = await fetch(`${API_CONFIG.proxyUrl}/health`);
        const data = await response.json();
        return data.status === 'healthy';
    } catch (error) {
        console.log('Proxy server not available, using direct API calls');
        return false;
    }
}

// API Keys for direct calls
const OPENROUTER_API_KEY = API_CONFIG.openRouterKey;
const REPLICATE_API_KEY = API_CONFIG.replicateKey;

// Available art styles
const ART_STYLES = {
    watercolor: {
        name: '水彩画',
        icon: '🎨',
        prompt: 'watercolor painting, soft colors, artistic, beautiful, flowing water effects',
        description: '柔和的水彩风格'
    },
    ghibli: {
        name: '吉卜力',
        icon: '🏞️',
        prompt: 'Studio Ghibli style, anime art, dreamy atmosphere, soft pastel colors, magical',
        description: '宫崎骏动画风格'
    },
    manga: {
        name: '漫画',
        icon: '📚',
        prompt: 'manga style, anime drawing, bold lines, dynamic composition, Japanese comic art',
        description: '日本漫画风格'
    },
    oil: {
        name: '油画',
        icon: '🖼️',
        prompt: 'oil painting, thick brush strokes, rich textures, classical art style, impressionist',
        description: '经典油画风格'
    },
    realistic: {
        name: '写实',
        icon: '📷',
        prompt: 'photorealistic, highly detailed, professional photography, sharp focus, high resolution',
        description: '真实照片风格'
    }
};

// Convert canvas to base64 image
async function canvasToBase64(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]); // Remove data:image/png;base64, prefix
            };
            reader.readAsDataURL(blob);
        }, 'image/png');
    });
}

// Upload image to temporary storage (using data URL for now)
async function uploadImageToStorage(canvas) {
    return canvas.toDataURL('image/png');
}

// Step 1: Analyze doodle content with Gemini
async function analyzeDoodleContent(imageDataUrl, userDescription = '') {
    // 如果使用代理服务器
    if (API_CONFIG.useProxy) {
        try {
            const response = await fetch(`${API_CONFIG.proxyUrl}/api/analyze-doodle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageDataUrl,
                    description: userDescription
                })
            });
            
            const data = await response.json();
            if (data.success) {
                return data.analysis;
            } else {
                throw new Error(data.error || '分析失败');
            }
        } catch (error) {
            console.error('Proxy analyze error:', error);
            // 如果代理失败，尝试直接调用
            console.log('Falling back to direct API call...');
        }
    }
    
    // 直接调用API（原有代码）
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

${userDescription ? `用户对这幅画的描述：${userDescription}` : ''}

请在100字以内完成描述。`;

    try {
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
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing doodle:', error);
        throw new Error('涂鸦分析失败');
    }
}

// Step 2: Generate Flux prompt based on analysis and style
async function generateFluxPrompt(doodleAnalysis, artStyle, imageDataUrl) {
    const stylePrompt = ART_STYLES[artStyle].prompt;
    
    // 如果使用代理服务器
    if (API_CONFIG.useProxy) {
        try {
            const response = await fetch(`${API_CONFIG.proxyUrl}/api/generate-prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    analysis: doodleAnalysis,
                    style: stylePrompt,
                    imageDataUrl
                })
            });
            
            const data = await response.json();
            if (data.success) {
                return data.prompt;
            } else {
                throw new Error(data.error || '提示词生成失败');
            }
        } catch (error) {
            console.error('Proxy prompt generation error:', error);
            console.log('Falling back to direct API call...');
        }
    }
    
    // 直接调用API（原有代码）    
    const systemPrompt = `Based on this doodle analysis, create a concise Flux AI image generation prompt.

Doodle Analysis: ${doodleAnalysis}
Target Art Style: ${stylePrompt}

Requirements:
1. Keep the EXACT composition, layout, and structure from the original doodle
2. Preserve the original color scheme and color positions precisely
3. Transform the style to: ${ART_STYLES[artStyle].name}
4. Make the prompt clear, specific, and under 50 words
5. Include style keywords but maintain the original scene integrity

Generate a prompt that will create an artistic version while keeping all original elements in their exact positions.`;

    try {
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
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating Flux prompt:', error);
        throw new Error('提示词生成失败');
    }
}

// Step 3: Generate art with Flux
async function generateArtWithFlux(imageUrl, prompt, promptStrength = 0.8) {
    // 如果使用代理服务器
    if (API_CONFIG.useProxy) {
        try {
            const response = await fetch(`${API_CONFIG.proxyUrl}/api/generate-art`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageUrl,
                    prompt,
                    promptStrength
                })
            });
            
            const data = await response.json();
            if (data.success) {
                return data.artworkUrl;
            } else {
                throw new Error(data.error || '艺术画生成失败');
            }
        } catch (error) {
            console.error('Proxy art generation error:', error);
            console.log('Falling back to direct API call...');
        }
    }
    
    // 直接调用API（原有代码）
    try {
        const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-krea-dev/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${REPLICATE_API_KEY}`,
                'Prefer': 'wait'
            },
            body: JSON.stringify({
                input: {
                    prompt: prompt,
                    image: imageUrl,
                    prompt_strength: promptStrength,
                    num_outputs: 1
                }
            })
        });

        const data = await response.json();
        
        // Check if the generation is completed
        if (data.status === 'succeeded' && data.output && data.output.length > 0) {
            return data.output[0];
        } else if (data.status === 'processing' || data.status === 'starting') {
            // Poll for results if still processing
            return await pollForResults(data.urls.get);
        } else {
            throw new Error('图片生成失败');
        }
    } catch (error) {
        console.error('Error generating art with Flux:', error);
        throw new Error('艺术画生成失败');
    }
}

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

// Main transform function
async function transformDoodleToArt(canvas, artStyle, userDescription = '', onProgress = () => {}) {
    try {
        onProgress('正在准备图片...');
        
        // Convert canvas to data URL
        const imageDataUrl = await uploadImageToStorage(canvas);
        
        onProgress('正在分析涂鸦内容...');
        
        // Step 1: Analyze doodle content
        const doodleAnalysis = await analyzeDoodleContent(imageDataUrl, userDescription);
        console.log('Doodle analysis:', doodleAnalysis);
        
        onProgress('正在生成艺术提示词...');
        
        // Step 2: Generate Flux prompt
        const fluxPrompt = await generateFluxPrompt(doodleAnalysis, artStyle, imageDataUrl);
        console.log('Flux prompt:', fluxPrompt);
        
        onProgress('正在生成艺术画作...');
        
        // Upload to a public URL (for Flux API)
        // Note: In production, you'd upload to a cloud storage service
        // For now, we'll use a data URL converter service or temporary storage
        const publicImageUrl = await uploadToPublicStorage(imageDataUrl);
        
        // Step 3: Generate art with Flux
        const artworkUrl = await generateArtWithFlux(publicImageUrl, fluxPrompt);
        
        onProgress('完成！');
        
        return {
            originalImage: imageDataUrl,
            artworkUrl: artworkUrl,
            analysis: doodleAnalysis,
            prompt: fluxPrompt,
            style: ART_STYLES[artStyle].name
        };
    } catch (error) {
        console.error('Transform error:', error);
        throw error;
    }
}

// Upload to public storage
async function uploadToPublicStorage(dataUrl) {
    try {
        // 使用ImageUpload模块上传图片
        if (window.ImageUpload && window.ImageUpload.uploadImageToPublic) {
            console.log('Uploading image to get public URL...');
            const publicUrl = await window.ImageUpload.uploadImageToPublic(dataUrl);
            console.log('Image uploaded successfully:', publicUrl);
            return publicUrl;
        } else {
            console.warn('ImageUpload module not available, using data URL');
            return dataUrl;
        }
    } catch (error) {
        console.error('Upload error:', error);
        // Fallback to data URL
        console.warn('Failed to upload, using data URL as fallback');
        return dataUrl;
    }
}

// Export functions and constants
window.ArtTransform = {
    ART_STYLES,
    transformDoodleToArt,
    canvasToBase64,
    analyzeDoodleContent,
    generateFluxPrompt,
    generateArtWithFlux
};