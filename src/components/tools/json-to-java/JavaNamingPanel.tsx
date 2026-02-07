'use client';

import React from 'react';
import type { JavaGeneratorSettings, AccessModifier } from '@/lib/java/types';

interface JavaNamingPanelProps {
  settings: JavaGeneratorSettings;
  onSettingsChange: (settings: Partial<JavaGeneratorSettings>) => void;
}

export function JavaNamingPanel({ settings, onSettingsChange }: JavaNamingPanelProps) {
  const accessModifiers: { value: AccessModifier; label: string }[] = [
    { value: 'public', label: 'public' },
    { value: 'private', label: 'private' },
    { value: 'protected', label: 'protected' },
    { value: 'package', label: 'package-private' },
  ];

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

      {/* Package Name */}
      <div className="settings-group">
        <label className="setting-label">Package Name</label>
        <input
          type="text"
          value={settings.packageName}
          onChange={(e) => onSettingsChange({ packageName: e.target.value })}
          className="setting-input"
          placeholder="com.example.model"
        />
      </div>

      {/* Field Access Modifier */}
      <div className="settings-group">
        <label className="setting-label">Field Access Modifier</label>
        <select
          value={settings.accessModifier}
          onChange={(e) => onSettingsChange({ accessModifier: e.target.value as AccessModifier })}
          className="setting-select"
        >
          {accessModifiers.map((mod) => (
            <option key={mod.value} value={mod.value}>
              {mod.label}
            </option>
          ))}
        </select>
      </div>

      {/* Make Fields Final */}
      <div className="checkbox-group">
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={settings.makeFinal}
            onChange={(e) => onSettingsChange({ makeFinal: e.target.checked })}
          />
          <span className="checkbox-option-label">Make fields final</span>
        </label>
      </div>
    </div>
  );
}
