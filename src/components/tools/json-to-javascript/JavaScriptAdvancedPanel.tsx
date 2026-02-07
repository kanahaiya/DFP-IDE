'use client';

import React from 'react';
import type { JavaScriptGeneratorSettings } from '@/lib/javascript/types';
import type { NamingConvention } from '@/lib/code-gen/types';

interface JavaScriptAdvancedPanelProps {
  settings: JavaScriptGeneratorSettings;
  updateSettings: (updates: Partial<JavaScriptGeneratorSettings>) => void;
}

export function JavaScriptAdvancedPanel({ settings, updateSettings }: JavaScriptAdvancedPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Property Names</h3>

      {/* Property Naming */}
      <div className="settings-group">
        <label className="settings-label">Property Naming</label>
        <select
          className="settings-select"
          value={settings.propertyNaming}
          onChange={(e) => updateSettings({ propertyNaming: e.target.value as NamingConvention })}
        >
          <option value="preserve">Preserve Original</option>
          <option value="camelCase">camelCase</option>
          <option value="PascalCase">PascalCase</option>
          <option value="snake_case">snake_case</option>
        </select>
        <span className="settings-hint">Transform property name casing</span>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Extra Options</h3>

      {/* Add Comments */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addComments"
          checked={settings.addComments}
          onChange={(e) => updateSettings({ addComments: e.target.checked })}
        />
        <label htmlFor="addComments">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Add Comments</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Include JSDoc-style comments above the code</span>
          </div>
        </label>
      </div>

      {/* Freeze Object */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="freezeObject"
          checked={settings.freezeObject}
          onChange={(e) => updateSettings({ freezeObject: e.target.checked })}
        />
        <label htmlFor="freezeObject">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Object.freeze()</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Make the object immutable</span>
          </div>
        </label>
      </div>

      {/* Use Shorthand Syntax */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useShorthandSyntax"
          checked={settings.useShorthandSyntax}
          onChange={(e) => updateSettings({ useShorthandSyntax: e.target.checked })}
        />
        <label htmlFor="useShorthandSyntax">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Shorthand Syntax</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Use ES6 shorthand where applicable</span>
          </div>
        </label>
      </div>
    </div>
  );
}
