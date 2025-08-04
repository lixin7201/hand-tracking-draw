// AI Transform Integration for Next.js
// 严格按照原版本逻辑：Gemini 分析 -> Flux 提示词生成 -> Flux 出图

// 支持的宽高比
const SUPPORTED_ASPECT_RATIOS = [
    { ratio: "1:1", value: 1 },
    { ratio: "16:9", value: 16/9 },
    { ratio: "21:9", value: 21/9 },
    { ratio: "3:2", value: 3/2 },
    { ratio: "2:3", value: 2/3 },
    { ratio: "4:5", value: 4/5 },
    { ratio: "5:4", value: 5/4 },
    { ratio: "3:4", value: 3/4 },
    { ratio: "4:3", value: 4/3 },
    { ratio: "9:16", value: 9/16 },
    { ratio: "9:21", value: 9/21 }
];

// Art styles (matching the constants)
const ART_STYLES = {
    watercolor: {
        name: '水彩画',
        icon: '🎨',
        prompt: 'watercolor painting, soft colors, artistic, beautiful',
        description: '柔和的水彩风格'
    },
    ghibli: {
        name: '吉卜力',
        icon: '🏞️',
        prompt: 'Studio Ghibli style, anime art, dreamy atmosphere',
        description: '宫崎骏动画风格'
    },
    manga: {
        name: '漫画',
        icon: '📚',
        prompt: 'manga style, anime drawing, bold lines',
        description: '日本漫画风格'
    },
    oil: {
        name: '油画',
        icon: '🖼️',
        prompt: 'oil painting, thick brush strokes, rich textures',
        description: '经典油画风格'
    },
    realistic: {
        name: '写实',
        icon: '📷',
        prompt: 'photorealistic, highly detailed, professional',
        description: '真实照片风格'
    }
};

// 获取最接近的支持宽高比
function getClosestAspectRatio(width, height) {
    const currentRatio = width / height;
    let closestRatio = SUPPORTED_ASPECT_RATIOS[0];
    let minDiff = Math.abs(currentRatio - closestRatio.value);
    
    for (const ratio of SUPPORTED_ASPECT_RATIOS) {
        const diff = Math.abs(currentRatio - ratio.value);
        if (diff < minDiff) {
            minDiff = diff;
            closestRatio = ratio;
        }
    }
    
    return closestRatio;
}

// 调整画布到支持的宽高比（白底）
function adjustCanvasToSupportedRatio(sourceCanvas) {
    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;
    
    // 获取最接近的支持宽高比
    const targetRatio = getClosestAspectRatio(sourceWidth, sourceHeight);
    console.log(`Adjusting aspect ratio from ${sourceWidth}x${sourceHeight} to ${targetRatio.ratio}`);
    
    // 计算新的尺寸
    let newWidth, newHeight;
    const currentRatio = sourceWidth / sourceHeight;
    
    if (currentRatio > targetRatio.value) {
        // 图片太宽，需要增加高度
        newHeight = sourceHeight;
        newWidth = Math.round(sourceHeight * targetRatio.value);
    } else if (currentRatio < targetRatio.value) {
        // 图片太高，需要增加宽度
        newWidth = sourceWidth;
        newHeight = Math.round(sourceWidth / targetRatio.value);
    } else {
        // 比例正好，不需要调整
        newWidth = sourceWidth;
        newHeight = sourceHeight;
    }
    
    // 创建新的画布
    const adjustedCanvas = document.createElement('canvas');
    adjustedCanvas.width = newWidth;
    adjustedCanvas.height = newHeight;
    const ctx = adjustedCanvas.getContext('2d');
    
    // 填充白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newWidth, newHeight);
    
    // 居中绘制原图
    const dx = (newWidth - sourceWidth) / 2;
    const dy = (newHeight - sourceHeight) / 2;
    ctx.drawImage(sourceCanvas, dx, dy);
    
    return {
        canvas: adjustedCanvas,
        aspectRatio: targetRatio.ratio
    };
}

