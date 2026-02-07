'use client';

import { useFlattenerStore } from '@/store/flattener';
import { FLATTENER_PRESETS } from '@/lib/flattener/presets';

export function FlattenerPresetsPanel() {
  const { updateSettings } = useFlattenerStore();
  
  const applyPreset = (presetId: string) => {
    const preset = FLATTENER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      updateSettings(preset.settings);
    }
  };
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-magic"></i> Quick Presets</h3>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '-8px', marginBottom: '12px' }}>
          One-click configurations for common use cases
        </p>
        
        <div className="presets-grid">
          {FLATTENER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="preset-button"
              onClick={() => applyPreset(preset.id)}
              title={preset.description}
            >
              <i className={preset.icon}></i>
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-lightbulb"></i> Preset Tips</h3>
        <ul style={{ fontSize: '12px', opacity: 0.8, margin: 0, paddingLeft: '16px', lineHeight: 1.6 }}>
          <li><strong>Standard:</strong> Default dot notation, good for most use cases</li>
          <li><strong>CSV Export:</strong> Underscore keys for spreadsheet compatibility</li>
          <li><strong>Environment Variables:</strong> Perfect for .env file generation</li>
          <li><strong>Path Style:</strong> Slash notation for file-path-like structures</li>
          <li><strong>Compact:</strong> Minimal output by removing null/empty values</li>
        </ul>
      </div>
    </div>
  );
}
