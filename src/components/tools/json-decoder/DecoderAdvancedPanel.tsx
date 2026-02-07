'use client';

import { useDecoderStore } from '@/store/decoder';
import { getDecodingTypeName } from '@/lib/decoder/converter';

export function DecoderAdvancedPanel() {
  const { settings, decodingChain, isValidJSON, resetSettings } = useDecoderStore();
  
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
          <div><strong>Mode:</strong> {getDecodingTypeName(settings.decodingType)}</div>
          <div><strong>Auto-Detect:</strong> {settings.autoDetect ? 'Enabled' : 'Disabled'}</div>
          <div><strong>Recursive:</strong> {settings.recursiveDecode ? `Yes (max ${settings.maxIterations})` : 'No'}</div>
          <div><strong>Format Output:</strong> {settings.formatOutput ? 'Yes' : 'No'}</div>
          {settings.formatOutput && (
            <>
              <div><strong>Indentation:</strong> {settings.indentation === 'tab' ? 'Tab' : `${settings.indentation} spaces`}</div>
              <div><strong>Sort Keys:</strong> {settings.sortKeys ? 'Yes' : 'No'}</div>
            </>
          )}
        </div>
      </div>
      
      {decodingChain.length > 0 && (
        <div className="settings-group">
          <h3><i className="fas fa-link"></i> Decoding Chain</h3>
          
          <div style={{ 
            background: 'var(--input-bg)', 
            padding: '12px', 
            borderRadius: '6px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {decodingChain.map((step, index) => (
                <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {getDecodingTypeName(step as 'url')}
                  </span>
                  {index < decodingChain.length - 1 && (
                    <i className="fas fa-arrow-right" style={{ color: 'var(--text-secondary)' }}></i>
                  )}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '8px', color: isValidJSON ? 'var(--success)' : 'var(--warning)' }}>
              <i className={`fas ${isValidJSON ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {' '}
              {isValidJSON ? 'Output is valid JSON' : 'Output is not valid JSON'}
            </div>
          </div>
        </div>
      )}
      
      <div className="settings-group">
        <h3><i className="fas fa-book"></i> Quick Reference</h3>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>URL:</strong> %7B → {"{"} | %22 → {'"'}</p>
          <p><strong>Base64:</strong> eyJ... → {"{"}{'"'}...</p>
          <p><strong>Hex:</strong> 7b22 → {"{"}{'"'}</p>
          <p><strong>HTML:</strong> {"&#60;"} → {"<"} | {"&#62;"} → {">"}</p>
          <p><strong>Unicode:</strong> \u0041 → A</p>
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
