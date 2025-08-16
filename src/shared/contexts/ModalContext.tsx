import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Block } from '../types/index';

export type ModalType = 
  | 'createProject'
  | 'editProject'
  | 'deleteProject'
  | 'projectDetails'
  | 'addBlock'
  | 'blockProperties'
  | 'projectConversation';

interface ModalContextType {
  activeModal: ModalType | null;
  selectedProject: Project | null;
  selectedBlock: Block | null;
  openModal: (modalType: ModalType, data?: { project?: Project; block?: Block }) => void;
  closeModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const openModal = (modalType: ModalType, data?: { project?: Project; block?: Block }) => {
    setActiveModal(modalType);
    if (data?.project) {
      setSelectedProject(data.project);
    }
    if (data?.block) {
      setSelectedBlock(data.block);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProject(null);
    setSelectedBlock(null);
  };

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedProject(null);
    setSelectedBlock(null);
  };

  // Close modal on Escape key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeModal) {
        closeModal();
      }
    };

    if (activeModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal, closeModal]);

  return (
    <ModalContext.Provider value={{
      activeModal,
      selectedProject,
      selectedBlock,
      openModal,
      closeModal,
      closeAllModals,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
