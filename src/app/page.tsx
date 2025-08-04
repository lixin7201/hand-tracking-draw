'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import VideoCanvas, { VideoCanvasRef } from '@/components/canvas/VideoCanvas';
import DrawingCanvas, { DrawingCanvasRef } from '@/components/canvas/DrawingCanvas';
import StickerCanvas, { StickerCanvasRef } from '@/components/canvas/StickerCanvas';
import Toolbar from '@/components/ui/Toolbar';
import ControlPanel from '@/components/ui/ControlPanel';
import GestureIndicator from '@/components/ui/GestureIndicator';
import SiteTitle from '@/components/ui/SiteTitle';
import StickerPanel from '@/components/ui/StickerPanel';
import BrushParams from '@/components/controls/BrushParams';
import SaveModal from '@/components/modals/SaveModal';
import ColorPaletteModal from '@/components/modals/ColorPaletteModal';
import TransformModal from '@/components/modals/TransformModal';
import ResultModal from '@/components/modals/ResultModal';
import useGestureDetection from '@/hooks/useGestureDetection';
import useDrawing from '@/hooks/useDrawing';
import { GestureType } from '@/types/gesture';
import { StickerInstance } from '@/types/sticker';
import { TEMPLATES } from '@/constants/templates';
import { MAX_RECENT_COLORS } from '@/constants/colors';
import { ART_STYLES } from '@/constants/ai-styles';
import { saveCanvasAsImage, mergeCanvases } from '@/utils/canvas';
import { transformDoodle } from '@/utils/ai-transform';

// Dynamically import to avoid SSR issues
const HandCanvas = dynamic(() => import('@/components/canvas/HandCanvas'), {
  ssr: false
});

