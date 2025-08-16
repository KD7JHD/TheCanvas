import React, { useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';

export const ModalOverlay: React.FC = () => {
  const { activeModal, closeModal } = useModal();

  // Close modal on Escape key press
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

  if (!activeModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[90] pointer-events-auto"
      onClick={closeModal}
      style={{ pointerEvents: 'auto' }}
    />
  );
};
