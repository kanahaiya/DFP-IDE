'use client';

import React from 'react';
import type { CSharpGeneratorSettings } from '@/lib/csharp/types';

interface CSharpNamingPanelProps {
  settings: CSharpGeneratorSettings;
  onSettingsChange: (settings: Partial<CSharpGeneratorSettings>) => void;
}

export function CSharpNamingPanel({ settings, onSettingsChange }: CSharpNamingPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Root Class Name */}
      <div className="settings-group">
        <label className="setting-label">Root Class Name</label>
        <input
          type="text"
          value={settings.rootClassName}
          onChange={(e) => onSettingsChange({ rootClassName: e.target.value })}
          className="setting-input"
          placeholder="Root"
        />
      </div>

      {/* Namespace */}
      <div className="settings-group">
        <label className="setting-label">Namespace</label>
        <input
          type="text"
          value={settings.namespace}
          onChange={(e) => onSettingsChange({ namespace: e.target.value })}
          className="setting-input"
          placeholder="MyNamespace"
        />
      </div>

      {/* Output Type */}
      <div className="settings-group">
        <label className="setting-label">Output Type</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="outputType"
              checked={!settings.useRecords}
              onChange={() => onSettingsChange({ useRecords: false })}
            />
            <div className="radio-option-content">
              <span className="radio-option-label">Class</span>
              <p className="radio-option-desc">Reference type with properties</p>
            </div>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="outputType"
              checked={settings.useRecords}
              onChange={() => onSettingsChange({ useRecords: true })}
            />
            <div className="radio-option-content">
              <span className="radio-option-label">Record</span>
              <p className="radio-option-desc">Immutable reference type (C# 9+)</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
