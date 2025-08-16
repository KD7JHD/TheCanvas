import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/index';
import { X, Send, Loader2, Bot, User } from 'lucide-react';
import { projectCreationAgentService, ConversationState } from '../services/projectCreationAgentService';

interface ProjectConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  projectName: string;
  projectGoal: string;
  onComplete: (attributes: {
    instructions: string;
    folder: string;
    description: string;
    tags: string[];
    settings: any;
  }) => void;
}

export const ProjectConversationModal: React.FC<ProjectConversationModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  projectName,

  onComplete,
}) => {
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation on mount
  useEffect(() => {
    if (isOpen && sessionId) {
      loadConversation();
    }
  }, [isOpen, sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const loadConversation = async () => {
    try {
      const conv = projectCreationAgentService.getConversation(sessionId);
      if (conv) {
        setConversation(conv);
        
        // Check if conversation is complete
        if (conv.isComplete && conv.finalAttributes) {
          onComplete(conv.finalAttributes);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setError('Failed to load conversation');
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedConversation = await projectCreationAgentService.sendMessage(sessionId, message.trim());
      setConversation(updatedConversation);
      setMessage('');

      // Check if conversation is complete
      if (updatedConversation.isComplete && updatedConversation.finalAttributes) {
        onComplete(updatedConversation.finalAttributes);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Project Creation Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Creating: {projectName}
            </p>
          </div>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation?.messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                msg.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={cn(
                "text-xs mt-1",
                msg.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={cn(
              "flex-1 px-3 py-2 text-sm resize-none",
              "bg-background border border-input rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className={cn(
              "px-4 py-2 text-sm",
              "bg-primary text-primary-foreground rounded-md",
              "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
