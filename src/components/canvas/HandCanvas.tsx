'use client';

import { forwardRef } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from './DrawingCanvas';

const HandCanvas = forwardRef<DrawingCanvasRef>((props, ref) => {
  return (
    <DrawingCanvas
      ref={ref}
      className="pointer-events-none"
    />
  );
});

HandCanvas.displayName = 'HandCanvas';

export default HandCanvas;