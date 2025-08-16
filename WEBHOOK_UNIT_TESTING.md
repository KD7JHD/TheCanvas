# Real Webhook Testing System

## Overview

This document describes the real webhook testing system that works with actual n8n endpoints. The system is designed for **real webhook testing** with actual responses from n8n.

## Key Features

✅ **Real n8n Integration** - Test with actual n8n endpoints  
✅ **Real Response Handling** - Capture actual responses from n8n  
✅ **Real-time Testing Interface** - Visual testing UI  
✅ **Type-safe** - Full TypeScript support  
✅ **Production Ready** - Works with real webhook endpoints  

## Architecture

```
┌─────────────────┐    HTTP POST    ┌──────────────┐    HTTP POST    ┌─────────────┐
│   WebhookTest   │ ──────────────► │     n8n      │ ──────────────► │     SPA     │
│   Component     │                 │              │                 │             │
└─────────────────┘                 └──────────────┘                 └─────────────┘
         │                                   │                               │
         ▼                                   ▼                               ▼
┌─────────────────┐                 ┌──────────────────┐            ┌─────────────────┐
│ Test Scenarios  │                 │   Real Response  │            │   Callbacks     │
│ & Validation    │                 │   from n8n       │            │   & Timeouts    │
└─────────────────┘                 └──────────────────┘            └─────────────────┘
```

## Quick Start

### 1. Access the Testing Interface

1. Start the development server: `npm run dev`
2. Click the ⚡ (Zap) button in the top bar
3. The webhook testing interface will open

### 2. Configure n8n Endpoint

1. Enter your actual n8n webhook URL
2. Test connectivity to ensure the endpoint is reachable
3. Configure n8n to send responses back to the SPA

### 3. Send Real Webhook Requests

1. Enter test data in JSON format
2. Click "Send Test Webhook" to send to n8n
3. Wait for actual response from n8n
4. Monitor the response in real-time

### 4. Handle Real Responses

1. Configure n8n to send responses back to the SPA
2. Receive actual webhook responses from n8n
3. Process responses through the webhook service
4. Handle success, error, and timeout scenarios

## Components

### SimpleWebhookService

The core service that handles real webhook operations:

```typescript
// Send a webhook request to n8n
await simpleWebhookService.sendWebhook(url, request, callback, timeoutMs);

// Handle real response from n8n
simpleWebhookService.handleWebhookResponse(response);
```

### useSimpleWebhook Hook

React hook for easy webhook integration:

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

### WebhookTest Component

Visual testing interface with:

- **Real n8n Integration** - Test with actual endpoints
- **Response Simulation** - Test response handling (for development)
- **Manual Testing** - Send individual webhook requests
- **Real-time Status** - Monitor pending requests and responses
- **Results Display** - View actual webhook responses

### Test Utilities

Comprehensive testing utilities:

```typescript
// Generate test scenarios
const scenarios = generateTestScenarios();

// Run tests with real endpoints
const results = await runWebhookTests(url, scenarios);

// Validate results
const validation = validateTestResults(results);

// Clean up test environment
cleanupTestEnvironment();
```

## Test Scenarios

The system includes pre-built test scenarios for:

1. **Basic Test** - Simple webhook with minimal data
2. **Project Generation** - Test project attribute generation
3. **Large Data Test** - Test with larger payloads
4. **Error Handling** - Test error scenarios

## Usage Examples

### Basic Webhook Testing

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

### Real Webhook Testing

```typescript
import { simpleWebhookService } from '../services/simpleWebhookService';

// Send webhook to real n8n endpoint
await simpleWebhookService.sendWebhook(
  'https://your-n8n-endpoint.com',
  {
    sessionId: 'test-session',
    action: 'generate-project-attributes',
    data: { projectName: 'Test' },
    timestamp: Date.now()
  },
  {
    onSuccess: (response) => {
      console.log('Real response from n8n:', response);
    }
  }
);
```

