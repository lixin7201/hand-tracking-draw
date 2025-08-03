// Vercel API Route - 生成Flux提示词

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
        
        res.status(200).json({
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
}