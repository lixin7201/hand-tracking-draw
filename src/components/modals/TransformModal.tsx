'use client';

import { useState } from 'react';
import { ART_STYLES } from '@/constants/ai-styles';

interface TransformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransform: (style: string, description: string) => Promise<void>;
}

export default function TransformModal({
  isOpen,
  onClose,
  onTransform
}: TransformModalProps) {
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('正在准备...');

  if (!isOpen) return null;

  const handleTransform = async () => {
    setIsProcessing(true);
    setProgressText('正在分析涂鸦...');
    
    try {
      await onTransform(selectedStyle, description);
      onClose();
    } catch (error) {
      console.error('Transform error:', error);
      alert('转换失败，请重试');
    } finally {
      setIsProcessing(false);
      setProgressText('正在准备...');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[10001] animate-fadeIn">
      <div className="bg-white rounded-[25px] p-8 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto shadow-2xl animate-slideUp">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">🎨 AI艺术转换</h2>
        <p className="text-gray-600 text-center mb-5">将你的涂鸦变成艺术作品！</p>
        
        {!isProcessing ? (
          <>
            <div className="my-6">
              <h3 className="text-gray-800 mb-4 text-base font-semibold">选择艺术风格</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4">
                {ART_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`border-2 rounded-[15px] p-4 text-center cursor-pointer transition-all bg-white ${
                      selectedStyle === style.id
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                        : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#667eea]'
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.icon}</div>
                    <div className="font-bold text-sm mb-1">{style.name}</div>
                    <div className="text-[11px] opacity-80">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="my-6">
              <h3 className="text-gray-800 mb-4 text-base font-semibold">描述你的画（可选）</h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="告诉AI你画的是什么，比如：一只在花园里玩耍的小猫..."
                className="w-full p-3 border-2 border-gray-200 rounded-[10px] text-sm resize-y font-inherit focus:outline-none focus:border-[#667eea]"
                rows={3}
              />
            </div>
            
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={handleTransform}
                className="px-8 py-3 bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white border-none rounded-[10px] text-base font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                开始转换
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-200 border-none rounded-[10px] cursor-pointer text-sm transition-all hover:bg-gray-300"
              >
                取消
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="w-[50px] h-[50px] border-[5px] border-gray-100 border-t-[#667eea] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">{progressText}</p>
          </div>
        )}
      </div>
    </div>
  );
}