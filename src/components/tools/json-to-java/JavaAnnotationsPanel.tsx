'use client';

import React from 'react';
import type { JavaGeneratorSettings, AnnotationStyle } from '@/lib/java/types';

interface JavaAnnotationsPanelProps {
  settings: JavaGeneratorSettings;
  onSettingsChange: (settings: Partial<JavaGeneratorSettings>) => void;
}

export function JavaAnnotationsPanel({ settings, onSettingsChange }: JavaAnnotationsPanelProps) {
  const annotationStyles: { value: AnnotationStyle; label: string; description: string }[] = [
    { value: 'jackson', label: 'Jackson', description: '@JsonProperty annotations' },
    { value: 'gson', label: 'Gson', description: '@SerializedName annotations' },
    { value: 'lombok', label: 'Lombok', description: '@Data, @Builder annotations' },
    { value: 'none', label: 'None', description: 'No serialization annotations' },
  ];

  return (
    <div className="settings-panel-content sp-stack-lg">
      {/* Annotation Style */}
      <div className="settings-group">
        <label className="setting-label">Serialization Library</label>
        <div className="radio-group">
          {annotationStyles.map((style) => (
            <label key={style.value} className="radio-option">
              <input
                type="radio"
                name="annotationStyle"
                value={style.value}
                checked={settings.annotationStyle === style.value}
                onChange={() => onSettingsChange({ annotationStyle: style.value })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{style.label}</span>
                <p className="radio-option-desc">{style.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="settings-group">
        <span className="settings-group-title">Additional Options</span>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.useLombok}
              onChange={(e) => onSettingsChange({ useLombok: e.target.checked })}
            />
            <span className="checkbox-option-label">Use Lombok annotations</span>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.generateBuilder}
              onChange={(e) => onSettingsChange({ generateBuilder: e.target.checked })}
            />
            <span className="checkbox-option-label">Generate Builder pattern</span>
          </label>
        </div>
      </div>
    </div>
  );
}
