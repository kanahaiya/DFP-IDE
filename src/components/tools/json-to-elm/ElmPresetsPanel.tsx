'use client';

import React from 'react';
import type { ElmPreset } from '@/lib/elm/presets';

interface ElmPresetsPanelProps {
  presets: ElmPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function ElmPresetsPanel({ presets, onApplyPreset }: ElmPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-magic"></i> Quick Presets</h3>
        <p className="setting-hint">Apply preconfigured settings for common use cases</p>
        <div className="presets-grid">
          {presets.map((preset) => (
            <button key={preset.id} className="preset-card" onClick={() => onApplyPreset(preset.id)}>
              <div className="preset-icon"><i className={`fas ${preset.icon}`}></i></div>
              <div className="preset-content">
                <span className="preset-name">{preset.name}</span>
                <span className="preset-description">{preset.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
