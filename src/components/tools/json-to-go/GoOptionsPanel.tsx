'use client';

import React from 'react';
import type { GoGeneratorSettings } from '@/lib/go/types';

interface GoOptionsPanelProps {
  settings: GoGeneratorSettings;
  onSettingsChange: (settings: Partial<GoGeneratorSettings>) => void;
}

export function GoOptionsPanel({ settings, onSettingsChange }: GoOptionsPanelProps) {
  return (
    <div className="settings-panel-content">
      {/* Type Options */}
      <div className="settings-group">
        <h4 className="settings-group-title">Type Options</h4>

        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label>Pointer for Nullable</label>
            <span className="setting-hint">Use *Type for nullable fields</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.usePointerForNullable}
            onClick={() => onSettingsChange({ usePointerForNullable: !settings.usePointerForNullable })}
            className={`toggle-switch ${settings.usePointerForNullable ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label>Prefer int64</label>
            <span className="setting-hint">Use int64 instead of int for integers</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.preferInt64}
            onClick={() => onSettingsChange({ preferInt64: !settings.preferInt64 })}
            className={`toggle-switch ${settings.preferInt64 ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label>Use float32</label>
            <span className="setting-hint">Use float32 instead of float64</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.useFloat32}
            onClick={() => onSettingsChange({ useFloat32: !settings.useFloat32 })}
            className={`toggle-switch ${settings.useFloat32 ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* Formatting Options */}
      <div className="settings-group">
        <h4 className="settings-group-title">Formatting</h4>

        <div className="setting-group">
          <label>Indentation</label>
          <select
            value={settings.indentation === 'tab' ? 'tab' : settings.indentation}
            onChange={(e) => {
              const value = e.target.value;
              onSettingsChange({
                indentation: value === 'tab' ? 'tab' : parseInt(value, 10)
              });
            }}
          >
            <option value="tab">Tab (Go standard)</option>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
          </select>
        </div>

        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label>Inline Nested Structs</label>
            <span className="setting-hint">Define nested structs inside parent</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.inlineNestedStructs}
            onClick={() => onSettingsChange({ inlineNestedStructs: !settings.inlineNestedStructs })}
            className={`toggle-switch ${settings.inlineNestedStructs ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>
    </div>
  );
}
