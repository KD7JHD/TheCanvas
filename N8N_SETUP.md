# n8n Setup for SPA Communication

## Overview

This document explains how to configure n8n to send responses back to the SPA after processing project creation requests using proper webhook communication.

## How It Works

1. **SPA sends request to n8n**: When user creates a project, the SPA sends a webhook request to n8n with a unique `sessionId`
2. **n8n processes the request**: Your n8n workflow processes the request using AI/agents
3. **n8n sends response back**: n8n sends an HTTP POST request to the SPA's webhook endpoint
4. **SPA displays response**: The SPA receives the response and shows it to the user

## n8n Configuration

### Step 1: Add an HTTP Request Node

In your n8n workflow, add an "HTTP Request" node after your AI processing:

**Method**: POST  
**URL**: `http://localhost:3001/webhook` (or your production webhook URL)  
**Headers**: 
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "sessionId": "{{ $json.sessionId }}",
  "question": "Which specific aspects of the system do you intend to test?",
  "suggestions": [
    "1. Functional testing (features and requirements)",
    "2. Performance and load testing", 
    "3. Security testing",
    "4. Usability and user experience testing",
    "5. Compatibility testing across devices and platforms"
  ],
  "isComplete": false,
  "timestamp": "{{ $now }}"
}
```

### Step 2: Alternative - Code Node (Development)

For development/testing, you can also use a Code node:

```javascript
// Get the response data from your AI processing
const responseData = {
  sessionId: $input.first().json.sessionId,
  question: "Which specific aspects of the system do you intend to test?",
  suggestions: [
    "1. Functional testing (features and requirements)",
    "2. Performance and load testing", 
    "3. Security testing",
    "4. Usability and user experience testing",
    "5. Compatibility testing across devices and platforms"
  ],
  isComplete: false,
  timestamp: Date.now()
};

// Call the global function in the SPA (development only)
if (typeof window !== 'undefined' && window.handleWebhookResponse) {
  window.handleWebhookResponse(responseData);
}

return responseData;
```

### Step 2: Response Data Structure

The response should include:

- `sessionId`: The session ID from the original request (required)
- `question`: The question to ask the user (optional)
- `suggestions`: Array of suggested options (optional)
- `isComplete`: Boolean indicating if the conversation is complete
- `attributes`: Final project attributes when complete (optional)
- `error`: Error message if something went wrong (optional)

### Step 3: Complete Response Example

When the conversation is complete, send:

```javascript
const finalResponse = {
  sessionId: $input.first().json.sessionId,
  isComplete: true,
  attributes: {
    instructions: "Your generated project instructions",
    folder: "/projects/your-project",
    description: "Your project description",
    tags: ["tag1", "tag2"],
    settings: {
      autoSave: true,
      snapToGrid: true,
      gridSize: 50,
      theme: "system",
      collaborationMode: false
    }
  },
  timestamp: Date.now()
};

window.handleWebhookResponse(finalResponse);
```

## Testing

1. Start the SPA (`npm run dev`)
2. Open the browser console to see webhook handler initialization
3. Create a new project in the SPA
4. In n8n, use the Code node to call `window.handleWebhookResponse`
5. The SPA should receive the response and show the interactive modal

## Troubleshooting

- **No response received**: Check that the `sessionId` matches between request and response
- **Global function not found**: Make sure the SPA is running and the global handler is initialized
- **Response not showing**: Check browser console for errors in the webhook handler

## Production Considerations

For production, consider using a server-side endpoint instead of the global function approach:

1. Set up a server endpoint to receive webhook responses
2. Use n8n's HTTP Request node to send responses to your server
3. Your server can then forward responses to the SPA via WebSocket or Server-Sent Events
