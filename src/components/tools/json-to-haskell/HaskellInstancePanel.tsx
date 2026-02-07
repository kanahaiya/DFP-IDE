'use client';

import React from 'react';
import type { HaskellGeneratorSettings, HaskellAesonStyle } from '@/lib/haskell/types';

interface HaskellInstancePanelProps {
  settings: HaskellGeneratorSettings;
  updateSettings: (settings: Partial<HaskellGeneratorSettings>) => void;
}

const AESON_STYLES: { value: HaskellAesonStyle; label: string; description: string }[] = [
  { value: 'generic', label: 'Generic Deriving', description: 'Use DeriveGeneric' },
  { value: 'template-haskell', label: 'Template Haskell', description: 'Use deriveJSON TH' },
  { value: 'manual', label: 'Manual Instances', description: 'Hand-written instances' },
];

export function HaskellInstancePanel({ settings, updateSettings }: HaskellInstancePanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-cogs"></i> Aeson Instance Style</h3>
        <div className="setting-group">
          {AESON_STYLES.map((style) => (
            <label key={style.value} className={`radio-card ${settings.aesonStyle === style.value ? 'selected' : ''}`}>
              <input type="radio" name="aesonStyle" checked={settings.aesonStyle === style.value} onChange={() => updateSettings({ aesonStyle: style.value })} />
              <div className="radio-card-content">
                <span className="radio-card-label">{style.label}</span>
                <span className="radio-card-description">{style.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-exchange-alt"></i> JSON Instances</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateFromJSON} onChange={(e) => updateSettings({ generateFromJSON: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate FromJSON</span>
          </label>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateToJSON} onChange={(e) => updateSettings({ generateToJSON: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate ToJSON</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-tag"></i> Field Naming</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.fieldLabelModifier} onChange={(e) => updateSettings({ fieldLabelModifier: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Use field label modifier</span>
          </label>
          <p className="setting-hint">Prefix fields with type name, then drop prefix in JSON</p>
        </div>
      </div>
    </div>
  );
}
