'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StickerInstance } from '@/types/sticker';
import { STICKERS } from '@/constants/stickers';

export interface StickerCanvasRef {
  canvas: HTMLCanvasElement | null;
  addSticker: (stickerId: string, x?: number, y?: number) => void;
  moveSticker: (id: string, x: number, y: number) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;
  getStickers: () => StickerInstance[];
  getStickerAt: (x: number, y: number) => StickerInstance | null;
}

interface StickerCanvasProps {
  stickers: StickerInstance[];
  onStickersChange: (stickers: StickerInstance[]) => void;
}

const StickerCanvas = forwardRef<StickerCanvasRef, StickerCanvasProps>(
  ({ stickers, onStickersChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nextIdRef = useRef(1);
    
    // Render stickers
    const renderStickers = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each sticker
      stickers.forEach(stickerInstance => {
        const sticker = STICKERS[stickerInstance.stickerId];
        if (!sticker) return;
        
        ctx.save();
        
        // Apply transformations
        ctx.translate(stickerInstance.x, stickerInstance.y);
        ctx.rotate((stickerInstance.rotation * Math.PI) / 180);
        
        // Create image from SVG
        const img = new Image();
        const svgBlob = new Blob([sticker.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.drawImage(
            img,
            -stickerInstance.size / 2,
            -stickerInstance.size / 2,
            stickerInstance.size,
            stickerInstance.size
          );
          URL.revokeObjectURL(url);
        };
        
        img.src = url;
        
        // Draw selection border if dragging
        if (stickerInstance.isDragging) {
          ctx.strokeStyle = '#667eea';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(
            -stickerInstance.size / 2 - 5,
            -stickerInstance.size / 2 - 5,
            stickerInstance.size + 10,
            stickerInstance.size + 10
          );
        }
        
        ctx.restore();
      });
    };
    
    // Add sticker
    const addSticker = (stickerId: string, x?: number, y?: number) => {
      const sticker = STICKERS[stickerId];
      if (!sticker) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const newSticker: StickerInstance = {
        id: `sticker-${nextIdRef.current++}`,
        stickerId,
        x: x ?? canvas.width / 2,
        y: y ?? canvas.height / 2,
        size: sticker.defaultSize,
        rotation: 0,
        isDragging: false
      };
      
      onStickersChange([...stickers, newSticker]);
    };
    
    // Move sticker
    const moveSticker = (id: string, x: number, y: number) => {
      const updatedStickers = stickers.map(s =>
        s.id === id ? { ...s, x, y } : s
      );
      onStickersChange(updatedStickers);
    };
    
    // Remove sticker
    const removeSticker = (id: string) => {
      onStickersChange(stickers.filter(s => s.id !== id));
    };
    
    // Clear all stickers
    const clearStickers = () => {
      onStickersChange([]);
    };
    
    // Get sticker at position
    const getStickerAt = (x: number, y: number): StickerInstance | null => {
      // Check from top to bottom (reverse order)
      for (let i = stickers.length - 1; i >= 0; i--) {
        const sticker = stickers[i];
        const halfSize = sticker.size / 2;
        
        // Simple bounding box check
        if (
          x >= sticker.x - halfSize &&
          x <= sticker.x + halfSize &&
          y >= sticker.y - halfSize &&
          y <= sticker.y + halfSize
        ) {
          return sticker;
        }
      }
      return null;
    };
    
    // Update canvas size
    useEffect(() => {
      const updateCanvasSize = () => {
        if (!canvasRef.current) return;
        
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderStickers();
      };
      
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);
    
    // Re-render when stickers change
    useEffect(() => {
      renderStickers();
    }, [stickers]);
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      addSticker,
      moveSticker,
      removeSticker,
      clearStickers,
      getStickers: () => stickers,
      getStickerAt
    }));
    
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[3]"
        style={{ touchAction: 'none' }}
      />
    );
  }
);

StickerCanvas.displayName = 'StickerCanvas';

export default StickerCanvas;