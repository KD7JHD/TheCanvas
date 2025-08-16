# Project Creation Templates

This directory contains the template files used by the Project Creation Agent to generate project attributes.

## Directory Structure

```
src/shared/config/projectCreation/
├── README.md              # This file
├── templateLoader.ts      # Utility to load templates
├── instructions.md        # AI agent instructions template
├── description.md         # Project description template
├── folder.md             # Project folder path template
└── tags.md               # Default project tags
```

## Template Files

### `instructions.md`
Contains the template for AI agent instructions that will be used for each project. This defines how the AI agent should behave and what guidance it should provide.

**Placeholders:**
- `{{PROJECT_NAME}}` - The user-provided project name
- `{{PROJECT_GOAL}}` - The user-provided project goal

### `description.md`
Contains the template for automatically generated project descriptions.

**Placeholders:**
- `{{PROJECT_GOAL}}` - The user-provided project goal

### `folder.md`
Contains the template for project folder paths.

**Placeholders:**
- `{{PROJECT_NAME_SLUG}}` - URL-friendly version of the project name

### `tags.md`
Contains the default tags that will be assigned to new projects.

**Format:** One tag per line in a code block

## Customization

To customize the templates:

1. **Edit the markdown files** in this directory
2. **Follow the format** shown in each file
3. **Use code blocks** to define the actual template content
4. **Restart the application** to see changes

## Template Format

Each template file should contain:

1. **Documentation** explaining the template's purpose
2. **Example customizations** for different project types
3. **A code block** containing the actual template content

Example:
```markdown
# Template Documentation

This template does X...

## Template Content

```
Your actual template content here
```

## Customization Examples

### For Development Projects
```
Different template content
```
```

## How It Works

1. The `templateLoader.ts` utility reads these markdown files
2. It extracts the template content from code blocks
3. The `projectCreationAgent.ts` configuration uses these templates
4. When creating projects, the system processes placeholders with actual values

## Placeholder Processing

The system automatically:
- Replaces `{{PROJECT_NAME}}` with the user's project name
- Replaces `{{PROJECT_GOAL}}` with the user's project goal
- Replaces `{{PROJECT_NAME_SLUG}}` with a URL-friendly version of the project name

## Fallback System

If the markdown files cannot be loaded (e.g., in a browser environment), the system falls back to hardcoded templates in `templateLoader.ts`.

## Best Practices

1. **Keep templates concise** but informative
2. **Use consistent formatting** across all templates
3. **Test changes** by creating a new project
4. **Document customizations** in the markdown files
5. **Use appropriate placeholders** for dynamic content

## Example Customizations

### For a Development Team
- Modify `instructions.md` to include technical guidance
- Update `tags.md` to include technology-specific tags
- Adjust `folder.md` to match your project structure

### For a Creative Agency
- Modify `instructions.md` to focus on creative guidance
- Update `tags.md` to include design-related tags
- Adjust `description.md` to emphasize creative aspects

### For a Research Organization
- Modify `instructions.md` to include research methodology
- Update `tags.md` to include research-related tags
- Adjust `description.md` to emphasize research objectives
