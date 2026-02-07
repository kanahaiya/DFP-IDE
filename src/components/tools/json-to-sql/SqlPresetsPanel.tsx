'use client';

import React from 'react';
import { SQL_PRESETS } from '@/lib/sql/presets';
import { SqlGeneratorSettings } from '@/lib/sql/types';

interface SqlPresetsPanelProps {
  onPresetSelect: (settings: Partial<SqlGeneratorSettings>) => void;
}

export function SqlPresetsPanel({ onPresetSelect }: SqlPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Quick Presets</label>
        <p className="settings-hint">Select a preset to apply common configurations</p>
        <div className="presets-grid">
          {SQL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="preset-button"
              onClick={() => onPresetSelect(preset.settings)}
              title={preset.description}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
