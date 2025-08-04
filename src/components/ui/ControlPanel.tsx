'use client';

import ColorPicker from '@/components/controls/ColorPicker';
import BrushSizeSlider from '@/components/controls/BrushSizeSlider';

interface ControlPanelProps {
  currentColor: string;
  brushSize: number;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onSave: () => void;
  onTransform: () => void;
  onOpenColorPalette: () => void;
}

export default function ControlPanel({
  currentColor,
  brushSize,
  onColorChange,
  onBrushSizeChange,
  onClear,
  onSave,
  onTransform,
  onOpenColorPalette
}: ControlPanelProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[4] flex gap-4 bg-white/95 p-4 rounded-[20px] shadow-lg backdrop-blur-md">
      <ColorPicker
        currentColor={currentColor}
        onColorChange={onColorChange}
        onOpenPalette={onOpenColorPalette}
      />
      
      <BrushSizeSlider
        value={brushSize}
        onChange={onBrushSizeChange}
      />
      
      <button
        onClick={onClear}
        className="px-5 py-2.5 border-none rounded-[10px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold cursor-pointer transition-all min-w-[80px] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        清空
      </button>
      
      <button
        onClick={onSave}
        className="px-5 py-2.5 border-none rounded-[10px] bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold cursor-pointer transition-all min-w-[80px] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        保存
      </button>
      
      <button
        onClick={onTransform}
        className="px-5 py-2.5 border-none rounded-[10px] bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white text-sm font-semibold cursor-pointer transition-all min-w-[80px] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        AI转画
      </button>
    </div>
  );
}