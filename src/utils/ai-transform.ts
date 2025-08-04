// AI Transform API Integration Module

import { ART_STYLES } from '@/constants/ai-styles';

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

// 获取最接近的支持宽高比
function getClosestAspectRatio(width: number, height: number) {
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

// 调整画布尺寸到支持的宽高比
export function adjustCanvasAspectRatio(canvas: HTMLCanvasElement): string {
  const { width, height } = canvas;
  const closestRatio = getClosestAspectRatio(width, height);
  
  console.log(`Adjusting aspect ratio from ${width}x${height} to ${closestRatio.ratio}`);
  
  // 创建新画布
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }
  
  // 计算新尺寸
  let newWidth = width;
  let newHeight = height;
  
  if (closestRatio.value > width / height) {
    // 需要更宽
    newWidth = Math.round(height * closestRatio.value);
  } else {
    // 需要更高
    newHeight = Math.round(width / closestRatio.value);
  }
  
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;
  
  // 填充白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, newWidth, newHeight);
  
  // 居中绘制原画布
  const offsetX = (newWidth - width) / 2;
  const offsetY = (newHeight - height) / 2;
  ctx.drawImage(canvas, offsetX, offsetY);
  
  return newCanvas.toDataURL('image/png');
}

// 分析涂鸦内容
export async function analyzeDoodle(imageData: string): Promise<string> {
  try {
    // 创建 FormData
    const base64Data = imageData.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', blob, 'doodle.png');
    
    // 调用 Next.js API
    const response = await fetch('/api/analyze-doodle', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.description || '一幅充满创意的儿童画';
  } catch (error) {
    console.error('Error analyzing doodle:', error);
    // 返回默认描述
    return '一幅充满想象力的儿童涂鸦作品';
  }
}

// 生成 AI 提示词
export async function generatePrompt(
  style: string, 
  description: string
): Promise<string> {
  try {
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ style, description })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.prompt;
  } catch (error) {
    console.error('Error generating prompt:', error);
    // 使用本地生成的提示词
    const selectedStyle = ART_STYLES.find(s => s.id === style);
    if (!selectedStyle) {
      throw new Error('Invalid style selected');
    }
    
    let prompt = selectedStyle.prompt;
    if (description && description.trim()) {
      prompt = `${description}, ${prompt}`;
    }
    prompt += ', high quality, detailed, vibrant colors, child-friendly';
    
    return prompt;
  }
}

// 生成艺术作品
export async function generateArt(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-art', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating art:', error);
    // 返回占位图
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5Ij4KICAgIEFJIEFydCBQbGFjZWhvbGRlcgogIDwvdGV4dD4KPC9zdmc+';
  }
}

// 主转换函数
export async function transformDoodle(
  canvas: HTMLCanvasElement,
  style: string,
  userDescription?: string
): Promise<{
  originalImage: string;
  transformedImage: string;
  description: string;
}> {
  try {
    // 1. 调整画布宽高比
    const adjustedImage = adjustCanvasAspectRatio(canvas);
    
    // 2. 分析涂鸦（如果没有提供描述）
    let description = userDescription || '';
    if (!description) {
      console.log('Analyzing doodle...');
      description = await analyzeDoodle(adjustedImage);
    }
    
    // 3. 生成提示词
    console.log('Generating prompt...');
    const prompt = await generatePrompt(style, description);
    console.log('Generated prompt:', prompt);
    
    // 4. 生成艺术作品
    console.log('Generating art...');
    const transformedImage = await generateArt(prompt);
    
    return {
      originalImage: adjustedImage,
      transformedImage,
      description
    };
  } catch (error) {
    console.error('Transform error:', error);
    throw error;
  }
}