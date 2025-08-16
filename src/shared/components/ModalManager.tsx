import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { CreateProjectModal } from './CreateProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { DeleteProjectModal } from './DeleteProjectModal';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { AddBlockModal } from './AddBlockModal';
import { BlockPropertiesModal } from './BlockPropertiesModal';



export const ModalManager: React.FC = () => {
  const { activeModal, selectedProject, selectedBlock, closeModal } = useModal();

  // Don't render anything if no modal is active
  if (!activeModal) return null;

  return (
    <>
      {/* Modal Overlay - High z-index to ensure it's above all other content */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9999]"
        onClick={closeModal}
      />
      
      {/* Modal Content Container - Higher z-index than overlay */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Create Project Modal */}
          {activeModal === 'createProject' && (
            <CreateProjectModal
              isOpen={true}
              onClose={closeModal}
            />
          )}

          {/* Edit Project Modal */}
          {activeModal === 'editProject' && selectedProject && (
            <EditProjectModal
              isOpen={true}
              onClose={closeModal}
            />
          )}

          {/* Delete Project Modal */}
          {activeModal === 'deleteProject' && selectedProject && (
            <DeleteProjectModal
              isOpen={true}
              onClose={closeModal}
            />
          )}

          {/* Project Details Modal */}
          {activeModal === 'projectDetails' && selectedProject && (
            <ProjectDetailsModal
              isOpen={true}
              onClose={closeModal}
            />
          )}

          {/* Add Block Modal */}
          {activeModal === 'addBlock' && (
            <AddBlockModal
              isOpen={true}
              onClose={closeModal}
            />
          )}

          {/* Block Properties Modal */}
          {activeModal === 'blockProperties' && selectedBlock && (
            <BlockPropertiesModal
              isOpen={true}
              onClose={closeModal}
            />
          )}



          {/* Project Conversation Modal - TODO: Implement with proper props */}
          {/* {activeModal === 'projectConversation' && (
            <ProjectConversationModal
              isOpen={true}
              onClose={closeModal}
              sessionId=""
              projectName=""
              projectGoal=""
              onComplete={() => {}}
            />
          )} */}
        </div>
      </div>
    </>
  );
};
