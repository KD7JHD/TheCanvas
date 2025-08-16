import React, { useState, useEffect } from 'react';
import { cn } from '../utils/index';
import { X, Palette, Link } from 'lucide-react';
import { BlockType } from '../types/index';
import { useBlockStore } from '../stores/blockStore';
import { useModal } from '../contexts/ModalContext';

interface BlockPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COLORS = [
  '#f3f4f6', // Light gray
  '#e5e7eb', // Gray
  '#d1d5db', // Medium gray
  '#9ca3af', // Dark gray
];

const BLOCK_TYPES: BlockType[] = [
  'Text Block',
  'Image Block',
  'Code Block',
  'Form Block',
  'Expert Block',
];

export const BlockPropertiesModal: React.FC<BlockPropertiesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedBlock } = useModal();
  const block = selectedBlock;
  const [blockName, setBlockName] = useState('');
  const [blockType, setBlockType] = useState<BlockType>('Text Block');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const updateBlock = useBlockStore((state) => state.updateBlock);

  // Update form when block changes
  useEffect(() => {
    if (block) {
      setBlockName(block.name);
      setBlockType(block.type);
      setWebhookUrl(block.webhookUrl || '');
      
      // Check if block color is one of the default colors
      const isDefaultColor = DEFAULT_COLORS.includes(block.color);
      if (isDefaultColor) {
        setSelectedColor(block.color);
        setShowColorPicker(false);
        setCustomColor('');
      } else {
        setCustomColor(block.color);
        setShowColorPicker(true);
      }
    }
  }, [block]);

  const handleSave = () => {
    if (block && blockName.trim()) {
      const color = showColorPicker && customColor ? customColor : selectedColor;
      
      updateBlock(block.id, {
        name: blockName.trim(),
        type: blockType,
        color,
        webhookUrl: webhookUrl.trim(),
      });
      
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !block) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Block Properties</h3>
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
          onClick={handleSave}
          disabled={!blockName.trim()}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-primary text-primary-foreground rounded-md",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
