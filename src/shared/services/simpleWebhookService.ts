/**
 * Simple Webhook Service
 * 
 * A destination-agnostic webhook service that can:
 * 1. Send webhook requests to any destination (n8n, etc.)
 * 2. Handle real responses via callbacks
 * 3. Support real webhook testing with actual endpoints
 * 4. Keep implementation simple and focused
 */

export interface WebhookRequest {
  sessionId: string;
  action: string;
  data: any;
  timestamp?: number;
}

export interface WebhookResponse {
  sessionId: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: number;
}

export interface WebhookCallback {
  onSuccess?: (response: WebhookResponse) => void;
  onError?: (error: string) => void;
  onTimeout?: () => void;
}

class SimpleWebhookService {
  private responseHandlers: Map<string, WebhookCallback> = new Map();
  private pendingRequests: Map<string, { timestamp: number; timeout: ReturnType<typeof setTimeout> }> = new Map();
  private defaultTimeout = 30000; // 30 seconds

  /**
   * Send a webhook request to a destination
   */
  async sendWebhook(
    url: string, 
    request: WebhookRequest, 
    callback?: WebhookCallback,
    timeoutMs: number = this.defaultTimeout
  ): Promise<boolean> {
    try {
      // Add timestamp if not provided
      const webhookRequest = {
        ...request,
        timestamp: request.timestamp || Date.now()
      };

      console.log('Sending webhook request:', {
        url,
        sessionId: request.sessionId,
        action: request.action
      });

      // Register callback if provided
      if (callback) {
        this.responseHandlers.set(request.sessionId, callback);
      }

      // Track pending request
      this.trackRequest(request.sessionId, timeoutMs);

      // Send the actual request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = `HTTP ${response.status}: ${errorText}`;
        this.handleError(request.sessionId, error);
        return false;
      }

      // For immediate responses, handle them directly
      try {
        const responseData = await response.json();
        this.handleResponse({
          sessionId: request.sessionId,
          success: true,
          data: responseData,
          timestamp: Date.now()
        });
      } catch (parseError) {
        // If response is not JSON, that's okay - we'll wait for webhook response
        console.log('Non-JSON response received, waiting for webhook callback');
      }

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.handleError(request.sessionId, errorMessage);
      return false;
    }
  }

  /**
   * Handle incoming webhook response from n8n
   * This is called when n8n sends a response back to the SPA
   */
  handleWebhookResponse(response: WebhookResponse): void {
    console.log('Received webhook response from n8n:', response);
    this.handleResponse(response);
  }

  /**
   * Track a pending request
   */
  private trackRequest(sessionId: string, timeoutMs: number): void {
    const timeout = setTimeout(() => {
      this.handleTimeout(sessionId);
    }, timeoutMs);

    this.pendingRequests.set(sessionId, {
      timestamp: Date.now(),
      timeout
    });
  }

  /**
   * Handle a successful response
   */
  private handleResponse(response: WebhookResponse): void {
    const { sessionId } = response;
    const callback = this.responseHandlers.get(sessionId);

    if (callback?.onSuccess) {
      callback.onSuccess(response);
    }

    this.cleanup(sessionId);
  }

  /**
   * Handle an error
   */
  private handleError(sessionId: string, error: string): void {
    console.error(`Webhook error for session ${sessionId}:`, error);
    
    const callback = this.responseHandlers.get(sessionId);
    if (callback?.onError) {
      callback.onError(error);
    }

    this.cleanup(sessionId);
  }

  /**
   * Handle timeout
   */
  private handleTimeout(sessionId: string): void {
    console.warn(`Webhook timeout for session ${sessionId}`);
    
    const callback = this.responseHandlers.get(sessionId);
    if (callback?.onTimeout) {
      callback.onTimeout();
    }

    this.cleanup(sessionId);
  }

  /**
   * Clean up resources for a session
   */
  private cleanup(sessionId: string): void {
    const pending = this.pendingRequests.get(sessionId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(sessionId);
    }
    this.responseHandlers.delete(sessionId);
  }

  /**
   * Test webhook connectivity
   */
  async testWebhook(url: string): Promise<boolean> {
    try {
      const testRequest: WebhookRequest = {
        sessionId: `test-${Date.now()}`,
        action: 'test',
        data: { message: 'Webhook connectivity test' },
        timestamp: Date.now()
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest),
      });

      return response.ok;
    } catch (error) {
      console.error('Webhook test failed:', error);
      return false;
    }
  }

  /**
   * Get pending request count
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * Clear all pending requests
   */
  clearAll(): void {
    for (const [, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timeout);
    }
    this.pendingRequests.clear();
    this.responseHandlers.clear();
  }
}

// Export singleton instance
export const simpleWebhookService = new SimpleWebhookService();
