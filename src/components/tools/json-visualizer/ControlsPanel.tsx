'use client';

import React from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';
import { VISUALIZER_PRESETS } from '@/lib/json-visualizer';
import type { LayoutType } from '@/lib/json-visualizer';

export function ControlsPanel() {
  const {
    graph,
    settings,
    setMode,
    setLayout,
    setTreeOrientation,
    updateSettings,
    applyPreset,
    expandAll,
    collapseAllNodes,
    expandToLevel,
  } = useJsonVisualizerStore();

  const maxDepth = graph?.stats.maxDepth || 5;

  return (
    <div className="controls-panel">
      {/* Mode Toggle */}
      <div className="control-section">
        <h4 className="section-title">Visualization Mode</h4>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${settings.mode === '2d' ? 'active' : ''}`}
            onClick={() => setMode('2d')}
          >
            <i className="fas fa-square" />
            <span>2D</span>
          </button>
          <button
            className={`mode-btn ${settings.mode === '3d' ? 'active' : ''}`}
            onClick={() => setMode('3d')}
          >
            <i className="fas fa-cube" />
            <span>3D</span>
          </button>
        </div>
      </div>

      {/* Layout Selection */}
      <div className="control-section">
        <h4 className="section-title">Layout</h4>
        <div className="layout-grid">
          {(['tree', 'force', 'radial', 'treemap'] as LayoutType[]).map((layout) => {
            const isDisabled = layout === 'treemap' && settings.mode === '3d';
            return (
              <button
                key={layout}
                className={`layout-btn ${settings.layout === layout ? 'active' : ''}`}
                onClick={() => setLayout(layout)}
                disabled={isDisabled}
                title={isDisabled ? 'Treemap is only available in 2D mode' : ''}
              >
                <i className={`fas ${getLayoutIcon(layout)}`} />
                <span>{layout.charAt(0).toUpperCase() + layout.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tree Orientation (only for tree layout in 2D) */}
      {settings.layout === 'tree' && settings.mode === '2d' && (
        <div className="control-section">
          <h4 className="section-title">Orientation</h4>
          <div className="orientation-toggle">
            <button
              className={`orient-btn ${settings.treeOrientation === 'horizontal' ? 'active' : ''}`}
              onClick={() => setTreeOrientation('horizontal')}
            >
              <i className="fas fa-arrows-alt-h" />
              <span>Horizontal</span>
            </button>
            <button
              className={`orient-btn ${settings.treeOrientation === 'vertical' ? 'active' : ''}`}
              onClick={() => setTreeOrientation('vertical')}
            >
              <i className="fas fa-arrows-alt-v" />
              <span>Vertical</span>
            </button>
          </div>
        </div>
      )}

      {/* Expansion Controls */}
      <div className="control-section">
        <h4 className="section-title">Expansion</h4>
        <div className="expansion-controls">
          <button className="action-btn" onClick={expandAll}>
            <i className="fas fa-expand-arrows-alt" />
            Expand All
          </button>
          <button className="action-btn" onClick={collapseAllNodes}>
            <i className="fas fa-compress-arrows-alt" />
            Collapse All
          </button>
        </div>
        <div className="depth-slider">
          <label>Expand to depth: {settings.defaultExpandDepth}</label>
          <input
            type="range"
            min="1"
            max={Math.max(maxDepth, 5)}
            value={settings.defaultExpandDepth}
            onChange={(e) => {
              const depth = parseInt(e.target.value, 10);
              updateSettings({ defaultExpandDepth: depth });
              expandToLevel(depth);
            }}
          />
        </div>
      </div>

      {/* Display Options */}
      <div className="control-section">
        <h4 className="section-title">Display</h4>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={settings.showTypes}
              onChange={(e) => updateSettings({ showTypes: e.target.checked })}
            />
            <span>Show Types</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={settings.showValues}
              onChange={(e) => updateSettings({ showValues: e.target.checked })}
            />
            <span>Show Values</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={settings.colorByType}
              onChange={(e) => updateSettings({ colorByType: e.target.checked })}
            />
            <span>Color by Type</span>
          </label>
        </div>
      </div>

      {/* 3D-specific Options */}
      {settings.mode === '3d' && (
        <div className="control-section">
          <h4 className="section-title">3D Options</h4>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.autoRotate}
                onChange={(e) => updateSettings({ autoRotate: e.target.checked })}
              />
              <span>Auto Rotate</span>
            </label>
          </div>
          {settings.autoRotate && (
            <div className="depth-slider">
              <label>Rotation Speed: {settings.rotationSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.rotationSpeed}
                onChange={(e) => updateSettings({ rotationSpeed: parseFloat(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}

      {/* Presets */}
      <div className="control-section">
        <h4 className="section-title">Presets</h4>
        <div className="presets-list">
          {VISUALIZER_PRESETS.filter(
            (p) => p.settings.mode === settings.mode || !p.settings.mode
          ).map((preset) => (
            <button
              key={preset.id}
              className="preset-btn"
              onClick={() => applyPreset(preset.id)}
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .controls-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 12px;
          overflow-y: auto;
        }

        .control-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .mode-toggle,
        .orientation-toggle {
          display: flex;
          gap: 4px;
        }

        .mode-btn,
        .orient-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover,
        .orient-btn:hover {
          background: var(--hover);
          color: var(--text);
        }

        .mode-btn.active,
        .orient-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .mode-btn i,
        .orient-btn i {
          font-size: 16px;
        }

        .mode-btn span,
        .orient-btn span {
          font-size: 11px;
          font-weight: 500;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }

        .layout-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .layout-btn:hover:not(:disabled) {
          background: var(--hover);
          color: var(--text);
        }

        .layout-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .layout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .layout-btn i {
          font-size: 14px;
        }

        .layout-btn span {
          font-size: 10px;
          font-weight: 500;
        }

        .expansion-controls {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: var(--hover);
          color: var(--text);
        }

        .depth-slider {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .depth-slider label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .depth-slider input[type="range"] {
          width: 100%;
          accent-color: var(--primary);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .checkbox-item input {
          accent-color: var(--primary);
        }

        .presets-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .preset-btn {
          padding: 6px 10px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          background: var(--hover);
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

function getLayoutIcon(layout: LayoutType): string {
  switch (layout) {
    case 'tree':
      return 'fa-sitemap';
    case 'force':
      return 'fa-atom';
    case 'radial':
      return 'fa-sun';
    case 'treemap':
      return 'fa-th-large';
    default:
      return 'fa-project-diagram';
  }
}
