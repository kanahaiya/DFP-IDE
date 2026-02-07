'use client';

import { useState } from 'react';
import { useUnescaperStore } from '@/store/unescaper';
import { UNESCAPER_PRESETS } from '@/lib/unescaper/presets';
import { event as trackEvent } from '@/lib/analytics';

export function UnescaperPresetsPanel() {
  const { updateSettings } = useUnescaperStore();
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);
  
  const applyPreset = (preset: typeof UNESCAPER_PRESETS[0]) => {
    updateSettings(preset.settings);
    setAppliedPreset(preset.id);
    
    // Track preset usage
    trackEvent('preset_apply', 'json_unescaper', preset.id);
    
    // Clear feedback after 2 seconds
    setTimeout(() => setAppliedPreset(null), 2000);
  };
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-magic"></i> Unescape Presets</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Click a preset to apply its settings instantly
        </p>
        
        <div className="presets-grid">
          {UNESCAPER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="preset-card"
              onClick={() => applyPreset(preset)}
              style={{ cursor: 'pointer' }}
            >
              <div className="preset-header">
                <i className={preset.icon} style={{ marginRight: '8px', color: 'var(--primary)' }}></i>
                <span className="preset-name">{preset.name}</span>
                {appliedPreset === preset.id && (
                  <span 
                    className="preset-applied"
                    style={{ 
                      marginLeft: 'auto',
                      fontSize: '11px',
                      color: 'var(--success)',
                      fontWeight: 500
                    }}
                  >
                    ✓ Applied
                  </span>
                )}
              </div>
              <p className="preset-description" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-list"></i> Common Scenarios</h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>Auto:</strong> Handles most cases automatically</p>
          <p><strong>Single Layer:</strong> Just one level of escaping</p>
          <p><strong>Deep:</strong> Multiple nested escape levels</p>
          <p><strong>JSON String:</strong> Standard JSON.parse behavior</p>
        </div>
      </div>
    </div>
  );
}
