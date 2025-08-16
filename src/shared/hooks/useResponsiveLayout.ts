import { useState, useEffect, useCallback } from 'react';
import { LayoutConfig, ResponsiveBreakpoints } from '../types/index';
import { storage } from '@utils/index';

const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  leftSidebar: { width: 260, minWidth: 200, collapsible: true },
  canvas: { flex: 1, minWidth: 400 },
  rightSidebar: { width: 320, minWidth: 250, collapsible: true },
};

const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

interface LayoutState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const STORAGE_KEY = 'canvas-layout-state';

export const useResponsiveLayout = () => {
  const [layoutState, setLayoutState] = useState<LayoutState>(() => {
    // Load saved state from localStorage
    const saved = storage.get<Partial<LayoutState>>(STORAGE_KEY);
    return {
      leftSidebarOpen: saved?.leftSidebarOpen ?? true,
      rightSidebarOpen: saved?.rightSidebarOpen ?? true,
      leftSidebarWidth: saved?.leftSidebarWidth ?? DEFAULT_LAYOUT_CONFIG.leftSidebar.width,
      rightSidebarWidth: saved?.rightSidebarWidth ?? DEFAULT_LAYOUT_CONFIG.rightSidebar.width,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  });

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < RESPONSIVE_BREAKPOINTS.mobile;
      const isTablet = width >= RESPONSIVE_BREAKPOINTS.mobile && width < RESPONSIVE_BREAKPOINTS.tablet;
      const isDesktop = width >= RESPONSIVE_BREAKPOINTS.desktop;

      setLayoutState(prev => ({
        ...prev,
        isMobile,
        isTablet,
        isDesktop,
        // Auto-close sidebars on mobile
        leftSidebarOpen: isMobile ? false : prev.leftSidebarOpen,
        rightSidebarOpen: isMobile ? false : prev.rightSidebarOpen,
      }));
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    storage.set(STORAGE_KEY, layoutState);
  }, [layoutState]);

  const toggleLeftSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      leftSidebarOpen: !prev.leftSidebarOpen,
    }));
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      rightSidebarOpen: !prev.rightSidebarOpen,
    }));
  }, []);

  const setLeftSidebarWidth = useCallback((width: number) => {
    setLayoutState(prev => ({
      ...prev,
      leftSidebarWidth: Math.max(DEFAULT_LAYOUT_CONFIG.leftSidebar.minWidth, width),
    }));
  }, []);

  const setRightSidebarWidth = useCallback((width: number) => {
    setLayoutState(prev => ({
      ...prev,
      rightSidebarWidth: Math.max(DEFAULT_LAYOUT_CONFIG.rightSidebar.minWidth, width),
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setLayoutState({
      leftSidebarOpen: true,
      rightSidebarOpen: true,
      leftSidebarWidth: DEFAULT_LAYOUT_CONFIG.leftSidebar.width,
      rightSidebarWidth: DEFAULT_LAYOUT_CONFIG.rightSidebar.width,
      isMobile: layoutState.isMobile,
      isTablet: layoutState.isTablet,
      isDesktop: layoutState.isDesktop,
    });
  }, [layoutState.isMobile, layoutState.isTablet, layoutState.isDesktop]);

  return {
    ...layoutState,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    resetLayout,
    config: DEFAULT_LAYOUT_CONFIG,
    breakpoints: RESPONSIVE_BREAKPOINTS,
  };
};
