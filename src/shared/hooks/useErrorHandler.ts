import { useCallback, useState } from 'react';
import { createComponentErrorHandler } from '../services/loggerService';
import { createError } from '../utils/index';
import { AppError } from '../types/index';

interface UseErrorHandlerOptions {
  componentName?: string;
  autoRemove?: boolean;
  autoRemoveDelay?: number;
}

interface UseErrorHandlerReturn {
  errors: AppError[];
  addError: (message: string, type?: 'error' | 'warning' | 'info') => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  handleError: (error: Error) => void;
  handleAsyncError: (error: unknown) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn => {
  const { componentName = 'Unknown', autoRemove = true, autoRemoveDelay = 5000 } = options;
  const [errors, setErrors] = useState<AppError[]>([]);

  const errorHandler = createComponentErrorHandler(componentName);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const addError = useCallback((message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    const error = createError(message, type);
    
    if (autoRemove && type !== 'error') {
      error.autoRemove = autoRemoveDelay;
    }

    setErrors(prev => [...prev, error]);

    // Auto-remove non-error messages
    if (error.autoRemove) {
      setTimeout(() => {
        removeError(error.id);
      }, error.autoRemove);
    }
  }, [autoRemove, autoRemoveDelay, removeError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleError = useCallback((error: Error) => {
    errorHandler.handle(error);
    addError(error.message, 'error');
  }, [errorHandler, addError]);

  const handleAsyncError = useCallback((error: unknown) => {
    errorHandler.handleAsync(error);
    const message = error instanceof Error ? error.message : String(error);
    addError(message, 'error');
  }, [errorHandler, addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleError,
    handleAsyncError,
  };
};
