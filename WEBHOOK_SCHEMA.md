# Webhook Schema Documentation

## Overview

This document describes the JSON schema used for webhook communication between the application and n8n workflows. The schema ensures consistent data structure and validation for project creation requests.

## Schema Location

- **JSON Schema**: `src/shared/config/projectCreation/webhookSchema.json`
- **TypeScript Types**: `src/shared/types/webhookTypes.ts`
- **Utility Functions**: `src/shared/utils/webhookUtils.ts`

## Schema Structure

### Root Object
```json
{
  "action": "string",
  "data": "object",
  "projectId": "string (optional)",
  "blockId": "string (optional)",
  "sessionId": "string (optional)"
}
```

### Required Fields

#### `action` (string)
- **Description**: The action to be performed by the webhook
- **Valid Values**: `"generate-project-attributes"`, `"test"`, `"conversation-message"`
- **Default**: `"generate-project-attributes"`

#### `data` (object)
- **Description**: The main data payload for the webhook
- **Required**: Yes

### Data Object Structure

```json
{
  "projectName": "string",
  "goal": "string", 
  "instructions": "string",
  "otherAttributes": "array (optional)",
  "finished": "boolean (optional)",
  "metadata": "object (optional)"
}
```

#### Required Data Fields

##### `projectName` (string)
- **Description**: The name of the project to be created
- **Constraints**:
  - Minimum length: 1 character
  - Maximum length: 100 characters
  - Pattern: `^[a-zA-Z0-9\s\-_]+$` (alphanumeric, spaces, hyphens, underscores)
- **Example**: `"My Test Project"`

##### `goal` (string)
- **Description**: The goal or objective of the project
- **Constraints**:
  - Minimum length: 10 characters
  - Maximum length: 1000 characters
- **Example**: `"Create a comprehensive testing framework for web applications"`

##### `instructions` (string)
- **Description**: The AI agent instructions for project creation
- **Constraints**:
  - Minimum length: 1 character
- **Example**: `"Act as a Senior Analyst with sixteen years of experience..."`

#### Optional Data Fields

##### `otherAttributes` (array)
- **Description**: Additional attributes for the project
- **Default**: `[]`
- **Structure**: Array of attribute objects

```json
{
  "name": "string",
  "value": "any",
  "type": "string"
}
```

**Attribute Types**:
- `"string"` - Text values
- `"number"` - Numeric values
- `"boolean"` - True/false values
- `"array"` - Array values
- `"object"` - Object values

**Example**:
```json
[
  {
    "name": "priority",
    "value": "high",
    "type": "string"
  },
  {
    "name": "estimatedDuration",
    "value": 30,
    "type": "number"
  },
  {
    "name": "requiresApproval",
    "value": true,
    "type": "boolean"
  }
]
```

##### `finished` (boolean)
- **Description**: Indicates if the project creation process is complete
- **Default**: `false`

##### `metadata` (object)
- **Description**: Additional metadata for the project
- **Structure**:
```json
{
  "createdAt": "string (ISO date-time)",
  "sessionId": "string",
  "version": "string"
}
```

## Example Payload

```json
{
  "action": "generate-project-attributes",
  "data": {
    "projectName": "My Test Project",
    "goal": "Create a comprehensive testing framework for web applications",
    "instructions": "Act as a Senior Analyst with sixteen years of experience...",
    "otherAttributes": [
      {
        "name": "priority",
        "value": "high",
        "type": "string"
      },
      {
        "name": "estimatedDuration",
        "value": 30,
        "type": "number"
      },
      {
        "name": "requiresApproval",
        "value": true,
        "type": "boolean"
      }
    ],
    "finished": false,
    "metadata": {
      "createdAt": "2024-01-15T10:30:00Z",
      "sessionId": "session-12345",
      "version": "1.0.0"
    }
  }
}
```

## Usage in Code

### Creating Webhook Payloads

```typescript
import { createWebhookPayload, createWebhookAttribute } from '../utils/webhookUtils';

// Basic payload
const payload = createWebhookPayload(
  'My Project',
  'Project goal description',
  'AI instructions...'
);

// Payload with additional attributes
const payloadWithAttributes = createWebhookPayload(
  'My Project',
  'Project goal description', 
  'AI instructions...',
  [
    createWebhookAttribute('priority', 'high', 'string'),
    createWebhookAttribute('duration', 30, 'number')
  ],
  false,
  { sessionId: 'custom-session-id' }
);
```

### Validation

```typescript
import { validateWebhookPayload, validateProjectName } from '../utils/webhookUtils';

// Validate project name
const nameValidation = validateProjectName('My Project');
if (!nameValidation.isValid) {
  console.error(nameValidation.error);
}

// Validate entire payload
const payloadValidation = validateWebhookPayload(webhookPayload);
if (!payloadValidation.isValid) {
  console.error('Validation errors:', payloadValidation.errors);
}
```

## Response Schema

The webhook should respond with the following structure:

```json
{
  "success": true,
  "data": {
    "instructions": "Generated instructions...",
    "folder": "/projects/my-project",
    "description": "Generated description...",
    "tags": ["tag1", "tag2"],
    "settings": {
      "autoSave": true,
      "snapToGrid": true,
      "gridSize": 50,
      "theme": "system",
      "collaborationMode": false
    },
    "otherAttributes": [],
    "finished": true
  }
}
```

## Error Response

```json
{
  "success": false,
  "error": "Error description"
}
```

## Migration from Legacy Format

The new schema is backward compatible. Legacy requests will be automatically converted to the new format:

**Legacy Format**:
```json
{
  "action": "generate-project-attributes",
  "data": {
    "goal": "Project goal",
    "projectName": "Project name",
    "instructions": "AI instructions"
  }
}
```

**New Format**:
```json
{
  "action": "generate-project-attributes", 
  "data": {
    "projectName": "Project name",
    "goal": "Project goal",
    "instructions": "AI instructions",
    "otherAttributes": [],
    "finished": false,
    "metadata": {
      "createdAt": "2024-01-15T10:30:00Z",
      "sessionId": "session-12345",
      "version": "1.0.0"
    }
  }
}
```

## Testing

Use the "Test Webhook" button in the Create Project modal to test webhook connectivity and payload structure. The test will send a sample payload and verify the response format.
