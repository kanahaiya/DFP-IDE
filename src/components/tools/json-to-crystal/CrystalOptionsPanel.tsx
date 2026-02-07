'use client';

import React from 'react';
import { CrystalGeneratorSettings } from '@/lib/crystal/types';

interface CrystalOptionsPanelProps {
  settings: CrystalGeneratorSettings;
  onSettingsChange: (settings: Partial<CrystalGeneratorSettings>) => void;
}

export function CrystalOptionsPanel({ settings, onSettingsChange }: CrystalOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useJsonSerializable}
            onChange={(e) => onSettingsChange({ useJsonSerializable: e.target.checked })}
          />
          <span>Include JSON::Serializable</span>
        </label>
        <p className="settings-hint">Add JSON::Serializable module include</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateInitializer}
            onChange={(e) => onSettingsChange({ generateInitializer: e.target.checked })}
          />
          <span>Generate Initializer</span>
        </label>
        <p className="settings-hint">Create initialize method with all properties</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateFromJson}
            onChange={(e) => onSettingsChange({ generateFromJson: e.target.checked })}
          />
          <span>Generate from_json Method</span>
        </label>
        <p className="settings-hint">Add class method to parse from JSON string</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateToJson}
            onChange={(e) => onSettingsChange({ generateToJson: e.target.checked })}
          />
          <span>Generate to_json Method</span>
        </label>
        <p className="settings-hint">Add method to convert to JSON string</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">Indent Size</label>
        <input
          type="number"
          className="settings-input"
          value={settings.indentSize}
          onChange={(e) => onSettingsChange({ indentSize: parseInt(e.target.value) || 2 })}
          min={1}
          max={8}
        />
        <p className="settings-hint">Number of spaces for indentation</p>
      </div>
    </div>
  );
}
