'use client';

import React from 'react';
import type { ElmGeneratorSettings } from '@/lib/elm/types';

interface ElmModulePanelProps {
  settings: ElmGeneratorSettings;
  updateSettings: (settings: Partial<ElmGeneratorSettings>) => void;
}

export function ElmModulePanel({ settings, updateSettings }: ElmModulePanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-folder"></i> Module Settings</h3>
        <div className="setting-group">
          <label className="setting-label">Module Prefix</label>
          <input type="text" className="setting-input" value={settings.modulePrefix} onChange={(e) => updateSettings({ modulePrefix: e.target.value })} placeholder="Data" />
          <p className="setting-hint">e.g., Data.Root or Api.Types</p>
        </div>
        <div className="setting-group">
          <label className="setting-label">Root Type Name</label>
          <input type="text" className="setting-input" value={settings.rootClassName} onChange={(e) => updateSettings({ rootClassName: e.target.value })} placeholder="Root" />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-eye"></i> Exposing</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.exposeAll} onChange={(e) => updateSettings({ exposeAll: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Expose all (..)</span>
          </label>
          <p className="setting-hint">Expose all types and functions from the module</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-align-left"></i> Formatting</h3>
        <div className="setting-group">
          <label className="setting-label">Indent Spaces</label>
          <select className="setting-select" value={settings.indentation} onChange={(e) => updateSettings({ indentation: parseInt(e.target.value) })}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces (Elm default)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
