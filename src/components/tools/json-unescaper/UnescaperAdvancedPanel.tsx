'use client';

import { useUnescaperStore } from '@/store/unescaper';
import { getUnescapeModeName } from '@/lib/unescaper/converter';

export function UnescaperAdvancedPanel() {
  const { settings, resetSettings, unescapeChain, isValidJSON, escapeLevel } = useUnescaperStore();
  
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
          <div><strong>Mode:</strong> {getUnescapeModeName(settings.unescapeMode)}</div>
          <div><strong>Format Output:</strong> {settings.formatOutput ? 'Yes' : 'No'}</div>
          {settings.formatOutput && (
            <>
              <div><strong>Indentation:</strong> {settings.indentation === 'tab' ? 'Tab' : `${settings.indentation} spaces`}</div>
              <div><strong>Sort Keys:</strong> {settings.sortKeys ? 'Yes' : 'No'}</div>
            </>
          )}
          <div><strong>Max Depth:</strong> {settings.maxDepth}</div>
          <div><strong>Remove Outer Quotes:</strong> {settings.removeOuterQuotes ? 'Yes' : 'No'}</div>
        </div>
      </div>
      
      {(unescapeChain.length > 0 || escapeLevel > 0) && (
        <div className="settings-group">
          <h3><i className="fas fa-link"></i> Unescape Details</h3>
          
          <div style={{ 
            background: 'var(--input-bg)', 
            padding: '12px', 
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <div><strong>Detected Escape Level:</strong> {escapeLevel}</div>
            <div><strong>Output is Valid JSON:</strong> {isValidJSON ? 'Yes ✓' : 'No'}</div>
            {unescapeChain.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <strong>Unescape Chain:</strong>
                <div style={{ 
                  marginTop: '4px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {unescapeChain.map((step, i) => (
                    <span 
                      key={i}
                      style={{
                        background: 'var(--primary-bg)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      {i + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="settings-group">
        <h3><i className="fas fa-book"></i> Escape Sequence Reference</h3>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>\\&quot;</strong> → &quot; (double quote)</p>
          <p><strong>\\\\</strong> → \\ (backslash)</p>
          <p><strong>\\/</strong> → / (forward slash)</p>
          <p><strong>\\n</strong> → newline</p>
          <p><strong>\\t</strong> → tab</p>
          <p><strong>\\r</strong> → carriage return</p>
          <p><strong>\\uXXXX</strong> → unicode character</p>
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
