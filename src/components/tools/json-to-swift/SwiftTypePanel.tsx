'use client';

import React from 'react';
import type { SwiftGeneratorSettings, SwiftOutputType, SwiftAccessModifier, CodableOption } from '@/lib/swift/types';

interface SwiftTypePanelProps {
  settings: SwiftGeneratorSettings;
  onSettingsChange: (settings: Partial<SwiftGeneratorSettings>) => void;
}

export function SwiftTypePanel({ settings, onSettingsChange }: SwiftTypePanelProps) {
  const outputTypes: { value: SwiftOutputType; label: string; description: string }[] = [
    { value: 'struct', label: 'Struct', description: 'Value type (recommended)' },
    { value: 'class', label: 'Class', description: 'Reference type' },
    { value: 'finalClass', label: 'Final Class', description: 'Non-subclassable class' },
  ];

  const accessModifiers: { value: SwiftAccessModifier; label: string }[] = [
    { value: 'internal', label: 'internal (default)' },
    { value: 'public', label: 'public' },
    { value: 'private', label: 'private' },
    { value: 'fileprivate', label: 'fileprivate' },
  ];

  const codableOptions: { value: CodableOption; label: string; description: string }[] = [
    { value: 'codable', label: 'Codable', description: 'Encode & Decode' },
    { value: 'decodable', label: 'Decodable', description: 'Decode only' },
    { value: 'encodable', label: 'Encodable', description: 'Encode only' },
    { value: 'none', label: 'None', description: 'No protocol' },
  ];

  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Output Type */}
      <div className="settings-group">
        <label className="setting-label">Output Type</label>
        <div className="radio-group">
          {outputTypes.map((type) => (
            <label key={type.value} className="radio-option">
              <input
                type="radio"
                name="outputType"
                value={type.value}
                checked={settings.outputType === type.value}
                onChange={() => onSettingsChange({ outputType: type.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{type.label}</span>
                <p className="radio-option-desc">{type.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Access Modifier */}
      <div className="settings-group">
        <label className="setting-label">Access Modifier</label>
        <select
          value={settings.accessModifier}
          onChange={(e) => onSettingsChange({ accessModifier: e.target.value as SwiftAccessModifier })}
          className="setting-select"
        >
          {accessModifiers.map((mod) => (
            <option key={mod.value} value={mod.value}>{mod.label}</option>
          ))}
        </select>
      </div>

      {/* Codable Protocol */}
      <div className="settings-group">
        <label className="setting-label">Protocol Conformance</label>
        <div className="radio-group">
          {codableOptions.map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name="codableOption"
                value={opt.value}
                checked={settings.codableOption === opt.value}
                onChange={() => onSettingsChange({ codableOption: opt.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{opt.label}</span>
                <p className="radio-option-desc">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
