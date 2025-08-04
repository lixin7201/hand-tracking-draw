'use client';

import { useState, useEffect } from 'react';
import { COLOR_THEMES, MAX_RECENT_COLORS } from '@/constants/colors';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  recentColors: string[];
}

export default function ColorPaletteModal({
  isOpen,
  onClose,
  onColorSelect,
  recentColors
}: ColorPaletteModalProps) {
  const [customColor, setCustomColor] = useState('#FF0000');

  if (!isOpen) return null;

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  const applyCustomColor = () => {
    handleColorSelect(customColor);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[10003]">
      <div className="bg-white rounded-[15px] p-8 w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto relative animate-slideIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-3xl cursor-pointer text-gray-600 transition-colors hover:text-black"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-5">🎨 选择颜色</h2>
        
        {/* Custom Color Picker */}
        <div className="flex items-center gap-4 my-5 p-4 bg-gray-100 rounded-[10px]">
          <label className="text-sm text-gray-600">自定义颜色:</label>
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-[60px] h-10 border-2 border-gray-300 rounded cursor-pointer"
          />
          <button
            onClick={applyCustomColor}
            className="px-5 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-[20px] cursor-pointer text-sm transition-transform hover:scale-105"
          >
            应用
          </button>
        </div>
        
        {/* Recent Colors */}
        {recentColors.length > 0 && (
          <div className="my-5">
            <h3 className="text-base text-gray-800 mb-2.5 font-semibold">最近使用</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2.5">
              {recentColors.map((color, index) => (
                <button
                  key={`recent-${index}`}
                  className="w-10 h-10 border-2 border-transparent rounded-lg cursor-pointer transition-all shadow-sm hover:scale-110 hover:border-gray-800 hover:shadow-md"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Color Themes */}
        {Object.entries(COLOR_THEMES).map(([key, theme]) => (
          <div key={key} className="my-5">
            <h3 className="text-base text-gray-800 mb-2.5 font-semibold">{theme.name}</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2.5">
              {theme.colors.map((color, index) => (
                <button
                  key={`${key}-${index}`}
                  className="w-10 h-10 border-2 border-transparent rounded-lg cursor-pointer transition-all shadow-sm hover:scale-110 hover:border-gray-800 hover:shadow-md"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}