# Original

[First Draft](https://www.notion.so/First-Draft-24e669bfabdd80668231f6d72a84497d?pvs=21)

## Updated Architecture Specification

### 1. Design Goals

- **Maintainable, modular application logic**
    - Managers can be no longer than 100 lines of code or fit on one page
    - Functions can be no longer than 5 lines of code
    - You can pass no more than four parameters into a function
    - In your controller, you can only instantiate one object, to do whatever it is that needs to be done.
    - Comments describe the input, proceedure, and outputs
- **Modular logic designed to swap components/services**
- **Object-oriented programming for code reuse**
- **Sleek, modern UX with React, Tailwind, and Radix**
- **High performance (Core Web Vitals green)**
- **Secure authentication (GitHub OAuth with PKCE)**
- **Dual persistence (GitHub + LocalStorage)**
- **Mobile responsive and accessible (WCAG 2.2 AA)**
- **Every object will have CRUD functionality by default**

### 2. Updated Tech Stack

typescript

`*// Core Framework*
"react": "^19.0.0"
"react-dom": "^19.0.0"
"typescript": "^5.7.0"

*// Canvas & Graphics*
"konva": "^9.3.16"
"react-konva": "^19.0.7"

*// Forms & Validation*
"@jsonforms/core": "^3.6.0"
"@jsonforms/react": "^3.6.0"
"@jsonforms/material-renderers": "^3.6.0"
"ajv": "^8.17.1"

*// UI & Styling*
"@tailwindcss/forms": "^0.5.9"
"@radix-ui/react-*": "latest"
"tailwindcss": "^3.4.14"
"@headlessui/react": "^2.2.0"

*// Authentication & API*
"@octokit/rest": "^21.0.2"
"@octokit/auth-oauth-app": "^8.1.1"

*// Build & Development*
"vite": "^6.0.0"
"@vitejs/plugin-react": "^4.3.3"`

### 3. Revised Architecture Layers

`┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  App.tsx │ TopBar │ Canvas │ BlockPanel │ ProjectSidebar   │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  BlockSystem │ ProjectMgmt │ ThreadMgmt │ CanvasEngine    │
├─────────────────────────────────────────────────────────────┤
│                    State Management Layer                   │
│  ProjectContext │ AuthContext │ ThemeContext │ CanvasState │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                          │
│  GitHubAPI │ n8nWebhook │ LocalStorage │ AuthProvider     │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure Layer                    │
│        Vite │ GitHub Actions │ GitHub Pages                │
└─────────────────────────────────────────────────────────────┘`

### 4. Enhanced Folder Structure

`src/
├── app/                    # Application shell and providers
│   ├── App.tsx            # Main application component
│   ├── providers/         # Context providers
│   └── layout/            # Layout components
├── features/              # Feature-based organization
│   ├── canvas/            # Infinite canvas system
│   │   ├── components/    # Canvas-related components
│   │   ├── hooks/         # Canvas state management
│   │   ├── engine/        # Canvas rendering engine
│   │   └── types/         # Canvas type definitions
│   ├── blocks/            # Block management system
│   │   ├── components/    # Block UI components
│   │   ├── forms/         # Dynamic form components
│   │   ├── library/       # Block library management
│   │   └── types/         # Block type definitions
│   ├── projects/          # Project management
│   │   ├── components/    # Project UI components
│   │   ├── storage/       # Storage layer
│   │   └── types/         # Project type definitions
│   ├── auth/              # Authentication system
│   │   ├── providers/     # OAuth providers
│   │   ├── hooks/         # Auth state management
│   │   └── types/         # Auth type definitions
│   └── threads/           # Thread logging system
│       ├── components/    # Thread UI components
│       ├── storage/       # Thread persistence
│       └── types/         # Thread type definitions
├── shared/                # Shared utilities and components
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Shared hooks
│   ├── utils/             # Utility functions
│   ├── types/             # Shared type definitions
│   └── constants/         # Application constants
├── services/              # External service integrations
│   ├── github/            # GitHub API integration
│   ├── n8n/               # n8n webhook integration
│   ├── storage/           # Storage abstraction layer
│   └── validation/        # Input/output validation
└── styles/                # Styling and theming
    ├── globals.css        # Global styles
    ├── components.css     # Component styles
    └── tokens/            # Design tokens`

### 5. Component Architecture Details

### **Canvas System (Enhanced)**

typescript

`*// Canvas Engine with Performance Optimization*
interface CanvasEngine {
  *// Infinite scrolling with viewport culling*
  viewport: ViewportManager;
  *// Grid system with dynamic generation*
  grid: GridSystem;
  *// Node management with spatial indexing*
  nodes: NodeManager;
  *// Performance monitoring*
  performance: PerformanceMonitor;
}

*// Key Performance Features:// - RequestAnimationFrame batching// - Layer-based rendering optimization// - Viewport-based node culling// - Memory-efficient grid generation*`

### **Block System (Refined)**

typescript

`interface BlockSystem {
  *// Block library with categorization*
  library: BlockLibrary;
  *// Dynamic form generation with JSONForms*
  forms: FormGenerator;
  *// Block lifecycle management*
  lifecycle: BlockLifecycle;
  *// Thread logging for expert blocks*
  threading: ThreadManager;
}`

### **Storage Layer (Dual Strategy)**

typescript

`interface StorageStrategy {
  *// Primary: GitHub repository storage*
  github: GitHubStorage;
  *// Cache: LocalStorage for performance*
  local: LocalStorageCache;
  *// Synchronization layer*
  sync: SyncManager;
}`

### 6. Security & Validation Framework

### **Input Validation Pipeline**

typescript

`*// Client-side validation with Ajv*
interface ValidationPipeline {
  *// JSONSchema-based validation*
  schema: SchemaValidator;
  *// XSS prevention and sanitization*
  sanitizer: ContentSanitizer;
  *// Type-safe boundaries*
  typeGuards: TypeGuardSystem;
}`

### **OAuth Security Implementation**

typescript

`*// PKCE flow for enhanced security*
interface OAuthPKCE {
  *// Code challenge generation*
  codeChallenge: string;
  *// Secure token storage*
  tokenManager: SecureTokenManager;
  *// Session persistence*
  sessionManager: SessionManager;
}`

### 7. Performance Budget & Monitoring

typescript

`*// Performance Budgets (Enhanced)*
interface PerformanceBudgets {
  *// Bundle size constraints*
  initialJS: "≤ 150KB gzip";        *// Reduced from 200KB// Core Web Vitals targets*
  LCP: "< 2.0s";                    *// Improved from 2.5s*
  CLS: "< 0.1";                     *// Maintained*
  INP: "< 150ms";                   *// Improved from 200ms// Canvas-specific metrics*
  frameRate: "≥ 60fps";
  renderTime: "< 16ms/frame";
}`

### 8. Deployment Configuration

### **Vite Configuration (GitHub Pages)**

typescript

`*// vite.config.ts*
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/repo-name/' : '/',
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          canvas: ['konva', 'react-konva'],
          forms: ['@jsonforms/core', '@jsonforms/react']
        }
      }
    }
  }
});`

### **GitHub Actions Workflow**

yaml

`*# Automated deployment with proper security*
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: actions/deploy-pages@v4`

### 9. Mobile & Accessibility Enhancements

### **Responsive Design Strategy**

typescript

`*// Mobile-first responsive breakpoints*
interface ResponsiveBreakpoints {
  mobile: "320px - 768px";      *// Touch-optimized interactions*
  tablet: "768px - 1024px";     *// Hybrid interactions*
  desktop: "1024px+";           *// Full feature set*
}

*// Touch gesture support*
interface TouchGestures {
  pinchZoom: "Canvas zoom control";
  panGesture: "Canvas navigation";
  longPress: "Context menu activation";
  swipeGestures: "Sidebar navigation";
}`

### **Accessibility Compliance (WCAG 2.2 AA)**

typescript

`interface AccessibilityFeatures {
  *// Keyboard navigation*
  keyboardNav: "Full keyboard accessibility";
  *// Screen reader support*
  ariaLabels: "Comprehensive ARIA labeling";
  *// Color contrast*
  colorContrast: "≥ 4.5:1 ratio";
  *// Focus management*
  focusManagement: "Logical focus flow";
}`

### 10. Testing Strategy (Enhanced)

typescript

`*// Comprehensive testing approach*
interface TestingStrategy {
  *// Unit testing*
  unit: "Vitest + React Testing Library";
  unit: "Puppeteer";
  *// Integration testing*
  integration: "Canvas interactions + API flows";
  *// End-to-end testing*
  e2e: "Playwright for critical user flows";
  *// Performance testing*
  performance: "Lighthouse CI integration";
  *// Accessibility testing*
  a11y: "axe-core integration";
}`