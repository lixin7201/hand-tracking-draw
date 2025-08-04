'use client';

import { useState } from 'react';
import { STICKERS, STICKER_CATEGORIES } from '@/constants/stickers';

interface StickerPanelProps {
  onStickerSelect: (stickerId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function StickerPanel({ onStickerSelect, isOpen, onToggle }: StickerPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('nature');
  
  const filteredStickers = Object.values(STICKERS).filter(
    sticker => sticker.category === selectedCategory
  );
  
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-5 right-5 z-[7] px-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <span className="text-2xl">🎨</span>
        <span className="ml-2 text-sm font-semibold">贴纸</span>
      </button>
      
      {/* Sticker Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-[7] bg-white/95 rounded-2xl shadow-xl backdrop-blur-md p-4 w-80 max-h-[400px] overflow-hidden flex flex-col">
          {/* Categories */}
          <div className="flex gap-2 mb-3 pb-3 border-b border-gray-200">
            {STICKER_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Stickers Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredStickers.map(sticker => (
                <button
                  key={sticker.id}
                  onClick={() => onStickerSelect(sticker.id)}
                  className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 hover:scale-110 transition-all cursor-pointer group"
                  title={sticker.name}
                >
                  <div 
                    className="w-full h-14 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: sticker.svg }}
                  />
                  <p className="text-xs text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {sticker.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 点击贴纸添加到画布，使用三指手势抓取和移动贴纸
            </p>
          </div>
        </div>
      )}
    </>
  );
}