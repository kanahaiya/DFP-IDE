'use client';

import React from 'react';
import type { GoGeneratorSettings } from '@/lib/go/types';

interface GoTagsPanelProps {
  settings: GoGeneratorSettings;
  onSettingsChange: (settings: Partial<GoGeneratorSettings>) => void;
}

export function GoTagsPanel({ settings, onSettingsChange }: GoTagsPanelProps) {
  const tagOptions = [
    {
      key: 'includeJsonTags' as const,
      label: 'JSON Tags',
      description: 'Add `json:"key"` tags',
      enabled: settings.includeJsonTags,
    },
    {
      key: 'includeYamlTags' as const,
      label: 'YAML Tags',
      description: 'Add `yaml:"key"` tags',
      enabled: settings.includeYamlTags,
    },
    {
      key: 'includeXmlTags' as const,
      label: 'XML Tags',
      description: 'Add `xml:"key"` tags',
      enabled: settings.includeXmlTags,
    },
    {
      key: 'includeBsonTags' as const,
      label: 'BSON Tags',
      description: 'Add `bson:"key"` tags for MongoDB',
      enabled: settings.includeBsonTags,
    },
  ];

  return (
    <div className="settings-panel-content">
      {/* Tag Type Toggles */}
      <div className="settings-group">
        <h4 className="settings-group-title">Include Tags</h4>
        {tagOptions.map((option) => (
          <div key={option.key} className="setting-toggle">
            <div className="setting-toggle-info">
              <label>{option.label}</label>
              <span className="setting-hint">{option.description}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={option.enabled}
              onClick={() => onSettingsChange({ [option.key]: !option.enabled })}
              className={`toggle-switch ${option.enabled ? 'active' : ''}`}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      {/* Omitempty Option */}
      <div className="setting-toggle">
        <div className="setting-toggle-info">
          <label>Include omitempty</label>
          <span className="setting-hint">Add ,omitempty to tags for optional fields</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.includeOmitempty}
          onClick={() => onSettingsChange({ includeOmitempty: !settings.includeOmitempty })}
          className={`toggle-switch ${settings.includeOmitempty ? 'active' : ''}`}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      {/* Preview */}
      {settings.includeJsonTags && (
        <div className="code-preview">
          <p className="code-preview-label">Tag Preview:</p>
          <code className="code-preview-content">
            {`\`json:"field_name${settings.includeOmitempty ? ',omitempty' : ''}"`}
            {settings.includeYamlTags && ` yaml:"field_name${settings.includeOmitempty ? ',omitempty' : ''}"`}
            {settings.includeXmlTags && ` xml:"field_name"`}
            {settings.includeBsonTags && ` bson:"field_name${settings.includeOmitempty ? ',omitempty' : ''}"`}
            {`\``}
          </code>
        </div>
      )}
    </div>
  );
}
