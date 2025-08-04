'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { resizeCanvas, clearCanvas } from '@/utils/canvas';

interface DrawingCanvasProps {
  className?: string;
}

export interface DrawingCanvasRef {
  canvas: HTMLCanvasElement | null;
  clear: () => void;
  getContext: () => CanvasRenderingContext2D | null;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      clear: () => {
        if (canvasRef.current) {
          clearCanvas(canvasRef.current);
        }
      },
      getContext: () => {
        return canvasRef.current?.getContext('2d') || null;
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleResize = () => {
        resizeCanvas(canvas);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className || ''}`}
        style={{ zIndex: 2 }}
      />
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;