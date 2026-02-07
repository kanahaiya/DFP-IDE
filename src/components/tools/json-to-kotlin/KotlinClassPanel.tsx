'use client';

import React from 'react';
import type { KotlinGeneratorSettings } from '@/lib/kotlin/types';

interface KotlinClassPanelProps {
  settings: KotlinGeneratorSettings;
  updateSettings: (updates: Partial<KotlinGeneratorSettings>) => void;
}

export function KotlinClassPanel({ settings, updateSettings }: KotlinClassPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Data Class Options</h3>

      {/* Use Data Class */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useDataClass"
          checked={settings.useDataClass}
          onChange={(e) => updateSettings({ useDataClass: e.target.checked })}
        />
        <label htmlFor="useDataClass">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Use Data Class</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Generate data class (recommended)</span>
          </div>
        </label>
      </div>

      {/* Val Properties */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="useValProperties"
          checked={settings.useValProperties}
          onChange={(e) => updateSettings({ useValProperties: e.target.checked })}
        />
        <label htmlFor="useValProperties">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Use val (Immutable)</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Use val instead of var for properties</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Nullable Support</h3>

      {/* Make Properties Nullable */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="makePropertiesNullable"
          checked={settings.makePropertiesNullable}
          onChange={(e) => updateSettings({ makePropertiesNullable: e.target.checked })}
        />
        <label htmlFor="makePropertiesNullable">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Make All Nullable</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Mark all properties as nullable (?)</span>
          </div>
        </label>
      </div>

      {/* Add Default Values */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="addDefaultValues"
          checked={settings.addDefaultValues}
          onChange={(e) => updateSettings({ addDefaultValues: e.target.checked })}
        />
        <label htmlFor="addDefaultValues">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Add Default Values</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add default values for properties</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Additional</h3>

      {/* Companion Object */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="generateCompanionObject"
          checked={settings.generateCompanionObject}
          onChange={(e) => updateSettings({ generateCompanionObject: e.target.checked })}
        />
        <label htmlFor="generateCompanionObject">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Companion Object</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Generate companion object placeholder</span>
          </div>
        </label>
      </div>
    </div>
  );
}
