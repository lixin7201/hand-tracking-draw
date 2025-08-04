'use client';

import { BRUSH_TOOLS } from '@/constants/brushes';

interface BrushParamsProps {
  brushType: string;
  opacity: number;
  texture: number;
  scatter: number;
  onOpacityChange: (value: number) => void;
  onTextureChange: (value: number) => void;
  onScatterChange: (value: number) => void;
}

export default function BrushParams({
  brushType,
  opacity,
  texture,
  scatter,
  onOpacityChange,
  onTextureChange,
  onScatterChange
}: BrushParamsProps) {
  const brush = BRUSH_TOOLS[brushType];
  
  return (
    <div className="fixed bottom-[100px] right-5 z-[5] bg-white/95 p-4 rounded-2xl backdrop-blur-md shadow-lg w-[180px]">
      <div className="mb-3">
        <label className="block text-xs text-gray-600 mb-1">
          透明度 <span className="text-gray-400 ml-1">{opacity}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-full h-1 rounded-full bg-gray-200 appearance-none cursor-pointer slider"
        />
      </div>
      
      {brush?.texture && (
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">
            纹理强度 <span className="text-gray-400 ml-1">{texture}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={texture}
            onChange={(e) => onTextureChange(Number(e.target.value))}
            className="w-full h-1 rounded-full bg-gray-200 appearance-none cursor-pointer slider"
          />
        </div>
      )}
      
      {brush?.scatter && (
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">
            散布范围 <span className="text-gray-400 ml-1">{scatter}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={scatter}
            onChange={(e) => onScatterChange(Number(e.target.value))}
            className="w-full h-1 rounded-full bg-gray-200 appearance-none cursor-pointer slider"
          />
        </div>
      )}
    </div>
  );
}