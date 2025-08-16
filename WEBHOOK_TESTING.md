# Webhook Testing System

## Overview

The webhook testing system allows users to preview and test the JSON payload that will be sent to the n8n webhook when creating projects. This is particularly useful for debugging and ensuring your n8n workflow is properly configured to handle the incoming data.

## Features

### 🔍 **Payload Preview**
- Shows the exact JSON that will be sent to the n8n webhook
- Displays processed AI agent instructions from the template
- Includes project name and goal in the payload structure

### 📋 **Copy to Clipboard**
- One-click copying of the JSON payload
- Useful for testing in external tools or documentation

### 🧪 **Direct Webhook Testing**
- Send test requests directly to your n8n webhook
- Real-time feedback on webhook responses
- Error handling for failed requests

### 📊 **Payload Structure Documentation**
- Clear explanation of each field in the payload
- Expected response format documentation
- Integration guidance for n8n workflows

## How to Use

### 1. **Accessing the Test Modal**
1. Open the "Create New Project" modal
2. Fill in the project name and goal
3. Ensure you're in "Simple Mode" (AI-assisted creation)
4. Click the "Test Webhook" button (blue button with send icon)

### 2. **Understanding the Payload**

The webhook payload follows this structure:

```json
{
  "action": "generate-project-attributes",
  "data": {
    "goal": "User-provided project goal",
    "projectName": "User-provided project name",
    "instructions": "Processed AI agent instructions from template"
  }
}
```

#### Field Descriptions:

- **`action`**: Always set to `"generate-project-attributes"` for project creation
- **`data.goal`**: The project goal entered by the user
- **`data.projectName`**: The project name entered by the user
- **`data.instructions`**: The exact text from instructions.md template

### 3. **AI Agent Instructions**

The instructions field contains the exact text from `src/shared/config/projectCreation/instructions.md`:

- The complete instructions template is sent as-is to the n8n webhook
- No placeholder replacement is performed - the n8n workflow receives the raw template text
- This allows the n8n workflow to process the instructions as needed

Example:
```
Instructions sent to webhook:
"Act as a Senior Analyst with sixteen years of experience. You are proficient in discovery facilitation and workshop design; stakeholder analysis, mapping, and expectation management; interviewing, surveying, and observational research; problem framing, goal setting, SMART goals, and OKRs; requirements elicitation using use cases, user stories, acceptance criteria, and nonfunctional requirements; process modeling with BPMN, data flow diagrams, and context diagrams; concept modeling, glossary creation, and domain analysis; prioritization with MoSCoW, RICE, Kano, and cost of delay; scoping and MVP definition with incremental delivery; risk identification and mitigation; defining success metrics and measurable acceptance tests; writing clear, testable documentation and specifications; communication, negotiation, and conflict resolution; change control and traceability from requirement to test case; tool proficiency with Jira or Azure Boards, Confluence or Notion, Miro or FigJam, and Figma or Visio; cross domain adaptability and rapid domain ramp up; awareness of privacy, security, compliance, and accessibility; close collaboration with project managers, product managers, UX researchers, designers, architects, and engineering leads. You use IIBA BABOK v3, PMI PMBOK Guide, ISO IEC IEEE 29148, ISO IEC 25010, ISO IEC 15288, the IEEE Software Engineering Standards collection, MoSCoW prioritization from the DSDM Consortium, OKRs literature including Doerr and Google sources, Jobs To Be Done materials from Clayton Christensen and the Christensen Institute, the Kano model by Noriaki Kano, RICE prioritization from Intercom, Impact Mapping by Gojko Adzic, Event Storming and domain driven discovery by Alberto Brandolini, Mastering the Requirements Process by Robertson and Robertson, Software Requirements by Wiegers and Beatty, User Story Mapping by Jeff Patton, Lean UX by Gothelf and Seiden, Specification by Example by Gojko Adzic, Agile Estimating and Planning by Mike Cohn, The Lean Startup by Eric Ries, Nielsen Norman Group research, ISO 9241 human centered design standards, and templates such as the IIBA requirement classification schema, PMI scope statements, WBS and change control templates, and RACI matrices, best practices, and always cite your sources.
Please provide helpful guidance and suggestions to the client as they write their project goal. You can help with planning, best practices, and problem-solving."
```

## n8n Workflow Integration

### Expected Response Format

Your n8n workflow should return a response in this format:

```json
{
  "success": true,
  "data": {
    "instructions": "Customized project instructions",
    "folder": "/projects/my-test-project",
    "description": "A comprehensive project focused on...",
    "tags": ["project", "planning", "development"],
    "settings": {
      "autoSave": true,
      "snapToGrid": true,
      "gridSize": 50,
      "theme": "system",
      "collaborationMode": false
    }
  }
}
```

### Error Response Format

If your workflow encounters an error, return:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

## Testing Workflow

### 1. **Copy the Payload**
- Click "Copy JSON" to copy the payload to your clipboard
- Use this in external testing tools like Postman or curl

### 2. **Test Directly**
- Click "Test Webhook" to send the payload directly to your n8n webhook
- The system will show success/error messages based on the response

### 3. **Verify Response**
- Check that your n8n workflow processes the payload correctly
- Ensure the response format matches the expected structure
- Verify that the AI agent instructions are being used properly

## Configuration

### Webhook URL

The webhook URL is configured in:
```
src/shared/config/projectCreationAgent.ts
```

Current configuration:
```typescript
webhookUrl: 'https://kd7jhd.app.n8n.cloud/webhook/dbd6ace9-51d3-4c1b-8b95-f95b05e379ef'
```

### Instructions Template

The AI agent instructions are loaded from:
```
src/shared/config/projectCreation/instructions.md
```

## Troubleshooting

### Common Issues

**Webhook returns 404:**
- Verify the webhook URL is correct
- Ensure your n8n workflow is active and accessible

**Webhook returns 500:**
- Check your n8n workflow logs for errors
- Verify the payload structure matches what your workflow expects

**Response format errors:**
- Ensure your n8n workflow returns the expected JSON structure
- Check that all required fields are present in the response

**Template processing issues:**
- Verify the instructions template file exists and is properly formatted
- Check that placeholder replacement is working correctly

### Debug Tips

1. **Use the Copy JSON feature** to test in external tools
2. **Check n8n workflow logs** for detailed error information
3. **Verify webhook URL accessibility** from your development environment
4. **Test with simple payloads first** before adding complex AI processing

## Security Considerations

### Webhook Security
- Ensure your n8n webhook has proper authentication if needed
- Consider rate limiting to prevent abuse
- Validate incoming payloads in your n8n workflow

### Data Privacy
- The webhook payload contains user-provided project information
- Ensure your n8n workflow handles this data appropriately
- Consider data retention policies for webhook logs

## Future Enhancements

### Planned Features
- Webhook response validation
- Payload history and replay
- Custom webhook URL per project
- Webhook health monitoring
- Response time tracking

### Integration Improvements
- Support for different webhook authentication methods
- Custom payload templates
- Batch webhook testing
- Webhook performance analytics
