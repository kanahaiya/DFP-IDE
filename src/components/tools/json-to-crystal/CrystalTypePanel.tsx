'use client';

import React from 'react';
import { CrystalGeneratorSettings, OutputType } from '@/lib/crystal/types';

interface CrystalTypePanelProps {
  settings: CrystalGeneratorSettings;
  onSettingsChange: (settings: Partial<CrystalGeneratorSettings>) => void;
}

export function CrystalTypePanel({ settings, onSettingsChange }: CrystalTypePanelProps) {
  const outputTypes: { value: OutputType; label: string; description: string }[] = [
    { value: 'struct', label: 'Struct', description: 'Immutable value type (recommended)' },
    { value: 'class', label: 'Class', description: 'Reference type with inheritance' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Output Type</label>
        <div className="settings-options">
          {outputTypes.map((type) => (
            <div
              key={type.value}
              className={`settings-option ${settings.outputType === type.value ? 'active' : ''}`}
              onClick={() => onSettingsChange({ outputType: type.value })}
            >
              <div className="option-header">
                <span className="option-label">{type.label}</span>
                <input
                  type="radio"
                  checked={settings.outputType === type.value}
                  onChange={() => onSettingsChange({ outputType: type.value })}
                />
              </div>
              <span className="option-description">{type.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Root Type Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.rootClassName}
          onChange={(e) => onSettingsChange({ rootClassName: e.target.value })}
          placeholder="Root"
        />
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useNilableTypes}
            onChange={(e) => onSettingsChange({ useNilableTypes: e.target.checked })}
          />
          <span>Use Nilable Types</span>
        </label>
        <p className="settings-hint">Use Type? for nullable fields</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useStrictTypes}
            onChange={(e) => onSettingsChange({ useStrictTypes: e.target.checked })}
          />
          <span>Use Strict Types</span>
        </label>
        <p className="settings-hint">Use strict type checking</p>
      </div>
    </div>
  );
}
