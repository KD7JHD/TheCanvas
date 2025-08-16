/**
 * Webhook Response Endpoint
 * 
 * Simple endpoint utilities for handling real webhook responses from n8n.
 * This provides helper functions for webhook configuration and real testing.
 */

import { simpleWebhookService, WebhookResponse } from './simpleWebhookService';

/**
 * Handle incoming webhook response from n8n
 * This function is called when n8n sends a response back to the SPA
 */
export function handleWebhookResponse(responseData: any): void {
  try {
    // Validate the response data
    if (!responseData || !responseData.sessionId) {
      console.error('Invalid webhook response: missing sessionId');
      return;
    }

    // Convert to WebhookResponse format
    const response: WebhookResponse = {
      sessionId: responseData.sessionId,
      success: responseData.success !== false, // Default to true unless explicitly false
      data: responseData.data,
      error: responseData.error,
      timestamp: responseData.timestamp || Date.now()
    };

    // Forward to the webhook service
    simpleWebhookService.handleWebhookResponse(response);

  } catch (error) {
    console.error('Failed to handle webhook response:', error);
  }
}

/**
 * Get webhook endpoint URL for n8n configuration
 * In production, this would be your actual webhook endpoint
 */
export function getWebhookEndpointUrl(): string {
  // In production, this would be your actual webhook endpoint
  // For now, return a placeholder
  return 'https://your-production-endpoint.com/webhook';
}

/**
 * Get instructions for n8n configuration
 */
export function getN8nInstructions(): string {
  return `
# n8n Webhook Configuration

## Endpoint URL
${getWebhookEndpointUrl()}

## Request Format
Send a POST request with the following JSON structure:

\`\`\`json
{
  "sessionId": "{{ $json.sessionId }}",
  "success": true,
  "data": {
    // Your response data here
  },
  "timestamp": "{{ $now }}"
}
\`\`\`

## Example n8n HTTP Request Node
- **Method**: POST
- **URL**: ${getWebhookEndpointUrl()}
- **Headers**: Content-Type: application/json
- **Body**: JSON (see format above)

## Error Response Format
\`\`\`json
{
  "sessionId": "{{ $json.sessionId }}",
  "success": false,
  "error": "Error message here",
  "timestamp": "{{ $now }}"
}
\`\`\`

## Real Webhook Testing
For testing with real n8n endpoints:
1. Configure n8n to send responses back to your SPA
2. Use the webhook test interface (⚡ button in top bar)
3. Send real webhook requests to n8n
4. Receive and handle actual responses from n8n
5. Monitor webhook functionality in real-time
`;
}

