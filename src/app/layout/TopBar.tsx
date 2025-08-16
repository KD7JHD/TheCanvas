import React, { useState } from 'react';
import { cn } from '../../shared/utils/index';
import { Menu, PanelRightClose, Sun, Moon, Monitor, Zap } from 'lucide-react';
import { BrandLogo } from '../../shared/components/BrandLogo';
import { WebhookTest } from '../../shared/components/WebhookTest';

interface TopBarProps {
  onMenuToggle?: () => void;
  onRightMenuToggle?: () => void;
  isMobile?: boolean;
  showBranding?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuToggle,
  onRightMenuToggle,
  isMobile = false,
  showBranding = true,
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('system');
  const [showWebhookTest, setShowWebhookTest] = useState(false);

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    if (nextTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(nextTheme);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <>
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Toggle left sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {showBranding && <BrandLogo />}
      </div>

      {/* Center Section - Breadcrumb */}
      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">TheCanvas</span>
          <span>/</span>
          <span>Infinite Playground</span>
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Webhook Test Button */}
        <button
          onClick={() => setShowWebhookTest(!showWebhookTest)}
          className={cn(
            "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200",
            showWebhookTest && "bg-accent text-accent-foreground"
          )}
          aria-label="Toggle webhook test"
        >
          <Zap className="h-4 w-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors duration-200"
          )}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
        >
          {getThemeIcon()}
        </button>

        {/* Right Sidebar Toggle (Mobile) */}
        {isMobile && (
          <button
            onClick={onRightMenuToggle}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            aria-label="Toggle right sidebar"
          >
            <PanelRightClose className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>

    {/* Webhook Test Overlay */}
    {showWebhookTest && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold">Webhook Test</h2>
            <button
              onClick={() => setShowWebhookTest(false)}
              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              ✕
            </button>
          </div>
          <WebhookTest />
        </div>
      </div>
    )}
  </>
  );
};
