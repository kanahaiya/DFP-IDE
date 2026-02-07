'use client';

import React from 'react';
import type { ProtobufPreset } from '@/lib/protobuf/types';

interface ProtobufPresetsPanelProps {
  presets: ProtobufPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function ProtobufPresetsPanel({
  presets,
  onApplyPreset,
}: ProtobufPresetsPanelProps) {
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
