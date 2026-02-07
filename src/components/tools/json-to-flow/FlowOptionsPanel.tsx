'use client';

import React from 'react';
import type { FlowSettings, LayoutAlgorithm, ThemeColor } from '@/lib/flow-viz/types';

interface FlowOptionsPanelProps {
  settings: FlowSettings;
  onUpdateSettings: (settings: Partial<FlowSettings>) => void;
  onReset: () => void;
}

export function FlowOptionsPanel({
  settings,
  onUpdateSettings,
  onReset,
}: FlowOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-cog"></i>
          Options
        </h3>
        <button className="btn btn-ghost btn-sm" onClick={onReset} title="Reset to defaults">
          <i className="fas fa-undo"></i>
        </button>
      </div>

      <div className="settings-content">
        {/* Layout */}
        <div className="setting-group">
          <label className="setting-label">Layout</label>
          <select
            className="setting-select"
            value={settings.layout}
            onChange={(e) => onUpdateSettings({ layout: e.target.value as LayoutAlgorithm })}
          >
            <option value="tree">Tree (Top-Down)</option>
            <option value="horizontal">Horizontal (Left-Right)</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {/* Theme */}
        <div className="setting-group">
          <label className="setting-label">Theme</label>
          <select
            className="setting-select"
            value={settings.theme}
            onChange={(e) => onUpdateSettings({ theme: e.target.value as ThemeColor })}
          >
            <option value="default">Default</option>
            <option value="colorful">Colorful</option>
            <option value="monochrome">Monochrome</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Max Depth */}
        <div className="setting-group">
          <label className="setting-label">Max Depth: {settings.maxDepth}</label>
          <input
            type="range"
            min={1}
            max={20}
            value={settings.maxDepth}
            onChange={(e) => onUpdateSettings({ maxDepth: parseInt(e.target.value) })}
            className="setting-range"
          />
        </div>

        {/* Show Types */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showTypes}
              onChange={(e) => onUpdateSettings({ showTypes: e.target.checked })}
            />
            <span>Show data types</span>
          </label>
        </div>

        {/* Show Values */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showValues}
              onChange={(e) => onUpdateSettings({ showValues: e.target.checked })}
            />
            <span>Show values</span>
          </label>
        </div>

        {/* Show Path */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showPath}
              onChange={(e) => onUpdateSettings({ showPath: e.target.checked })}
            />
            <span>Show JSON path</span>
          </label>
        </div>

        {/* Animate Edges */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.animateEdges}
              onChange={(e) => onUpdateSettings({ animateEdges: e.target.checked })}
            />
            <span>Animate edges</span>
          </label>
        </div>

        {/* Collapsed by Default */}
        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.collapsedByDefault}
              onChange={(e) => onUpdateSettings({ collapsedByDefault: e.target.checked })}
            />
            <span>Collapsed by default</span>
          </label>
        </div>
      </div>
    </div>
  );
}
