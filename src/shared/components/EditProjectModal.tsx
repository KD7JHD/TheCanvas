import React, { useState, useEffect } from 'react';
import { cn } from '../utils/index';
import { 
  X, 
  Folder, 
  Settings, 
  Save,
  User,
  Tag,
  Link
} from 'lucide-react';
import { Project } from '../types/index';
import { useProjectStore } from '../stores/projectStore';
import { useModal } from '../contexts/ModalContext';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditProjectFormData {
  name: string;
  goal: string;
  instructions: string;
  folder: string;
  description: string;
  tags: string[];
  owner: string;
  webhookUrl: string;
  settings: {
    autoSave: boolean;
    snapToGrid: boolean;
    gridSize: number;
    theme: 'light' | 'dark' | 'system';
    collaborationMode: boolean;
  };
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedProject } = useModal();
  const project = selectedProject;
  const [formData, setFormData] = useState<EditProjectFormData>({
    name: '',
    goal: '',
    instructions: '',
    folder: '',
    description: '',
    tags: [],
    owner: '',
    webhookUrl: '',
    settings: {
      autoSave: true,
      snapToGrid: true,
      gridSize: 50,
      theme: 'system',
      collaborationMode: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const { updateProject } = useProjectStore();

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        goal: project.goal,
        instructions: project.instructions,
        folder: project.folder,
        description: project.metadata?.description || '',
        tags: project.metadata?.tags || [],
        owner: project.owner || '',
        webhookUrl: project.webhookUrl || '',
        settings: {
          autoSave: project.settings?.autoSave ?? true,
          snapToGrid: project.settings?.snapToGrid ?? true,
          gridSize: project.settings?.gridSize ?? 50,
          theme: project.settings?.theme ?? 'system',
          collaborationMode: project.settings?.collaborationMode ?? false,
        },
      });
    }
  }, [project]);

  const handleInputChange = (field: keyof EditProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsChange = (field: keyof typeof formData.settings, value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.goal.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedProject: Partial<Project> = {
        name: formData.name.trim(),
        goal: formData.goal.trim(),
        instructions: formData.instructions.trim(),
        folder: formData.folder.trim(),
        owner: formData.owner.trim() || undefined,
        webhookUrl: formData.webhookUrl.trim() || undefined,
        settings: formData.settings,
        metadata: {
          description: formData.description.trim(),
          tags: formData.tags,
          version: project?.metadata?.version || '1.0.0',
          lastAccessed: project?.metadata?.lastAccessed || Date.now(),
        },
      };

      if (project) {
        updateProject(project.id, updatedProject);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Edit Project</h2>
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

      {/* Form */}
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
          
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={cn(
                "w-full px-3 py-2 text-sm",
                "bg-background border border-input rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "placeholder:text-muted-foreground"
              )}
              placeholder="Enter project name..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Goal *
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              rows={3}
              className={cn(
                "w-full px-3 py-2 text-sm",
                "bg-background border border-input rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "placeholder:text-muted-foreground resize-none"
              )}
              placeholder="Describe the goal of this project..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
              className={cn(
                "w-full px-3 py-2 text-sm",
                "bg-background border border-input rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "placeholder:text-muted-foreground resize-none"
              )}
              placeholder="Optional description of the project..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              rows={4}
              className={cn(
                "w-full px-3 py-2 text-sm",
                "bg-background border border-input rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "placeholder:text-muted-foreground resize-none"
              )}
              placeholder="Enter system prompt or instructions for this project..."
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Project Details</h3>
          
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Folder
            </label>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.folder}
                onChange={(e) => handleInputChange('folder', e.target.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="Enter local folder path (e.g., /projects/my-project)"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Project Owner
            </label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="Enter project owner..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              n8n Webhook URL
            </label>
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="https://your-n8n-instance.com/webhook/project-function"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
                placeholder="Enter tags separated by commas..."
              />
            </div>
          </div>
        </div>

        {/* Project Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">Project Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Auto Save</label>
              <button
                onClick={() => handleSettingsChange('autoSave', !formData.settings.autoSave)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  formData.settings.autoSave ? "bg-primary" : "bg-muted-foreground/20"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                    formData.settings.autoSave ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Snap to Grid */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Snap to Grid</label>
              <button
                onClick={() => handleSettingsChange('snapToGrid', !formData.settings.snapToGrid)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  formData.settings.snapToGrid ? "bg-primary" : "bg-muted-foreground/20"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                    formData.settings.snapToGrid ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Grid Size */}
            <div>
              <label className="text-sm text-foreground block mb-1">Grid Size</label>
              <input
                type="number"
                value={formData.settings.gridSize}
                onChange={(e) => handleSettingsChange('gridSize', parseInt(e.target.value) || 50)}
                min="10"
                max="100"
                className={cn(
                  "w-full px-2 py-1 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              />
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm text-foreground block mb-1">Theme</label>
              <select
                value={formData.settings.theme}
                onChange={(e) => handleSettingsChange('theme', e.target.value as 'light' | 'dark' | 'system')}
                className={cn(
                  "w-full px-2 py-1 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
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
          onClick={handleSave}
          disabled={!formData.name.trim() || !formData.goal.trim() || isSaving}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-primary text-primary-foreground rounded-md",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};
