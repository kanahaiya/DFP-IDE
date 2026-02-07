'use client';

import React from 'react';
import type { RubyGeneratorSettings, RubyOutputMode } from '@/lib/ruby/types';

interface RubyOutputPanelProps {
  settings: RubyGeneratorSettings;
  updateSettings: (settings: Partial<RubyGeneratorSettings>) => void;
}

const OUTPUT_MODES: { value: RubyOutputMode; label: string; description: string }[] = [
  { value: 'hash', label: 'Hash', description: 'Ruby hash literal' },
  { value: 'struct', label: 'Struct', description: 'Struct.new with keyword_init' },
  { value: 'ostruct', label: 'OpenStruct', description: 'Dynamic attributes' },
  { value: 'class', label: 'Class', description: 'Full Ruby class' },
  { value: 'data', label: 'Data.define', description: 'Ruby 3.2+ immutable' },
];

export function RubyOutputPanel({ settings, updateSettings }: RubyOutputPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-cube"></i> Output Mode</h3>
        <div className="setting-group">
          {OUTPUT_MODES.map((mode) => (
            <label key={mode.value} className={`radio-card ${settings.outputMode === mode.value ? 'selected' : ''}`}>
              <input type="radio" name="outputMode" checked={settings.outputMode === mode.value} onChange={() => updateSettings({ outputMode: mode.value })} />
              <div className="radio-card-content">
                <span className="radio-card-label">{mode.label}</span>
                <span className="radio-card-description">{mode.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {(settings.outputMode === 'class' || settings.outputMode === 'struct' || settings.outputMode === 'data') && (
        <div className="settings-section">
          <h3 className="settings-section-title"><i className="fas fa-tag"></i> Naming</h3>
          <div className="setting-group">
            <label className="setting-label">Root Class Name</label>
            <input type="text" className="setting-input" value={settings.rootClassName} onChange={(e) => updateSettings({ rootClassName: e.target.value })} placeholder="Root" />
          </div>
        </div>
      )}

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-snowflake"></i> File Options</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.addFrozenStringLiteral} onChange={(e) => updateSettings({ addFrozenStringLiteral: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Add frozen_string_literal pragma</span>
          </label>
          <p className="setting-hint">Recommended for performance and safety</p>
        </div>
      </div>
    </div>
  );
}
