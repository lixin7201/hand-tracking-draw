import { NextRequest, NextResponse } from 'next/server';

// 使用 OpenRouter API (支持 Gemini)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const description = formData.get('description') as string || '';
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64Image}`;
    
    // 如果没有 API key，返回默认分析
    if (!OPENROUTER_API_KEY) {
      console.log('No OpenRouter API key, using default analysis');
      return NextResponse.json({
        success: true,
        analysis: description || '一幅充满想象力的儿童涂鸦，画面色彩丰富，线条生动活泼'
      });
    }
    
    // 构建 Gemini 分析提示词
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
    
    // 调用 Gemini API (通过 OpenRouter)
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': request.headers.get('referer') || 'http://localhost:3000',
        'X-Title': 'Drawing App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-thinking-exp:free',
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
    
    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing doodle:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze doodle',
      analysis: '一幅充满想象力的儿童涂鸦作品'
    });
  }
}