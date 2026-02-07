'use client';

import { useDecoderStore } from '@/store/decoder';
import { getDecodingTypes } from '@/lib/decoder/converter';
import type { DecodingType } from '@/lib/decoder/converter';

export function DecoderTypePanel() {
  const { settings, updateSettings } = useDecoderStore();
  const decodingTypes = getDecodingTypes();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-exchange-alt"></i> Decoding Type</h3>
        
        <div className="form-row">
          <label htmlFor="decodingType">
            <i className="fas fa-unlock" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Select Decoding
          </label>
          <select
            id="decodingType"
            value={settings.decodingType}
            onChange={(e) => updateSettings({ decodingType: e.target.value as DecodingType })}
          >
            {decodingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {decodingTypes.find(t => t.value === settings.decodingType)?.description}
          </span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-search"></i> Detection</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="autoDetect"
            checked={settings.autoDetect}
            onChange={(e) => updateSettings({ autoDetect: e.target.checked })}
            disabled={settings.decodingType !== 'auto'}
          />
          <label htmlFor="autoDetect">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Auto-Detect Encoding</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔍 Automatically identify the encoding type</span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="recursiveDecode"
            checked={settings.recursiveDecode}
            onChange={(e) => updateSettings({ recursiveDecode: e.target.checked })}
          />
          <label htmlFor="recursiveDecode">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Recursive Decoding</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔄 Decode multiple layers automatically</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
