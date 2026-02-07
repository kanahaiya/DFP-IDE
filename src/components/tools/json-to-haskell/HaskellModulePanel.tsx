'use client';

import React from 'react';
import type { HaskellGeneratorSettings } from '@/lib/haskell/types';

interface HaskellModulePanelProps {
  settings: HaskellGeneratorSettings;
  updateSettings: (settings: Partial<HaskellGeneratorSettings>) => void;
}

export function HaskellModulePanel({ settings, updateSettings }: HaskellModulePanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-folder"></i> Module Settings</h3>
        <div className="setting-group">
          <label className="setting-label">Module Prefix</label>
          <input type="text" className="setting-input" value={settings.modulePrefix} onChange={(e) => updateSettings({ modulePrefix: e.target.value })} placeholder="Data" />
          <p className="setting-hint">e.g., Data.Types or Api.Models</p>
        </div>
        <div className="setting-group">
          <label className="setting-label">Root Type Name</label>
          <input type="text" className="setting-input" value={settings.rootClassName} onChange={(e) => updateSettings({ rootClassName: e.target.value })} placeholder="Root" />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-info-circle"></i> Required Extensions</h3>
        <div className="setting-hint">
          <code>DeriveGeneric</code><br/>
          <code>OverloadedStrings</code><br/>
          {settings.aesonStyle === 'template-haskell' && <><code>TemplateHaskell</code><br/></>}
          {settings.useStrictFields && <code>StrictData</code>}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-box"></i> Package Dependencies</h3>
        <div className="setting-hint">
          <code>aeson</code><br/>
          <code>text</code>
        </div>
      </div>
    </div>
  );
}
