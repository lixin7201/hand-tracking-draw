import { NextRequest, NextResponse } from 'next/server';
import { ART_STYLES } from '@/constants/ai-styles';

// 使用 OpenRouter API (支持 Gemini)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

export async function POST(request: NextRequest) {
  try {
    const { analysis, style, imageDataUrl } = await request.json();
    
    const selectedStyle = ART_STYLES.find(s => s.id === style);
    if (!selectedStyle) {
      return NextResponse.json(
        { error: 'Invalid style selected' },
        { status: 400 }
      );
    }
    
    // 如果没有 API key，返回基础提示词
    if (!OPENROUTER_API_KEY) {
      console.log('No OpenRouter API key, using basic prompt');
      let prompt = `${analysis || 'A creative children\'s drawing'}, ${selectedStyle.prompt}`;
      prompt += ', high quality, detailed, vibrant colors, child-friendly, masterpiece, best quality';
      
      return NextResponse.json({
        success: true,
        prompt
      });
    }
    
    // 构建 Flux 提示词生成的系统提示
    const systemPrompt = `Based on this doodle analysis, create a concise Flux AI image generation prompt.

Doodle Analysis: ${analysis}
Target Art Style: ${selectedStyle.prompt}

Requirements:
1. Keep the EXACT composition, layout, and structure from the original doodle
2. Preserve the original color scheme and color positions precisely
3. Transform the style to: ${selectedStyle.name}
4. Make the prompt clear, specific, and under 50 words
5. Include style keywords but maintain the original scene integrity

Generate a prompt that will create an artistic version while keeping all original elements in their exact positions.`;
    
    // 调用 Gemini API 生成精准的 Flux 提示词
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
            content: imageDataUrl ? [
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
    const fluxPrompt = data.choices?.[0]?.message?.content || `${analysis}, ${selectedStyle.prompt}`;
    
    // 添加质量标签
    const finalPrompt = `${fluxPrompt}, masterpiece, best quality, highly detailed`;
    
    return NextResponse.json({
      success: true,
      prompt: finalPrompt
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    
    // Fallback prompt
    const { analysis, style } = await request.json();
    const selectedStyle = ART_STYLES.find(s => s.id === style);
    const fallbackPrompt = `${analysis || 'A creative drawing'}, ${selectedStyle?.prompt || 'artistic style'}, high quality`;
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate optimized prompt',
      prompt: fallbackPrompt
    });
  }
}