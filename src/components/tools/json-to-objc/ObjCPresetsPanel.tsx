'use client';

import React from 'react';
import { OBJC_PRESETS } from '@/lib/objc/presets';
import { ObjCGeneratorSettings } from '@/lib/objc/types';

interface ObjCPresetsPanelProps {
  onPresetSelect: (settings: Partial<ObjCGeneratorSettings>) => void;
}

export function ObjCPresetsPanel({ onPresetSelect }: ObjCPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Quick Presets</label>
        <p className="settings-hint">Select a preset to apply common configurations</p>
        <div className="presets-grid">
          {OBJC_PRESETS.map((preset) => (
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
