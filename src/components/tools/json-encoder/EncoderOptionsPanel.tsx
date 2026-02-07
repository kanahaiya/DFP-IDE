'use client';

import { useEncoderStore } from '@/store/encoder';

export function EncoderOptionsPanel() {
  const { settings, updateSettings } = useEncoderStore();
  
  return (
    <div className="settings-panel-content">
      {/* URL Encoding Options */}
      {(settings.encodingType === 'url' || settings.encodingType === 'uri') && (
        <div className="settings-group">
          <h3><i className="fas fa-link"></i> URL Encoding Options</h3>
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="spaceAsPlus"
              checked={settings.spaceAsPlus}
              onChange={(e) => updateSettings({ spaceAsPlus: e.target.checked })}
            />
            <label htmlFor="spaceAsPlus">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Space as +</span>
                <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>➕ Encode spaces as + instead of %20</span>
              </div>
            </label>
          </div>
        </div>
      )}
      
      {/* Base64 Options */}
      {(settings.encodingType === 'base64' || settings.encodingType === 'base64url') && (
        <div className="settings-group">
          <h3><i className="fas fa-key"></i> Base64 Options</h3>
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="includePadding"
              checked={settings.includePadding}
              onChange={(e) => updateSettings({ includePadding: e.target.checked })}
            />
            <label htmlFor="includePadding">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Include Padding</span>
                <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>= Add padding characters at the end</span>
              </div>
            </label>
          </div>
          
          {settings.encodingType === 'base64' && (
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="urlSafe"
                checked={settings.urlSafe}
                onChange={(e) => updateSettings({ urlSafe: e.target.checked })}
              />
              <label htmlFor="urlSafe">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>URL-Safe Variant</span>
                  <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔗 Use - and _ instead of + and /</span>
                </div>
              </label>
            </div>
          )}
        </div>
      )}
      
      {/* Hex Options */}
      {settings.encodingType === 'hex' && (
        <div className="settings-group">
          <h3><i className="fas fa-hashtag"></i> Hex Options</h3>
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="uppercase"
              checked={settings.uppercase}
              onChange={(e) => updateSettings({ uppercase: e.target.checked })}
            />
            <label htmlFor="uppercase">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Uppercase</span>
                <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔠 Use A-F instead of a-f</span>
              </div>
            </label>
          </div>
          
          <div className="form-row">
            <label htmlFor="hexPrefix">
              <i className="fas fa-code" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Prefix
            </label>
            <select
              id="hexPrefix"
              value={settings.hexPrefix}
              onChange={(e) => updateSettings({ hexPrefix: e.target.value as 'none' | '0x' | '\\x' })}
            >
              <option value="none">None</option>
              <option value="0x">0x (C-style)</option>
              <option value="\x">\x (Escape sequence)</option>
            </select>
            <span className="form-hint">Prefix for each hex byte</span>
          </div>
          
          <div className="form-row">
            <label htmlFor="hexDelimiter">
              <i className="fas fa-grip-lines-vertical" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Delimiter
            </label>
            <select
              id="hexDelimiter"
              value={settings.hexDelimiter}
              onChange={(e) => updateSettings({ hexDelimiter: e.target.value as 'none' | 'space' | 'colon' })}
            >
              <option value="none">None</option>
              <option value="space">Space</option>
              <option value="colon">Colon (:)</option>
            </select>
            <span className="form-hint">Separator between hex bytes</span>
          </div>
        </div>
      )}
      
      {/* Unicode Options */}
      {settings.encodingType === 'unicode' && (
        <div className="settings-group">
          <h3><i className="fas fa-globe"></i> Unicode Options</h3>
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="escapeNonAscii"
              checked={settings.escapeNonAscii}
              onChange={(e) => updateSettings({ escapeNonAscii: e.target.checked })}
              disabled={settings.escapeAll}
            />
            <label htmlFor="escapeNonAscii">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Escape Non-ASCII</span>
                <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🌍 Only escape characters with code {'>'} 127</span>
              </div>
            </label>
          </div>
          
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="escapeAll"
              checked={settings.escapeAll}
              onChange={(e) => updateSettings({ escapeAll: e.target.checked })}
            />
            <label htmlFor="escapeAll">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>Escape All Characters</span>
                <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Escape every character to \uXXXX</span>
              </div>
            </label>
          </div>
        </div>
      )}
      
      {/* HTML Entity - no specific options */}
      {settings.encodingType === 'htmlEntity' && (
        <div className="settings-group">
          <h3><i className="fas fa-code"></i> HTML Entity Options</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            All characters will be encoded as numeric HTML entities ({"&#XXX;"}). 
            This ensures safe embedding in HTML documents and prevents XSS attacks.
          </p>
        </div>
      )}
    </div>
  );
}
