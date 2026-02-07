'use client';

import React from 'react';
import type { JavaScriptGeneratorSettings, VariableDeclaration, ExportFormat } from '@/lib/javascript/types';

interface JavaScriptOutputPanelProps {
  settings: JavaScriptGeneratorSettings;
  updateSettings: (updates: Partial<JavaScriptGeneratorSettings>) => void;
}

export function JavaScriptOutputPanel({ settings, updateSettings }: JavaScriptOutputPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Variable Declaration</h3>

      {/* Variable Declaration */}
      <div className="settings-group">
        <label className="settings-label">Declaration Type</label>
        <select
          className="settings-select"
          value={settings.variableDeclaration}
          onChange={(e) => updateSettings({ variableDeclaration: e.target.value as VariableDeclaration })}
        >
          <option value="const">const (recommended)</option>
          <option value="let">let</option>
          <option value="var">var (legacy)</option>
          <option value="none">None (object only)</option>
        </select>
        <span className="settings-hint">How to declare the variable</span>
      </div>

      {/* Variable Name */}
      {settings.variableDeclaration !== 'none' && (
        <div className="settings-group">
          <label className="settings-label">Variable Name</label>
          <input
            type="text"
            className="settings-input"
            value={settings.variableName}
            onChange={(e) => updateSettings({ variableName: e.target.value })}
            placeholder="data"
          />
          <span className="settings-hint">Name of the JavaScript variable</span>
        </div>
      )}

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Export Format</h3>

      {/* Export Format */}
      <div className="settings-group">
        <label className="settings-label">Module Export</label>
        <select
          className="settings-select"
          value={settings.exportFormat}
          onChange={(e) => updateSettings({ exportFormat: e.target.value as ExportFormat })}
        >
          <option value="none">None</option>
          <option value="es6-default">ES6 Default Export</option>
          <option value="es6-named">ES6 Named Export</option>
          <option value="commonjs">CommonJS (module.exports)</option>
          <option value="umd">UMD (Universal)</option>
        </select>
        <span className="settings-hint">JavaScript module format</span>
      </div>

      {/* Module Name (for UMD) */}
      {settings.exportFormat === 'umd' && (
        <div className="settings-group">
          <label className="settings-label">Module Name</label>
          <input
            type="text"
            className="settings-input"
            value={settings.moduleName}
            onChange={(e) => updateSettings({ moduleName: e.target.value })}
            placeholder="myModule"
          />
          <span className="settings-hint">Global variable name for UMD</span>
        </div>
      )}
    </div>
  );
}
