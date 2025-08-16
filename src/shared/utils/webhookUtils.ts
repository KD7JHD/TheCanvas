import { ProjectCreationData, WebhookAttribute, WebhookMetadata, WebhookValueType, WebhookRequest } from '../types/webhookTypes';

/**
 * Create a webhook payload according to the JSON schema
 */
export function createWebhookPayload(
  projectName: string,
  goal: string,
  instructions: string,
  otherAttributes: WebhookAttribute[] = [],
  finished: boolean = false,
  metadata?: Partial<WebhookMetadata>
): ProjectCreationData {
  return {
    projectName,
    goal,
    instructions,
    otherAttributes,
    finished,
    metadata: {
      createdAt: new Date().toISOString(),
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      version: '1.0.0',
      ...metadata
    }
  };
}

/**
 * Create a webhook attribute with proper typing
 */
export function createWebhookAttribute(
  name: string,
  value: WebhookValueType,
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
): WebhookAttribute {
  return {
    name,
    value,
    type
  };
}

/**
 * Validate project name according to schema rules
 */
export function validateProjectName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Project name is required' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Project name must be 100 characters or less' };
  }
  
  const pattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!pattern.test(name)) {
    return { isValid: false, error: 'Project name contains invalid characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate project goal according to schema rules
 */
export function validateProjectGoal(goal: string): { isValid: boolean; error?: string } {
  if (!goal || goal.trim().length === 0) {
    return { isValid: false, error: 'Project goal is required' };
  }
  
  if (goal.length < 10) {
    return { isValid: false, error: 'Project goal must be at least 10 characters' };
  }
  
  if (goal.length > 1000) {
    return { isValid: false, error: 'Project goal must be 1000 characters or less' };
  }
  
  return { isValid: true };
}

/**
 * Validate webhook payload structure
 */
export function validateWebhookPayload(payload: WebhookRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required top-level fields
  if (!payload.action) {
    errors.push('Action is required');
  }
  
  if (!payload.data) {
    errors.push('Data is required');
  }
  
  if (payload.data) {
    // Validate data structure based on action type
    if (payload.action === 'generate-project-attributes') {
      if (typeof payload.data === 'object' && payload.data !== null) {
        const projectData = payload.data as ProjectCreationData;
        const dataValidation = validateProjectCreationData(projectData);
        errors.push(...dataValidation.errors);
      } else {
        errors.push('Data must be an object for project generation');
      }
    }
    // Add other action type validations as needed
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate project creation data structure
 */
export function validateProjectCreationData(data: ProjectCreationData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required fields
  const nameValidation = validateProjectName(data.projectName);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error!);
  }
  
  const goalValidation = validateProjectGoal(data.goal);
  if (!goalValidation.isValid) {
    errors.push(goalValidation.error!);
  }
  
  if (!data.instructions || data.instructions.trim().length === 0) {
    errors.push('Instructions are required');
  }
  
  // Validate otherAttributes if present
  if (data.otherAttributes && Array.isArray(data.otherAttributes)) {
    data.otherAttributes.forEach((attr: WebhookAttribute, index: number) => {
      if (!attr.name || !Object.prototype.hasOwnProperty.call(attr, 'value') || !attr.type) {
        errors.push(`Attribute at index ${index} is missing required fields (name, value, type)`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate a sample webhook payload for testing
 */
export function generateSampleWebhookPayload(): ProjectCreationData {
  return createWebhookPayload(
    'Sample Project',
    'This is a sample project goal for testing purposes. It demonstrates how the webhook payload should be structured.',
    'Act as a Senior Analyst with sixteen years of experience...',
    [
      createWebhookAttribute('priority', 'high', 'string'),
      createWebhookAttribute('estimatedDuration', 30, 'number'),
      createWebhookAttribute('requiresApproval', true, 'boolean'),
      createWebhookAttribute('tags', ['sample', 'test', 'webhook'], 'array')
    ],
    false
  );
}
