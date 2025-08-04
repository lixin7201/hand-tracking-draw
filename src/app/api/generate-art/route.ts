import { NextRequest, NextResponse } from 'next/server';

// Replicate API (for Flux)
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || '';
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

// 支持的宽高比
const ASPECT_RATIOS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1365, height: 768 },
  '21:9': { width: 1536, height: 640 },
  '3:2': { width: 1254, height: 836 },
  '2:3': { width: 836, height: 1254 },
  '4:5': { width: 916, height: 1145 },
  '5:4': { width: 1145, height: 916 },
  '3:4': { width: 886, height: 1182 },
  '4:3': { width: 1182, height: 886 },
  '9:16': { width: 768, height: 1365 },
  '9:21': { width: 640, height: 1536 }
};

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      imageUrl, 
      promptStrength = 0.8, 
      aspectRatio = '1:1' 
    } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }
    
    // 如果没有 Replicate API key，返回占位图
    if (!REPLICATE_API_KEY) {
      console.log('No Replicate API key, returning placeholder');
      // 返回一个更好看的占位图
      const placeholderSvg = `
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1024" height="1024" fill="url(#bg)"/>
          <text x="50%" y="45%" text-anchor="middle" font-size="48" fill="white" font-family="Arial">
            AI Art Preview
          </text>
          <text x="50%" y="55%" text-anchor="middle" font-size="24" fill="white" opacity="0.8" font-family="Arial">
            Configure API key to generate
          </text>
        </svg>
      `;
      const base64 = Buffer.from(placeholderSvg).toString('base64');
      return NextResponse.json({
        success: true,
        imageUrl: `data:image/svg+xml;base64,${base64}`
      });
    }
    
    // 获取宽高比尺寸
    const dimensions = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['1:1'];
    
    // 使用 Flux 1.1 Pro (通过 Replicate)
    const modelVersion = 'black-forest-labs/flux-1.1-pro';
    
    // 创建预测
    const createResponse = await fetch(`${REPLICATE_API_URL}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: '7f81ed39e8e8bbcdee14c19a8a81f08b088b5b6e8c4e9d088aed99c899f94026',
        input: {
          prompt: prompt,
          ...(imageUrl && { image: imageUrl }),
          ...(imageUrl && { prompt_strength: promptStrength }),
          width: dimensions.width,
          height: dimensions.height,
          num_outputs: 1,
          guidance_scale: 3.5,
          num_inference_steps: 28,
          output_format: 'webp',
          output_quality: 90
        }
      })
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Replicate API error:', errorText);
      throw new Error(`Replicate API error: ${createResponse.statusText}`);
    }
    
    const prediction = await createResponse.json();
    
    // 轮询检查预测状态
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `${REPLICATE_API_URL}/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`
          }
        }
      );
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check prediction status');
      }
      
      result = await statusResponse.json();
    }
    
    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }
    
    const imageUrl = result.output?.[0];
    
    if (!imageUrl) {
      throw new Error('No image generated');
    }
    
    return NextResponse.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error generating art:', error);
    
    // 返回更友好的错误占位图
    const errorSvg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#f8f8f8"/>
        <text x="50%" y="50%" text-anchor="middle" font-size="20" fill="#999" font-family="Arial">
          生成失败，请重试
        </text>
      </svg>
    `;
    const base64 = Buffer.from(errorSvg).toString('base64');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate art',
      imageUrl: `data:image/svg+xml;base64,${base64}`
    });
  }
}