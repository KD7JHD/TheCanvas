import React from 'react';
import { cn } from '../../shared/utils/index';
import { useResponsiveLayout } from '../../shared/hooks/useResponsiveLayout';
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { CanvasArea } from './CanvasArea';
import { ModalTest } from '../../shared/components/ModalTest';
import { ModalManager } from '../../shared/components/ModalManager';

export const MainLayout: React.FC = () => {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    leftSidebarWidth,
    rightSidebarWidth,
    isMobile,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useResponsiveLayout();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <TopBar 
        onMenuToggle={toggleLeftSidebar}
        onRightMenuToggle={toggleRightSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={cn(
            "bg-card border-r border-border transition-all duration-300 ease-in-out",
            "flex flex-col z-10",
            leftSidebarOpen ? "w-0" : "w-0", // Will be overridden by inline style
            isMobile && !leftSidebarOpen && "absolute left-0 top-0 h-full z-10"
          )}
          style={{
            width: leftSidebarOpen ? leftSidebarWidth : 0,
            minWidth: leftSidebarOpen ? leftSidebarWidth : 0,
          }}
        >
          <LeftSidebar />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0 z-0">
          <CanvasArea />
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "bg-card border-l border-border transition-all duration-300 ease-in-out",
            "flex flex-col z-10",
            rightSidebarOpen ? "w-0" : "w-0", // Will be overridden by inline style
            isMobile && !rightSidebarOpen && "absolute right-0 top-0 h-full z-10"
          )}
          style={{
            width: rightSidebarOpen ? rightSidebarWidth : 0,
            minWidth: rightSidebarOpen ? rightSidebarWidth : 0,
          }}
        >
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && (leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            if (leftSidebarOpen) toggleLeftSidebar();
            if (rightSidebarOpen) toggleRightSidebar();
          }}
        />
      )}

      {/* Modal Test Component */}
      <ModalTest />
      
      {/* Unified Modal Manager */}
      <ModalManager />
    </div>
  );
};
