'use client';

import React from 'react';
import type { CppGeneratorSettings, CppLibrary, CppStandard } from '@/lib/cpp/types';

interface CppLibraryPanelProps {
  settings: CppGeneratorSettings;
  updateSettings: (settings: Partial<CppGeneratorSettings>) => void;
}

const LIBRARIES: { value: CppLibrary; label: string; description: string }[] = [
  { value: 'nlohmann', label: 'nlohmann/json', description: 'Modern, intuitive API' },
  { value: 'rapidjson', label: 'RapidJSON', description: 'High performance' },
  { value: 'jsoncpp', label: 'jsoncpp', description: 'Mature, stable' },
  { value: 'boost', label: 'Boost.JSON', description: 'Boost ecosystem' },
  { value: 'none', label: 'None', description: 'Plain structs only' },
];

const STANDARDS: { value: CppStandard; label: string }[] = [
  { value: 'cpp11', label: 'C++11' },
  { value: 'cpp14', label: 'C++14' },
  { value: 'cpp17', label: 'C++17' },
  { value: 'cpp20', label: 'C++20' },
];

export function CppLibraryPanel({ settings, updateSettings }: CppLibraryPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-book"></i> JSON Library</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {LIBRARIES.map((lib) => {
            const active = settings.library === lib.value;
            return (
              <label key={lib.value} className={`settings-option ${active ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="library"
                  checked={active}
                  onChange={() => updateSettings({ library: lib.value })}
                />
                <span className="option-label">{lib.label}</span>
                <span className="option-description">{lib.description}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-code"></i> C++ Standard</h3>
        <div className="form-row">
          <label htmlFor="cpp-standard">Standard</label>
          <select
            id="cpp-standard"
            className="select-input"
            value={settings.cppStandard}
            onChange={(e) => updateSettings({ cppStandard: e.target.value as CppStandard })}
          >
            {STANDARDS.map((std) => (
              <option key={std.value} value={std.value}>
                {std.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-cog"></i> Serialization</h3>
        <div className="checkbox-row">
          <input
            id="cpp-serialization-macros"
            type="checkbox"
            checked={settings.addSerializationMacros}
            onChange={(e) => updateSettings({ addSerializationMacros: e.target.checked })}
          />
          <label htmlFor="cpp-serialization-macros">Add serialization macros</label>
        </div>
        <span className="form-hint">
          Generate NLOHMANN_DEFINE_TYPE_INTRUSIVE or Boost.Describe annotations
        </span>
      </div>
    </div>
  );
}
