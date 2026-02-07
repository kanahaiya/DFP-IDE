'use client';

import React from 'react';
import type { ElmGeneratorSettings, ElmOutputMode } from '@/lib/elm/types';

interface ElmOutputPanelProps {
  settings: ElmGeneratorSettings;
  updateSettings: (settings: Partial<ElmGeneratorSettings>) => void;
}

const OUTPUT_MODES: { value: ElmOutputMode; label: string; description: string }[] = [
  { value: 'types-only', label: 'Types Only', description: 'Just type aliases' },
  { value: 'with-decoders', label: 'With Decoders', description: 'Types + Json.Decode' },
  { value: 'with-encoders', label: 'With Encoders', description: 'Types + Json.Encode' },
  { value: 'full', label: 'Full', description: 'Types, decoders, encoders' },
];

export function ElmOutputPanel({ settings, updateSettings }: ElmOutputPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-shapes"></i> Output Mode</h3>
        <div className="setting-group">
          {OUTPUT_MODES.map((mode) => (
            <label key={mode.value} className={`radio-card ${settings.outputMode === mode.value ? 'selected' : ''}`}>
              <input type="radio" name="outputMode" checked={settings.outputMode === mode.value} onChange={() => updateSettings({ outputMode: mode.value })} />
              <div className="radio-card-content">
                <span className="radio-card-label">{mode.label}</span>
                <span className="radio-card-description">{mode.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-cog"></i> Generation Options</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateTypeAliases} onChange={(e) => updateSettings({ generateTypeAliases: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate type aliases</span>
          </label>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.addComments} onChange={(e) => updateSettings({ addComments: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Add documentation comments</span>
          </label>
        </div>
      </div>
    </div>
  );
}
