'use client';

import React from 'react';
import { PYTHON_PRESETS } from '@/lib/python/presets';
import type { PythonGeneratorSettings } from '@/lib/python/types';

interface PythonPresetsPanelProps {
  onPresetSelect: (settings: Partial<PythonGeneratorSettings>) => void;
}

export function PythonPresetsPanel({ onPresetSelect }: PythonPresetsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-md">
      <p className="setting-hint">Select a preset to quickly configure all settings:</p>
      <div className="preset-list">
        {PYTHON_PRESETS.map((preset) => (
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
