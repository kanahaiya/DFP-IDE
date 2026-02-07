'use client';

import React from 'react';
import { MINIFIER_PRESETS, type MinifierMode } from '@/lib/minifier/types';

interface MinifierPresetsPanelProps {
  onApplyPreset: (presetId: string) => void;
  currentMode: MinifierMode;
}

export function MinifierPresetsPanel({
  onApplyPreset,
  currentMode,
}: MinifierPresetsPanelProps) {
  // Group presets by mode
  const minifyPresets = MINIFIER_PRESETS.filter(p => p.settings.mode === 'minify');
  const beautifyPresets = MINIFIER_PRESETS.filter(p => p.settings.mode === 'beautify');

  return (
    <div className="panel-section">
      <h4 className="section-title">
        <i className="fas fa-magic"></i>
        Quick Presets
      </h4>
      
      <p className="section-description">
        One-click presets for common use cases. 
        Click a preset to apply its settings instantly.
      </p>

      <h5 className="preset-group-title">
        <i className="fas fa-compress-arrows-alt"></i>
        Minify Presets
      </h5>
      
      <div className="presets-grid">
        {minifyPresets.map(preset => (
          <button
            key={preset.id}
            className={`preset-btn ${currentMode === 'minify' ? 'current-mode' : ''}`}
            onClick={() => onApplyPreset(preset.id)}
          >
            <i className={preset.icon}></i>
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </div>
          </button>
        ))}
      </div>

      <h5 className="preset-group-title" style={{ marginTop: '1.5rem' }}>
        <i className="fas fa-expand"></i>
        Beautify Presets
      </h5>
      
      <div className="presets-grid">
        {beautifyPresets.map(preset => (
          <button
            key={preset.id}
            className={`preset-btn ${currentMode === 'beautify' ? 'current-mode' : ''}`}
            onClick={() => onApplyPreset(preset.id)}
          >
            <i className={preset.icon}></i>
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .panel-section {
          padding: 1rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .section-title i {
          color: var(--primary);
          width: 16px;
        }
        
        .section-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          line-height: 1.4;
        }
        
        .preset-group-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .preset-group-title i {
          width: 14px;
        }
        
        .presets-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .preset-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .preset-btn:hover {
          border-color: var(--primary);
          background: var(--card);
        }
        
        .preset-btn.current-mode {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }
        
        .preset-btn i {
          font-size: 1rem;
          color: var(--primary);
          width: 24px;
          text-align: center;
        }
        
        .preset-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        
        .preset-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
        }
        
        .preset-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
