import { simpleWebhookService } from './simpleWebhookService';
import { 
  PROJECT_CREATION_AGENT_CONFIG, 
  validateProjectData, 
  getDefaultProjectAttributes,
  type ProjectCreationAgentConfig 
} from '../config/projectCreationAgent';
import { getTemplates } from '../config/projectCreation/templateLoader';

export interface ProjectCreationRequest {
  goal: string;
  projectName: string;
  mode: 'simple' | 'advanced';
  userProvidedData?: {
    instructions?: string;
    folder?: string;
    description?: string;
    tags?: string[];
    settings?: any;
  };
}

export interface ProjectCreationResponse {
  success: boolean;
  data?: {
    instructions: string;
    folder: string;
    description: string;
    tags: string[];
    settings: any;
    conversationSessionId?: string;
  };
  error?: string;
  validationErrors?: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConversationState {
  sessionId: string;
  messages: ConversationMessage[];
  isComplete: boolean;
  finalAttributes?: {
    instructions: string;
    folder: string;
    description: string;
    tags: string[];
    settings: any;
  };
}

class ProjectCreationAgentService {
  private config: ProjectCreationAgentConfig;
  private activeConversations: Map<string, ConversationState> = new Map();

  constructor(config: ProjectCreationAgentConfig = PROJECT_CREATION_AGENT_CONFIG) {
    this.config = config;
  }

  /**
   * Start a new conversation with the project creation agent
   */
  async startConversation(projectName: string, goal: string): Promise<ConversationState> {
    const sessionId = `project-creation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get the instructions template
    const templates = getTemplates();
    
    const initialState: ConversationState = {
      sessionId,
      messages: [],
      isComplete: false,
    };

    // Send initial message to start the conversation
    const initialMessage: ConversationMessage = {
      role: 'user',
      content: `I want to create a project called "${projectName}" with the goal: "${goal}". Please help me define all the project attributes.`,
      timestamp: Date.now(),
    };

    initialState.messages.push(initialMessage);

    // Send to n8n webhook to start conversation
    await simpleWebhookService.sendWebhook(
      this.config.webhookUrl,
      {
        sessionId,
        action: 'conversation-message',
        data: {
          message: initialMessage,
          context: {
            projectName,
            goal,
            instructions: templates.instructions,
          }
        },
        timestamp: Date.now()
      }
    );

    // Note: In a real implementation, the response would be handled via the webhook callback
    // The actual response from n8n would be processed by the webhook service

    this.activeConversations.set(sessionId, initialState);
    return initialState;
  }

  /**
   * Send a message in an ongoing conversation
   */
  async sendMessage(sessionId: string, message: string): Promise<ConversationState> {
    const conversation = this.activeConversations.get(sessionId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add user message
    const userMessage: ConversationMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    conversation.messages.push(userMessage);

    // Send to n8n webhook
    await simpleWebhookService.sendWebhook(
      this.config.webhookUrl,
      {
        sessionId,
        action: 'conversation-message',
        data: {
          message: userMessage,
          context: {
            conversationHistory: conversation.messages,
          }
        },
        timestamp: Date.now()
      }
    );

    // Note: In a real implementation, the response would be handled via the webhook callback
    // The actual response from n8n would be processed by the webhook service

    this.activeConversations.set(sessionId, conversation);
    return conversation;
  }

  /**
   * Get the current state of a conversation
   */
  getConversation(sessionId: string): ConversationState | undefined {
    return this.activeConversations.get(sessionId);
  }

  /**
   * Complete a conversation and create the project
   */
  async completeConversation(sessionId: string): Promise<ProjectCreationResponse> {
    const conversation = this.activeConversations.get(sessionId);
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    if (!conversation.isComplete || !conversation.finalAttributes) {
      return {
        success: false,
        error: 'Conversation is not complete yet',
      };
    }

    // Clean up conversation
    this.activeConversations.delete(sessionId);

    return {
      success: true,
      data: conversation.finalAttributes,
    };
  }

  /**
   * Create a new project using the project creation agent (legacy method for advanced mode)
   */
  async createProject(request: ProjectCreationRequest): Promise<ProjectCreationResponse> {
    try {
      // Validate input data
      const validation = validateProjectData(
        { name: request.projectName, goal: request.goal },
        this.config
      );

      if (!validation.isValid) {
        return {
          success: false,
          validationErrors: validation.errors,
        };
      }

      // Check if advanced mode is enabled
      if (request.mode === 'advanced' && !this.config.enableAdvancedMode) {
        return {
          success: false,
          error: 'Advanced mode is not enabled in the project creation agent configuration',
        };
      }

      // Check if auto generation is enabled
      if (request.mode === 'simple' && !this.config.enableAutoGeneration) {
        return {
          success: false,
          error: 'Auto generation is not enabled in the project creation agent configuration',
        };
      }

      if (request.mode === 'simple') {
        // Use conversation flow for AI-assisted project creation
        return await this.createProjectWithConversation(request);
      } else {
        // Use user-provided data with fallback to defaults
        return await this.createProjectWithUserData(request);
      }
    } catch (error) {
      console.error('Project creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create project using conversation flow with AI assistance
   */
  private async createProjectWithConversation(request: ProjectCreationRequest): Promise<ProjectCreationResponse> {
    try {
      // Start conversation
      const conversation = await this.startConversation(request.projectName, request.goal);
      
      // For now, return the conversation state - the UI will handle the conversation flow
      return {
        success: true,
        data: {
          conversationSessionId: conversation.sessionId,
          instructions: '',
          folder: '',
          description: '',
          tags: [],
          settings: this.config.defaultSettings,
        },
      };
    } catch (error) {
      console.error('Conversation-based project creation failed:', error);
      
      // Fallback to default attributes
      const defaultAttributes = getDefaultProjectAttributes(
        request.projectName,
        request.goal,
        this.config
      );

      return {
        success: true,
        data: defaultAttributes,
      };
    }
  }



  /**
   * Create project using user-provided data with fallback to defaults
   */
  private async createProjectWithUserData(request: ProjectCreationRequest): Promise<ProjectCreationResponse> {
    const defaultAttributes = getDefaultProjectAttributes(
      request.projectName,
      request.goal,
      this.config
    );

    const userData = request.userProvidedData || {};

    // Merge user data with defaults, prioritizing user data
    const mergedData = {
      instructions: userData.instructions || defaultAttributes.instructions,
      folder: userData.folder || defaultAttributes.folder,
      description: userData.description || defaultAttributes.description,
      tags: userData.tags || defaultAttributes.tags,
      settings: {
        ...defaultAttributes.settings,
        ...userData.settings,
      },
    };

    return {
      success: true,
      data: mergedData,
    };
  }

  /**
   * Test the project creation agent webhook
   */
  async testAgent(): Promise<boolean> {
    try {
      return await simpleWebhookService.testWebhook(this.config.webhookUrl);
    } catch (error) {
      console.error('Project creation agent test failed:', error);
      return false;
    }
  }

  /**
   * Get the current agent configuration
   */
  getConfig(): ProjectCreationAgentConfig {
    return { ...this.config };
  }

  /**
   * Update the agent configuration
   */
  updateConfig(newConfig: Partial<ProjectCreationAgentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export a singleton instance
export const projectCreationAgentService = new ProjectCreationAgentService();
