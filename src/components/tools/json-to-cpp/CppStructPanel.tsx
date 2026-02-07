'use client';

import React from 'react';
import type { CppGeneratorSettings, CppOutputMode } from '@/lib/cpp/types';

interface CppStructPanelProps {
  settings: CppGeneratorSettings;
  updateSettings: (settings: Partial<CppGeneratorSettings>) => void;
}

const OUTPUT_MODES: { value: CppOutputMode; label: string; description: string }[] = [
  { value: 'struct', label: 'Struct', description: 'Public members' },
  { value: 'class', label: 'Class', description: 'Private members' },
  { value: 'header-only', label: 'Header Only', description: 'Single .hpp file' },
  { value: 'header-source', label: 'Header + Source', description: 'Separate .hpp/.cpp' },
];

export function CppStructPanel({ settings, updateSettings }: CppStructPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-cube"></i> Output Mode</h3>
        <div className="form-row">
          <label htmlFor="cpp-output-mode">Mode</label>
          <select
            id="cpp-output-mode"
            className="select-input"
            value={settings.outputMode}
            onChange={(e) => updateSettings({ outputMode: e.target.value as CppOutputMode })}
          >
            {OUTPUT_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label} - {mode.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-tag"></i> Naming</h3>
        <div className="form-row">
          <label htmlFor="cpp-root-class">Root Class Name</label>
          <input
            id="cpp-root-class"
            type="text"
            value={settings.rootClassName}
            onChange={(e) => updateSettings({ rootClassName: e.target.value })}
            placeholder="Root"
          />
        </div>
        <div className="form-row">
          <label htmlFor="cpp-namespace">Namespace</label>
          <input
            id="cpp-namespace"
            type="text"
            value={settings.namespacePrefix}
            onChange={(e) => updateSettings({ namespacePrefix: e.target.value })}
            placeholder="(optional)"
          />
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Structure Options</h3>

        <div className="checkbox-row">
          <input
            id="cpp-constructors"
            type="checkbox"
            checked={settings.generateConstructors}
            onChange={(e) => updateSettings({ generateConstructors: e.target.checked })}
          />
          <label htmlFor="cpp-constructors">Generate default constructor</label>
        </div>

        <div className="checkbox-row">
          <input
            id="cpp-getters-setters"
            type="checkbox"
            checked={settings.generateGettersSetters}
            onChange={(e) => updateSettings({ generateGettersSetters: e.target.checked })}
            disabled={settings.outputMode !== 'class'}
          />
          <label htmlFor="cpp-getters-setters">Generate getters/setters</label>
        </div>
        {settings.outputMode !== 'class' && (
          <span className="form-hint">Requires class output mode</span>
        )}

        <div className="checkbox-row">
          <input
            id="cpp-comments"
            type="checkbox"
            checked={settings.generateComments}
            onChange={(e) => updateSettings({ generateComments: e.target.checked })}
          />
          <label htmlFor="cpp-comments">Generate documentation comments</label>
        </div>
      </div>
    </div>
  );
}
