'use client';

interface Tab {
  id: string;
  title: string;
  icon: string;
  closeable?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

export function TabBar({ tabs, activeTabId, onTabChange, onTabClose }: TabBarProps) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${activeTabId === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange?.(tab.id)}
        >
          <i className={tab.icon}></i>
          <span>{tab.title}</span>
          {tab.closeable !== false && (
            <i
              className="fas fa-times close-tab"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose?.(tab.id);
              }}
            ></i>
          )}
        </div>
      ))}
    </div>
  );
}
