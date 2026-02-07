'use client';

import React from 'react';
import { ObjCGeneratorSettings } from '@/lib/objc/types';
import type { NamingConvention, CaseConvention } from '@/lib/code-gen/types';

interface ObjCNamingPanelProps {
  settings: ObjCGeneratorSettings;
  onSettingsChange: (settings: Partial<ObjCGeneratorSettings>) => void;
}

export function ObjCNamingPanel({ settings, onSettingsChange }: ObjCNamingPanelProps) {
  const propertyNamingOptions: { value: NamingConvention; label: string }[] = [
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'preserve', label: 'Preserve original' },
  ];

  const classNamingOptions: { value: CaseConvention; label: string }[] = [
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'camelCase', label: 'camelCase' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Class Prefix</label>
        <input
          type="text"
          className="settings-input"
          value={settings.classPrefix}
          onChange={(e) => onSettingsChange({ classPrefix: e.target.value })}
          placeholder="e.g., ABC, DFP"
        />
        <p className="settings-hint">Prefix for all generated class names (Objective-C convention)</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">Root Class Name</label>
        <input
          type="text"
          className="settings-input"
          value={settings.rootClassName}
          onChange={(e) => onSettingsChange({ rootClassName: e.target.value })}
          placeholder="Root"
        />
      </div>

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
      </div>
    </div>
  );
}
