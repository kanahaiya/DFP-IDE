'use client';

import React from 'react';
import { JAVA_PRESETS } from '@/lib/java/presets';
import type { JavaGeneratorSettings } from '@/lib/java/types';

interface JavaPresetsPanelProps {
  onPresetSelect: (settings: Partial<JavaGeneratorSettings>) => void;
}

export function JavaPresetsPanel({ onPresetSelect }: JavaPresetsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-md">
      <p className="setting-hint">Select a preset to quickly configure all settings:</p>
      <div className="preset-list">
        {JAVA_PRESETS.map((preset) => (
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
