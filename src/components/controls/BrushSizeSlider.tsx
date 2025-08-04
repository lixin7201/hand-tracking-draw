'use client';

interface BrushSizeSliderProps {
  value: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
}

export default function BrushSizeSlider({
  value,
  onChange,
  min = 1,
  max = 20
}: BrushSizeSliderProps) {
  return (
    <div className="flex items-center gap-2.5">
      <label className="text-sm text-gray-600">画笔大小:</label>
      <input
        type="range"
        id="brushSize"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-[100px]"
      />
      <span className="text-sm text-gray-600 min-w-[20px]">{value}</span>
    </div>
  );
}