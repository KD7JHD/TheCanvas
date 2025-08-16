# Project Folder Template

This file contains the template for project folder paths that will be automatically generated for new projects.

## Template Content

```
/projects/{{PROJECT_NAME_SLUG}}
```

## Placeholders

- `{{PROJECT_NAME_SLUG}}` - URL-friendly version of the project name (lowercase, hyphens instead of spaces, no special characters)

## Customization

You can modify this template to change how project folder paths are generated. The folder path should be:

- Consistent with your file system structure
- URL-friendly (no spaces, special characters, or uppercase letters)
- Descriptive and organized
- Suitable for your project management workflow

## Example Customizations

### Basic Structure
```
/projects/{{PROJECT_NAME_SLUG}}
```

### With Date Prefix
```
/projects/{{CURRENT_DATE}}-{{PROJECT_NAME_SLUG}}
```

### With Category Organization
```
/projects/{{PROJECT_CATEGORY}}/{{PROJECT_NAME_SLUG}}
```

### With User Organization
```
/projects/{{USER_NAME}}/{{PROJECT_NAME_SLUG}}
```

### With Year/Month Organization
```
/projects/{{CURRENT_YEAR}}/{{CURRENT_MONTH}}/{{PROJECT_NAME_SLUG}}
```

### Custom Base Path
```
/workspace/projects/{{PROJECT_NAME_SLUG}}
```

### With Status
```
/projects/active/{{PROJECT_NAME_SLUG}}
```

## Folder Naming Rules

The system automatically converts project names to URL-friendly slugs by:

1. Converting to lowercase
2. Replacing spaces with hyphens
3. Removing special characters (except hyphens)
4. Trimming leading/trailing hyphens
5. Limiting length to prevent overly long paths

## Examples

- "My Awesome Project" → "my-awesome-project"
- "Project 2.0" → "project-2-0"
- "API Development" → "api-development"
- "Frontend/Backend Integration" → "frontend-backend-integration"