export default function DrawingApp() {
  // Refs
  const videoRef = useRef<VideoCanvasRef>(null);
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null);
  const handCanvasRef = useRef<DrawingCanvasRef>(null);
  const stickerCanvasRef = useRef<StickerCanvasRef>(null);
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [drawMode, setDrawMode] = useState<'free' | 'coloring'>('free');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [titleHidden, setTitleHidden] = useState(false);
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [draggedSticker, setDraggedSticker] = useState<StickerInstance | null>(null);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  
  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showTransformModal, setShowTransformModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Transform result state
  const [transformResult, setTransformResult] = useState<{
    originalImage: string;
    transformedImage: string;
    styleName: string;
  } | null>(null);
  
  // Drawing hook
  const { 
    drawingState, 
    startDrawing, 
    draw, 
    stopDrawing, 
    clear, 
    updateDrawingState 
  } = useDrawing({ 
    canvas: drawingCanvasRef.current?.canvas || null 
  });
  
  // Gesture detection
  const handleGestureChange = useCallback((gesture: GestureType | null) => {
    if (!gesture) {
      stopDrawing();
      return;
    }
    
    switch (gesture) {
      case 'one_finger':
        // Drawing mode
        break;
      case 'two_fingers':
        // Eraser mode
        updateDrawingState({ brushType: 'eraser' });
        break;
      case 'three_fingers':
        // Sticker grabbing mode - handled in handleHandMove
        stopDrawing();
        break;
      case 'five_fingers':
        // Clear canvas
        clear();
        break;
      case 'fist':
        // Stop drawing
        stopDrawing();
        break;
    }
  }, [stopDrawing, updateDrawingState, clear]);
  
  const handleHandMove = useCallback((x: number, y: number, gesture: GestureType | null) => {
    const canvas = drawingCanvasRef.current?.canvas;
    if (!canvas) return;
    
    // Convert video coordinates to canvas coordinates
    const rect = canvas.getBoundingClientRect();
    const canvasX = (x / videoRef.current?.video?.videoWidth!) * rect.width;
    const canvasY = (y / videoRef.current?.video?.videoHeight!) * rect.height;
    
    // Handle three-finger sticker dragging
    if (gesture === 'three_fingers' && stickerCanvasRef.current) {
      if (!draggedSticker) {
        // Try to grab a sticker
        const sticker = stickerCanvasRef.current.getStickerAt(canvasX, canvasY);
        if (sticker) {
          setDraggedSticker(sticker);
          // Update sticker to show it's being dragged
          const updatedStickers = stickers.map(s =>
            s.id === sticker.id ? { ...s, isDragging: true } : s
          );
          setStickers(updatedStickers);
        }
      } else {
        // Move the dragged sticker
        stickerCanvasRef.current.moveSticker(draggedSticker.id, canvasX, canvasY);
      }
    } else if (draggedSticker) {
      // Release the sticker
      const updatedStickers = stickers.map(s =>
        s.id === draggedSticker.id ? { ...s, isDragging: false } : s
      );
      setStickers(updatedStickers);
      setDraggedSticker(null);
    } else if (drawingState.isDrawing) {
      draw(canvasX, canvasY);
    }
  }, [draw, drawingState.isDrawing, draggedSticker, stickers]);
  
  const { isReady, mouseMode, currentGesture } = useGestureDetection({
    videoElement: videoRef.current?.video || null,
    onGestureChange: handleGestureChange,
    onHandMove: (x, y) => handleHandMove(x, y, currentGesture)
  });
  
  // Template handling
  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !drawingCanvasRef.current) return;
    
    const template = TEMPLATES[selectedTemplate];
    if (!template) return;
    
    const ctx = drawingCanvasRef.current.getContext();
    if (!ctx) return;
    
    clear();
    
    // Draw template paths
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    template.paths.forEach(pathStr => {
      const path = new Path2D(pathStr);
      ctx.stroke(path);
    });
    
    ctx.setLineDash([]);
  }, [selectedTemplate, clear]);
  
  // Color handling
  const handleColorChange = useCallback((color: string) => {
    updateDrawingState({ currentColor: color });
    
    // Add to recent colors
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      const updated = [color, ...filtered].slice(0, MAX_RECENT_COLORS);
      return updated;
    });
  }, [updateDrawingState]);
  
  // Save handling
  const saveWithCamera = useCallback(() => {
    if (!drawingCanvasRef.current?.canvas || !videoRef.current?.video) return;
    
    const video = videoRef.current.video;
    const drawingCanvas = drawingCanvasRef.current.canvas;
    const stickerCanvas = stickerCanvasRef.current?.canvas;
    
    // Create temporary canvas for video
    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = drawingCanvas.width;
    videoCanvas.height = drawingCanvas.height;
    const videoCtx = videoCanvas.getContext('2d');
    
    if (videoCtx) {
      videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    }
    
    const canvasesToMerge = [videoCanvas, drawingCanvas];
    if (stickerCanvas) canvasesToMerge.push(stickerCanvas);
    
    const merged = mergeCanvases(canvasesToMerge);
    saveCanvasAsImage(merged, `drawing-${Date.now()}.png`);
    setShowSaveModal(false);
  }, []);
  
  const saveWithWhiteBackground = useCallback(() => {
    if (!drawingCanvasRef.current?.canvas) return;
    
    const drawingCanvas = drawingCanvasRef.current.canvas;
    const stickerCanvas = stickerCanvasRef.current?.canvas;
    
    const canvasesToMerge = [drawingCanvas];
    if (stickerCanvas) canvasesToMerge.push(stickerCanvas);
    
    const merged = mergeCanvases(canvasesToMerge, '#FFFFFF');
    saveCanvasAsImage(merged, `drawing-${Date.now()}.png`);
    setShowSaveModal(false);
  }, []);
  
  // Transform handling
  const handleTransform = useCallback(async (style: string, description: string) => {
    if (!drawingCanvasRef.current?.canvas) {
      alert('请先绘制一些内容');
      return;
    }
    
    try {
      const canvas = drawingCanvasRef.current.canvas;
      const result = await transformDoodle(canvas, style, description);
      
      // Find style name
      const selectedStyle = ART_STYLES.find(s => s.id === style);
      const styleName = selectedStyle?.name || '艺术';
      
      // Set result and show modal
      setTransformResult({
        originalImage: result.originalImage,
        transformedImage: result.transformedImage,
        styleName
      });
      
      setShowTransformModal(false);
      setShowResultModal(true);
    } catch (error) {
      console.error('Transform error:', error);
      throw error; // Let the modal handle the error
    }
  }, []);
  
  // Video ready handler
  const handleVideoReady = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => setTitleHidden(true), 3000);
  }, []);
  
  useEffect(() => {
    // Hide title after drawing starts
    if (drawingState.isDrawing && !titleHidden) {
      setTitleHidden(true);
    }
  }, [drawingState.isDrawing, titleHidden]);
  
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/95 px-10 py-5 rounded-[15px] text-base font-semibold text-gray-800 backdrop-blur-md">
          正在加载摄像头...
        </div>
      )}
      
      {/* Video Canvas */}
      <VideoCanvas ref={videoRef} onVideoReady={handleVideoReady} />
      
      {/* Drawing Canvas */}
      <DrawingCanvas ref={drawingCanvasRef} />
      
      {/* Sticker Canvas */}
      <StickerCanvas
        ref={stickerCanvasRef}
        stickers={stickers}
        onStickersChange={setStickers}
      />
      
      {/* Hand Tracking Canvas */}
      {isReady && <HandCanvas ref={handCanvasRef} />}
      
      {/* Site Title */}
      <SiteTitle hidden={titleHidden} />
      
      {/* Toolbar */}
      <Toolbar
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        onLoadTemplate={loadTemplate}
        currentBrush={drawingState.brushType}
        onBrushChange={(brush) => updateDrawingState({ brushType: brush })}
        drawMode={drawMode}
        onModeChange={setDrawMode}
      />
      
      {/* Gesture Indicator */}
      <GestureIndicator />
      
      {/* Brush Parameters */}
      <BrushParams
        brushType={drawingState.brushType}
        opacity={drawingState.opacity}
        texture={drawingState.texture}
        scatter={drawingState.scatter}
        onOpacityChange={(v) => updateDrawingState({ opacity: v })}
        onTextureChange={(v) => updateDrawingState({ texture: v })}
        onScatterChange={(v) => updateDrawingState({ scatter: v })}
      />
      
      {/* Control Panel */}
      <ControlPanel
        currentColor={drawingState.currentColor}
        brushSize={drawingState.brushSize}
        onColorChange={handleColorChange}
        onBrushSizeChange={(size) => updateDrawingState({ brushSize: size })}
        onClear={clear}
        onSave={() => setShowSaveModal(true)}
        onTransform={() => setShowTransformModal(true)}
        onOpenColorPalette={() => setShowColorPalette(true)}
      />
      
      {/* Sticker Panel */}
      <StickerPanel
        isOpen={showStickerPanel}
        onToggle={() => setShowStickerPanel(!showStickerPanel)}
        onStickerSelect={(stickerId) => {
          stickerCanvasRef.current?.addSticker(stickerId);
          setShowStickerPanel(false);
        }}
      />
      
      {/* Modals */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaveWithCamera={saveWithCamera}
        onSaveWithWhiteBackground={saveWithWhiteBackground}
      />
      
      <ColorPaletteModal
        isOpen={showColorPalette}
        onClose={() => setShowColorPalette(false)}
        onColorSelect={handleColorChange}
        recentColors={recentColors}
      />
      
      <TransformModal
        isOpen={showTransformModal}
        onClose={() => setShowTransformModal(false)}
        onTransform={handleTransform}
      />
      
      {transformResult && (
        <ResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          originalImage={transformResult.originalImage}
          transformedImage={transformResult.transformedImage}
          styleName={transformResult.styleName}
        />
      )}
    </div>
  );
}