'use client';

import React from 'react';
import { CSHARP_PRESETS } from '@/lib/csharp/presets';
import type { CSharpGeneratorSettings } from '@/lib/csharp/types';

interface CSharpPresetsPanelProps {
  onPresetSelect: (settings: Partial<CSharpGeneratorSettings>) => void;
}

export function CSharpPresetsPanel({ onPresetSelect }: CSharpPresetsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-md">
      <p className="setting-hint">Select a preset to quickly configure all settings:</p>
      <div className="preset-list">
        {CSHARP_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset.settings)}
            className="preset-btn"
          >
            <div className="preset-btn-header">
              <span className="preset-btn-name">{preset.name}</span>
            </div>
            <p className="preset-btn-desc">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
