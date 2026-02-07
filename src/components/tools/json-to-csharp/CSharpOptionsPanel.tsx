'use client';

import React from 'react';
import type { CSharpGeneratorSettings } from '@/lib/csharp/types';

interface CSharpOptionsPanelProps {
  settings: CSharpGeneratorSettings;
  onSettingsChange: (settings: Partial<CSharpGeneratorSettings>) => void;
}

export function CSharpOptionsPanel({ settings, onSettingsChange }: CSharpOptionsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Nullable Options */}
      <div className="settings-group">
        <span className="settings-group-title">Nullable Options</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useNullableTypes}
              onChange={(e) => onSettingsChange({ useNullableTypes: e.target.checked })}
            />
            <span className="checkbox-option-label">Enable nullable reference types (C# 8+)</span>
          </label>
        </div>
      </div>

      {/* Property Options */}
      <div className="settings-group">
        <span className="settings-group-title">Property Options</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useInitOnlySetters}
              onChange={(e) => onSettingsChange({ useInitOnlySetters: e.target.checked })}
            />
            <span className="checkbox-option-label">Use init-only setters (C# 9+)</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useRequiredModifier}
              onChange={(e) => onSettingsChange({ useRequiredModifier: e.target.checked })}
            />
            <span className="checkbox-option-label">Use required modifier (C# 11+)</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.usePrimaryConstructor}
              onChange={(e) => onSettingsChange({ usePrimaryConstructor: e.target.checked })}
            />
            <span className="checkbox-option-label">Use primary constructors (C# 12+)</span>
          </label>
        </div>
      </div>

      {/* Class Options */}
      <div className="settings-group">
        <span className="settings-group-title">Class Options</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generatePartialClasses}
              onChange={(e) => onSettingsChange({ generatePartialClasses: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate partial classes</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.sealClasses}
              onChange={(e) => onSettingsChange({ sealClasses: e.target.checked })}
            />
            <span className="checkbox-option-label">Seal classes</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.fileScopedNamespace}
              onChange={(e) => onSettingsChange({ fileScopedNamespace: e.target.checked })}
            />
            <span className="checkbox-option-label">File-scoped namespace (C# 10+)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
