'use client';

import { useEncoderStore } from '@/store/encoder';
import { getEncodingTypes } from '@/lib/encoder/converter';
import type { EncodingType } from '@/lib/encoder/converter';

export function EncoderTypePanel() {
  const { settings, updateSettings } = useEncoderStore();
  const encodingTypes = getEncodingTypes();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-exchange-alt"></i> Encoding Type</h3>
        
        <div className="form-row">
          <label htmlFor="encodingType">
            <i className="fas fa-lock" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Select Encoding
          </label>
          <select
            id="encodingType"
            value={settings.encodingType}
            onChange={(e) => updateSettings({ encodingType: e.target.value as EncodingType })}
          >
            {encodingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {encodingTypes.find(t => t.value === settings.encodingType)?.description}
          </span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-cog"></i> Preprocessing</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="minifyFirst"
            checked={settings.minifyFirst}
            onChange={(e) => updateSettings({ minifyFirst: e.target.checked, formatFirst: false })}
          />
          <label htmlFor="minifyFirst">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Minify JSON First</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>📦 Remove whitespace before encoding</span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="formatFirst"
            checked={settings.formatFirst}
            onChange={(e) => updateSettings({ formatFirst: e.target.checked, minifyFirst: false })}
          />
          <label htmlFor="formatFirst">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Format JSON First</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>✨ Pretty print before encoding</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
