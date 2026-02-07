'use client';

import React from 'react';
import type { PythonGeneratorSettings } from '@/lib/python/types';

interface PythonNamingPanelProps {
  settings: PythonGeneratorSettings;
  onSettingsChange: (settings: Partial<PythonGeneratorSettings>) => void;
}

export function PythonNamingPanel({ settings, onSettingsChange }: PythonNamingPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Root Class Name */}
      <div className="settings-group">
        <label className="setting-label">Root Class Name</label>
        <input
          type="text"
          value={settings.className}
          onChange={(e) => onSettingsChange({ className: e.target.value })}
          className="setting-input"
          placeholder="MyModel"
        />
      </div>

      {/* Naming Options */}
      <div className="settings-group">
        <span className="settings-group-title">Naming Convention</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.convertToSnakeCase}
              onChange={(e) => onSettingsChange({ convertToSnakeCase: e.target.checked })}
            />
            <span className="checkbox-option-label">Use snake_case for field names</span>
          </label>
        </div>
      </div>

      {/* Type Hints */}
      <div className="settings-group">
        <span className="settings-group-title">Type Annotations</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.includeTypeHints}
              onChange={(e) => onSettingsChange({ includeTypeHints: e.target.checked })}
            />
            <span className="checkbox-option-label">Add type hints</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useOptionalForNullable}
              onChange={(e) => onSettingsChange({ useOptionalForNullable: e.target.checked })}
            />
            <span className="checkbox-option-label">Use Optional for nullable fields</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useUnionSyntax}
              onChange={(e) => onSettingsChange({ useUnionSyntax: e.target.checked })}
            />
            <span className="checkbox-option-label">Use | syntax (Python 3.10+)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
