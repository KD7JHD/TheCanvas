import React, { useState } from 'react';
import { cn } from '../../shared/utils/index';
import { Plus, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useBlockStore } from '../../shared/stores/blockStore';
import { BlockItem } from '../../shared/components/BlockItem';
import { Block } from '../../shared/types/index';
import { useModal } from '../../shared/contexts/ModalContext';

export const RightSidebar: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { openModal } = useModal();

  const categorizedBlocks = useBlockStore((state) => state.getCategorizedBlocks());

  // Filter blocks based on search query
  const filteredCategorizedBlocks = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return categorizedBlocks;
    }

    const query = searchQuery.toLowerCase();
    return categorizedBlocks
      .map(category => ({
        ...category,
        blocks: category.blocks.filter(block =>
          block.name.toLowerCase().includes(query) ||
          block.type.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.blocks.length > 0);
  }, [categorizedBlocks, searchQuery]);

  const handleAddBlock = () => {
    openModal('addBlock');
  };

  const handleEditProperties = (block: Block) => {
    openModal('blockProperties', { block });
  };



  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Building Blocks</h2>
          <button
            onClick={handleAddBlock}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Add new block"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search building blocks..."
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategorizedBlocks.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery.trim() ? (
              <div className="text-muted-foreground text-sm mb-2">
                No blocks found matching "{searchQuery}"
              </div>
            ) : (
              <div className="text-muted-foreground text-sm mb-2">
                No blocks created yet
              </div>
            )}
            <button
              onClick={handleAddBlock}
              className={cn(
                "px-4 py-2 text-sm",
                "bg-primary text-primary-foreground rounded-md",
                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "transition-colors duration-200"
              )}
            >
              Create Your First Block
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategorizedBlocks.map((category) => (
              <div key={category.name} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left",
                    "text-sm font-medium text-foreground",
                    "hover:text-accent-foreground transition-colors duration-200"
                  )}
                >
                  {expandedCategories.has(category.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {category.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {category.blocks.length}
                  </span>
                </button>
                
                {expandedCategories.has(category.name) && (
                  <div className="space-y-2 pl-4">
                    {category.blocks.map((block) => (
                      <BlockItem
                        key={block.id}
                        block={block}
                        onEditProperties={handleEditProperties}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
