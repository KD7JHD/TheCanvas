# Webhook Response System

## Overview

The webhook response system enables the SPA to receive responses from n8n after processing webhook requests. This creates a complete two-way communication flow where:

1. The SPA sends a webhook request to n8n with a unique session ID
2. n8n processes the request and sends a response back to the SPA
3. The SPA receives the response and updates the UI accordingly
4. Users can view the response details and create projects with the generated attributes

## Architecture

### Components

- **WebhookResponseService**: Core service that manages response handling
- **useWebhookResponse**: React hook for components to handle responses
- **WebhookResponseEndpoint**: Development endpoint for receiving responses
- **WebhookResponseConfig**: UI component for configuration and testing

### Communication Flow

```
SPA → n8n (Request with sessionId)
     ↓
n8n processes request
     ↓
n8n → SPA (Response with same sessionId)
     ↓
SPA updates UI with response
```

## Implementation Details

### 1. Webhook Response Service

The `WebhookResponseService` provides:

- **WebSocket support** for real-time responses (future enhancement)
- **Polling fallback** for reliable response handling
- **Session management** to track pending requests
- **Event-driven architecture** for response handling
- **Timeout handling** for failed requests

### 2. Response Hook

The `useWebhookResponse` hook provides:

- **Automatic session registration** when sessionId changes
- **Response state management** (waiting, success, error, timeout)
- **Callback support** for different response types
- **Connection status monitoring**
- **Automatic cleanup** on component unmount

### 3. Development Endpoint

For development and testing, the system includes:

- **Mock endpoint URL** generation
- **Response simulation** for testing
- **Configuration details** for n8n setup
- **Testing tools** to verify the system

## n8n Configuration

### Response Endpoint Setup

1. **Get the endpoint URL** from the webhook configuration modal
2. **Configure n8n** to send responses to this URL
3. **Use the correct response format** as specified in the configuration

### Response Format

n8n should send responses in this format:

```json
{
  "sessionId": "project-creation-1234567890-abc123",
  "message": "Optional human-readable message",
  "content": "Optional additional content",
  "isComplete": true,
  "attributes": {
    "instructions": "Generated project instructions",
    "folder": "/projects/my-project",
    "description": "Project description",
    "tags": ["tag1", "tag2"],
    "settings": {
      "autoSave": true,
      "snapToGrid": true,
      "gridSize": 50,
      "theme": "system",
      "collaborationMode": false
    }
  },
  "error": "Optional error message",
  "timestamp": 1234567890
}
```

### Required Fields

- **sessionId**: Must match the session ID from the original request
- **timestamp**: Unix timestamp of when the response was generated

### Optional Fields

- **message**: Human-readable message to display to the user
- **content**: Additional content or details
- **isComplete**: Boolean indicating if the conversation is complete
- **attributes**: Project attributes when isComplete is true
- **error**: Error message if something went wrong

## Usage in Components

### Basic Usage

```typescript
import { useWebhookResponse } from '../hooks/useWebhookResponse';

const MyComponent = () => {
  const webhookResponse = useWebhookResponse({
    sessionId: 'my-session-id',
    onResponse: (data) => {
      console.log('Received response:', data);
    },
    onError: (error) => {
      console.error('Webhook error:', error);
    },
    onComplete: (attributes) => {
      // Handle complete response with attributes
    }
  });

  return (
    <div>
      {webhookResponse.isWaiting && <div>Waiting for response...</div>}
      {webhookResponse.hasResponse && <div>Response received!</div>}
      {webhookResponse.hasError && <div>Error: {webhookResponse.error}</div>}
    </div>
  );
};
```

### Advanced Usage

```typescript
const webhookResponse = useWebhookResponse({
  sessionId: sessionId,
  onResponse: (data) => {
    // Handle any response
    if (data.message) {
      showNotification(data.message);
    }
  },
  onError: (error) => {
    // Handle errors
    showErrorNotification(error);
  },
  onTimeout: () => {
    // Handle timeouts
    showTimeoutNotification();
  },
  onComplete: (attributes) => {
    // Handle complete responses
    createProjectWithAttributes(attributes);
  },
  autoCleanup: true // Automatically cleanup on unmount
});
```

## Testing

### Manual Testing

1. **Open the Create Project modal**
2. **Switch to Simple Mode** (AI-assisted creation)
3. **Click the settings icon** to open webhook configuration
4. **Generate a test session ID**
5. **Send a test response**
6. **Verify the response appears** in the UI

### Automated Testing

```typescript
// Test webhook response simulation
webhookResponseEndpoint.simulateWebhookResponse('test-session', {
  message: 'Test response',
  isComplete: true,
  attributes: {
    instructions: 'Test instructions',
    folder: '/projects/test',
    description: 'Test description',
    tags: ['test'],
    settings: { autoSave: true, snapToGrid: true, gridSize: 50, theme: 'system', collaborationMode: false }
  }
});
```

## Production Deployment

### Server-Side Endpoint

In production, replace the development endpoint with a real server endpoint:

1. **Create a server endpoint** (e.g., `/api/webhook/response`)
2. **Update the endpoint URL** in the configuration
3. **Implement proper authentication** and validation
4. **Handle CORS** if needed
5. **Add rate limiting** and security measures

### WebSocket Support

For real-time responses, implement WebSocket support:

1. **Set up a WebSocket server**
2. **Update the WebSocket URL** in the configuration
3. **Implement connection management**
4. **Add reconnection logic**

### Security Considerations

- **Validate session IDs** to prevent unauthorized access
- **Implement rate limiting** to prevent abuse
- **Add authentication** for production endpoints
- **Validate response format** to prevent injection attacks
- **Log all requests** for debugging and monitoring

## Troubleshooting

### Common Issues

1. **Response not received**
   - Check if session ID matches
   - Verify endpoint URL is correct
   - Check n8n workflow logs
   - Ensure response format is correct

2. **Timeout errors**
   - Increase timeout duration
   - Check n8n processing time
   - Verify network connectivity

3. **Connection issues**
   - Check WebSocket connection status
   - Verify polling is working
   - Check browser console for errors

### Debug Tools

- **Webhook Response Config modal** for testing
- **Browser console** for detailed logs
- **Network tab** for request/response inspection
- **n8n workflow logs** for server-side debugging

## Future Enhancements

### Planned Features

- **Real-time WebSocket support** for instant responses
- **Response history** and replay functionality
- **Advanced error handling** with retry logic
- **Response validation** with JSON schema
- **Performance monitoring** and analytics
- **Multi-session support** for concurrent requests

### Integration Improvements

- **Support for different response types** (streaming, chunked)
- **Custom response handlers** for different use cases
- **Response caching** for improved performance
- **Offline support** with response queuing

