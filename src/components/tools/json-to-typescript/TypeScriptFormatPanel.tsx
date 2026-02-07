'use client';

import React from 'react';
import type { TypeScriptGeneratorSettings } from '@/lib/typescript/types';

interface TypeScriptFormatPanelProps {
  settings: TypeScriptGeneratorSettings;
  updateSettings: (updates: Partial<TypeScriptGeneratorSettings>) => void;
}

export function TypeScriptFormatPanel({ settings, updateSettings }: TypeScriptFormatPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Output Format</h3>

      {/* Output Type */}
      <div className="settings-group">
        <label className="settings-label">Output Type</label>
        <select
          className="settings-select"
          value={settings.outputFormat}
          onChange={(e) => updateSettings({ outputFormat: e.target.value as 'interface' | 'type' | 'both' })}
        >
          <option value="interface">Interfaces</option>
          <option value="type">Type Aliases</option>
          <option value="both">Both</option>
        </select>
        <span className="settings-hint">Choose between interfaces and type aliases</span>
      </div>

      {/* Root Type Name */}
      <div className="settings-group">
        <label className="settings-label">Root Type Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.rootTypeName}
          onChange={(e) => updateSettings({ rootTypeName: e.target.value })}
          placeholder="Root"
        />
        <span className="settings-hint">Name for the root interface/type</span>
      </div>

      {/* Export Types */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="exportTypes"
          checked={settings.exportTypes}
          onChange={(e) => updateSettings({ exportTypes: e.target.checked })}
        />
        <label htmlFor="exportTypes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Export Types</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add export keyword to types</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Naming Conventions</h3>

      {/* Type Naming */}
      <div className="settings-group">
        <label className="settings-label">Type Names</label>
        <select
          className="settings-select"
          value={settings.typeNaming}
          onChange={(e) => updateSettings({ typeNaming: e.target.value as 'PascalCase' | 'camelCase' | 'snake_case' })}
        >
          <option value="PascalCase">PascalCase</option>
          <option value="camelCase">camelCase</option>
          <option value="snake_case">snake_case</option>
        </select>
      </div>

      {/* Property Naming */}
      <div className="settings-group">
        <label className="settings-label">Property Names</label>
        <select
          className="settings-select"
          value={settings.propertyNaming}
          onChange={(e) => updateSettings({ propertyNaming: e.target.value as 'camelCase' | 'PascalCase' | 'snake_case' | 'preserve' })}
        >
          <option value="camelCase">camelCase</option>
          <option value="PascalCase">PascalCase</option>
          <option value="snake_case">snake_case</option>
          <option value="preserve">Preserve Original</option>
        </select>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Formatting</h3>

      {/* Indentation */}
      <div className="settings-group">
        <label className="settings-label">Indentation</label>
        <select
          className="settings-select"
          value={settings.useSpaces ? settings.indentSize : 'tab'}
          onChange={(e) => {
            if (e.target.value === 'tab') {
              updateSettings({ useSpaces: false });
            } else {
              updateSettings({ useSpaces: true, indentSize: Number(e.target.value) });
            }
          }}
        >
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tabs</option>
        </select>
      </div>

      {/* Sort Properties */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="sortProperties"
          checked={settings.sortProperties}
          onChange={(e) => updateSettings({ sortProperties: e.target.checked })}
        />
        <label htmlFor="sortProperties">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Sort Properties</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Alphabetically sort properties</span>
          </div>
        </label>
      </div>

      {/* Trailing Comma */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addTrailingComma"
          checked={settings.addTrailingComma}
          onChange={(e) => updateSettings({ addTrailingComma: e.target.checked })}
        />
        <label htmlFor="addTrailingComma">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Trailing Semicolons</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add semicolons after properties</span>
          </div>
        </label>
      </div>
    </div>
  );
}
