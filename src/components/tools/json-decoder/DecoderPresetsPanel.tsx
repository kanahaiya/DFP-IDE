'use client';

import { useState } from 'react';
import { useDecoderStore } from '@/store/decoder';
import { DECODER_PRESETS } from '@/lib/decoder/presets';
import { event as trackEvent } from '@/lib/analytics';

export function DecoderPresetsPanel() {
  const { updateSettings } = useDecoderStore();
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);
  
  const applyPreset = (preset: typeof DECODER_PRESETS[0]) => {
    updateSettings(preset.settings);
    setAppliedPreset(preset.id);
    
    // Track preset usage
    trackEvent('preset_apply', 'json_decoder', preset.id);
    
    // Clear feedback after 2 seconds
    setTimeout(() => setAppliedPreset(null), 2000);
  };
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-magic"></i> Decoding Presets</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Click a preset to apply its settings instantly
        </p>
        
        <div className="presets-grid">
          {DECODER_PRESETS.map((preset) => (
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
        <h3><i className="fas fa-list"></i> Preset Categories</h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>Auto:</strong> Detect encoding automatically</p>
          <p><strong>URL:</strong> Decode percent-encoded strings</p>
          <p><strong>Base64:</strong> Decode Base64 and JWT tokens</p>
          <p><strong>Hex:</strong> Decode hexadecimal byte strings</p>
          <p><strong>Unescape:</strong> Remove extra escape characters</p>
        </div>
      </div>
    </div>
  );
}
