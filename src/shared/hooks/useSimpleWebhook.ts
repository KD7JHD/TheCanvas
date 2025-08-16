/**
 * Simple Webhook Hook
 * 
 * A React hook that provides an easy interface for using the webhook service
 * with real user data and proper state management.
 */

import { useState, useCallback, useRef } from 'react';
import { simpleWebhookService, WebhookRequest, WebhookResponse, WebhookCallback } from '../services/simpleWebhookService';

export interface UseWebhookOptions {
  onSuccess?: (response: WebhookResponse) => void;
  onError?: (error: string) => void;
  onTimeout?: () => void;
  timeoutMs?: number;
}

export interface WebhookState {
  isSending: boolean;
  hasResponse: boolean;
  hasError: boolean;
  response: WebhookResponse | null;
  error: string | null;
  pendingCount: number;
}

export const useSimpleWebhook = (options: UseWebhookOptions = {}) => {
  const {
    onSuccess,
    onError,
    onTimeout,
    timeoutMs = 30000
  } = options;

  const [state, setState] = useState<WebhookState>({
    isSending: false,
    hasResponse: false,
    hasError: false,
    response: null,
    error: null,
    pendingCount: 0
  });

  const isMountedRef = useRef(true);

  // Update pending count
  const updatePendingCount = useCallback(() => {
    if (isMountedRef.current) {
      setState(prev => ({
        ...prev,
        pendingCount: simpleWebhookService.getPendingCount()
      }));
    }
  }, []);

  // Create webhook callback
  const createCallback = useCallback((_sessionId: string): WebhookCallback => ({
    onSuccess: (response: WebhookResponse) => {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isSending: false,
          hasResponse: true,
          hasError: false,
          response,
          error: null
        }));
        updatePendingCount();
        onSuccess?.(response);
      }
    },
    onError: (error: string) => {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isSending: false,
          hasResponse: false,
          hasError: true,
          response: null,
          error
        }));
        updatePendingCount();
        onError?.(error);
      }
    },
    onTimeout: () => {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isSending: false,
          hasResponse: false,
          hasError: true,
          response: null,
          error: 'Request timed out'
        }));
        updatePendingCount();
        onTimeout?.();
      }
    }
  }), [onSuccess, onError, onTimeout, updatePendingCount]);

  // Send webhook request
  const sendWebhook = useCallback(async (
    url: string,
    action: string,
    data: any,
    sessionId?: string
  ): Promise<boolean> => {
    const requestSessionId = sessionId || `webhook-${Date.now()}`;
    
    const request: WebhookRequest = {
      sessionId: requestSessionId,
      action,
      data,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      isSending: true,
      hasResponse: false,
      hasError: false,
      response: null,
      error: null
    }));

    const callback = createCallback(requestSessionId);
    const success = await simpleWebhookService.sendWebhook(url, request, callback, timeoutMs);
    
    if (!success && isMountedRef.current) {
      setState(prev => ({
        ...prev,
        isSending: false,
        hasError: true,
        error: 'Failed to send webhook request'
      }));
    }

    updatePendingCount();
    return success;
  }, [createCallback, timeoutMs, updatePendingCount]);

  // Test webhook connectivity
  const testWebhook = useCallback(async (url: string): Promise<boolean> => {
    return await simpleWebhookService.testWebhook(url);
  }, []);

  // Clear state
  const clearState = useCallback(() => {
    if (isMountedRef.current) {
      setState({
        isSending: false,
        hasResponse: false,
        hasError: false,
        response: null,
        error: null,
        pendingCount: simpleWebhookService.getPendingCount()
      });
    }
  }, []);

  // Clear all pending requests
  const clearAll = useCallback(() => {
    simpleWebhookService.clearAll();
    updatePendingCount();
  }, [updatePendingCount]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    sendWebhook,
    testWebhook,
    clearState,
    clearAll,
    cleanup,
    
    // Utility
    updatePendingCount
  };
};

