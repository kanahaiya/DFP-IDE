'use client';

import React from 'react';
import { CrystalGeneratorSettings } from '@/lib/crystal/types';
import type { NamingConvention, CaseConvention } from '@/lib/code-gen/types';

interface CrystalNamingPanelProps {
  settings: CrystalGeneratorSettings;
  onSettingsChange: (settings: Partial<CrystalGeneratorSettings>) => void;
}

export function CrystalNamingPanel({ settings, onSettingsChange }: CrystalNamingPanelProps) {
  const propertyNamingOptions: { value: NamingConvention; label: string }[] = [
    { value: 'snake_case', label: 'snake_case' },
    { value: 'camelCase', label: 'camelCase' },
    { value: 'preserve', label: 'Preserve original' },
  ];

  const classNamingOptions: { value: CaseConvention; label: string }[] = [
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'camelCase', label: 'camelCase' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Property Naming</label>
        <select
          className="settings-select"
          value={settings.propertyNaming}
          onChange={(e) => onSettingsChange({ propertyNaming: e.target.value as NamingConvention })}
        >
          {propertyNamingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="settings-hint">Naming convention for property names (Crystal uses snake_case)</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">Class Naming</label>
        <select
          className="settings-select"
          value={settings.classNaming}
          onChange={(e) => onSettingsChange({ classNaming: e.target.value as CaseConvention })}
        >
          {classNamingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="settings-hint">Naming convention for class/struct names</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.includeJsonKey}
            onChange={(e) => onSettingsChange({ includeJsonKey: e.target.checked })}
          />
          <span>Include JSON Key Annotation</span>
        </label>
        <p className="settings-hint">Add @[JSON::Field(key: &quot;...&quot;)] annotations</p>
      </div>
    </div>
  );
}
