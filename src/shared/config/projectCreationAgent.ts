/**
 * Project Creation Agent Configuration
 * 
 * This is the behind-the-scenes agent that handles project creation in collaboration with the user.
 * You can customize the webhook URL and other settings here.
 * 
 * Template content is loaded from markdown files in the projectCreation directory:
 * - src/shared/config/projectCreation/instructions.md
 * - src/shared/config/projectCreation/description.md
 * - src/shared/config/projectCreation/folder.md
 * - src/shared/config/projectCreation/tags.md
 */

import { getTemplates } from './projectCreation/templateLoader';

export interface ProjectCreationAgentConfig {
  // The n8n webhook URL for the project creation agent
  webhookUrl: string;
  
  // Agent metadata
  name: string;
  description: string;
  version: string;
  
  // Configuration options
  enableAdvancedMode: boolean;
  enableAutoGeneration: boolean;
  defaultSettings: {
    autoSave: boolean;
    snapToGrid: boolean;
    gridSize: number;
    theme: 'light' | 'dark' | 'system';
    collaborationMode: boolean;
  };
  
  // Placeholder templates for project attributes
  templates: {
    instructions: string;
    folder: string;
    description: string;
    tags: string[];
  };
  
  // Validation rules
  validation: {
    minProjectNameLength: number;
    maxProjectNameLength: number;
    minGoalLength: number;
    maxGoalLength: number;
    requiredFields: string[];
  };
}

// ============================================================================
// CONFIGURATION - CUSTOMIZE THESE VALUES
// ============================================================================

export const PROJECT_CREATION_AGENT_CONFIG: ProjectCreationAgentConfig = {
  // ============================================================================
  // WEBHOOK CONFIGURATION
  // ============================================================================
  webhookUrl: 'https://kd7jhd.app.n8n.cloud/webhook-test/dbd6ace9-51d3-4c1b-8b95-f95b05e379ef',
  
  // ============================================================================
  // AGENT METADATA
  // ============================================================================
  name: 'Project Creation Agent',
  description: 'AI agent that helps users create new projects with intelligent suggestions and automation',
  version: '1.0.0',
  
  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  enableAdvancedMode: true,
  enableAutoGeneration: true,
  
  // ============================================================================
  // DEFAULT PROJECT SETTINGS
  // ============================================================================
  defaultSettings: {
    autoSave: true,
    snapToGrid: true,
    gridSize: 50,
    theme: 'system',
    collaborationMode: false,
  },
  
  // ============================================================================
  // TEMPLATE PLACEHOLDERS
  // ============================================================================
  // Templates are loaded from markdown files in the projectCreation directory
  // See: src/shared/config/projectCreation/ for individual template files
  templates: getTemplates(),
  
  // ============================================================================
  // VALIDATION RULES
  // ============================================================================
  validation: {
    minProjectNameLength: 3,
    maxProjectNameLength: 100,
    minGoalLength: 10,
    maxGoalLength: 500,
    requiredFields: ['name', 'goal'],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Process template placeholders with actual values
 */
export function processTemplate(template: string, values: Record<string, string>): string {
  let processed = template;
  
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return processed;
}

/**
 * Generate project name slug for folder paths
 */
export function generateProjectSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Validate project creation data against configuration rules
 */
export function validateProjectData(
  data: { name: string; goal: string },
  config: ProjectCreationAgentConfig = PROJECT_CREATION_AGENT_CONFIG
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate project name
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Project name is required');
  } else if (data.name.trim().length < config.validation.minProjectNameLength) {
    errors.push(`Project name must be at least ${config.validation.minProjectNameLength} characters`);
  } else if (data.name.trim().length > config.validation.maxProjectNameLength) {
    errors.push(`Project name must be no more than ${config.validation.maxProjectNameLength} characters`);
  }
  
  // Validate project goal
  if (!data.goal || data.goal.trim().length === 0) {
    errors.push('Project goal is required');
  } else if (data.goal.trim().length < config.validation.minGoalLength) {
    errors.push(`Project goal must be at least ${config.validation.minGoalLength} characters`);
  } else if (data.goal.trim().length > config.validation.maxGoalLength) {
    errors.push(`Project goal must be no more than ${config.validation.maxGoalLength} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get default project attributes using templates
 */
export function getDefaultProjectAttributes(
  projectName: string,
  projectGoal: string,
  config: ProjectCreationAgentConfig = PROJECT_CREATION_AGENT_CONFIG
) {
  const projectSlug = generateProjectSlug(projectName);
  
  return {
    instructions: processTemplate(config.templates.instructions, {
      PROJECT_NAME: projectName,
      PROJECT_GOAL: projectGoal,
    }),
    
    folder: processTemplate(config.templates.folder, {
      PROJECT_NAME_SLUG: projectSlug,
    }),
    
    description: processTemplate(config.templates.description, {
      PROJECT_GOAL: projectGoal,
    }),
    
    tags: [...config.templates.tags],
    
    settings: { ...config.defaultSettings },
  };
}
