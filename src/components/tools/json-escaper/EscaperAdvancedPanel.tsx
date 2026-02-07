'use client';

import { useEscaperStore } from '@/store/escaper';
import { getEscapeModeName } from '@/lib/escaper/converter';

export function EscaperAdvancedPanel() {
  const { settings, resetSettings } = useEscaperStore();
  
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
          <div><strong>Mode:</strong> {getEscapeModeName(settings.escapeMode)}</div>
          <div><strong>Output Format:</strong> {settings.outputFormat === 'string' ? 'As-Is' : settings.outputFormat === 'minified' ? 'Minified' : 'Formatted'}</div>
          <div><strong>Wrap in Quotes:</strong> {settings.wrapInQuotes ? 'Yes' : 'No'}</div>
          <div><strong>Escape Slash:</strong> {settings.escapeSlash ? 'Yes' : 'No'}</div>
          <div><strong>Unicode Escape:</strong> {settings.unicodeEscape ? 'Yes' : 'No'}</div>
          {settings.unicodeEscape && (
            <div><strong>ASCII Only:</strong> {settings.escapeNonAscii ? 'Yes' : 'No'}</div>
          )}
          {settings.outputFormat === 'formatted' && (
            <div><strong>Indentation:</strong> {settings.indentation} spaces</div>
          )}
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-book"></i> Escape Sequence Reference</h3>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>{'"'}</strong> → {'\\"'} (double quote)</p>
          <p><strong>\\</strong> → \\\\ (backslash)</p>
          <p><strong>/</strong> → \\/ (optional)</p>
          <p><strong>newline</strong> → \\n</p>
          <p><strong>tab</strong> → \\t</p>
          <p><strong>carriage return</strong> → \\r</p>
          <p><strong>unicode</strong> → \\uXXXX</p>
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
