# Project Creation Agent Configuration

## Overview

The Project Creation Agent is a behind-the-scenes AI agent that handles project creation in collaboration with the user. It's not a project object itself but exists as a configuration-driven service that integrates with n8n workflows.

## Configuration Location

The project creation agent configuration is located in:

**Main Configuration:** `src/shared/config/projectCreationAgent.ts`

**Template Directory:** `src/shared/config/projectCreation/`

### Template Files
- `instructions.md` - AI agent instructions template
- `description.md` - Project description template  
- `folder.md` - Project folder path template
- `tags.md` - Default project tags
- `templateLoader.ts` - Utility to load templates
- `README.md` - Documentation for the template system

## Key Configuration Sections

### 1. Webhook Configuration
```typescript
webhookUrl: 'https://kd7jhd.app.n8n.cloud/webhook/dbd6ace9-51d3-4c1b-8b95-f95b05e379ef'
```

**What to customize:** Update this URL to point to your n8n webhook endpoint.

### 2. Agent Metadata
```typescript
name: 'Project Creation Agent',
description: 'AI agent that helps users create new projects with intelligent suggestions and automation',
version: '1.0.0',
```

**What to customize:** Update the name, description, and version as needed.

### 3. Feature Flags
```typescript
enableAdvancedMode: true,
enableAutoGeneration: true,
```

**What to customize:** 
- Set `enableAdvancedMode: false` to disable the advanced mode toggle
- Set `enableAutoGeneration: false` to disable AI-assisted project creation

### 4. Default Project Settings
```typescript
defaultSettings: {
  autoSave: true,
  snapToGrid: true,
  gridSize: 50,
  theme: 'system',
  collaborationMode: false,
},
```

**What to customize:** Modify these default settings for new projects.

### 5. Template Placeholders
```typescript
templates: getTemplates(), // Loaded from markdown files
```

**What to customize:** 
- **Instructions:** Edit `src/shared/config/projectCreation/instructions.md`
- **Folder:** Edit `src/shared/config/projectCreation/folder.md`
- **Description:** Edit `src/shared/config/projectCreation/description.md`
- **Tags:** Edit `src/shared/config/projectCreation/tags.md`

The templates are now stored in separate markdown files for easier customization and management.

### 6. Validation Rules
```typescript
validation: {
  minProjectNameLength: 3,
  maxProjectNameLength: 100,
  minGoalLength: 10,
  maxGoalLength: 500,
  requiredFields: ['name', 'goal'],
},
```

**What to customize:** Adjust validation rules for project names and goals.

## Template Placeholders

The configuration uses template placeholders that get replaced with actual values:

- `{{PROJECT_NAME}}` - The user-provided project name
- `{{PROJECT_GOAL}}` - The user-provided project goal
- `{{PROJECT_NAME_SLUG}}` - URL-friendly version of the project name

## How It Works

### Simple Mode
1. User provides project name and goal
2. Agent sends request to n8n webhook
3. n8n processes the request and returns generated attributes
4. If webhook fails, falls back to template-based defaults

### Advanced Mode
1. User provides all project attributes manually
2. Agent merges user data with template defaults
3. User data takes priority over defaults

## n8n Integration

The agent expects your n8n workflow to:

1. **Receive webhook requests** with this structure:
```json
{
  "action": "generate-project-attributes",
  "data": {
    "goal": "string",
    "projectName": "string"
  }
}
```

2. **Return responses** in this format:
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

## Testing the Agent

You can test the project creation agent using:

```typescript
import { projectCreationAgentService } from '../services/projectCreationAgentService';

// Test the webhook connection
const isAvailable = await projectCreationAgentService.testAgent();

// Test project creation
const response = await projectCreationAgentService.createProject({
  projectName: 'Test Project',
  goal: 'Create a test project to verify the agent works',
  mode: 'simple'
});
```

## Service Location

The project creation agent service is located in:

**File:** `src/shared/services/projectCreationAgentService.ts`

This service handles:
- Project creation requests
- Validation
- Webhook communication
- Fallback to template defaults
- Error handling

## Customization Checklist

- [ ] Update webhook URL to your n8n endpoint
- [ ] Modify agent metadata (name, description, version)
- [ ] Configure feature flags (advanced mode, auto generation)
- [ ] Set default project settings
- [ ] Customize template placeholders in markdown files:
  - [ ] Edit `instructions.md` for AI agent behavior
  - [ ] Edit `description.md` for project descriptions
  - [ ] Edit `folder.md` for folder structure
  - [ ] Edit `tags.md` for default tags
- [ ] Adjust validation rules
- [ ] Test the webhook connection
- [ ] Verify project creation works in both modes
