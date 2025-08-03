// Vercel API Route - 生成艺术画作

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
    
    if (!REPLICATE_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            error: 'Replicate API密钥未配置' 
        });
    }
    
    try {
        const { imageUrl, prompt, promptStrength = 0.8 } = req.body;
        
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
        
        if (data.error) {
            throw new Error(data.error.detail || 'Flux API调用失败');
        }
        
        // 如果还在处理中，轮询获取结果
        if (data.status === 'processing' || data.status === 'starting') {
            const result = await pollForResults(data.urls.get, REPLICATE_API_KEY);
            res.status(200).json({
                success: true,
                artworkUrl: result
            });
        } else if (data.status === 'succeeded' && data.output && data.output.length > 0) {
            res.status(200).json({
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
}

// 轮询获取结果
async function pollForResults(url, apiKey, maxAttempts = 60, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'succeeded' && data.output && data.output.length > 0) {
                return data.output[0];
            } else if (data.status === 'failed') {
                throw new Error('生成失败：' + (data.error || '未知错误'));
            }
            
            // 等待下一次轮询
            await new Promise(resolve => setTimeout(resolve, interval));
        } catch (error) {
            console.error('Polling error:', error);
            throw error;
        }
    }
    
    throw new Error('生成超时');
}