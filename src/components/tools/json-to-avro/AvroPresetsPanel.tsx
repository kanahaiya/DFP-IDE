'use client';

import React from 'react';
import type { AvroPreset } from '@/lib/avro/types';

interface AvroPresetsPanelProps {
  presets: AvroPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function AvroPresetsPanel({
  presets,
  onApplyPreset,
}: AvroPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-magic"></i>
          Presets
        </h3>
      </div>

      <div className="settings-content">
        <div className="presets-grid">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="preset-button"
              onClick={() => onApplyPreset(preset.id)}
              title={preset.description}
            >
              <i className={`fas ${preset.icon}`}></i>
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
