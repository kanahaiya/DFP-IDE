'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { IDEHeader } from './IDEHeader';
import { ActivityBar, type ActivityView } from './ActivityBar';
import { ToolboxSidebar } from './ToolboxSidebar';
import { WorkspaceSettingsModal } from '@/components/common/WorkspaceSettingsModal';

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
  
  // Initialize with null to avoid hydration mismatch (server doesn't have localStorage)
  const [activeView, setActiveView] = useState<ActivityView>(null);
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false);

  // Load activeView from localStorage after mount (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('ide-active-view');
    if (saved) {
      setActiveView(saved as ActivityView);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Persist activeView to localStorage when it changes (only after initial mount)
  useEffect(() => {
    if (!hasMounted) return;
    
    if (activeView === null) {
      localStorage.removeItem('ide-active-view');
    } else {
      localStorage.setItem('ide-active-view', activeView);
    }
  }, [activeView, hasMounted]);

  const handleSidebarToggle = () => {
    setIsSettingsSidebarOpen(!isSettingsSidebarOpen);
  };

  return (
    <div className="ide-layout">
      <IDEHeader toolName={toolName} onSidebarToggle={handleSidebarToggle} onHelpClick={onHelpClick} />
      
      <main id="main-content">
        <div className="ide-container">
          <ActivityBar
            activeView={activeView}
            onViewChange={setActiveView}
            onWorkspaceSettingsClick={() => setIsWorkspaceSettingsOpen(true)}
          />
          
          <ToolboxSidebar isOpen={activeView === 'explorer'} />
          
          <div className="ide-main">
            {children}
          </div>
          
          {settingsSidebar && (
            <aside className={`ide-sidebar ${!isSettingsSidebarOpen ? 'collapsed' : ''}`} id="appSidebar">
              {settingsSidebar}
            </aside>
          )}
        </div>
      </main>

      <WorkspaceSettingsModal
        isOpen={isWorkspaceSettingsOpen}
        onClose={() => setIsWorkspaceSettingsOpen(false)}
      />
    </div>
  );
}
