'use client';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWithCamera: () => void;
  onSaveWithWhiteBackground: () => void;
}

export default function SaveModal({
  isOpen,
  onClose,
  onSaveWithCamera,
  onSaveWithWhiteBackground
}: SaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[10000] animate-fadeIn">
      <div className="bg-white rounded-[20px] p-8 max-w-[500px] w-[90%] shadow-2xl animate-slideUp text-center">
        <h2 className="text-gray-800 text-2xl mb-5" style={{ fontFamily: "'幼圆', 'Comic Sans MS', cursive" }}>
          🎨 选择保存方式
        </h2>
        
        <div className="flex gap-5 justify-center my-5 flex-wrap">
          <button
            onClick={onSaveWithCamera}
            className="flex-1 min-w-[150px] p-5 border-2 border-transparent rounded-[15px] cursor-pointer transition-all bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl mb-2.5">📷</div>
            <div className="text-lg font-bold mb-1">原图保存</div>
            <div className="text-xs">保留摄像头背景</div>
          </button>
          
          <button
            onClick={onSaveWithWhiteBackground}
            className="flex-1 min-w-[150px] p-5 border-2 border-gray-200 rounded-[15px] cursor-pointer transition-all bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl mb-2.5">🖼️</div>
            <div className="text-lg font-bold mb-1 text-gray-800">白底保存</div>
            <div className="text-xs text-gray-600">纯白色背景</div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-5 px-8 py-2.5 bg-gray-200 border-none rounded-[10px] cursor-pointer text-sm transition-all hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </div>
  );
}