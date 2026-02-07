'use client';

import { useEncoderStore } from '@/store/encoder';
import { getEncodingTypeName } from '@/lib/encoder/converter';

export function EncoderAdvancedPanel() {
  const { settings, resetSettings } = useEncoderStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-info-circle"></i> Current Configuration</h3>
        
        <div style={{ 
          background: 'var(--input-bg)', 
          padding: '12px', 
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          <div><strong>Encoding:</strong> {getEncodingTypeName(settings.encodingType)}</div>
          <div><strong>Preprocessing:</strong> {settings.minifyFirst ? 'Minify' : settings.formatFirst ? 'Format' : 'None'}</div>
          
          {(settings.encodingType === 'url' || settings.encodingType === 'uri') && (
            <div><strong>Space as +:</strong> {settings.spaceAsPlus ? 'Yes' : 'No'}</div>
          )}
          
          {(settings.encodingType === 'base64' || settings.encodingType === 'base64url') && (
            <>
              <div><strong>URL-Safe:</strong> {settings.urlSafe || settings.encodingType === 'base64url' ? 'Yes' : 'No'}</div>
              <div><strong>Padding:</strong> {settings.includePadding ? 'Yes' : 'No'}</div>
            </>
          )}
          
          {settings.encodingType === 'hex' && (
            <>
              <div><strong>Case:</strong> {settings.uppercase ? 'Uppercase' : 'Lowercase'}</div>
              <div><strong>Prefix:</strong> {settings.hexPrefix === 'none' ? 'None' : settings.hexPrefix}</div>
              <div><strong>Delimiter:</strong> {settings.hexDelimiter === 'none' ? 'None' : settings.hexDelimiter}</div>
            </>
          )}
          
          {settings.encodingType === 'unicode' && (
            <>
              <div><strong>Escape Non-ASCII:</strong> {settings.escapeNonAscii ? 'Yes' : 'No'}</div>
              <div><strong>Escape All:</strong> {settings.escapeAll ? 'Yes' : 'No'}</div>
            </>
          )}
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-book"></i> Quick Reference</h3>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>URL:</strong> {"{"} → %7B | {"}"} → %7D | {'"'} → %22</p>
          <p><strong>Base64:</strong> Binary-safe, +33% size increase</p>
          <p><strong>Hex:</strong> 2 chars per byte, +100% size</p>
          <p><strong>HTML:</strong> {"<"} → {"&#60;"} | {">"} → {"&#62;"}</p>
          <p><strong>Unicode:</strong> é → \u00e9</p>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-tools"></i> Actions</h3>
        
        <button
          onClick={resetSettings}
          className="btn btn-secondary"
          style={{ width: '100%' }}
        >
          <i className="fas fa-undo"></i> Reset to Defaults
        </button>
      </div>
    </div>
  );
}
