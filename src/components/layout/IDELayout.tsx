'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { IDEHeader } from './IDEHeader';
import { ActivityBar, type ActivityView } from './ActivityBar';
import { ToolboxSidebar } from './ToolboxSidebar';

interface IDELayoutProps {
  toolName: string;
  children: ReactNode;
  settingsSidebar?: ReactNode;
  onHelpClick?: () => void;
}

/**
 * Main IDE layout component with VS Code-style interface
 * Includes activity bar, toolbox sidebar, settings sidebar, and main editor area
 */
export function IDELayout({ toolName, children, settingsSidebar, onHelpClick }: IDELayoutProps) {
  const { theme } = useTheme();
  
  const [activeView, setActiveView] = useState<ActivityView>('explorer');
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSidebarToggle = () => {
    setIsSettingsSidebarOpen(!isSettingsSidebarOpen);
  };

  return (
    <div className="ide-layout">
      <IDEHeader toolName={toolName} onSidebarToggle={handleSidebarToggle} onHelpClick={onHelpClick} />
      
      <main id="main-content">
        <div className="ide-container">
          <ActivityBar activeView={activeView} onViewChange={setActiveView} />
          
          <ToolboxSidebar isOpen={activeView === 'explorer'} />
          
          {settingsSidebar && (
            <aside className={`ide-sidebar ${!isSettingsSidebarOpen ? 'collapsed' : ''}`} id="appSidebar">
              {settingsSidebar}
            </aside>
          )}
          
          <div className="ide-main">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
