'use client';

import React from 'react';
import { SqlGeneratorSettings, OutputMode } from '@/lib/sql/types';

interface SqlOutputPanelProps {
  settings: SqlGeneratorSettings;
  onSettingsChange: (settings: Partial<SqlGeneratorSettings>) => void;
}

export function SqlOutputPanel({ settings, onSettingsChange }: SqlOutputPanelProps) {
  const outputModes: { value: OutputMode; label: string; description: string }[] = [
    { value: 'create-table', label: 'CREATE TABLE', description: 'Generate table definition only' },
    { value: 'insert', label: 'INSERT', description: 'Generate INSERT statements only' },
    { value: 'both', label: 'Both', description: 'Generate CREATE TABLE and INSERT statements' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Output Mode</label>
        <div className="settings-options">
          {outputModes.map((mode) => (
            <div
              key={mode.value}
              className={`settings-option ${settings.outputMode === mode.value ? 'active' : ''}`}
              onClick={() => onSettingsChange({ outputMode: mode.value })}
            >
              <div className="option-header">
                <span className="option-label">{mode.label}</span>
                <input
                  type="radio"
                  checked={settings.outputMode === mode.value}
                  onChange={() => onSettingsChange({ outputMode: mode.value })}
                />
              </div>
              <span className="option-description">{mode.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useUppercaseKeywords}
            onChange={(e) => onSettingsChange({ useUppercaseKeywords: e.target.checked })}
          />
          <span>Uppercase Keywords</span>
        </label>
        <p className="settings-hint">Use uppercase SQL keywords (CREATE, INSERT, etc.)</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.batchInserts}
            onChange={(e) => onSettingsChange({ batchInserts: e.target.checked })}
          />
          <span>Batch Inserts</span>
        </label>
        <p className="settings-hint">Group multiple rows in single INSERT statements</p>
      </div>
    </div>
  );
}
