export interface ArtStyle {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  description: string;
}

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'cartoon',
    name: '卡通风格',
    icon: '🎨',
    prompt: 'cartoon style, disney pixar style, colorful',
    description: '像动画片一样'
  },
  {
    id: 'watercolor',
    name: '水彩画',
    icon: '💧',
    prompt: 'watercolor painting, soft colors, artistic',
    description: '柔和的水彩效果'
  },
  {
    id: 'oil',
    name: '油画风格',
    icon: '🖼️',
    prompt: 'oil painting style, van gogh style, artistic brushstrokes',
    description: '经典油画风格'
  },
  {
    id: 'anime',
    name: '动漫风格',
    icon: '✨',
    prompt: 'anime style, manga art, japanese animation',
    description: '日本动漫风格'
  },
  {
    id: '3d',
    name: '3D立体',
    icon: '🎮',
    prompt: '3d rendered, pixar style, volumetric lighting',
    description: '立体3D效果'
  },
  {
    id: 'pixel',
    name: '像素艺术',
    icon: '👾',
    prompt: 'pixel art, 8-bit style, retro game art',
    description: '复古像素风格'
  },
  {
    id: 'crayon',
    name: '蜡笔画',
    icon: '🖍️',
    prompt: 'crayon drawing, children\'s book illustration',
    description: '儿童蜡笔画风格'
  },
  {
    id: 'fantasy',
    name: '梦幻童话',
    icon: '🦄',
    prompt: 'fantasy art, magical, fairy tale illustration',
    description: '魔法童话风格'
  }
];