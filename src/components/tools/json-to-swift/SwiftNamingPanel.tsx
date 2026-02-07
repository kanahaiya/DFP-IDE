'use client';

import React from 'react';
import type { SwiftGeneratorSettings } from '@/lib/swift/types';

interface SwiftNamingPanelProps {
  settings: SwiftGeneratorSettings;
  onSettingsChange: (settings: Partial<SwiftGeneratorSettings>) => void;
}

export function SwiftNamingPanel({ settings, onSettingsChange }: SwiftNamingPanelProps) {
  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Root Type Name */}
      <div className="settings-group">
        <label className="setting-label">Root Type Name</label>
        <input
          type="text"
          value={settings.rootClassName}
          onChange={(e) => onSettingsChange({ rootClassName: e.target.value || 'Root' })}
          placeholder="Root"
          className="setting-input"
        />
        <p className="setting-hint">Name for the root struct/class (use PascalCase)</p>
      </div>

      {/* Generate CodingKeys */}
      <div className="setting-toggle">
        <div className="setting-toggle-info">
          <label className="setting-label">Generate CodingKeys</label>
          <p className="setting-hint">Create CodingKeys enum for key mapping</p>
        </div>
        <button
          onClick={() => onSettingsChange({ generateCodingKeys: !settings.generateCodingKeys })}
          disabled={settings.codableOption === 'none'}
          className={`toggle-switch ${settings.generateCodingKeys && settings.codableOption !== 'none' ? 'active' : ''} ${settings.codableOption === 'none' ? 'disabled' : ''}`}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {/* Add Comments */}
      <div className="setting-toggle">
        <div className="setting-toggle-info">
          <label className="setting-label">Add Comments</label>
          <p className="setting-hint">Include MARK comments for types</p>
        </div>
        <button
          onClick={() => onSettingsChange({ addComments: !settings.addComments })}
          className={`toggle-switch ${settings.addComments ? 'active' : ''}`}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {/* Preview */}
      <div className="code-preview">
        <p className="code-preview-label">Type Preview:</p>
        <code className="code-preview-content">
{`${settings.accessModifier === 'internal' ? '' : settings.accessModifier + ' '}${
  settings.outputType === 'finalClass' ? 'final class' : settings.outputType
} ${settings.rootClassName}${settings.codableOption !== 'none' ? `: ${
  settings.codableOption.charAt(0).toUpperCase() + settings.codableOption.slice(1)
}` : ''} {
    // properties
}`}
        </code>
      </div>
    </div>
  );
}
