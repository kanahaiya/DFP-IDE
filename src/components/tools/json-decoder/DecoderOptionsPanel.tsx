'use client';

import { useDecoderStore } from '@/store/decoder';

export function DecoderOptionsPanel() {
  const { settings, updateSettings } = useDecoderStore();
  
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
              <span>Format JSON Output</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>✨ Pretty print decoded JSON with indentation</span>
            </div>
          </label>
        </div>
        
        <div className="form-row">
          <label htmlFor="indentation">
            <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Indentation
          </label>
          <select
            id="indentation"
            value={settings.indentation}
            onChange={(e) => {
              const val = e.target.value;
              updateSettings({ 
                indentation: val === 'tab' ? 'tab' : parseInt(val) as 2 | 4 
              });
            }}
            disabled={!settings.formatOutput}
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">Tab</option>
          </select>
          <span className="form-hint">Spacing for nested elements</span>
        </div>
        
        <div className="checkbox-row">
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
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Sort JSON object keys alphabetically</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Decoding Limits</h3>
        
        <div className="form-row">
          <label htmlFor="maxIterations">
            <i className="fas fa-repeat" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Max Iterations
          </label>
          <select
            id="maxIterations"
            value={settings.maxIterations}
            onChange={(e) => updateSettings({ maxIterations: parseInt(e.target.value) })}
          >
            <option value="3">3 iterations</option>
            <option value="5">5 iterations</option>
            <option value="10">10 iterations</option>
            <option value="20">20 iterations</option>
          </select>
          <span className="form-hint">Maximum decoding layers for recursive decoding</span>
        </div>
      </div>
    </div>
  );
}
