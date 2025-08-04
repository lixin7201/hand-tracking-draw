import { BrushTool } from '@/constants/brushes';
import { Point } from '@/types/drawing';

export function applyBrushEffect(
  ctx: CanvasRenderingContext2D,
  brush: BrushTool,
  point: Point,
  size: number,
  color: string,
  opacity: number,
  texture: number,
  scatter: number
) {
  ctx.save();
  
  // Reset to default composite operation first
  ctx.globalCompositeOperation = 'source-over';
  
  // Set basic properties
  ctx.globalAlpha = opacity / 100;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size;
  
  if (brush.lineJoin) ctx.lineJoin = brush.lineJoin;
  if (brush.lineCap) ctx.lineCap = brush.lineCap;
  if (brush.blendMode) ctx.globalCompositeOperation = brush.blendMode;
  if (brush.shadowBlur) {
    ctx.shadowBlur = brush.shadowBlur;
    ctx.shadowColor = color;
  }
  
  // Apply texture effect
  if (brush.texture && texture > 0) {
    applyTextureEffect(ctx, point, size, texture);
  }
  
  // Apply scatter effect
  if (brush.scatter && scatter > 0) {
    applyScatterEffect(ctx, point, size, color, scatter);
  }
  
  ctx.restore();
}

function applyTextureEffect(
  ctx: CanvasRenderingContext2D,
  point: Point,
  size: number,
  intensity: number
) {
  const particleCount = Math.floor((intensity / 100) * 20);
  
  for (let i = 0; i < particleCount; i++) {
    const offsetX = (Math.random() - 0.5) * size;
    const offsetY = (Math.random() - 0.5) * size;
    const particleSize = Math.random() * (size / 4);
    
    ctx.beginPath();
    ctx.arc(
      point.x + offsetX,
      point.y + offsetY,
      particleSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function applyScatterEffect(
  ctx: CanvasRenderingContext2D,
  point: Point,
  size: number,
  color: string,
  scatter: number
) {
  const scatterRadius = size * scatter;
  const particleCount = Math.floor(scatter * 5);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * scatterRadius;
    const x = point.x + Math.cos(angle) * distance;
    const y = point.y + Math.sin(angle) * distance;
    const particleSize = Math.random() * (size / 2);
    
    ctx.globalAlpha = Math.random() * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, particleSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  size: number,
  brush: BrushTool,
  opacity: number = 100
) {
  if (points.length < 2) return;
  
  ctx.save();
  // Reset to default composite operation first
  ctx.globalCompositeOperation = 'source-over';
  
  ctx.globalAlpha = opacity / 100;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  
  if (brush.lineJoin) ctx.lineJoin = brush.lineJoin;
  if (brush.lineCap) ctx.lineCap = brush.lineCap;
  if (brush.blendMode) ctx.globalCompositeOperation = brush.blendMode;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  
  if (points.length > 1) {
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
  }
  
  ctx.stroke();
  ctx.restore();
}