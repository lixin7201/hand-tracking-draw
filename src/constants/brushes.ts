export interface BrushTool {
  name: string;
  icon: string;
  texture?: boolean;
  scatter?: boolean;
  opacity?: number;
  blendMode?: GlobalCompositeOperation;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  shadowBlur?: number;
}

export const BRUSH_TOOLS: Record<string, BrushTool> = {
  marker: {
    name: '马克笔',
    icon: '🖍️',
    opacity: 0.9,
    lineJoin: 'round',
    lineCap: 'round'
  },
  coloredPencil: {
    name: '彩色铅笔',
    icon: '✏️',
    texture: true,
    opacity: 0.7,
    lineJoin: 'round',
    lineCap: 'round'
  },
  watercolor: {
    name: '水彩笔',
    icon: '🎨',
    opacity: 0.3,
    blendMode: 'multiply',
    shadowBlur: 5,
    lineJoin: 'round',
    lineCap: 'round'
  },
  pencil: {
    name: '铅笔',
    icon: '✎',
    texture: true,
    opacity: 0.6,
    lineJoin: 'round',
    lineCap: 'round'
  },
  spray: {
    name: '喷漆',
    icon: '🎯',
    scatter: true,
    opacity: 0.2,
    lineCap: 'round'
  },
  roller: {
    name: '滚刷',
    icon: '🔲',
    opacity: 0.95,
    lineJoin: 'miter',
    lineCap: 'square'
  },
  crayon: {
    name: '蜡笔',
    icon: '🖍️',
    texture: true,
    opacity: 0.8,
    lineJoin: 'round',
    lineCap: 'round'
  },
  pastel: {
    name: '色粉',
    icon: '🎨',
    texture: true,
    scatter: true,
    opacity: 0.4,
    blendMode: 'screen'
  },
  eraser: {
    name: '橡皮擦',
    icon: '🧹',
    blendMode: 'destination-out',
    opacity: 1,
    lineJoin: 'round',
    lineCap: 'round'
  }
};