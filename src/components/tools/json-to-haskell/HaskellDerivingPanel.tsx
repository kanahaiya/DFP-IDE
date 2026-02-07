'use client';

import React from 'react';
import type { HaskellGeneratorSettings } from '@/lib/haskell/types';

interface HaskellDerivingPanelProps {
  settings: HaskellGeneratorSettings;
  updateSettings: (settings: Partial<HaskellGeneratorSettings>) => void;
}

export function HaskellDerivingPanel({ settings, updateSettings }: HaskellDerivingPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-list"></i> Deriving Clauses</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.deriveGeneric} onChange={(e) => updateSettings({ deriveGeneric: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Derive Generic</span>
          </label>
          <p className="setting-hint">Required for generic Aeson instances</p>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.deriveShow} onChange={(e) => updateSettings({ deriveShow: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Derive Show</span>
          </label>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.deriveEq} onChange={(e) => updateSettings({ deriveEq: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Derive Eq</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-bolt"></i> Performance</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.useStrictFields} onChange={(e) => updateSettings({ useStrictFields: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Use strict fields</span>
          </label>
          <p className="setting-hint">Adds StrictData pragma and bang patterns</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-comment-alt"></i> Documentation</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.addDocComments} onChange={(e) => updateSettings({ addDocComments: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Add Haddock comments</span>
          </label>
        </div>
      </div>
    </div>
  );
}
