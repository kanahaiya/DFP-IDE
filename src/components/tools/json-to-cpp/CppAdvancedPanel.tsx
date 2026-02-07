'use client';

import React from 'react';
import type { CppGeneratorSettings } from '@/lib/cpp/types';

interface CppAdvancedPanelProps {
  settings: CppGeneratorSettings;
  updateSettings: (settings: Partial<CppGeneratorSettings>) => void;
}

export function CppAdvancedPanel({ settings, updateSettings }: CppAdvancedPanelProps) {
  const isCpp17Plus = settings.cppStandard === 'cpp17' || settings.cppStandard === 'cpp20';

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-layer-group"></i> Type Options</h3>

        <div className="checkbox-row">
          <input
            id="cpp-optional"
            type="checkbox"
            checked={settings.useOptional}
            onChange={(e) => updateSettings({ useOptional: e.target.checked })}
            disabled={!isCpp17Plus}
          />
          <label htmlFor="cpp-optional">Use std::optional for nullable</label>
        </div>
        {!isCpp17Plus && <span className="form-hint">Requires C++17 or later</span>}

        <div className="checkbox-row">
          <input
            id="cpp-string-view"
            type="checkbox"
            checked={settings.useStringView}
            onChange={(e) => updateSettings({ useStringView: e.target.checked })}
            disabled={!isCpp17Plus}
          />
          <label htmlFor="cpp-string-view">Use std::string_view</label>
        </div>
        {!isCpp17Plus && <span className="form-hint">Requires C++17 or later</span>}

        <div className="checkbox-row">
          <input
            id="cpp-smart-ptrs"
            type="checkbox"
            checked={settings.useSmartPointers}
            onChange={(e) => updateSettings({ useSmartPointers: e.target.checked })}
          />
          <label htmlFor="cpp-smart-ptrs">Use smart pointers for nested</label>
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-shield-alt"></i> Header Guard</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(['pragma', 'ifndef'] as const).map((v) => {
            const active = settings.headerGuardStyle === v;
            const label = v === 'pragma' ? '#pragma once' : '#ifndef / #define';
            return (
              <label key={v} className={`settings-option ${active ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="cpp-header-guard"
                  checked={active}
                  onChange={() => updateSettings({ headerGuardStyle: v })}
                />
                <span className="option-label">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-align-left"></i> Formatting</h3>
        <div className="form-row">
          <label htmlFor="cpp-indent-style">Indent Style</label>
          <select
            id="cpp-indent-style"
            className="select-input"
            value={settings.indentStyle}
            onChange={(e) => updateSettings({ indentStyle: e.target.value as 'spaces' | 'tabs' })}
          >
            <option value="spaces">Spaces</option>
            <option value="tabs">Tabs</option>
          </select>
        </div>
        {settings.indentStyle === 'spaces' && (
          <div className="form-row">
            <label htmlFor="cpp-indent-size">Indent Size</label>
            <select
              id="cpp-indent-size"
              className="select-input"
              value={settings.indentSize}
              onChange={(e) => updateSettings({ indentSize: parseInt(e.target.value) })}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
