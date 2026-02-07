'use client';

import React from 'react';
import type { DartGeneratorSettings } from '@/lib/dart/types';

interface DartNamingPanelProps {
  settings: DartGeneratorSettings;
  onSettingsChange: (settings: Partial<DartGeneratorSettings>) => void;
}

export function DartNamingPanel({ settings, onSettingsChange }: DartNamingPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Root Class Name */}
      <div className="settings-group">
        <label className="setting-label">Root Class Name</label>
        <input
          type="text"
          value={settings.rootClassName}
          onChange={(e) => onSettingsChange({ rootClassName: e.target.value || 'Root' })}
          placeholder="Root"
          className="setting-input"
        />
        <p className="setting-hint">Name for the root class (use PascalCase)</p>
      </div>

      {/* Indentation */}
      <div className="settings-group">
        <label className="setting-label">Indentation</label>
        <select
          value={settings.indentation === 'tab' ? 'tab' : settings.indentation}
          onChange={(e) => {
            const value = e.target.value;
            onSettingsChange({
              indentation: value === 'tab' ? 'tab' : parseInt(value, 10)
            });
          }}
          className="setting-select"
        >
          <option value="2">2 spaces (Dart standard)</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>

      {/* Add Comments */}
      <div className="setting-toggle">
        <div className="setting-toggle-info">
          <label className="setting-label">Add Comments</label>
          <p className="setting-hint">Include doc comments for classes</p>
        </div>
        <button
          onClick={() => onSettingsChange({ addComments: !settings.addComments })}
          className={`toggle-switch ${settings.addComments ? 'active' : ''}`}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {/* Preview */}
      <div className="code-preview">
        <p className="code-preview-label">Class Preview:</p>
        <code className="code-preview-content">
{`class ${settings.rootClassName} {
  ${settings.useFinal ? 'final ' : ''}String name;
  
  ${settings.rootClassName}({
    ${settings.useRequired ? 'required ' : ''}this.name,
  });
}`}
        </code>
      </div>
    </div>
  );
}
