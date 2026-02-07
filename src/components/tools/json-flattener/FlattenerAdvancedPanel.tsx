'use client';

import { useFlattenerStore } from '@/store/flattener';

export function FlattenerAdvancedPanel() {
  const { settings, updateSettings } = useFlattenerStore();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-filter"></i> Value Filtering</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="ignoreNulls"
            checked={settings.ignoreNulls}
            onChange={(e) => updateSettings({ ignoreNulls: e.target.checked })}
          />
          <label htmlFor="ignoreNulls">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Ignore Nulls</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Exclude null and undefined values from output
              </span>
            </div>
          </label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="ignoreEmpty"
            checked={settings.ignoreEmpty}
            onChange={(e) => updateSettings({ ignoreEmpty: e.target.checked })}
          />
          <label htmlFor="ignoreEmpty">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Ignore Empty</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Exclude empty strings, arrays, and objects
              </span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-shield-alt"></i> Key Safety</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="safeMode"
            checked={settings.safeMode}
            onChange={(e) => updateSettings({ safeMode: e.target.checked })}
          />
          <label htmlFor="safeMode">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Safe Mode</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Escape special characters in keys (. [ ] / \)
              </span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-info-circle"></i> About Advanced Options</h3>
        <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
          These options help control the flattening process for edge cases. 
          <strong> Ignore Nulls/Empty</strong> reduces output size by excluding falsy values.
          <strong> Safe Mode</strong> prevents key conflicts when keys contain separator characters.
        </p>
      </div>
    </div>
  );
}
