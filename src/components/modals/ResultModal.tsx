'use client';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  transformedImage: string;
  styleName: string;
}

export default function ResultModal({
  isOpen,
  onClose,
  originalImage,
  transformedImage,
  styleName
}: ResultModalProps) {
  if (!isOpen) return null;

  const handleSaveTransformed = () => {
    const link = document.createElement('a');
    link.download = `art-${styleName}-${Date.now()}.png`;
    link.href = transformedImage;
    link.click();
  };

  const handleSaveBoth = () => {
    // Save original
    const link1 = document.createElement('a');
    link1.download = `original-${Date.now()}.png`;
    link1.href = originalImage;
    link1.click();
    
    // Save transformed after a short delay
    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.download = `art-${styleName}-${Date.now()}.png`;
      link2.href = transformedImage;
      link2.click();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[10002] animate-fadeIn">
      <div className="bg-white rounded-[25px] p-8 max-w-[900px] w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">✨ 转换完成！</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
          <div className="text-center">
            <h3 className="text-gray-800 mb-2.5 text-base font-semibold">原始涂鸦</h3>
            <img 
              src={originalImage} 
              alt="原始涂鸦" 
              className="w-full rounded-[10px] shadow-lg"
            />
          </div>
          <div className="text-center">
            <h3 className="text-gray-800 mb-2.5 text-base font-semibold">{styleName}风格</h3>
            <img 
              src={transformedImage} 
              alt="转换后的艺术作品" 
              className="w-full rounded-[10px] shadow-lg"
            />
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-6 flex-wrap">
          <button
            onClick={handleSaveTransformed}
            className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-[10px] text-sm font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            保存艺术画
          </button>
          <button
            onClick={handleSaveBoth}
            className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-[10px] text-sm font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            保存两张图
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 border-none rounded-[10px] cursor-pointer text-sm transition-all hover:bg-gray-300"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}