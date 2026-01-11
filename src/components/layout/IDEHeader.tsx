'use client';

import { useTheme } from '@/hooks/useTheme';
import { useLayout } from '@/hooks/useLayout';

interface IDEHeaderProps {
  toolName: string;
  onSidebarToggle: () => void;
  onHelpClick?: () => void;
}

export function IDEHeader({ toolName, onSidebarToggle, onHelpClick }: IDEHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { layout, toggleLayout } = useLayout();

  return (
    <header className="ide-header">
      <div className="ide-header-left">
        <button
          className="btn btn-secondary icon-only-btn"
          id="sidebarToggle"
          title="Toggle Settings (Alt+S)"
          onClick={onSidebarToggle}
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="ide-header-title">
          <i className="fas fa-project-diagram"></i>
          <span>
            {toolName} <span className="ide-pill">IDE</span>
          </span>
        </h1>
      </div>
      <div className="ide-header-right" style={{ marginLeft: 'auto' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleLayout}
          title={`Switch to ${layout === 'horizontal' ? 'Vertical' : 'Horizontal'} Layout`}
        >
          <i className={`fas fa-columns layout-icon ${layout === 'vertical' ? 'rotated' : ''}`}></i>
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <button 
          className="btn btn-secondary btn-sm" 
          id="helpBtn" 
          title="Documentation"
          onClick={onHelpClick}
        >
          <i className="fas fa-question-circle"></i> Help
        </button>
      </div>
    </header>
  );
}
