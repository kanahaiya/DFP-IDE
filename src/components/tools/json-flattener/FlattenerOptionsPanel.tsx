'use client';

import { useFlattenerStore } from '@/store/flattener';

export function FlattenerOptionsPanel() {
  const { settings, updateSettings } = useFlattenerStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-layer-group"></i> Depth Control</h3>
        
        <div className="form-row">
          <label htmlFor="maxDepth">
            <i className="fas fa-sort-amount-down" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Max Depth
          </label>
          <select
            id="maxDepth"
            value={settings.maxDepth === Infinity ? 'unlimited' : settings.maxDepth}
            onChange={(e) => {
              const value = e.target.value;
              updateSettings({ 
                maxDepth: value === 'unlimited' ? Infinity : parseInt(value) 
              });
            }}
          >
            <option value="unlimited">Unlimited</option>
            <option value="1">1 Level</option>
            <option value="2">2 Levels</option>
            <option value="3">3 Levels</option>
            <option value="5">5 Levels</option>
            <option value="10">10 Levels</option>
          </select>
          <span className="form-hint">Limit how deep to flatten nested objects</span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-edit"></i> Custom Separator</h3>
        
        <div className="form-row">
          <label htmlFor="customSeparator">
            <i className="fas fa-minus" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Override Separator
          </label>
          <input
            type="text"
            id="customSeparator"
            value={settings.customSeparator}
            onChange={(e) => updateSettings({ customSeparator: e.target.value })}
            placeholder="Leave empty to use notation default"
            maxLength={5}
          />
          <span className="form-hint">Custom separator overrides notation style</span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-cog"></i> Type Handling</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="preserveTypes"
            checked={settings.preserveTypes}
            onChange={(e) => updateSettings({ preserveTypes: e.target.checked })}
          />
          <label htmlFor="preserveTypes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Preserve Types</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Keep arrays and objects as-is at max depth
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
