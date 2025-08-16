import React from 'react';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { ModalProvider } from '../shared/contexts/ModalContext';
import { MainLayout } from './layout/MainLayout';

export const App: React.FC = () => {

  return (
    <ErrorBoundary>
      <ModalProvider>
        <MainLayout />
      </ModalProvider>
    </ErrorBoundary>
  );
};
