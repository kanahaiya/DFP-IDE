'use client';

export type ActivityView = 'explorer' | 'search' | null;

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
  onWorkspaceSettingsClick?: () => void;
}

export function ActivityBar({ activeView, onViewChange, onWorkspaceSettingsClick }: ActivityBarProps) {
  const handleItemClick = (view: ActivityView) => {
    // Toggle: if clicking the same view, close it
    onViewChange(activeView === view ? null : view);
  };

  return (
    <aside className="activity-bar">
      <div
        className={`activity-item ${activeView === 'explorer' ? 'active' : ''}`}
        onClick={() => handleItemClick('explorer')}
        title="Tools Explorer"
      >
        <i className="fas fa-boxes"></i>
      </div>
      <div
        className={`activity-item ${activeView === 'search' ? 'active' : ''}`}
        onClick={() => handleItemClick('search')}
        title="Search Tools"
      >
        <i className="fas fa-search"></i>
      </div>
      <div style={{ marginTop: 'auto' }}></div>
      <div
        className="activity-item"
        title="Workspace / IDE Settings"
        role="button"
        tabIndex={0}
        onClick={onWorkspaceSettingsClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onWorkspaceSettingsClick?.();
          }
        }}
      >
        <i className="fas fa-cog"></i>
      </div>
    </aside>
  );
}
