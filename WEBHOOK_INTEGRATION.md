# Webhook Integration with n8n

This application uses webhooks to integrate with n8n for AI/agent functionality. All AI and agent services are handled through n8n workflows via webhook endpoints.

## Overview

Instead of having built-in AI services, the application sends webhook requests to n8n workflows that handle:
- Project attribute generation
- Block-specific AI functions
- Project-specific AI functions

## Webhook Structure

### Request Format
All webhook requests follow this structure:

```json
{
  "action": "string",
  "data": "any",
  "projectId": "string (optional)",
  "blockId": "string (optional)"
}
```

### Response Format
All webhook responses should follow this structure:

```json
{
  "success": "boolean",
  "data": "any (optional)",
  "error": "string (optional)"
}
```

## Webhook Actions

### Project Generation
**Action:** `generate-project-attributes`

**Request:**
```json
{
  "action": "generate-project-attributes",
  "data": {
    "goal": "string",
    "projectName": "string"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "instructions": "string",
    "folder": "string",
    "description": "string",
    "tags": ["string"],
    "settings": {
      "autoSave": "boolean",
      "snapToGrid": "boolean",
      "gridSize": "number",
      "theme": "string",
      "collaborationMode": "boolean"
    }
  }
}
```

### Block Functions
**Action:** Custom action name

**Request:**
```json
{
  "action": "your-custom-action",
  "data": "any",
  "blockId": "string"
}
```

### Project Functions
**Action:** Custom action name

**Request:**
```json
{
  "action": "your-custom-action",
  "data": "any",
  "projectId": "string"
}
```

### Test Webhook
**Action:** `test`

**Request:**
```json
{
  "action": "test",
  "data": {
    "timestamp": "number"
  }
}
```

## Implementation

### Project Webhooks
- Each project can have a `webhookUrl` attribute
- Used for project-specific AI functions
- Required for AI-assisted project creation

### Block Webhooks
- Each block can have a `webhookUrl` attribute
- Used for block-specific AI functions
- Optional - blocks can function without webhooks

### Webhook Service
The application includes a `WebhookService` class that handles:
- Sending webhook requests
- Error handling
- Response parsing
- Webhook testing

## n8n Workflow Setup

### Project Generation Workflow
1. Create a webhook trigger
2. Add AI service nodes (OpenAI, Claude, etc.)
3. Process the project goal and name
4. Generate appropriate attributes
5. Return structured response

### Block Function Workflow
1. Create a webhook trigger
2. Add AI service nodes
3. Process block-specific data
4. Return results

### Error Handling
- Always return `success: false` with error message on failure
- Handle network timeouts gracefully
- Validate input data
- Provide meaningful error messages

## Security Considerations

1. **Webhook URLs**: Store securely, consider encryption
2. **Authentication**: Implement webhook authentication if needed
3. **Rate Limiting**: Implement rate limiting in n8n workflows
4. **Input Validation**: Validate all webhook inputs
5. **Error Logging**: Log webhook failures for debugging

## Testing

Use the webhook test endpoint to verify connectivity:
```javascript
const isAvailable = await webhookService.testWebhook(webhookUrl);
```

## Example n8n Workflow

```javascript
// Webhook trigger
const webhookData = $input.all()[0].json;

// Validate action
if (webhookData.action !== 'generate-project-attributes') {
  return { success: false, error: 'Invalid action' };
}

// Extract data
const { goal, projectName } = webhookData.data;

// Call AI service
const aiResponse = await callAIService(goal, projectName);

// Generate response
const response = {
  instructions: aiResponse.instructions,
  folder: `/projects/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
  description: aiResponse.description,
  tags: aiResponse.tags,
  settings: {
    autoSave: true,
    snapToGrid: true,
    gridSize: 50,
    theme: 'system',
    collaborationMode: false,
  }
};

return { success: true, data: response };
```
