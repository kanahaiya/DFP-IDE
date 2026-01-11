'use client';

import { useState, useRef, useEffect } from 'react';
import type { Tab } from '@/hooks/useTabs';

interface TabManagerProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabRename: (tabId: string, newName: string) => void;
  onAddTab: () => void;
  onDuplicateTab: (tabId: string) => void;
  onCloseOtherTabs: (tabId: string) => void;
  onCloseAllTabs: () => void;
  canAddTab: boolean;
  maxTabs: number;
}

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  tabId: string | null;
}

export default function TabManager({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabRename,
  onAddTab,
  onDuplicateTab,
  onCloseOtherTabs,
  onCloseAllTabs,
  canAddTab,
  maxTabs,
}: TabManagerProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    tabId: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu({ show: false, x: 0, y: 0, tabId: null });
      }
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

  const handleDoubleClick = (tab: Tab) => {
    setEditingTabId(tab.id);
    setEditingName(tab.name);
  };

  const handleRename = (tabId: string) => {
    if (editingName.trim()) {
      onTabRename(tabId, editingName.trim());
    }
    setEditingTabId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      handleRename(tabId);
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
      setEditingName('');
    }
  };

  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      tabId,
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu.tabId) return;

    switch (action) {
      case 'new':
        onAddTab();
        break;
      case 'duplicate':
        onDuplicateTab(contextMenu.tabId);
        break;
      case 'close':
        onTabClose(contextMenu.tabId);
        break;
      case 'closeOthers':
        onCloseOtherTabs(contextMenu.tabId);
        break;
      case 'closeAll':
        onCloseAllTabs();
        break;
    }

    setContextMenu({ show: false, x: 0, y: 0, tabId: null });
  };

  return (
    <div className="tab-manager">
      <div className="tabs-container">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => onTabClick(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          >
            {editingTabId === tab.id ? (
              <input
                ref={inputRef}
                type="text"
                className="tab-name-input"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRename(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                maxLength={50}
              />
            ) : (
              <>
                <span className="tab-name" title={tab.name}>
                  {tab.name}
                </span>
                <button
                  className="tab-close"
                  onClick={(e) => handleClose(e, tab.id)}
                  title="Close tab"
                  aria-label="Close tab"
                >
                  <i className="fas fa-times"></i>
                </button>
              </>
            )}
          </div>
        ))}
        
        <button
          className="tab-add"
          onClick={onAddTab}
          disabled={!canAddTab}
          title={canAddTab ? 'New tab' : `Maximum ${maxTabs} tabs`}
          aria-label="Add new tab"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="tab-context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => handleContextMenuAction('new')}>
            <i className="fas fa-plus"></i>
            <span>New Request</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextMenuAction('duplicate')}>
            <i className="fas fa-copy"></i>
            <span>Duplicate Tab</span>
          </div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-item" onClick={() => handleContextMenuAction('close')}>
            <i className="fas fa-times"></i>
            <span>Close Tab</span>
          </div>
          <div className="context-menu-item" onClick={() => handleContextMenuAction('closeOthers')}>
            <i className="fas fa-times-circle"></i>
            <span>Close Other Tabs</span>
          </div>
          <div className="context-menu-item danger" onClick={() => handleContextMenuAction('closeAll')}>
            <i className="fas fa-ban"></i>
            <span>Close All Tabs</span>
          </div>
        </div>
      )}
    </div>
  );
}
