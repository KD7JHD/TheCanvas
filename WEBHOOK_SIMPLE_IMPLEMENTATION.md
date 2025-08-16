# Simple Webhook Implementation

## Overview

This document describes the new simple webhook system that replaces the complex previous implementation. The new system is:

- **Destination agnostic**: Can send webhooks to n8n, any other service, or custom endpoints
- **Simple**: Easy to understand and use
- **Testable**: Includes comprehensive testing utilities with real user data
- **Reliable**: Handles timeouts, errors, and response processing

## Architecture

```
┌─────────────┐    HTTP POST    ┌──────────────┐    HTTP POST    ┌─────────────┐
│     SPA     │ ──────────────► │     n8n      │ ──────────────► │ Webhook     │
│             │                 │              │                 │ Server      │
└─────────────┘                 └──────────────┘                 └─────────────┘
```

### Components

1. **SimpleWebhookService**: Core service for sending webhooks and handling responses
2. **useSimpleWebhook**: React hook for easy integration
3. **WebhookTest**: Test component for validation
4. **webhook-server.js**: Development server for receiving responses

## Quick Start

### 1. Start the Development Environment

```bash
# Start both the webhook server and SPA
npm run dev:full

# Or start them separately:
npm run webhook-server  # Terminal 1
npm run dev            # Terminal 2
```

### 2. Test the Webhook System

1. Click the ⚡ (Zap) button in the top bar to open the webhook test interface
2. Enter your n8n webhook URL
3. Click "Send Test Webhook" to test connectivity
4. Use "Create Test Response" to simulate responses

### 3. Configure n8n

In your n8n workflow, add an **HTTP Request** node:

- **Method**: POST
- **URL**: `http://localhost:3001/webhook`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "sessionId": "{{ $json.sessionId }}",
  "success": true,
  "data": {
    "message": "Response from n8n",
    "attributes": {
      "instructions": "Your instructions here",
      "folder": "/projects/your-project",
      "description": "Project description",
      "tags": ["tag1", "tag2"],
      "settings": {
        "autoSave": true,
        "snapToGrid": true,
        "gridSize": 50,
        "theme": "system",
        "collaborationMode": false
      }
    }
  },
  "timestamp": "{{ $now }}"
}
```

## API Reference

### SimpleWebhookService

```typescript
// Send a webhook request
await simpleWebhookService.sendWebhook(
  url: string,
  request: WebhookRequest,
  callback?: WebhookCallback,
  timeoutMs?: number
): Promise<boolean>

// Test webhook connectivity
await simpleWebhookService.testWebhook(url: string): Promise<boolean>

// Receive a webhook response
simpleWebhookService.receiveWebhookResponse(response: WebhookResponse): void
```

### useSimpleWebhook Hook

```typescript
const {
  isSending,
  hasResponse,
  hasError,
  response,
  error,
  pendingCount,
  sendWebhook,
  testWebhook,
  clearState,
  clearAll
} = useSimpleWebhook({
  onSuccess: (response) => console.log('Success:', response),
  onError: (error) => console.error('Error:', error),
  onTimeout: () => console.warn('Timeout'),
  timeoutMs: 30000
});
```

### WebhookRequest Interface

```typescript
interface WebhookRequest {
  sessionId: string;
  action: string;
  data: any;
  timestamp?: number;
}
```

### WebhookResponse Interface

```typescript
interface WebhookResponse {
  sessionId: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: number;
}
```

## Testing

### Manual Testing

1. **Open the webhook test interface** (⚡ button in top bar)
2. **Test connectivity** with your n8n endpoint
3. **Send test webhooks** with custom data
4. **Create test responses** to simulate n8n responses
5. **Monitor status** and pending requests

### Automated Testing

```typescript
import { runWebhookTests, generateTestScenarios } from '../utils/webhookTestUtils';

// Run test scenarios
const scenarios = generateTestScenarios();
const results = await runWebhookTests('https://your-n8n-endpoint.com', scenarios);

// Validate results
const validation = validateTestResults(results);
console.log(`Passed: ${validation.passed}, Failed: ${validation.failed}`);
```

### Test Scenarios

The system includes pre-built test scenarios for:

- Basic connectivity testing
- Project generation workflows
- Large data payloads
- Error handling
- Timeout scenarios

## Development vs Production

### Development

- Uses `webhook-server.js` for receiving responses
- Includes test utilities and mock responses
- Easy debugging with detailed logging

### Production

- Replace `webhook-server.js` with your backend
- Configure proper webhook endpoints
- Implement authentication and security
- Use environment variables for URLs

## Environment Variables

```bash
# Webhook base URL (defaults to http://localhost:3001)
VITE_WEBHOOK_BASE_URL=https://your-production-endpoint.com
```

## Error Handling

The system handles various error scenarios:

- **Network errors**: Automatic retry with exponential backoff
- **Timeout errors**: Configurable timeout with callback
- **Invalid responses**: Validation and error reporting
- **Server errors**: HTTP status code handling

## Security Considerations

1. **Validate webhook URLs**: Ensure they point to trusted endpoints
2. **Implement authentication**: Add API keys or tokens for production
3. **Rate limiting**: Implement rate limiting in your webhook endpoints
4. **Input validation**: Validate all webhook data
5. **HTTPS only**: Use HTTPS for all webhook communications

## Migration from Old System

The new system is a complete replacement. To migrate:

1. **Replace imports**: Use `simpleWebhookService` instead of old services
2. **Update components**: Use `useSimpleWebhook` hook
3. **Remove old files**: Delete unused webhook services
4. **Update tests**: Use new test utilities

## Troubleshooting

### Common Issues

1. **Webhook not sending**: Check URL and network connectivity
2. **No response received**: Verify n8n configuration and endpoint
3. **Timeout errors**: Increase timeout or check n8n processing time
4. **CORS errors**: Ensure proper CORS configuration

### Debug Mode

Enable debug logging by setting:

```typescript
localStorage.setItem('webhook-debug', 'true');
```

This will log all webhook requests and responses to the console.

## Examples

### Basic Usage

```typescript
import { useSimpleWebhook } from '../hooks/useSimpleWebhook';

function MyComponent() {
  const { sendWebhook, isSending, hasResponse, response } = useSimpleWebhook({
    onSuccess: (response) => {
      console.log('Project created:', response.data);
    }
  });

  const handleCreateProject = async () => {
    await sendWebhook(
      'https://your-n8n-endpoint.com',
      'generate-project-attributes',
      {
        projectName: 'My Project',
        goal: 'Create a web application'
      }
    );
  };

  return (
    <button onClick={handleCreateProject} disabled={isSending}>
      {isSending ? 'Creating...' : 'Create Project'}
    </button>
  );
}
```

### Advanced Usage

```typescript
const { sendWebhook, testWebhook } = useSimpleWebhook({
  onSuccess: (response) => {
    if (response.data?.attributes) {
      // Handle project attributes
      createProject(response.data.attributes);
    }
  },
  onError: (error) => {
    showErrorNotification(error);
  },
  onTimeout: () => {
    showTimeoutNotification();
  },
  timeoutMs: 60000 // 60 seconds
});

// Test connectivity first
const isAvailable = await testWebhook(webhookUrl);
if (isAvailable) {
  await sendWebhook(webhookUrl, 'test', { message: 'Hello' });
}
```
