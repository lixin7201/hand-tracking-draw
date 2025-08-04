import { Point } from '@/types/drawing';

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  size: number
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

export function saveCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'drawing.png'
) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

export function mergeCanvases(
  canvases: HTMLCanvasElement[],
  background?: string
): HTMLCanvasElement {
  const mergedCanvas = document.createElement('canvas');
  const ctx = mergedCanvas.getContext('2d');
  
  if (!ctx || canvases.length === 0) return mergedCanvas;
  
  mergedCanvas.width = canvases[0].width;
  mergedCanvas.height = canvases[0].height;
  
  // Fill background if provided
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);
  }
  
  // Draw each canvas
  canvases.forEach(canvas => {
    ctx.drawImage(canvas, 0, 0);
  });
  
  return mergedCanvas;
}