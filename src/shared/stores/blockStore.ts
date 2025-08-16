import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Block, BlockType, BlockCategory } from '../types/index';
import { generateId } from '../utils/index';

interface BlockStore {
  blocks: Block[];
  selectedBlockId: string | null;
  
  // Actions
  addBlock: (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  
  // Computed
  getBlockById: (id: string) => Block | undefined;
  getCategorizedBlocks: () => BlockCategory[];
}

export const useBlockStore = create<BlockStore>()(
  persist(
    (set, get) => ({
      blocks: [],
      selectedBlockId: null,

      addBlock: (blockData) => {
        const newBlock: Block = {
          ...blockData,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          blocks: [...state.blocks, newBlock],
        }));
      },

      updateBlock: (id, updates) => {
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id
              ? { ...block, ...updates, updatedAt: Date.now() }
              : block
          ),
        }));
      },

      deleteBlock: (id) => {
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        }));
      },

      selectBlock: (id) => {
        set({ selectedBlockId: id });
      },

      getBlockById: (id) => {
        return get().blocks.find((block) => block.id === id);
      },

      getCategorizedBlocks: () => {
        const blocks = get().blocks;
        const categories: Record<BlockType, Block[]> = {
          'Text Block': [],
          'Image Block': [],
          'Code Block': [],
          'Form Block': [],
          'Expert Block': [],
        };

        blocks.forEach((block) => {
          if (categories[block.type]) {
            categories[block.type].push(block);
          }
        });

        return Object.entries(categories)
          .filter(([, blocks]) => blocks.length > 0)
          .map(([name, blocks]) => ({
            name,
            blocks: blocks.sort((a, b) => b.createdAt - a.createdAt),
          }));
      },
    }),
    {
      name: 'canvas-blocks',
    }
  )
);