// 主转换函数 - 严格按照原版本的三步流程
async function transformDoodle(canvas, style, userDescription = '', onProgress) {
    try {
        console.log('Starting AI transformation with Gemini + Flux...');
        
        // 更新进度
        if (onProgress) onProgress('正在调整画布比例...');
        
        // 调整画布到支持的宽高比
        const adjusted = adjustCanvasToSupportedRatio(canvas);
        const imageDataUrl = adjusted.canvas.toDataURL('image/png');
        const aspectRatio = adjusted.aspectRatio;
        
        console.log(`Using aspect ratio: ${aspectRatio}`);
        
        // Step 1: 使用 Gemini 分析涂鸦
        if (onProgress) onProgress('正在分析涂鸦内容...');
        console.log('Step 1: Analyzing doodle with Gemini...');
        
        let analysis = userDescription;
        try {
            const base64Data = imageDataUrl.split(',')[1];
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const blob = new Blob([bytes], { type: 'image/png' });
            const formData = new FormData();
            formData.append('image', blob, 'doodle.png');
            formData.append('description', userDescription);
            
            const analyzeResponse = await fetch('http://localhost:3001/api/analyze-doodle', {
                method: 'POST',
                body: formData
            });
            
            if (analyzeResponse.ok) {
                const analyzeData = await analyzeResponse.json();
                if (analyzeData.success) {
                    analysis = analyzeData.analysis;
                    console.log('Doodle analysis:', analysis);
                }
            }
        } catch (error) {
            console.error('Error analyzing doodle:', error);
            // 使用用户描述或默认值
            analysis = userDescription || '一幅充满想象力的儿童涂鸦作品';
        }
        
        // Step 2: 使用 Gemini 生成精准的 Flux 提示词
        if (onProgress) onProgress('正在生成艺术提示词...');
        console.log('Step 2: Generating Flux prompt with Gemini...');
        
        let fluxPrompt;
        try {
            const promptResponse = await fetch('http://localhost:3001/api/generate-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    analysis, 
                    style, 
                    imageDataUrl 
                })
            });
            
            if (promptResponse.ok) {
                const promptData = await promptResponse.json();
                fluxPrompt = promptData.prompt;
                console.log('Generated Flux prompt:', fluxPrompt);
            } else {
                // Fallback prompt
                const selectedStyle = ART_STYLES[style];
                fluxPrompt = `${analysis}, ${selectedStyle.prompt}, high quality, detailed, vibrant colors`;
            }
        } catch (error) {
            console.error('Error generating prompt:', error);
            const selectedStyle = ART_STYLES[style];
            fluxPrompt = `${analysis}, ${selectedStyle.prompt}, high quality, detailed, vibrant colors`;
        }
        
        // Step 3: 使用 Flux 生成艺术作品
        if (onProgress) onProgress('正在生成艺术画作...');
        console.log('Step 3: Generating art with Flux...');
        
        let transformedImage;
        try {
            const artResponse = await fetch('http://localhost:3001/api/generate-art', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    prompt: fluxPrompt,
                    imageUrl: imageDataUrl,  // 传递原图用于 img2img
                    promptStrength: 0.8,      // 控制原图影响程度
                    aspectRatio: aspectRatio  // 传递宽高比
                })
            });
            
            if (artResponse.ok) {
                const artData = await artResponse.json();
                transformedImage = artData.imageUrl;
                console.log('Art generated successfully');
            } else {
                throw new Error('Failed to generate art');
            }
        } catch (error) {
            console.error('Error generating art:', error);
            // 返回占位图
            transformedImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izc2NGJhMjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9InVybCgjYmcpIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiPgogICAgQUkgQXJ0IFByZXZpZXcKICA8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiIGZvbnQtZmFtaWx5PSJBcmlhbCI+CiAgICBDb25maWd1cmUgQVBJIGtleSB0byBnZW5lcmF0ZQogIDwvdGV4dD4KPC9zdmc+';
        }
        
        if (onProgress) onProgress('完成！');
        
        return {
            success: true,
            originalImage: imageDataUrl,
            transformedImage,
            artworkUrl: transformedImage, // 兼容旧代码
            analysis,
            prompt: fluxPrompt,
            description: analysis,
            style: ART_STYLES[style].name
        };
    } catch (error) {
        console.error('Transform error:', error);
        return {
            success: false,
            error: error.message || '转换失败，请重试'
        };
    }
}

// 兼容旧版本的函数名
async function transformDoodleToArt(canvas, style, userDescription = '', onProgress) {
    return transformDoodle(canvas, style, userDescription, onProgress);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.ArtTransform = {
        transformDoodle,
        transformDoodleToArt, // 兼容旧代码
        ART_STYLES,
        adjustCanvasToSupportedRatio
    };
}