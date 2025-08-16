import React from 'react';

// Common application types
export interface AppError {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  dismissible: boolean;
  autoRemove?: number; // milliseconds
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  onRetry: () => void;
  onReset: () => void;
}

// Layout types
export interface LayoutConfig {
  leftSidebar: { width: number; minWidth: number; collapsible: boolean };
  canvas: { flex: number; minWidth: number };
  rightSidebar: { width: number; minWidth: number; collapsible: boolean };
}

export interface ResponsiveBreakpoints {
  mobile: number;    // 768px
  tablet: number;    // 1024px
  desktop: number;   // 1440px
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Generic component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Block types
export type BlockType = 'Text Block' | 'Image Block' | 'Code Block' | 'Form Block' | 'Expert Block';

export interface Block {
  id: string;
  name: string;
  type: BlockType;
  color: string;
  webhookUrl?: string; // n8n webhook URL for AI/agent functions
  createdAt: number;
  updatedAt: number;
  properties?: Record<string, unknown>;
}

export interface BlockCategory {
  name: string;
  blocks: Block[];
}

// Project types
export interface Project {
  id: string;
  name: string;
  goal: string;
  instructions: string; // System prompt text
  folder: string; // Local folder reference
  webhookUrl?: string; // n8n webhook URL for AI/agent functions
  createdAt: number;
  updatedAt: number;
  owner?: string;
  collaborators?: string[];
  settings?: ProjectSettings;
  metadata?: ProjectMetadata;
}

export interface ProjectSettings {
  autoSave: boolean;
  snapToGrid: boolean;
  gridSize: number;
  theme: 'light' | 'dark' | 'system';
  collaborationMode: boolean;
}

export interface ProjectMetadata {
  description?: string;
  tags?: string[];
  version?: string;
  lastAccessed?: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
