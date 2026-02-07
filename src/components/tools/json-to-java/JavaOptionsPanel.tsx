'use client';

import React from 'react';
import type { JavaGeneratorSettings } from '@/lib/java/types';

interface JavaOptionsPanelProps {
  settings: JavaGeneratorSettings;
  onSettingsChange: (settings: Partial<JavaGeneratorSettings>) => void;
}

export function JavaOptionsPanel({ settings, onSettingsChange }: JavaOptionsPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Method Generation */}
      <div className="settings-group">
        <span className="settings-group-title">Method Generation</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateGetters}
              onChange={(e) => onSettingsChange({ generateGetters: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate Getters</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateSetters}
              onChange={(e) => onSettingsChange({ generateSetters: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate Setters</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateConstructors}
              onChange={(e) => onSettingsChange({ generateConstructors: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate Constructor</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateAllArgsConstructor}
              onChange={(e) => onSettingsChange({ generateAllArgsConstructor: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate All-Args Constructor</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateToString}
              onChange={(e) => onSettingsChange({ generateToString: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate toString()</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateHashCodeEquals}
              onChange={(e) => onSettingsChange({ generateHashCodeEquals: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate equals() & hashCode()</span>
          </label>
        </div>
      </div>

      {/* Type Options */}
      <div className="settings-group">
        <span className="settings-group-title">Type Options</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.usePrimitives}
              onChange={(e) => onSettingsChange({ usePrimitives: e.target.checked })}
            />
            <span className="checkbox-option-label">Use primitive types (int vs Integer)</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useOptional}
              onChange={(e) => onSettingsChange({ useOptional: e.target.checked })}
            />
            <span className="checkbox-option-label">Use Optional for nullable fields</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useCollectionInterfaces}
              onChange={(e) => onSettingsChange({ useCollectionInterfaces: e.target.checked })}
            />
            <span className="checkbox-option-label">Use collection interfaces (List vs ArrayList)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
