import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/index';
import { 
  Folder, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { Project } from '../types/index';
import { useProjectStore } from '../stores/projectStore';

import { useModal } from '../contexts/ModalContext';

interface ProjectListProps {
  className?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({ className }) => {
  const [showMenuForProject, setShowMenuForProject] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  const { projects, selectProject, currentProjectId } = useProjectStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuForProject(null);
      }
    };

    if (showMenuForProject) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuForProject]);

  const handleViewProject = (project: Project) => {
    openModal('projectDetails', { project });
    setShowMenuForProject(null);
  };

  const handleEditProject = (project: Project) => {
    openModal('editProject', { project });
    setShowMenuForProject(null);
  };

  const handleDeleteProject = (project: Project) => {
    openModal('deleteProject', { project });
    setShowMenuForProject(null);
  };

  const handleSelectProject = (project: Project) => {
    selectProject(project.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (projects.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Projects Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first project to get started
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "group relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all w-full max-w-full",
              currentProjectId === project.id && "border-primary bg-primary/5"
            )}
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Folder className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground break-words">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground break-words">
                    {truncateText(project.goal, 60)}
                  </p>
                </div>
              </div>

              {/* Action Menu */}
              <div className="relative flex-shrink-0" ref={menuRef}>
                <button
                  onClick={() => setShowMenuForProject(
                    showMenuForProject === project.id ? null : project.id
                  )}
                  className={cn(
                    "p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenuForProject === project.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-60 max-h-48 overflow-y-auto">
                    <div className="py-1">
                      <button
                        onClick={() => handleViewProject(project)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Project
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>Created {formatDate(project.createdAt)}</span>
              </div>
              {project.owner && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-20">{project.owner}</span>
                </div>
              )}
            </div>

            {/* Project Tags */}
            {project.metadata?.tags && project.metadata.tags.length > 0 && (
              <div className="flex items-start gap-1 mb-3">
                <Tag className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1 min-w-0">
                  {project.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md break-words"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.metadata.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.metadata.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Project Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSelectProject(project)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors min-w-0",
                  currentProjectId === project.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <span className="truncate">
                  {currentProjectId === project.id ? 'Current Project' : 'Open Project'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
