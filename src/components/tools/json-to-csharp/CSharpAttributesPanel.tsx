'use client';

import React from 'react';
import type { CSharpGeneratorSettings, SerializerLibrary } from '@/lib/csharp/types';

interface CSharpAttributesPanelProps {
  settings: CSharpGeneratorSettings;
  onSettingsChange: (settings: Partial<CSharpGeneratorSettings>) => void;
}

export function CSharpAttributesPanel({ settings, onSettingsChange }: CSharpAttributesPanelProps) {
  const serializerLibraries: { value: SerializerLibrary; label: string; description: string }[] = [
    { value: 'system.text.json', label: 'System.Text.Json', description: '.NET Core / .NET 5+ built-in' },
    { value: 'newtonsoft', label: 'Newtonsoft.Json', description: 'Json.NET / legacy projects' },
    { value: 'none', label: 'None', description: 'No serialization attributes' },
  ];

  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Serializer Library */}
      <div className="settings-group">
        <label className="setting-label">Serialization Library</label>
        <div className="radio-group">
          {serializerLibraries.map((lib) => (
            <label key={lib.value} className="radio-option">
              <input
                type="radio"
                name="serializerLibrary"
                value={lib.value}
                checked={settings.serializerLibrary === lib.value}
                onChange={() => onSettingsChange({ serializerLibrary: lib.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{lib.label}</span>
                <p className="radio-option-desc">{lib.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* JSON Property Attributes */}
      <div className="settings-group">
        <span className="settings-group-title">Attribute Options</span>
        <div className="checkbox-group">
          <label className={`checkbox-option ${settings.serializerLibrary === 'none' ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={settings.addJsonPropertyAttributes}
              onChange={(e) => onSettingsChange({ addJsonPropertyAttributes: e.target.checked })}
              disabled={settings.serializerLibrary === 'none'}
            />
            <span className="checkbox-option-label">Add JSON property attributes</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.preserveOriginalNames}
              onChange={(e) => onSettingsChange({ preserveOriginalNames: e.target.checked })}
            />
            <span className="checkbox-option-label">Preserve original JSON names</span>
          </label>
        </div>
      </div>
    </div>
  );
}
