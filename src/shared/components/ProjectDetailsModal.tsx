import React from 'react';
import { cn } from '../utils/index';
import { 
  X, 
  Folder, 
  Calendar, 
  User, 
  Tag, 
  Settings, 
  FileText,
  Link
} from 'lucide-react';

import { useModal } from '../contexts/ModalContext';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedProject } = useModal();
  const project = selectedProject;
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (!isOpen || !project) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Project Details</h2>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded-md hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Project Information */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Project Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{project.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Goal</label>
                <p className="text-foreground">{project.goal}</p>
              </div>
              {project.metadata?.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{project.metadata.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Instructions
            </label>
            <div className="mt-2 p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {project.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dates */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Created:</span>
                <p className="text-sm text-foreground">{formatDate(project.createdAt)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(project.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Last Updated:</span>
                <p className="text-sm text-foreground">{formatDate(project.updatedAt)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(project.updatedAt)}
                </p>
              </div>
              {project.metadata?.lastAccessed && (
                <div>
                  <span className="text-xs text-muted-foreground">Last Accessed:</span>
                  <p className="text-sm text-foreground">
                    {formatDate(project.metadata.lastAccessed)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(project.metadata.lastAccessed)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ownership & Version */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Ownership
            </h4>
            <div className="space-y-2">
              {project.owner && (
                <div>
                  <span className="text-xs text-muted-foreground">Owner:</span>
                  <p className="text-sm text-foreground">{project.owner}</p>
                </div>
              )}
              {project.metadata?.version && (
                <div>
                  <span className="text-xs text-muted-foreground">Version:</span>
                  <p className="text-sm text-foreground">{project.metadata.version}</p>
                </div>
              )}
              {project.collaborators && project.collaborators.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Collaborators:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.collaborators.map((collaborator, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {collaborator}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.metadata?.tags && project.metadata.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Project Settings
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Auto Save:</span>
              <p className="text-sm text-foreground">
                {project.settings?.autoSave ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Snap to Grid:</span>
              <p className="text-sm text-foreground">
                {project.settings?.snapToGrid ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Grid Size:</span>
              <p className="text-sm text-foreground">{project.settings?.gridSize || 50}px</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Theme:</span>
              <p className="text-sm text-foreground capitalize">
                {project.settings?.theme || 'system'}
              </p>
            </div>
          </div>
        </div>

        {/* Folder & Webhook */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folder Path
            </h4>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-foreground font-mono break-all">
                {project.folder}
              </p>
            </div>
          </div>

          {project.webhookUrl && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Link className="h-4 w-4" />
                n8n Webhook
              </h4>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-foreground font-mono break-all">
                  {project.webhookUrl}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-border">
        <button
          onClick={onClose}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
        >
          Close
        </button>
      </div>
    </div>
  );
};
