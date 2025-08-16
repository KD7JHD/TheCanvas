# Project CRUD System

## Overview

The Project CRUD (Create, Read, Update, Delete) system provides complete management capabilities for projects within the SPA. Each project supports full CRUD operations with a modern, accessible user interface.

## CRUD Operations

### 🔧 **Create (C)**
- **Component**: `CreateProjectModal`
- **Location**: `src/shared/components/CreateProjectModal.tsx`
- **Features**:
  - Dual-mode creation (Simple AI-assisted vs Advanced manual)
  - AI agent integration via n8n webhooks
  - Template-based attribute generation
  - Validation and error handling
  - Real-time form validation

### 📖 **Read (R)**
- **Components**: 
  - `ProjectList` - Main project listing with actions
  - `ProjectDetailsModal` - Detailed project view
- **Locations**: 
  - `src/shared/components/ProjectList.tsx`
  - `src/shared/components/ProjectDetailsModal.tsx`
- **Features**:
  - Comprehensive project overview
  - Metadata display (dates, ownership, tags)
  - Settings visualization
  - Responsive design
  - Search and filtering capabilities

### ✏️ **Update (U)**
- **Component**: `EditProjectModal`
- **Location**: `src/shared/components/EditProjectModal.tsx`
- **Features**:
  - Full project editing capabilities
  - Settings management
  - Tag management
  - Webhook URL configuration
  - Real-time validation
  - Auto-save indicators

### 🗑️ **Delete (D)**
- **Component**: `DeleteProjectModal`
- **Location**: `src/shared/components/DeleteProjectModal.tsx`
- **Features**:
  - Confirmation dialog with project name verification
  - Warning messages about data loss
  - Project information preview before deletion
  - Safe deletion with confirmation

## Store Implementation

### Project Store (`src/shared/stores/projectStore.ts`)

```typescript
interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  
  // CRUD Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  
  // Computed
  getProjectById: (id: string) => Project | undefined;
  getCurrentProject: () => Project | undefined;
  getProjectsByOwner: (owner: string) => Project[];
}
```

### Key Features:
- **Persistence**: Uses Zustand persist middleware
- **Type Safety**: Full TypeScript support
- **Auto-timestamps**: Automatic creation and update timestamps
- **Current Project Tracking**: Maintains selected project state
- **Owner Filtering**: Filter projects by owner

## UI Components

### ProjectList Component

**Features:**
- Grid layout for project cards
- Action menus for each project
- Project metadata display
- Current project highlighting
- Empty state handling
- Responsive design

**Actions Available:**
- View Details
- Edit Project
- Delete Project
- Open Project

### ProjectDetailsModal Component

**Information Displayed:**
- Basic project information (name, goal, description)
- Project instructions
- Timeline (created, updated, last accessed)
- Ownership and version information
- Tags and metadata
- Project settings
- Folder path and webhook URL

### EditProjectModal Component

**Editable Fields:**
- Project name and goal
- Description and instructions
- Folder path
- Project owner
- n8n webhook URL
- Tags (comma-separated)
- All project settings

**Settings Management:**
- Auto Save toggle
- Snap to Grid toggle
- Grid size configuration
- Theme selection

### DeleteProjectModal Component

**Safety Features:**
- Project name confirmation
- Warning about data loss
- Project preview before deletion
- Disabled state until confirmation
- Loading state during deletion

## Data Model

### Project Interface

```typescript
interface Project {
  id: string;
  name: string;
  goal: string;
  instructions: string;
  folder: string;
  owner?: string;
  collaborators?: string[];
  webhookUrl?: string;
  createdAt: number;
  updatedAt: number;
  settings: ProjectSettings;
  metadata: ProjectMetadata;
}
```

### ProjectSettings Interface

```typescript
interface ProjectSettings {
  autoSave: boolean;
  snapToGrid: boolean;
  gridSize: number;
  theme: 'light' | 'dark' | 'system';
  collaborationMode: boolean;
}
```

### ProjectMetadata Interface

```typescript
interface ProjectMetadata {
  description: string;
  tags: string[];
  version: string;
  lastAccessed: number;
}
```

## Integration Points

### Project Creation Agent
- Integrates with the existing project creation agent
- Supports both AI-assisted and manual creation modes
- Uses template system for default attributes

### n8n Webhook Integration
- Each project can have a dedicated webhook URL
- Supports AI/agent functions via n8n workflows
- Webhook URLs are editable and manageable

### Block System Integration
- Projects can contain multiple blocks
- Block CRUD operations are separate from project CRUD
- Projects provide context for block operations

## User Experience Features

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels and descriptions

### Responsive Design
- Mobile-friendly layouts
- Adaptive grid systems
- Touch-friendly interactions
- Responsive typography

### Error Handling
- Validation feedback
- Error messages
- Loading states
- Graceful degradation

### Performance
- Lazy loading of modals
- Efficient state management
- Optimized re-renders
- Minimal bundle size impact

## Usage Examples

### Creating a Project
```typescript
import { useProjectStore } from '../stores/projectStore';

const { addProject } = useProjectStore();

addProject({
  name: 'My New Project',
  goal: 'Create a comprehensive solution',
  instructions: 'Project instructions...',
  folder: '/projects/my-new-project',
  settings: { /* default settings */ },
  metadata: { /* default metadata */ }
});
```

### Updating a Project
```typescript
import { useProjectStore } from '../stores/projectStore';

const { updateProject } = useProjectStore();

updateProject(projectId, {
  name: 'Updated Project Name',
  goal: 'Updated project goal',
  settings: { autoSave: false }
});
```

### Deleting a Project
```typescript
import { useProjectStore } from '../stores/projectStore';

const { deleteProject } = useProjectStore();

deleteProject(projectId);
```

## Best Practices

### Data Validation
- Always validate input data before operations
- Provide clear error messages
- Use TypeScript for type safety
- Implement client-side validation

### State Management
- Use Zustand for centralized state
- Implement optimistic updates where appropriate
- Handle loading and error states
- Maintain data consistency

### User Experience
- Provide immediate feedback for actions
- Use loading indicators for async operations
- Implement confirmation for destructive actions
- Maintain consistent UI patterns

### Security
- Validate all user inputs
- Sanitize data before storage
- Implement proper access controls
- Handle sensitive data appropriately

## Future Enhancements

### Planned Features
- Project templates and cloning
- Bulk operations (bulk delete, bulk edit)
- Advanced search and filtering
- Project import/export functionality
- Version history and rollback
- Project sharing and collaboration

### Technical Improvements
- Real-time collaboration
- Offline support
- Advanced caching strategies
- Performance optimizations
- Enhanced accessibility features

## Troubleshooting

### Common Issues

**Project not saving:**
- Check form validation
- Verify required fields
- Check console for errors

**Modal not opening:**
- Verify modal state management
- Check component imports
- Ensure proper event handling

**Data not persisting:**
- Check Zustand persist configuration
- Verify storage permissions
- Check for storage quota issues

### Debug Tips
- Use browser dev tools for state inspection
- Check network tab for webhook calls
- Verify TypeScript compilation
- Test with different data scenarios
