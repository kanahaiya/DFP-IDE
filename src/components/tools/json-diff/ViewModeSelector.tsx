'use client';

import React from 'react';
import { useJSONDiffStore, ViewMode } from '@/store/jsonDiff';
import { trackViewModeChange } from '@/lib/analytics';

export function ViewModeSelector() {
  const { settings, updateSettings } = useJSONDiffStore();
  
  const viewModes: Array<{ id: ViewMode; name: string; icon: string; description: string }> = [
    {
      id: 'split',
      name: 'Split View',
      icon: 'fas fa-columns',
      description: 'Side-by-side comparison with synchronized scrolling',
    },
    {
      id: 'unified',
      name: 'Unified View',
      icon: 'fas fa-align-left',
      description: 'Single view with unified diff format',
    },
    {
      id: 'tree',
      name: 'Tree View',
      icon: 'fas fa-sitemap',
      description: 'Hierarchical tree structure of changes',
    },
    {
      id: 'report',
      name: 'Report View',
      icon: 'fas fa-file-alt',
      description: 'Detailed change report with statistics',
    },
  ];
  
  const handleViewModeChange = (mode: ViewMode) => {
    updateSettings({ viewMode: mode });
    trackViewModeChange(mode);
  };
  
  return (
    <div className="view-mode-selector">
      {viewModes.map((mode) => (
        <button
          key={mode.id}
          className={`view-mode-btn ${settings.viewMode === mode.id ? 'active' : ''}`}
          onClick={() => handleViewModeChange(mode.id)}
          title={mode.description}
          aria-label={`Switch to ${mode.name}`}
          aria-pressed={settings.viewMode === mode.id}
        >
          <i className={mode.icon}></i>
          <span>{mode.name}</span>
        </button>
      ))}
    </div>
  );
}
