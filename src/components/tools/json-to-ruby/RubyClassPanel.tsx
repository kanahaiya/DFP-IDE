'use client';

import React from 'react';
import type { RubyGeneratorSettings } from '@/lib/ruby/types';

interface RubyClassPanelProps {
  settings: RubyGeneratorSettings;
  updateSettings: (settings: Partial<RubyGeneratorSettings>) => void;
}

export function RubyClassPanel({ settings, updateSettings }: RubyClassPanelProps) {
  const isClassMode = settings.outputMode === 'class';
  const isStructMode = settings.outputMode === 'struct';
  
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-cog"></i> Class Methods</h3>
        {!isClassMode && !isStructMode && (
          <p className="setting-hint">Class options are only available in Class or Struct output mode</p>
        )}
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateAccessors} onChange={(e) => updateSettings({ generateAccessors: e.target.checked })} disabled={!isClassMode} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate attr_accessor</span>
          </label>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateInitialize} onChange={(e) => updateSettings({ generateInitialize: e.target.checked })} disabled={!isClassMode} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate initialize method</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-exchange-alt"></i> Serialization</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateToJson} onChange={(e) => updateSettings({ generateToJson: e.target.checked })} disabled={!isClassMode && !isStructMode} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate to_h / to_json</span>
          </label>
          <p className="setting-hint">Adds methods to convert back to Hash/JSON</p>
        </div>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.generateFromJson} onChange={(e) => updateSettings({ generateFromJson: e.target.checked })} disabled={!isClassMode} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Generate self.from_json</span>
          </label>
          <p className="setting-hint">Adds class method to parse JSON strings</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title"><i className="fas fa-shield-alt"></i> Type Safety</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.addTypeSig} onChange={(e) => updateSettings({ addTypeSig: e.target.checked })} />
            <span className="checkbox-custom"><i className="fas fa-check"></i></span>
            <span>Add Sorbet/RBS type signatures</span>
          </label>
          <p className="setting-hint">Coming soon - type annotations for static analysis</p>
        </div>
      </div>
    </div>
  );
}
