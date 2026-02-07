'use client';

import React from 'react';
import { CRYSTAL_PRESETS } from '@/lib/crystal/presets';
import { CrystalGeneratorSettings } from '@/lib/crystal/types';

interface CrystalPresetsPanelProps {
  onPresetSelect: (settings: Partial<CrystalGeneratorSettings>) => void;
}

export function CrystalPresetsPanel({ onPresetSelect }: CrystalPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Quick Presets</label>
        <p className="settings-hint">Select a preset to apply common configurations</p>
        <div className="presets-grid">
          {CRYSTAL_PRESETS.map((preset) => (
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
