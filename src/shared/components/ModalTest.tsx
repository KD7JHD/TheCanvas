import React from 'react';
import { useModal } from '../contexts/ModalContext';

export const ModalTest: React.FC = () => {
  const { openModal } = useModal();

  const testModals = () => {
    console.log('Testing modal functionality...');
    
    // Test create project modal
    setTimeout(() => {
      openModal('createProject');
      console.log('Opened create project modal');
    }, 1000);

    // Test add block modal
    setTimeout(() => {
      openModal('addBlock');
      console.log('Opened add block modal');
    }, 3000);

    // Test project details modal (would need a project)
    setTimeout(() => {
      openModal('projectDetails', { 
        project: {
          id: 'test-1',
          name: 'Test Project',
          goal: 'Test project goal',
          instructions: 'Test instructions',
          folder: '/test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      });
      console.log('Opened project details modal');
    }, 5000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      <button
        onClick={testModals}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700"
      >
        Test Modals
      </button>
    </div>
  );
};
