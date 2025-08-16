/**
 * Logger service for consistent error handling and logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
}

class LoggerService {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableStorage: false,
      maxStorageEntries: 1000,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.config.level];
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
    };

    // Add to internal logs
    this.logs.push(entry);
    if (this.logs.length > this.config.maxStorageEntries) {
      this.logs.shift();
    }

    // Console output
    if (this.config.enableConsole) {
      const timestamp = new Date(entry.timestamp).toISOString();
      const contextStr = context ? ` ${JSON.stringify(context)}` : '';
      const errorStr = error ? `\nError: ${error.stack || error.message}` : '';

      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}] DEBUG: ${message}${contextStr}${errorStr}`);
          break;
        case 'info':
          console.info(`[${timestamp}] INFO: ${message}${contextStr}${errorStr}`);
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN: ${message}${contextStr}${errorStr}`);
          break;
        case 'error':
          console.error(`[${timestamp}] ERROR: ${message}${contextStr}${errorStr}`);
          break;
      }
    }

    // Storage (if enabled)
    if (this.config.enableStorage) {
      this.saveToStorage(entry);
    }
  }

  private saveToStorage(entry: LogEntry): void {
    try {
      const existing = localStorage.getItem('app-logs');
      const logs = existing ? JSON.parse(existing) : [];
      logs.push(entry);
      
      // Keep only recent logs
      if (logs.length > this.config.maxStorageEntries) {
        logs.splice(0, logs.length - this.config.maxStorageEntries);
      }
      
      localStorage.setItem('app-logs', JSON.stringify(logs));
    } catch (error) {
      // Fallback to console if storage fails
      console.error('Failed to save log to storage:', error);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log('error', message, context, error);
  }

  // Error handling utilities
  handleError(error: Error, context?: Record<string, unknown>): void {
    this.error('An error occurred', context, error);
  }

  handleAsyncError(error: unknown, context?: Record<string, unknown>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.error('Async operation failed', context, errorObj);
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    if (this.config.enableStorage) {
      localStorage.removeItem('app-logs');
    }
  }

  // Update configuration
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new LoggerService({
  level: (import.meta as any).env?.DEV ? 'debug' : 'warn',
  enableConsole: true,
  enableStorage: (import.meta as any).env?.DEV,
});

// Error handling utilities
export const createErrorHandler = (context?: Record<string, unknown>) => ({
  handle: (error: Error) => logger.handleError(error, context),
  handleAsync: (error: unknown) => logger.handleAsyncError(error, context),
});

// Webhook-specific error handling
export const createWebhookErrorHandler = (webhookUrl: string, sessionId?: string) => 
  createErrorHandler({ webhookUrl, sessionId });

// Component-specific error handling
export const createComponentErrorHandler = (componentName: string) => 
  createErrorHandler({ component: componentName });
