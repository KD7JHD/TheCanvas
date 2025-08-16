import React, { useState } from 'react';
import { cn } from '../utils/index';
import { X, Folder, Settings, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { projectCreationAgentService } from '../services/projectCreationAgentService';
import { useSimpleWebhook } from '../hooks/useSimpleWebhook';
import { PROJECT_CREATION_AGENT_CONFIG } from '../config/projectCreationAgent';
import { getTemplates } from '../config/projectCreation/templateLoader';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormData {
  name: string;
  goal: string;
  instructions: string;
  folder: string;
  description: string;
  tags: string[];
  settings: {
    autoSave: boolean;
    snapToGrid: boolean;
    gridSize: number;
    theme: 'light' | 'dark' | 'system';
    collaborationMode: boolean;
  };
}

interface ProjectAttributes {
  instructions: string;
  folder: string;
  description: string;
  tags: string[];
  settings: {
    autoSave: boolean;
    snapToGrid: boolean;
    gridSize: number;
    theme: 'light' | 'dark' | 'system';
    collaborationMode: boolean;
  };
}

const DEFAULT_PROJECT_SETTINGS = {
  autoSave: true,
  snapToGrid: true,
  gridSize: 50,
  theme: 'system' as const,
  collaborationMode: false,
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    goal: '',
    instructions: '',
    folder: '',
    description: '',
    tags: [],
    settings: DEFAULT_PROJECT_SETTINGS,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>('');

  const { addProject } = useProjectStore();

  // Simple webhook handling
  const { sendWebhook } = useSimpleWebhook({
    onSuccess: (response) => {
      console.log('Received webhook response:', response);
      
      // Just display the raw response
      setRawResponse(JSON.stringify(response, null, 2));
      setShowRawResponse(true);
      setIsGenerating(false);
    },
    onError: (error) => {
      setError(error);
      setIsGenerating(false);
    }
  });

  const handleInputChange = (field: keyof ProjectFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsChange = (field: keyof typeof formData.settings, value: unknown) => {
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

  const handleProjectCreationComplete = (attributes: ProjectAttributes) => {
    const projectData = {
      name: formData.name.trim(),
      goal: formData.goal.trim(),
      instructions: attributes.instructions,
      folder: attributes.folder,
      settings: attributes.settings,
      metadata: {
        description: attributes.description,
        tags: attributes.tags,
        version: '1.0.0',
        lastAccessed: Date.now(),
      },
    };

    addProject(projectData);
    resetFormAndClose();
  };

  const handleCloseRawResponse = () => {
    setShowRawResponse(false);
    setRawResponse('');
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim() || !formData.goal.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const templates = getTemplates();
      
      if (isAdvancedMode) {
        // Advanced mode - use user-provided data
        const agentResponse = await projectCreationAgentService.createProject({
          projectName: formData.name.trim(),
          goal: formData.goal.trim(),
          mode: 'advanced',
          userProvidedData: {
            instructions: formData.instructions.trim(),
            folder: formData.folder.trim(),
            description: formData.description.trim(),
            tags: formData.tags,
            settings: formData.settings,
          },
        });

        if (!agentResponse.success) {
          if (agentResponse.validationErrors && agentResponse.validationErrors.length > 0) {
            setError(`Validation errors: ${agentResponse.validationErrors.join(', ')}`);
          } else {
            setError(agentResponse.error || 'Failed to create project');
          }
          setIsGenerating(false);
          return;
        }

        const projectData = {
          name: formData.name.trim(),
          goal: formData.goal.trim(),
          instructions: agentResponse.data!.instructions,
          folder: agentResponse.data!.folder,
          settings: agentResponse.data!.settings,
          metadata: {
            description: agentResponse.data!.description,
            tags: agentResponse.data!.tags,
            version: '1.0.0',
            lastAccessed: Date.now(),
          },
        };

        addProject(projectData);
        resetFormAndClose();
      } else {
        // Simple mode - use webhook response system
        const newSessionId = `project-creation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        // Create webhook payload matching n8n expected format
        const webhookPayload = [
          {
            systemPrompt: templates.instructions,
            projectName: formData.name.trim(),
            projectGoal: formData.goal.trim(),
            finished: false,
            sessionID: newSessionId
          }
        ];

        // Send webhook request and track for response
        const success = await sendWebhook(
          PROJECT_CREATION_AGENT_CONFIG.webhookUrl,
          'generate-project-attributes',
          webhookPayload,
          newSessionId
        );

        if (!success) {
          setError('Failed to send webhook request. Please try again.');
          setIsGenerating(false);
          setSessionId(null);
        }
        // If success, the response will be handled by the webhook response hook
      }
    } catch (error) {
      setError('Failed to create project. Please try again.');
      setIsGenerating(false);
      setSessionId(null);
    }
  };

  const resetFormAndClose = () => {
    setFormData({
      name: '',
      goal: '',
      instructions: '',
      folder: '',
      description: '',
      tags: [],
      settings: DEFAULT_PROJECT_SETTINGS,
    });
    setIsAdvancedMode(false);
    setError(null);
    setSessionId(null);
    setShowRawResponse(false);
    setRawResponse('');
    onClose();
  };

  const handleCancel = () => {
    resetFormAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Create New Project</h3>
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

      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
          </span>
        </div>
                 <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAdvancedMode(!isAdvancedMode);
              setError(null);
            }}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isAdvancedMode ? "bg-primary" : "bg-muted-foreground/20"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isAdvancedMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-destructive font-medium">Error</p>
            <p className="text-xs text-destructive/80">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-destructive hover:text-destructive/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Simple Status */}
      {sessionId && isGenerating && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
          <div className="flex-1">
            <p className="text-sm text-primary font-medium">Processing with AI</p>
            <p className="text-xs text-primary/80">
              Your request is being processed... This may take a few moments.
            </p>
          </div>
          
        </div>
      )}

      <div className="space-y-4">
        {/* Project Name - Always Required */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter project name..."
            className={cn(
              "w-full px-3 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
            autoFocus
          />
        </div>

        {/* Project Goal - Always Required */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Project Goal *
          </label>
          <textarea
            value={formData.goal}
            onChange={(e) => handleInputChange('goal', e.target.value)}
            placeholder={
              isAdvancedMode 
                ? "Describe the goal of this project..."
                : "Describe what you want to achieve with this project. The AI agent will help generate the best configuration for you."
            }
            rows={3}
            className={cn(
              "w-full px-3 py-2 text-sm",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground resize-none"
            )}
          />
          {!isAdvancedMode && (
            <p className="text-xs text-muted-foreground mt-1">
              💡 AI will generate project attributes based on your goal. Switch to Advanced Mode to customize all attributes yourself.
            </p>
          )}
        </div>

        {/* Advanced Mode Fields */}
        {isAdvancedMode && (
          <>
            {/* Project Description */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional description of the project..."
                rows={2}
                className={cn(
                  "w-full px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground resize-none"
                )}
              />
            </div>

            {/* Project Instructions */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Project Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Enter system prompt or instructions for this project..."
                rows={4}
                className={cn(
                  "w-full px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground resize-none"
                )}
              />
            </div>

            {/* Project Folder */}
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
                  placeholder="Enter local folder path (e.g., /projects/my-project)"
                  className={cn(
                    "flex-1 px-3 py-2 text-sm",
                    "bg-background border border-input rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "placeholder:text-muted-foreground"
                  )}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas..."
                className={cn(
                  "w-full px-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "placeholder:text-muted-foreground"
                )}
              />
            </div>

            {/* Project Settings */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">Project Settings</h4>
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
          </>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleCancel}
          className={cn(
            "px-4 py-2 text-sm",
            "bg-secondary text-secondary-foreground rounded-md",
            "hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
        >
          Cancel
        </button>
        
        <button
          onClick={handleCreateProject}
          disabled={!formData.name.trim() || !formData.goal.trim() || isGenerating}
          className={cn(
            "flex-1 px-4 py-2 text-sm",
            "bg-primary text-primary-foreground rounded-md",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isAdvancedMode ? 'Creating Project...' : 'Generating Project Attributes...'}
            </>
          ) : (
            isAdvancedMode ? 'Create Project' : 'Generate Project Attributes'
          )}
        </button>
      </div>

      {/* Raw Response Modal */}
      {showRawResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Raw n8n Response</h3>
              <button
                onClick={handleCloseRawResponse}
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
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Response from n8n server:
                </label>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                  {rawResponse}
                </pre>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={handleCloseRawResponse}
                className={cn(
                  "px-4 py-2 text-sm",
                  "bg-primary text-primary-foreground rounded-md",
                  "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "transition-colors duration-200"
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
