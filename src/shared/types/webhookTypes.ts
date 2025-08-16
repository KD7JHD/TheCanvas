/**
 * TypeScript interfaces for webhook payloads
 * These match the JSON schema defined in webhookSchema.json
 */

// Base types for webhook attributes
export type WebhookValueType = string | number | boolean | string[] | Record<string, unknown> | null;

export interface WebhookAttribute {
  name: string;
  value: WebhookValueType;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
}

export interface WebhookMetadata {
  createdAt?: string;
  sessionId?: string;
  version?: string;
}

// Project creation specific types
export interface ProjectCreationData {
  projectName: string;
  goal: string;
  instructions: string;
  otherAttributes?: WebhookAttribute[];
  finished?: boolean;
  metadata?: WebhookMetadata;
}

// Generic webhook data types
export type WebhookData = 
  | ProjectCreationData 
  | ConversationRequest 
  | UserResponseData 
  | TestData;

export interface UserResponseData {
  sessionId: string;
  selectedSuggestions: string[];
  customInput: string;
  timestamp: number;
}

export interface TestData {
  message: string;
  timestamp: number;
}

export interface WebhookRequest {
  action: 'generate-project-attributes' | 'test' | 'conversation-message' | 'user-response';
  data: WebhookData;
  projectId?: string;
  blockId?: string;
  sessionId?: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: WebhookResponseData;
  error?: string;
}

export type WebhookResponseData = 
  | ProjectGenerationResponse 
  | ConversationResponse 
  | TestResponse 
  | InteractiveResponse;

export interface TestResponse {
  message: string;
  timestamp: number;
  success: boolean;
}

export interface InteractiveResponse {
  question: string;
  suggestions: string[];
  allowCustomInput: boolean;
  responseType: 'question' | 'confirmation' | 'selection' | 'input';
}

export interface ProjectGenerationResponse {
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
  otherAttributes?: WebhookAttribute[];
  finished?: boolean;
}

// Legacy interfaces for backward compatibility
export interface ProjectGenerationRequest {
  goal: string;
  projectName: string;
  instructions: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConversationRequest {
  sessionId: string;
  message: ConversationMessage;
  context: {
    projectName?: string;
    goal?: string;
    instructions?: string;
    conversationHistory?: ConversationMessage[];
  };
}

export interface ConversationResponse {
  message?: string;
  content?: string;
  isComplete?: boolean;
  attributes?: {
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
  };
  // New fields for interactive responses
  question?: string;
  suggestions?: string[];
  allowCustomInput?: boolean;
  responseType?: 'question' | 'confirmation' | 'selection' | 'input';
}
