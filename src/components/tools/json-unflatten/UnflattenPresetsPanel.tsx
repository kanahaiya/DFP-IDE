'use client';

import { useUnflattenStore } from '@/store/unflatten';
import { UNFLATTEN_PRESETS } from '@/lib/unflatten/presets';

export function UnflattenPresetsPanel() {
  const { updateSettings } = useUnflattenStore();
  
  const applyPreset = (presetId: string) => {
    const preset = UNFLATTEN_PRESETS.find(p => p.id === presetId);
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
          {UNFLATTEN_PRESETS.map((preset) => (
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
          <li><strong>Auto Detect:</strong> Best for most flattened JSON</li>
          <li><strong>Database Import:</strong> For ORM-generated flat exports</li>
          <li><strong>Form Data:</strong> For HTML form serialization</li>
          <li><strong>Config Import:</strong> For underscore-separated configs</li>
          <li><strong>Strict Mode:</strong> Errors on any key conflicts</li>
        </ul>
      </div>
    </div>
  );
}
