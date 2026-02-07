'use client';

import React from 'react';
import { DART_PRESETS } from '@/lib/dart/presets';
import type { DartGeneratorSettings } from '@/lib/dart/types';

interface DartPresetsPanelProps {
  onPresetSelect: (settings: Partial<DartGeneratorSettings>) => void;
  activePreset?: string;
}

export function DartPresetsPanel({ onPresetSelect, activePreset }: DartPresetsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-md">
      <p className="setting-hint">Quick configurations for common Flutter patterns</p>
      
      <div className="preset-list">
        {DART_PRESETS.map((preset) => (
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

      {/* Package Requirements */}
      <div className="info-box">
        <p className="info-box-content">
          <strong>Package Requirements:</strong>
        </p>
        <ul className="preset-overview-list">
          <li><strong>Plain/Flutter:</strong> No packages needed</li>
          <li><strong>Freezed:</strong> freezed_annotation, build_runner</li>
          <li><strong>JSON Serializable:</strong> json_annotation, json_serializable</li>
        </ul>
      </div>
    </div>
  );
}
