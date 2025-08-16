import React from 'react';
import { ErrorFallbackProps } from '../types/index';
import { cn } from '@utils/index';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  onReset,
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-destructive mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            We're sorry, but something unexpected happened. You can try to recover or reset the application.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2">Error Details</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Error ID:</strong> {errorId}</p>
              <p><strong>Message:</strong> {error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-primary hover:text-primary/80">
                    View Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {errorInfo && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Component Stack</h3>
              <details className="text-sm">
                <summary className="cursor-pointer text-primary hover:text-primary/80">
                  View Component Stack
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2",
              "bg-primary text-primary-foreground rounded-md",
              "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <button
            onClick={onReset}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2",
              "bg-destructive text-destructive-foreground rounded-md",
              "hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
              "transition-colors duration-200"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Application
          </button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            If this problem persists, please contact support with the Error ID: {errorId}
          </p>
        </div>
      </div>
    </div>
  );
};
