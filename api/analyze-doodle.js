// Vercel API Route - 分析涂鸦内容

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
    
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            error: 'API密钥未配置' 
        });
    }
    
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
        
        res.status(200).json({
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
}