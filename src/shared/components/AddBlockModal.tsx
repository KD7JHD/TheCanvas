import React, { useState } from 'react';
import { cn } from '../utils/index';
import { X, Link, Palette } from 'lucide-react';
import { useBlockStore } from '../stores/blockStore';
import { BlockType } from '../types/index';

const BLOCK_TYPES: BlockType[] = [
  'Text Block',
  'Image Block',
  'Code Block',
  'Form Block',
  'Expert Block',
];

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
];

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [blockName, setBlockName] = useState('');
  const [blockType, setBlockType] = useState<BlockType>('Text Block');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const addBlock = useBlockStore((state) => state.addBlock);

  const handleCreateBlock = () => {
    if (blockName.trim()) {
      const color = showColorPicker && customColor ? customColor : selectedColor;
      
      addBlock({
        name: blockName.trim(),
        type: blockType,
        color,
        webhookUrl: webhookUrl.trim(),
      });

      // Reset form
      setBlockName('');
      setBlockType('Text Block');
      setSelectedColor(DEFAULT_COLORS[0]);
      setCustomColor('');
      setShowColorPicker(false);
      setWebhookUrl('');
      
      onClose();
    }
  };

  const handleCancel = () => {
    setBlockName('');
    setBlockType('Text Block');
    setSelectedColor(DEFAULT_COLORS[0]);
    setCustomColor('');
    setShowColorPicker(false);
    setWebhookUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Add New Block</h3>
        <button
          onClick={handleCancel}
          className={cn(
            "p-1 rounded-md hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Block Name */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Block Name
          </label>
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            placeholder="Enter block name..."
            className={cn(
              "w-full px-3 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
            autoFocus
          />
        </div>

        {/* Block Type */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Block Type
          </label>
          <select
            value={blockType}
            onChange={(e) => setBlockType(e.target.value as BlockType)}
            className={cn(
              "w-full px-3 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            {BLOCK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Webhook URL */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            n8n Webhook URL (Optional)
          </label>
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/block-function"
              className={cn(
                "flex-1 px-3 py-2 text-sm",
                "bg-background border border-input rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "placeholder:text-muted-foreground"
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            For AI/agent functions specific to this block
          </p>
        </div>

        {/* Block Color */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Block Color
          </label>
          
          {/* Default Color Options */}
          <div className="flex items-center gap-2 mb-3">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
                className={cn(
                  "w-8 h-8 rounded-md border-2 transition-all",
                  "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  selectedColor === color && !showColorPicker
                    ? "border-primary scale-110"
                    : "border-border"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
            
            {/* Custom Color Picker */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={cn(
                "w-8 h-8 rounded-md border-2 border-border",
                "flex items-center justify-center",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "transition-all",
                showColorPicker && "border-primary scale-110"
              )}
              aria-label="Custom color picker"
            >
              <Palette className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Custom Color Input */}
          {showColorPicker && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-8 rounded border border-input cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className={cn(
                  "flex-1 px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCancel}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-secondary text-secondary-foreground rounded-md",
            "hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateBlock}
          disabled={!blockName.trim()}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-primary text-primary-foreground rounded-md",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Create Block
        </button>
      </div>
    </div>
  );
};
