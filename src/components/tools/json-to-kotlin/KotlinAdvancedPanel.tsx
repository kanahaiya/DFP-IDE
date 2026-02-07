'use client';

import React from 'react';
import type { KotlinGeneratorSettings } from '@/lib/kotlin/types';

interface KotlinAdvancedPanelProps {
  settings: KotlinGeneratorSettings;
  updateSettings: (updates: Partial<KotlinGeneratorSettings>) => void;
}

export function KotlinAdvancedPanel({ settings, updateSettings }: KotlinAdvancedPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Android Options</h3>

      {/* Parcelize */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="generateParcelize"
          checked={settings.generateParcelize}
          onChange={(e) => updateSettings({ generateParcelize: e.target.checked })}
        />
        <label htmlFor="generateParcelize">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>@Parcelize</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add Parcelable for Android</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Code Generation</h3>

      {/* Package Name */}
      <div className="settings-group">
        <label className="settings-label">Package Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.packageName}
          onChange={(e) => updateSettings({ packageName: e.target.value })}
          placeholder="com.example.app.models"
        />
        <span className="settings-hint">Package declaration (optional)</span>
      </div>

      {/* Add Imports */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addImports"
          checked={settings.addImports}
          onChange={(e) => updateSettings({ addImports: e.target.checked })}
        />
        <label htmlFor="addImports">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Add Imports</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Include necessary import statements</span>
          </div>
        </label>
      </div>

      {/* Add KDoc */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addKDoc"
          checked={settings.addKDoc}
          onChange={(e) => updateSettings({ addKDoc: e.target.checked })}
        />
        <label htmlFor="addKDoc">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Add KDoc</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Generate documentation comments</span>
          </div>
        </label>
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
    </div>
  );
}
