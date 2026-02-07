'use client';

import React from 'react';
import type { SwiftGeneratorSettings } from '@/lib/swift/types';

interface SwiftOptionsPanelProps {
  settings: SwiftGeneratorSettings;
  onSettingsChange: (settings: Partial<SwiftGeneratorSettings>) => void;
}

export function SwiftOptionsPanel({ settings, onSettingsChange }: SwiftOptionsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Property Options */}
      <div className="settings-group">
        <span className="settings-group-title">Property Options</span>

        {/* var vs let */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Use var</label>
            <p className="setting-hint">Use var instead of let (mutable)</p>
          </div>
          <button
            onClick={() => onSettingsChange({ useVar: !settings.useVar })}
            className={`toggle-switch ${settings.useVar ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Optional marking */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Mark Optional Types</label>
            <p className="setting-hint">Use Type? for nullable fields</p>
          </div>
          <button
            onClick={() => onSettingsChange({ markOptional: !settings.markOptional })}
            className={`toggle-switch ${settings.markOptional ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* @Published */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Add @Published</label>
            <p className="setting-hint">SwiftUI property wrapper</p>
          </div>
          <button
            onClick={() => onSettingsChange({ addPublished: !settings.addPublished })}
            className={`toggle-switch ${settings.addPublished ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* Code Generation */}
      <div className="settings-group">
        <span className="settings-group-title">Code Generation</span>

        {/* Generate init */}
        <div className="setting-toggle">
          <div className="setting-toggle-info">
            <label className="setting-label">Generate init()</label>
            <p className="setting-hint">Include initializer method</p>
          </div>
          <button
            onClick={() => onSettingsChange({ generateInit: !settings.generateInit })}
            className={`toggle-switch ${settings.generateInit ? 'active' : ''}`}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {/* Indentation */}
        <div>
          <label className="setting-label">Indentation</label>
          <select
            value={settings.indentation === 'tab' ? 'tab' : settings.indentation}
            onChange={(e) => {
              const value = e.target.value;
              onSettingsChange({
                indentation: value === 'tab' ? 'tab' : parseInt(value, 10)
              });
            }}
            className="setting-select"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces (Swift standard)</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>
    </div>
  );
}
