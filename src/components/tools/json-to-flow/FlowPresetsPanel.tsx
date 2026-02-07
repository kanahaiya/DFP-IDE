'use client';

import React from 'react';
import type { FlowPreset } from '@/lib/flow-viz/types';

interface FlowPresetsPanelProps {
  presets: FlowPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function FlowPresetsPanel({ presets, onApplyPreset }: FlowPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-magic"></i>
          Presets
        </h3>
      </div>

      <div className="settings-content">
        <div className="presets-list">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="preset-button"
              onClick={() => onApplyPreset(preset.id)}
              title={preset.description}
            >
              <span className="preset-name">
                <i className={`fas ${preset.icon}`}></i>
                {preset.name}
              </span>
              <span className="preset-description">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
