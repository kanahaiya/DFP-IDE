'use client';

import React from 'react';
import { SWIFT_PRESETS } from '@/lib/swift/presets';
import type { SwiftGeneratorSettings } from '@/lib/swift/types';

interface SwiftPresetsPanelProps {
  onPresetSelect: (settings: Partial<SwiftGeneratorSettings>) => void;
  activePreset?: string;
}

export function SwiftPresetsPanel({ onPresetSelect, activePreset }: SwiftPresetsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-md">
      <p className="setting-hint">Quick configurations for common Swift use cases</p>
      
      <div className="preset-list">
        {SWIFT_PRESETS.map((preset) => (
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

      {/* Use Case Guide */}
      <div className="info-box">
        <p className="info-box-content">
          <strong>When to Use Each Preset:</strong>
        </p>
        <ul className="preset-overview-list">
          <li><strong>Default:</strong> General purpose API models</li>
          <li><strong>SwiftUI:</strong> Observable state for views</li>
          <li><strong>API Client:</strong> Read-only response types</li>
          <li><strong>Data Model:</strong> Full-featured domain objects</li>
          <li><strong>Minimal:</strong> Plain types without serialization</li>
        </ul>
      </div>
    </div>
  );
}
