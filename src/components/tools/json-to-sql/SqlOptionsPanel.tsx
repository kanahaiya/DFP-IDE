'use client';

import React from 'react';
import { SqlGeneratorSettings } from '@/lib/sql/types';

interface SqlOptionsPanelProps {
  settings: SqlGeneratorSettings;
  onSettingsChange: (settings: Partial<SqlGeneratorSettings>) => void;
}

export function SqlOptionsPanel({ settings, onSettingsChange }: SqlOptionsPanelProps) {
  const columnNamingOptions = [
    { value: 'snake_case', label: 'snake_case' },
    { value: 'camelCase', label: 'camelCase' },
    { value: 'original', label: 'Preserve original' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Column Naming</label>
        <select
          className="settings-select"
          value={settings.columnNaming}
          onChange={(e) => onSettingsChange({ columnNaming: e.target.value as SqlGeneratorSettings['columnNaming'] })}
        >
          {columnNamingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.addPrimaryKey}
            onChange={(e) => onSettingsChange({ addPrimaryKey: e.target.checked })}
          />
          <span>Add Primary Key</span>
        </label>
        <p className="settings-hint">Auto-detect or add id column as primary key</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.useNullable}
            onChange={(e) => onSettingsChange({ useNullable: e.target.checked })}
          />
          <span>Use Nullable</span>
        </label>
        <p className="settings-hint">Allow NULL for columns without required values</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.addTimestamps}
            onChange={(e) => onSettingsChange({ addTimestamps: e.target.checked })}
          />
          <span>Add Timestamps</span>
        </label>
        <p className="settings-hint">Add created_at and updated_at columns</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.inferTypes}
            onChange={(e) => onSettingsChange({ inferTypes: e.target.checked })}
          />
          <span>Infer Types</span>
        </label>
        <p className="settings-hint">Automatically detect column types from data</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">Default String Length</label>
        <input
          type="number"
          className="settings-input"
          value={settings.defaultStringLength}
          onChange={(e) => onSettingsChange({ defaultStringLength: parseInt(e.target.value) || 255 })}
          min={1}
          max={4000}
        />
        <p className="settings-hint">Default length for VARCHAR columns</p>
      </div>
    </div>
  );
}
