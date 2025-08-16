# Webhook Setup Guide

## Overview

This guide explains how to set up proper webhook communication between n8n and the SPA for real-time project creation workflows.

## Architecture

```
┌─────────────┐    HTTP POST    ┌──────────────┐    Polling    ┌─────────────┐
│     n8n     │ ──────────────► │ Webhook      │ ────────────► │     SPA     │
│             │                 │ Server       │               │             │
└─────────────┘                 └──────────────┘               └─────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Environment

```bash
# Start both the webhook server and SPA
npm run dev:full

# Or start them separately:
npm run webhook-server  # Terminal 1
npm run dev            # Terminal 2
```

### 3. Configure n8n

In your n8n workflow, add an **HTTP Request** node:

- **Method**: POST
- **URL**: `http://localhost:3001/webhook`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
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

## How It Works

### 1. SPA Sends Request to n8n
When a user creates a project, the SPA sends a webhook request to n8n with:
- Project details (name, goal, etc.)
- Unique `sessionId` for tracking

### 2. n8n Processes the Request
Your n8n workflow:
- Receives the project creation request
- Processes it with AI/agents
- Generates questions or final attributes

### 3. n8n Sends Response Back
n8n sends an HTTP POST request to the webhook server with:
- The same `sessionId` from the original request
- Question and suggestions (for interactive responses)
- Final attributes (when complete)

### 4. SPA Receives and Displays Response
The SPA:
- Polls the webhook server for responses
- Displays interactive questions to the user
- Creates the project when complete

## Development vs Production

### Development
- Uses a simple Express server (`webhook-server.js`)
- SPA polls the server for responses
- Easy to test and debug

### Production
- Replace the Express server with your backend
- Use WebSockets or Server-Sent Events for real-time communication
- Implement proper authentication and security

## API Reference

### Webhook Server Endpoints

#### POST `/webhook`
Receives webhook requests from n8n.

**Request Body:**
```json
{
  "sessionId": "string",
  "question": "string (optional)",
  "suggestions": ["string[] (optional)"],
  "isComplete": "boolean",
  "attributes": {
    "instructions": "string",
    "folder": "string", 
    "description": "string",
    "tags": ["string[]"],
    "settings": "object"
  },
  "error": "string (optional)",
  "timestamp": "number"
}
```

#### GET `/webhook/:sessionId`
Retrieves webhook data for a specific session.

**Response:**
```json
{
  "sessionId": "string",
  "question": "string",
  "suggestions": ["string[]"],
  "isComplete": "boolean",
  "attributes": "object",
  "timestamp": "number"
}
```

#### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "string"
}
```

## Testing

### 1. Test the Webhook Server

```bash
# Start the webhook server
npm run webhook-server

# Test with curl
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "question": "What type of project?",
    "suggestions": ["Web App", "Mobile App", "API"],
    "isComplete": false
  }'
```

### 2. Test the Complete Flow

1. Start both servers: `npm run dev:full`
2. Open the SPA in your browser
3. Create a new project
4. In n8n, send a webhook response
5. Verify the SPA receives and displays the response

## Troubleshooting

### Common Issues

**Webhook server not starting:**
- Check if port 3001 is available
- Ensure Express and CORS are installed

**SPA not receiving responses:**
- Verify the webhook server is running
- Check browser console for errors
- Ensure the `sessionId` matches between request and response

**n8n webhook failing:**
- Check the webhook URL is correct
- Verify the request body format
- Check n8n logs for errors

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=webhook:* npm run dev:full
```

## Security Considerations

### Development
- Webhook server runs on localhost only
- No authentication required
- CORS enabled for local development

### Production
- Implement proper authentication
- Use HTTPS
- Validate webhook signatures
- Rate limiting
- Input validation and sanitization

## Next Steps

1. **Implement WebSockets**: Replace polling with real-time WebSocket communication
2. **Add Authentication**: Implement webhook signature verification
3. **Error Handling**: Add retry logic and error recovery
4. **Monitoring**: Add logging and monitoring for webhook events
5. **Scaling**: Consider using a message queue for high-volume scenarios

