import { Component, ErrorInfo } from 'react';
import { ErrorBoundaryState, ErrorBoundaryProps, ErrorFallbackProps } from '../types/index';
import { generateErrorId } from '@utils/index';
import { ErrorFallback } from './ErrorFallback';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Here you could also send the error to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleReset = () => {
    // Clear any stored state that might be causing issues
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage during reset:', e);
    }

    // Reload the application
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const fallbackProps: ErrorFallbackProps = {
        error: this.state.error!,
        errorInfo: this.state.errorInfo,
        errorId: this.state.errorId,
        onRetry: this.handleRetry,
        onReset: this.handleReset,
      };

      // Use custom fallback if provided, otherwise use default
      const FallbackComponent = this.props.fallback || ErrorFallback;
      
      return <FallbackComponent {...fallbackProps} />;
    }

    return this.props.children;
  }
}
