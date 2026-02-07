'use client';

import React from 'react';
import type { KotlinGeneratorSettings, KotlinSerializationLibrary } from '@/lib/kotlin/types';

interface KotlinSerializationPanelProps {
  settings: KotlinGeneratorSettings;
  updateSettings: (updates: Partial<KotlinGeneratorSettings>) => void;
}

export function KotlinSerializationPanel({ settings, updateSettings }: KotlinSerializationPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Serialization Library</h3>

      {/* Serialization Library */}
      <div className="settings-group">
        <label className="settings-label">Library</label>
        <select
          className="settings-select"
          value={settings.serializationLibrary}
          onChange={(e) => updateSettings({ serializationLibrary: e.target.value as KotlinSerializationLibrary })}
        >
          <option value="none">None</option>
          <option value="kotlinx">Kotlinx Serialization</option>
          <option value="gson">Gson</option>
          <option value="moshi">Moshi</option>
          <option value="jackson">Jackson</option>
        </select>
        <span className="settings-hint">JSON serialization library for annotations</span>
      </div>

      {/* Serial Names */}
      {settings.serializationLibrary !== 'none' && (
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="addSerialNames"
            checked={settings.addSerialNames}
            onChange={(e) => updateSettings({ addSerialNames: e.target.checked })}
          />
          <label htmlFor="addSerialNames">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Add Serial Names</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Add annotations when names differ</span>
            </div>
          </label>
        </div>
      )}

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Naming</h3>

      {/* Root Class Name */}
      <div className="settings-group">
        <label className="settings-label">Root Class Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.rootClassName}
          onChange={(e) => updateSettings({ rootClassName: e.target.value })}
          placeholder="Root"
        />
        <span className="settings-hint">Name for the main data class</span>
      </div>

      {/* Class Naming */}
      <div className="settings-group">
        <label className="settings-label">Class Names</label>
        <select
          className="settings-select"
          value={settings.classNaming}
          onChange={(e) => updateSettings({ classNaming: e.target.value as 'PascalCase' | 'camelCase' | 'snake_case' })}
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
    </div>
  );
}
