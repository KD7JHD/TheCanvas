## 4. Block Management System

### 4.1 Block Library & Management

### **Feature: Block Library Management**

**Technical Requirements:**

typescript

`interface BlockDefinition {
  id: string;
  name: string;
  category: BlockCategory;
  description: string;
  icon: string;
  version: string;
  schema: JSONSchema7;
  uiSchema?: UISchemaElement;
  isBuiltIn: boolean;
  isExpert: boolean;
  metadata: BlockMetadata;
}

interface BlockCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
}

interface BlockLibrary {
  blocks: Map<string, BlockDefinition>;
  categories: Map<string, BlockCategory>;
  addBlock(block: BlockDefinition): void;
  removeBlock(id: string): void;
  getBlocksByCategory(categoryId: string): BlockDefinition[];
  searchBlocks(query: string): BlockDefinition[];
}`

**Acceptance Criteria:**

- [ ]  Built-in block definitions with schemas
- [ ]  Custom block creation with visual editor
- [ ]  Block categorization and filtering
- [ ]  Search functionality with fuzzy matching
- [ ]  Drag from library to canvas
- [ ]  Block versioning and updates
- [ ]  Import/export block definitions

**Implementation Details:**

- Use JSONSchema for block data validation
- Implement Fuse.js for fuzzy search
- Store custom blocks in localStorage and GitHub

**Files to Create:**

- `src/features/blocks/library/BlockLibrary.ts`
- `src/features/blocks/library/BlockDefinition.ts`
- `src/features/blocks/components/BlockPanel.tsx`
- `src/features/blocks/components/BlockLibraryItem.tsx`

### **Feature: Dynamic Block Creation**

**Priority:** Medium | **Complexity:** High | **Estimated Hours:** 20

**Technical Requirements:**

typescript

`interface BlockCreator {
  createBlock(definition: BlockDefinition): void;
  editBlock(id: string, updates: Partial<BlockDefinition>): void;
  deleteBlock(id: string): void;
  duplicateBlock(id: string): BlockDefinition;
  validateBlock(definition: BlockDefinition): ValidationResult;
}

interface BlockEditor {
  schema: JSONSchemaEditor;
  uiSchema: UISchemaEditor;
  preview: BlockPreview;
  validation: SchemaValidator;
}`

**Acceptance Criteria:**

- [ ]  Visual schema editor for block structure
- [ ]  UI schema editor for form layout
- [ ]  Real-time block preview
- [ ]  Schema validation and error display
- [ ]  Block template system
- [ ]  Version control for block definitions
- [ ]  Collaborative editing (future)

**Files to Create:**

- `src/features/blocks/editor/BlockEditor.tsx`
- `src/features/blocks/editor/SchemaEditor.tsx`
- `src/features/blocks/editor/UISchemaEditor.tsx`
- `src/features/blocks/editor/BlockPreview.tsx`

### 4.2 Block Instances & Forms

### **Feature: Dynamic Form Generation**

**Priority:** High | **Complexity:** High | **Estimated Hours:** 18

**Technical Requirements:**

typescript

`interface BlockFormProps {
  blockId: string;
  definition: BlockDefinition;
  data: BlockData;
  onChange: (data: BlockData) => void;
  onSubmit: (data: BlockData) => void;
  readonly?: boolean;
}

interface FormState {
  data: BlockData;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

interface JSONFormsConfig {
  renderers: JsonFormsRendererRegistryEntry[];
  cells: JsonFormsCellRendererRegistryEntry[];
  uischemas: JsonFormsUISchemaRegistryEntry[];
  config: any;
}`

**Acceptance Criteria:**

- [ ]  JSONForms integration with custom renderers
- [ ]  Multi-step form support
- [ ]  Field validation with error display
- [ ]  Conditional field visibility
- [ ]  File upload support for binary data
- [ ]  Form auto-save functionality
- [ ]  Form submission to n8n webhooks

**Implementation Details:**

- Use @jsonforms/react with Material renderers
- Custom renderers for specific field types
- Ajv for JSON schema validation
- Debounced auto-save

**Files to Create:**

- `src/features/blocks/forms/BlockForm.tsx`
- `src/features/blocks/forms/FormRenderer.tsx`
- `src/features/blocks/forms/CustomRenderers.tsx`
- `src/features/blocks/forms/FormValidator.ts`

### **Feature: Block Node Component**

**Priority:** High | **Complexity:** Medium | **Estimated Hours:** 14

**Technical Requirements:**

typescript

`interface BlockNodeProps {
  node: CanvasNode;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (updates: Partial<CanvasNode>) => void;
  onDelete: () => void;
  onEdit: () => void;
}

interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  opacity: number;
  shadow: ShadowConfig;
  gradient?: GradientConfig;
}

interface NodeInteractions {
  draggable: boolean;
  resizable: boolean;
  rotatable: boolean;
  selectable: boolean;
}`

**Acceptance Criteria:**

- [ ]  Visual block representation with category colors
- [ ]  Hover states with action buttons
- [ ]  Inline editing mode
- [ ]  Resize handles for adjustable blocks
- [ ]  Settings button for form access
- [ ]  Thread log button for expert blocks
- [ ]  Delete confirmation flow
- [ ]  Visual connection points (future)

**Files to Create:**

- `src/features/blocks/components/BlockNode.tsx`
- `src/features/blocks/components/NodeActions.tsx`
- `src/features/blocks/hooks/useBlockInteractions.ts`