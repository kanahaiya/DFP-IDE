'use client';

import React from 'react';
import type { TypeScriptGeneratorSettings, ArrayNotation, NullHandling } from '@/lib/typescript/types';

interface TypeScriptTypePanelProps {
  settings: TypeScriptGeneratorSettings;
  updateSettings: (updates: Partial<TypeScriptGeneratorSettings>) => void;
}

export function TypeScriptTypePanel({ settings, updateSettings }: TypeScriptTypePanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Array Types</h3>

      {/* Array Notation */}
      <div className="settings-group">
        <label className="settings-label">Array Notation</label>
        <select
          className="settings-select"
          value={settings.arrayNotation}
          onChange={(e) => updateSettings({ arrayNotation: e.target.value as ArrayNotation })}
        >
          <option value="brackets">T[] (Brackets)</option>
          <option value="generic">Array&lt;T&gt; (Generic)</option>
        </select>
        <span className="settings-hint">Style for array type annotations</span>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Null Handling</h3>

      {/* Null Handling Strategy */}
      <div className="settings-group">
        <label className="settings-label">Null Strategy</label>
        <select
          className="settings-select"
          value={settings.nullHandling}
          onChange={(e) => updateSettings({ nullHandling: e.target.value as NullHandling })}
        >
          <option value="nullable">Nullable (| null)</option>
          <option value="optional">Optional (?)</option>
          <option value="undefined">Undefined (| undefined)</option>
          <option value="null-or-undefined">Both (| null | undefined)</option>
        </select>
        <span className="settings-hint">How to handle null values in JSON</span>
      </div>

      {/* Strict Null Checks */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useStrictNullChecks"
          checked={settings.useStrictNullChecks}
          onChange={(e) => updateSettings({ useStrictNullChecks: e.target.checked })}
        />
        <label htmlFor="useStrictNullChecks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Strict Null Checks</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Generate null-safe types</span>
          </div>
        </label>
      </div>

      {/* Unknown vs Any */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useUnknownInsteadOfAny"
          checked={settings.useUnknownInsteadOfAny}
          onChange={(e) => updateSettings({ useUnknownInsteadOfAny: e.target.checked })}
        />
        <label htmlFor="useUnknownInsteadOfAny">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Use unknown Instead of any</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Prefer type-safe unknown type</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Property Options</h3>

      {/* Optional Properties */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useOptionalProperties"
          checked={settings.useOptionalProperties}
          onChange={(e) => updateSettings({ useOptionalProperties: e.target.checked })}
        />
        <label htmlFor="useOptionalProperties">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Detect Optional Properties</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Mark null values as optional (?)</span>
          </div>
        </label>
      </div>

      {/* Mark All Optional */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="markAllOptional"
          checked={settings.markAllOptional}
          onChange={(e) => updateSettings({ markAllOptional: e.target.checked })}
        />
        <label htmlFor="markAllOptional">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Mark All Optional</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Make every property optional</span>
          </div>
        </label>
      </div>

      {/* Readonly */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useReadonly"
          checked={settings.useReadonly}
          onChange={(e) => updateSettings({ useReadonly: e.target.checked })}
        />
        <label htmlFor="useReadonly">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Readonly Properties</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add readonly modifier to all properties</span>
          </div>
        </label>
      </div>
    </div>
  );
}
