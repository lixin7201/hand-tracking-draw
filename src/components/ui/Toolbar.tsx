'use client';

import { TEMPLATES } from '@/constants/templates';
import BrushSelector from '@/components/controls/BrushSelector';

interface ToolbarProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onLoadTemplate: () => void;
  currentBrush: string;
  onBrushChange: (brush: string) => void;
  drawMode: 'free' | 'coloring';
  onModeChange: (mode: 'free' | 'coloring') => void;
}

export default function Toolbar({
  selectedTemplate,
  onTemplateChange,
  onLoadTemplate,
  currentBrush,
  onBrushChange,
  drawMode,
  onModeChange
}: ToolbarProps) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[6] flex gap-4 items-center bg-white/95 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg">
      {/* Template Selection */}
      <div className="flex items-center gap-2.5">
        <label className="text-sm text-gray-600 font-semibold">模板:</label>
        <select
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm cursor-pointer transition-all min-w-[120px] hover:border-[#667eea] focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
        >
          <option value="">无模板</option>
          <optgroup label="动物 (30)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'animals')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="植物 (20)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'plants')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="物品 (15)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'objects')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="自然 (10)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'nature')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="食物 (10)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'food')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="交通工具 (5)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'vehicles')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="人物 (5)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'people')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="幻想 (5)">
            {Object.values(TEMPLATES)
              .filter(t => t.category === 'fantasy')
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
          </optgroup>
        </select>
        <button
          onClick={onLoadTemplate}
          className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-semibold rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          加载
        </button>
      </div>
      
      <div className="w-px h-8 bg-gray-200" />
      
      {/* Brush Selection */}
      <div className="flex items-center gap-2.5">
        <label className="text-sm text-gray-600 font-semibold">画笔:</label>
        <BrushSelector
          currentBrush={currentBrush}
          onBrushChange={onBrushChange}
        />
      </div>
      
      <div className="w-px h-8 bg-gray-200" />
      
      {/* Mode Toggle */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onModeChange('free')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
            drawMode === 'free'
              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          自由画
        </button>
        <button
          onClick={() => onModeChange('coloring')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
            drawMode === 'coloring'
              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          填色
        </button>
      </div>
    </div>
  );
}