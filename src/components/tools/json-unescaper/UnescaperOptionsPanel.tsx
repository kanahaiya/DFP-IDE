'use client';

import { useUnescaperStore } from '@/store/unescaper';

export function UnescaperOptionsPanel() {
  const { settings, updateSettings } = useUnescaperStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-align-left"></i> Output Formatting</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="formatOutput"
            checked={settings.formatOutput}
            onChange={(e) => updateSettings({ formatOutput: e.target.checked })}
          />
          <label htmlFor="formatOutput">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Format Output</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>✨ Pretty-print if result is valid JSON</span>
            </div>
          </label>
        </div>
        
        {settings.formatOutput && (
          <div className="form-row" style={{ marginTop: '12px' }}>
            <label htmlFor="indentation">
              <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Indentation
            </label>
            <select
              id="indentation"
              value={settings.indentation}
              onChange={(e) => {
                const val = e.target.value;
                updateSettings({ indentation: val === 'tab' ? 'tab' : parseInt(val) as 2 | 4 });
              }}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tab</option>
            </select>
            <span className="form-hint">Spaces/tab per indentation level</span>
          </div>
        )}
        
        <div className="checkbox-row" style={{ marginTop: '12px' }}>
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
            disabled={!settings.formatOutput}
          />
          <label htmlFor="sortKeys">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort Keys</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Alphabetically sort object keys</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-cog"></i> Processing Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="removeOuterQuotes"
            checked={settings.removeOuterQuotes}
            onChange={(e) => updateSettings({ removeOuterQuotes: e.target.checked })}
          />
          <label htmlFor="removeOuterQuotes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Remove Outer Quotes</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Strip surrounding quotation marks</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
