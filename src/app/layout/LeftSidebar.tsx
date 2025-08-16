import React from 'react';
import { cn } from '../../shared/utils/index';
import { Plus, Search } from 'lucide-react';
import { ProjectList } from '../../shared/components/ProjectList';
import { useModal } from '../../shared/contexts/ModalContext';

export const LeftSidebar: React.FC = () => {
  const { openModal } = useModal();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <button
            onClick={() => openModal('createProject')}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Create new project"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ProjectList />
      </div>
    </div>
  );
};
