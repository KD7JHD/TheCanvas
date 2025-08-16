import React from 'react';
import { cn } from '../../shared/utils/index';
import { Move, ZoomIn, ZoomOut } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background">
             {/* Canvas Toolbar */}
       <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
           <button
             className={cn(
               "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
               "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
               "transition-colors duration-200"
             )}
             aria-label="Move tool"
           >
             <Move className="h-4 w-4" />
           </button>
         </div>

        <div className="flex items-center gap-2">
          <button
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-muted-foreground px-2">100%</span>
          
          <button
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative overflow-hidden z-0">
        <div className="absolute inset-0 canvas-grid">
          {/* Empty canvas - ready for blocks */}
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="h-8 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Position: 0, 0</span>
          <span>Zoom: 100%</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Blocks: 0</span>
          <span>Connections: 0</span>
        </div>
      </div>
    </div>
  );
};
