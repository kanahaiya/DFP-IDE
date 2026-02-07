'use client';

import { useEscaperStore } from '@/store/escaper';

export function EscaperOptionsPanel() {
  const { settings, updateSettings } = useEscaperStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Escape Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="wrapInQuotes"
            checked={settings.wrapInQuotes}
            onChange={(e) => updateSettings({ wrapInQuotes: e.target.checked })}
            disabled={settings.escapeMode === 'urlSafe'}
          />
          <label htmlFor="wrapInQuotes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Wrap in Quotes</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Add outer double quotes to output</span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="escapeSlash"
            checked={settings.escapeSlash}
            onChange={(e) => updateSettings({ escapeSlash: e.target.checked })}
            disabled={settings.escapeMode === 'urlSafe'}
          />
          <label htmlFor="escapeSlash">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Escape Forward Slash</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>/ Convert / to \/ (optional per RFC)</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-globe"></i> Unicode Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="unicodeEscape"
            checked={settings.unicodeEscape}
            onChange={(e) => updateSettings({ unicodeEscape: e.target.checked })}
            disabled={settings.escapeMode === 'urlSafe'}
          />
          <label htmlFor="unicodeEscape">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Unicode Escape</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🌍 Convert non-ASCII to \uXXXX format</span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="escapeNonAscii"
            checked={settings.escapeNonAscii}
            onChange={(e) => updateSettings({ escapeNonAscii: e.target.checked })}
            disabled={settings.escapeMode === 'urlSafe' || !settings.unicodeEscape}
          />
          <label htmlFor="escapeNonAscii">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>ASCII Only Output</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔠 Escape all characters with code {'>'} 127</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
