'use client';

import { useUnflattenStore } from '@/store/unflatten';

export function UnflattenOptionsPanel() {
  const { settings, updateSettings } = useUnflattenStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-list"></i> Array Detection</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="autoDetectArrays"
            checked={settings.autoDetectArrays}
            onChange={(e) => updateSettings({ autoDetectArrays: e.target.checked })}
          />
          <label htmlFor="autoDetectArrays">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Auto-Detect Arrays</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Recognize [0], [1] patterns as array indices
              </span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="forceArrayConversion"
            checked={settings.forceArrayConversion}
            onChange={(e) => updateSettings({ forceArrayConversion: e.target.checked })}
          />
          <label htmlFor="forceArrayConversion">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Force Array Conversion</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Treat all numeric keys as array indices
              </span>
            </div>
          </label>
        </div>
      </div>
      
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
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Pretty-print with indentation
              </span>
            </div>
          </label>
        </div>
        
        {settings.formatOutput && (
          <div className="form-row">
            <label htmlFor="indentation">
              <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Indentation
            </label>
            <select
              id="indentation"
              value={settings.indentation}
              onChange={(e) => {
                const value = e.target.value;
                updateSettings({ 
                  indentation: value === 'tab' ? 'tab' : parseInt(value) as 2 | 4 
                });
              }}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tabs</option>
            </select>
            <span className="form-hint">Spaces or tabs per level</span>
          </div>
        )}
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
          />
          <label htmlFor="sortKeys">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort Keys</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Alphabetically sort object keys
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
