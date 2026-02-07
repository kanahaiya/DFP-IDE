'use client';

import React from 'react';
import { GO_PRESETS } from '@/lib/go/presets';
import type { GoGeneratorSettings } from '@/lib/go/types';

interface GoPresetsPanelProps {
  onPresetSelect: (settings: Partial<GoGeneratorSettings>) => void;
  activePreset?: string;
}

export function GoPresetsPanel({ onPresetSelect, activePreset }: GoPresetsPanelProps) {
  return (
    <div className="settings-panel-content">
      <p className="setting-hint" style={{ marginBottom: '0.75rem' }}>
        Quick configurations for common use cases
      </p>
      
      <div className="preset-list">
        {GO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset.settings)}
            className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
          >
            <div className="preset-btn-header">
              <span className="preset-btn-name">{preset.name}</span>
              {activePreset === preset.id && (
                <span className="preset-btn-check">
                  <i className="fas fa-check" />
                </span>
              )}
            </div>
            <p className="preset-btn-desc">{preset.description}</p>
          </button>
        ))}
      </div>

      {/* Preset Details */}
      <div className="code-preview" style={{ marginTop: '1rem' }}>
        <p className="code-preview-label">Preset Overview</p>
        <ul className="preset-overview-list">
          <li><strong>Default:</strong> Standard JSON tags</li>
          <li><strong>API Response:</strong> With omitempty and pointers</li>
          <li><strong>MongoDB:</strong> JSON + BSON tags</li>
          <li><strong>Config:</strong> JSON + YAML tags</li>
          <li><strong>XML API:</strong> JSON + XML tags</li>
          <li><strong>Minimal:</strong> No tags</li>
        </ul>
      </div>
    </div>
  );
}
