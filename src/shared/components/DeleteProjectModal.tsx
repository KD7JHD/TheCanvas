import React, { useState } from 'react';
import { cn } from '../utils/index';
import { 
  X, 
  AlertTriangle, 
  Trash2,
  Folder,
  Calendar,
  User
} from 'lucide-react';

import { useProjectStore } from '../stores/projectStore';
import { useModal } from '../contexts/ModalContext';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedProject } = useModal();
  const project = selectedProject;
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { deleteProject } = useProjectStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!project || confirmText !== project.name) {
      return;
    }

    setIsDeleting(true);

    try {
      deleteProject(project.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Delete Project</h2>
        </div>
        <button
          onClick={handleCancel}
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

      {/* Warning Message */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-destructive mb-1">
              This action cannot be undone
            </h3>
            <p className="text-sm text-destructive/80">
              This will permanently delete the project and all associated data. 
              Please make sure you have backed up any important information.
            </p>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Project to be deleted:</h3>
        
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Folder className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{project.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{project.goal}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            {project.owner && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{project.owner}</span>
              </div>
            )}
          </div>

          {project.metadata?.tags && project.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.metadata.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
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
          )}
        </div>
      </div>

      {/* Confirmation */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground block">
          To confirm deletion, type the project name:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={project.name}
          className={cn(
            "w-full px-3 py-2 text-sm",
            "bg-background border border-input rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "placeholder:text-muted-foreground"
          )}
        />
        <p className="text-xs text-muted-foreground">
          Type <span className="font-mono text-foreground">{project.name}</span> to confirm
        </p>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-4 border-t border-border">
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
          onClick={handleDelete}
          disabled={confirmText !== project.name || isDeleting}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-destructive text-destructive-foreground rounded-md",
            "hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isDeleting ? (
            <>
              <Trash2 className="h-4 w-4 animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </>
          )}
        </button>
      </div>
    </div>
  );
};
