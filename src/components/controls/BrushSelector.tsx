'use client';

import { BRUSH_TOOLS } from '@/constants/brushes';

interface BrushSelectorProps {
  currentBrush: string;
  onBrushChange: (brush: string) => void;
}

export default function BrushSelector({
  currentBrush,
  onBrushChange
}: BrushSelectorProps) {
  return (
    <select
      id="brushSelect"
      className="px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm cursor-pointer transition-all min-w-[120px] hover:border-[#667eea] focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
      value={currentBrush}
      onChange={(e) => onBrushChange(e.target.value)}
    >
      {Object.entries(BRUSH_TOOLS).map(([key, brush]) => (
        <option key={key} value={key}>
          {brush.icon} {brush.name}
        </option>
      ))}
    </select>
  );
}