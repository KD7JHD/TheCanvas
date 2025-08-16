import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectSettings, ProjectMetadata } from '../types/index';
import { generateId } from '../utils/index';

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  
  // Computed
  getProjectById: (id: string) => Project | undefined;
  getCurrentProject: () => Project | undefined;
  getProjectsByOwner: (owner: string) => Project[];
}

const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  autoSave: true,
  snapToGrid: true,
  gridSize: 50,
  theme: 'system',
  collaborationMode: false,
};

const DEFAULT_PROJECT_METADATA: ProjectMetadata = {
  description: '',
  tags: [],
  version: '1.0.0',
  lastAccessed: Date.now(),
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          settings: projectData.settings || DEFAULT_PROJECT_SETTINGS,
          metadata: projectData.metadata || DEFAULT_PROJECT_METADATA,
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id,
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: Date.now() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },

      selectProject: (id) => {
        set({ currentProjectId: id });
        
        // Update lastAccessed for the selected project
        if (id) {
          const project = get().getProjectById(id);
          if (project) {
            get().updateProject(id, {
              metadata: {
                ...project.metadata,
                lastAccessed: Date.now(),
              },
            });
          }
        }
      },

      getProjectById: (id) => {
        return get().projects.find((project) => project.id === id);
      },

      getCurrentProject: () => {
        const { currentProjectId, getProjectById } = get();
        return currentProjectId ? getProjectById(currentProjectId) : undefined;
      },

      getProjectsByOwner: (owner) => {
        return get().projects.filter((project) => project.owner === owner);
      },
    }),
    {
      name: 'canvas-projects',
    }
  )
);
