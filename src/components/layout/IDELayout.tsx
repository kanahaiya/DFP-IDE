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

  // Always start with the same default on both server and client to avoid hydration mismatch
  const [activeView, setActiveView] = useState<ActivityView>('explorer');
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false);

  // Set mounted flag and load from localStorage after initial render
  useEffect(() => {
    setHasMounted(true);
    
    // Load activeView from localStorage after mount
    const savedView = localStorage.getItem('ide-active-view');
    if (savedView === 'explorer' || savedView === 'search') {
      setActiveView(savedView as ActivityView);
    } else if (savedView === 'null' || savedView === '') {
      setActiveView(null);
    }
    
    // Load settings sidebar state from localStorage after mount
    const savedSidebar = localStorage.getItem('ide-settings-sidebar-open');
    if (savedSidebar !== null) {
      setIsSettingsSidebarOpen(savedSidebar === 'true');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Persist activeView to localStorage when it changes (only after initial mount)
  // Always save the state so it persists across tool switches
  useEffect(() => {
    if (!hasMounted) return;
    
    // Save the current state (including null if user explicitly closed it)
    if (activeView === null) {
      localStorage.setItem('ide-active-view', 'null');
    } else {
      localStorage.setItem('ide-active-view', activeView);
    }
  }, [activeView, hasMounted]);

  // Persist settings sidebar state
  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem('ide-settings-sidebar-open', String(isSettingsSidebarOpen));
  }, [isSettingsSidebarOpen, hasMounted]);

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