### Automated Testing

```typescript
import { runWebhookTests, generateTestScenarios, validateTestResults } from '../utils/webhookTestUtils';

// Run all test scenarios with real endpoint
const scenarios = generateTestScenarios();
const results = await runWebhookTests('https://your-n8n-endpoint.com', scenarios);

// Validate results
const validation = validateTestResults(results);
console.log(`Tests: ${validation.passed} passed, ${validation.failed} failed`);
```

## Testing Workflow

### 1. Development Testing

1. **Configure n8n Endpoint** in the webhook interface
2. **Test Connectivity** to ensure endpoint is reachable
3. **Send Test Webhooks** and observe real responses
4. **Validate Responses** match expectations

### 2. Real Integration Testing

1. **Set up n8n Workflow** to handle webhook requests
2. **Configure n8n Response** to send data back to SPA
3. **Test with Live Data** to validate integration
4. **Monitor Performance** and error handling

### 3. Production Testing

1. **Use Production Endpoints** for final testing
2. **Test with Real Data** to validate functionality
3. **Monitor Response Times** and reliability
4. **Handle Edge Cases** and error scenarios

## Benefits

### For Developers

- **Real Integration** - Test with actual n8n endpoints
- **Real Responses** - Handle actual webhook responses
- **Visual Interface** - Easy to understand and use
- **Production Ready** - Works with real endpoints

### For Testing

- **Real Webhook Testing** - Test actual webhook functionality
- **Integration Testing** - Test with real n8n workflows
- **Regression Testing** - Catch breaking changes
- **Performance Testing** - Monitor response times

### For Production

- **Reliable** - Well-tested webhook functionality
- **Maintainable** - Clean, simple codebase
- **Scalable** - Easy to add new webhook types
- **Debugging** - Clear error messages and logging

## Configuration

### Environment Variables

```bash
# Webhook base URL (for production)
VITE_WEBHOOK_BASE_URL=https://your-production-endpoint.com
```

### n8n Configuration

```typescript
// Configure n8n to send responses back to SPA
const n8nResponseConfig = {
  url: 'https://your-spa-endpoint.com/webhook',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: {
    sessionId: '{{ $json.sessionId }}',
    success: true,
    data: { /* response data */ },
    timestamp: '{{ $now }}'
  }
};
```

## Troubleshooting

### Common Issues

1. **n8n Endpoint Not Responding**
   - Check n8n webhook URL is correct
   - Verify n8n is running and accessible
   - Test connectivity with the test button

2. **No Response from n8n**
   - Configure n8n to send responses back to SPA
   - Check n8n workflow is properly configured
   - Verify response format matches expected structure

3. **Timeout Errors**
   - Increase timeout duration for slow operations
   - Check n8n processing time
   - Monitor n8n workflow performance

4. **TypeScript Errors**
   - Run `npm run type-check` to identify issues
   - Ensure all imports are correct

### Debug Mode

Enable debug logging:

```typescript
// Enable debug mode
localStorage.setItem('webhook-debug', 'true');

// Check console for detailed logs
console.log('Webhook debug enabled');
```

## Migration from Old System

The new system is a complete replacement. To migrate:

1. **Replace Imports** - Use `simpleWebhookService` instead of old services
2. **Update Components** - Use `useSimpleWebhook` hook
3. **Remove Old Files** - Delete unused webhook services
4. **Update Tests** - Use new test utilities

## Future Enhancements

- **More Test Scenarios** - Additional pre-built test cases
- **Performance Metrics** - Response time tracking
- **Error Simulation** - More sophisticated error scenarios
- **Integration Tests** - Automated integration testing
- **Load Testing** - High-volume webhook testing

## Conclusion

The real webhook testing system provides a comprehensive, production-ready solution for testing webhook functionality with actual n8n endpoints. It eliminates mock responses and focuses on real integration testing.

The system is production-ready and provides a solid foundation for webhook development and testing with real n8n workflows.
