'use client';

import { useUnflattenStore } from '@/store/unflatten';

export function UnflattenAdvancedPanel() {
  const { settings, updateSettings } = useUnflattenStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-exchange-alt"></i> Type Preservation</h3>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '-8px', marginBottom: '12px' }}>
          Convert string values back to their original types
        </p>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="preserveNumbers"
            checked={settings.preserveNumbers}
            onChange={(e) => updateSettings({ preserveNumbers: e.target.checked })}
          />
          <label htmlFor="preserveNumbers">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Preserve Numbers</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Convert &quot;123&quot; → 123
              </span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="preserveBooleans"
            checked={settings.preserveBooleans}
            onChange={(e) => updateSettings({ preserveBooleans: e.target.checked })}
          />
          <label htmlFor="preserveBooleans">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Preserve Booleans</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Convert &quot;true&quot;/&quot;false&quot; → true/false
              </span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="preserveNull"
            checked={settings.preserveNull}
            onChange={(e) => updateSettings({ preserveNull: e.target.checked })}
          />
          <label htmlFor="preserveNull">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Preserve Null</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Convert &quot;null&quot; → null
              </span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-info-circle"></i> About Type Preservation</h3>
        <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
          When JSON is flattened, some converters stringify all values. Type preservation 
          attempts to restore the original data types by analyzing string values. 
          Disable if you want to keep all values as strings.
        </p>
      </div>
    </div>
  );
}
