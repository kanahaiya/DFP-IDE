'use client';

import React from 'react';
import { SqlGeneratorSettings, SqlDialect } from '@/lib/sql/types';

interface SqlDialectPanelProps {
  settings: SqlGeneratorSettings;
  onSettingsChange: (settings: Partial<SqlGeneratorSettings>) => void;
}

export function SqlDialectPanel({ settings, onSettingsChange }: SqlDialectPanelProps) {
  const dialects: { value: SqlDialect; label: string; description: string }[] = [
    { value: 'postgresql', label: 'PostgreSQL', description: 'Advanced open-source database' },
    { value: 'mysql', label: 'MySQL', description: 'Popular relational database' },
    { value: 'sqlite', label: 'SQLite', description: 'Lightweight embedded database' },
    { value: 'sqlserver', label: 'SQL Server', description: 'Microsoft SQL Server' },
    { value: 'oracle', label: 'Oracle', description: 'Oracle Database' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">SQL Dialect</label>
        <div className="settings-options">
          {dialects.map((dialect) => (
            <div
              key={dialect.value}
              className={`settings-option ${settings.dialect === dialect.value ? 'active' : ''}`}
              onClick={() => onSettingsChange({ dialect: dialect.value })}
            >
              <div className="option-header">
                <span className="option-label">{dialect.label}</span>
                <input
                  type="radio"
                  checked={settings.dialect === dialect.value}
                  onChange={() => onSettingsChange({ dialect: dialect.value })}
                />
              </div>
              <span className="option-description">{dialect.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Table Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.tableName}
          onChange={(e) => onSettingsChange({ tableName: e.target.value })}
          placeholder="my_table"
        />
      </div>
    </div>
  );
}
