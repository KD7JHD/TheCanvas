import React from 'react';
import { cn } from '../utils/index';
import { Settings, Trash2 } from 'lucide-react';
import { Block } from '../types/index';
import { useBlockStore } from '../stores/blockStore';

interface BlockItemProps {
  block: Block;
  onEditProperties?: (block: Block) => void;
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  onEditProperties,
}) => {
  const deleteBlock = useBlockStore((state) => state.deleteBlock);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${block.name}"?`)) {
      deleteBlock(block.id);
    }
  };

  const handleEditProperties = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditProperties?.(block);
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg border",
        "hover:bg-accent hover:border-accent-foreground/20",
        "transition-all duration-200 cursor-pointer"
      )}
      style={{ borderLeftColor: block.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Color Indicator */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: block.color }}
        />
        
        {/* Block Info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">
            {block.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {block.type}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEditProperties}
          className={cn(
            "p-1 rounded hover:bg-accent-foreground/10",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
          aria-label="Edit block properties"
        >
          <Settings className="h-3 w-3 text-muted-foreground" />
        </button>
        
        <button
          onClick={handleDelete}
          className={cn(
            "p-1 rounded hover:bg-destructive/10",
            "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
            "transition-colors duration-200"
          )}
          aria-label="Delete block"
        >
          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </div>
  );
};
