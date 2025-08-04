'use client';

import { useState, useRef, useCallback } from 'react';
import { DrawingState, Point, DrawingPath } from '@/types/drawing';
import { BRUSH_TOOLS } from '@/constants/brushes';
import { drawSmoothLine, applyBrushEffect } from '@/utils/brush-effects';
import { clearCanvas } from '@/utils/canvas';

interface UseDrawingProps {
  canvas: HTMLCanvasElement | null;
}

export default function useDrawing({ canvas }: UseDrawingProps) {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentColor: '#FF0000',
    brushSize: 5,
    brushType: 'watercolor',
    opacity: 90,
    texture: 50,
    scatter: 2
  });

  const currentPathRef = useRef<Point[]>([]);
  const pathsRef = useRef<DrawingPath[]>([]);

  const startDrawing = useCallback((x: number, y: number) => {
    if (!canvas) return;
    
    setDrawingState(prev => ({ ...prev, isDrawing: true }));
    currentPathRef.current = [{ x, y }];
  }, [canvas]);

  const draw = useCallback((x: number, y: number) => {
    if (!canvas || !drawingState.isDrawing) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPath = currentPathRef.current;
    const lastPoint = currentPath[currentPath.length - 1];
    
    if (lastPoint) {
      const brush = BRUSH_TOOLS[drawingState.brushType];
      
      // Apply brush effects
      applyBrushEffect(
        ctx,
        brush,
        { x, y },
        drawingState.brushSize,
        drawingState.currentColor,
        drawingState.opacity,
        drawingState.texture,
        drawingState.scatter
      );
      
      // Draw smooth line
      currentPath.push({ x, y });
      drawSmoothLine(
        ctx,
        currentPath.slice(-3),
        drawingState.currentColor,
        drawingState.brushSize,
        brush,
        drawingState.opacity
      );
    }
  }, [canvas, drawingState]);

  const stopDrawing = useCallback(() => {
    if (currentPathRef.current.length > 0) {
      pathsRef.current.push({
        points: [...currentPathRef.current],
        color: drawingState.currentColor,
        size: drawingState.brushSize,
        brushType: drawingState.brushType,
        opacity: drawingState.opacity
      });
    }
    
    currentPathRef.current = [];
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
  }, [drawingState]);

  const clear = useCallback(() => {
    if (canvas) {
      clearCanvas(canvas);
      pathsRef.current = [];
      currentPathRef.current = [];
    }
  }, [canvas]);

  const updateDrawingState = useCallback((updates: Partial<DrawingState>) => {
    setDrawingState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    drawingState,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    updateDrawingState,
    paths: pathsRef.current
  };
}