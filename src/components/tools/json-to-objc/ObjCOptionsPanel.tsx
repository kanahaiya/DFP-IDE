'use client';

import React from 'react';
import { ObjCGeneratorSettings, OutputFormat, MemoryManagement } from '@/lib/objc/types';

interface ObjCOptionsPanelProps {
  settings: ObjCGeneratorSettings;
  onSettingsChange: (settings: Partial<ObjCGeneratorSettings>) => void;
}

export function ObjCOptionsPanel({ settings, onSettingsChange }: ObjCOptionsPanelProps) {
  const outputFormats: { value: OutputFormat; label: string; description: string }[] = [
    { value: 'header-implementation', label: 'Both', description: 'Header and implementation' },
    { value: 'header-only', label: 'Header Only', description: 'Generate .h file only' },
    { value: 'implementation-only', label: 'Implementation Only', description: 'Generate .m file only' },
  ];

  const memoryOptions: { value: MemoryManagement; label: string }[] = [
    { value: 'arc', label: 'ARC (Automatic Reference Counting)' },
    { value: 'mrc', label: 'MRC (Manual Reference Counting)' },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Output Format</label>
        <div className="settings-options">
          {outputFormats.map((format) => (
            <div
              key={format.value}
              className={`settings-option ${settings.outputFormat === format.value ? 'active' : ''}`}
              onClick={() => onSettingsChange({ outputFormat: format.value })}
            >
              <div className="option-header">
                <span className="option-label">{format.label}</span>
                <input
                  type="radio"
                  checked={settings.outputFormat === format.value}
                  onChange={() => onSettingsChange({ outputFormat: format.value })}
                />
              </div>
              <span className="option-description">{format.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Memory Management</label>
        <select
          className="settings-select"
          value={settings.memoryManagement}
          onChange={(e) => onSettingsChange({ memoryManagement: e.target.value as MemoryManagement })}
        >
          {memoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateInitWithDictionary}
            onChange={(e) => onSettingsChange({ generateInitWithDictionary: e.target.checked })}
          />
          <span>Generate initWithDictionary</span>
        </label>
        <p className="settings-hint">Create initializer from NSDictionary</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateToDictionary}
            onChange={(e) => onSettingsChange({ generateToDictionary: e.target.checked })}
          />
          <span>Generate toDictionary</span>
        </label>
        <p className="settings-hint">Create method to convert to NSDictionary</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.generateDescription}
            onChange={(e) => onSettingsChange({ generateDescription: e.target.checked })}
          />
          <span>Generate description</span>
        </label>
        <p className="settings-hint">Override description method for debugging</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.conformToNSCoding}
            onChange={(e) => onSettingsChange({ conformToNSCoding: e.target.checked })}
          />
          <span>Conform to NSCoding</span>
        </label>
        <p className="settings-hint">Implement NSCoding protocol</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <input
            type="checkbox"
            checked={settings.conformToNSCopying}
            onChange={(e) => onSettingsChange({ conformToNSCopying: e.target.checked })}
          />
          <span>Conform to NSCopying</span>
        </label>
        <p className="settings-hint">Implement NSCopying protocol</p>
      </div>
    </div>
  );
}
