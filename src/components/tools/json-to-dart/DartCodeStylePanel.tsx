'use client';

import React from 'react';
import type { DartGeneratorSettings, DartCodeStyle } from '@/lib/dart/types';

interface DartCodeStylePanelProps {
  settings: DartGeneratorSettings;
  onSettingsChange: (settings: Partial<DartGeneratorSettings>) => void;
}

export function DartCodeStylePanel({ settings, onSettingsChange }: DartCodeStylePanelProps) {
  const codeStyles: { value: DartCodeStyle; label: string; description: string }[] = [
    { value: 'plain', label: 'Plain Dart', description: 'Standard classes with manual serialization' },
    { value: 'freezed', label: 'Freezed', description: 'Immutable with freezed_annotation' },
    { value: 'jsonSerializable', label: 'JSON Serializable', description: 'With json_annotation' },
  ];

  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Code Style */}
      <div className="settings-group">
        <label className="setting-label">Code Style</label>
        <div className="radio-group">
          {codeStyles.map((style) => (
            <label key={style.value} className="radio-option">
              <input
                type="radio"
                name="codeStyle"
                value={style.value}
                checked={settings.codeStyle === style.value}
                onChange={() => onSettingsChange({ codeStyle: style.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{style.label}</span>
                <p className="radio-option-desc">{style.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Property Style */}
      <div className="settings-group">
        <span className="settings-group-title">Property Options</span>

        {/* Final Properties */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Final Properties</label>
            <p className="setting-hint">Use final keyword (immutable)</p>
          </div>
          <button
            onClick={() => onSettingsChange({ useFinal: !settings.useFinal })}
            className={`toggle-switch ${settings.useFinal ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Required Parameters */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Required Parameters</label>
            <p className="setting-hint">Add required keyword for non-null</p>
          </div>
          <button
            onClick={() => onSettingsChange({ useRequired: !settings.useRequired })}
            className={`toggle-switch ${settings.useRequired ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* Info Box */}
      {settings.codeStyle !== 'plain' && (
        <div className="info-box warning">
          <p className="info-box-content">
            <strong>Note:</strong> {settings.codeStyle === 'freezed' ? 'Freezed' : 'JSON Serializable'} requires running:
            <br />
            <code>flutter pub run build_runner build</code>
          </p>
        </div>
      )}
    </div>
  );
}
