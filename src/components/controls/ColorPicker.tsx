'use client';

import { useState } from 'react';
import { DEFAULT_COLORS } from '@/constants/colors';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onOpenPalette: () => void;
}

export default function ColorPicker({
  currentColor,
  onColorChange,
  onOpenPalette
}: ColorPickerProps) {
  return (
    <div className="flex gap-2.5 items-center">
      {DEFAULT_COLORS.map((color) => (
        <button
          key={color}
          className={`w-[30px] h-[30px] rounded-full cursor-pointer transition-transform border-[3px] hover:scale-110 ${
            currentColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          aria-label={`Select color ${color}`}
        />
      ))}
      <button
        className="w-[35px] h-[35px] border-2 border-gray-300 rounded bg-white cursor-pointer text-lg flex items-center justify-center ml-2.5 transition-all hover:scale-110 hover:border-gray-600 hover:shadow-md"
        onClick={onOpenPalette}
        title="更多颜色"
        aria-label="Open color palette"
      >
        🎨
      </button>
    </div>
  );
}