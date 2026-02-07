'use client';

import { useUnflattenStore } from '@/store/unflatten';
import { getDelimiterTypes, getConflictModes } from '@/lib/unflatten/converter';
import type { DelimiterType, ConflictMode } from '@/lib/unflatten/converter';

export function UnflattenModePanel() {
  const { settings, updateSettings, detectedDelimiter } = useUnflattenStore();
  const delimiterTypes = getDelimiterTypes();
  const conflictModes = getConflictModes();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-minus"></i> Delimiter</h3>
        
        <div className="form-row">
          <label htmlFor="delimiter">
            <i className="fas fa-ellipsis-h" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Delimiter Type
          </label>
          <select
            id="delimiter"
            value={settings.delimiter}
            onChange={(e) => updateSettings({ delimiter: e.target.value as DelimiterType })}
          >
            {delimiterTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {delimiterTypes.find(t => t.value === settings.delimiter)?.description}
            {detectedDelimiter && (
              <span style={{ display: 'block', marginTop: '4px', color: 'var(--accent)' }}>
                <i className="fas fa-magic"></i> Detected: {detectedDelimiter}
              </span>
            )}
          </span>
        </div>
        
        {settings.delimiter === 'custom' && (
          <div className="form-row">
            <label htmlFor="customDelimiter">
              <i className="fas fa-edit" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Custom Delimiter
            </label>
            <input
              type="text"
              id="customDelimiter"
              value={settings.customDelimiter}
              onChange={(e) => updateSettings({ customDelimiter: e.target.value })}
              placeholder="Enter custom delimiter"
              maxLength={5}
            />
            <span className="form-hint">Enter your custom delimiter character(s)</span>
          </div>
        )}
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-exclamation-triangle"></i> Conflict Handling</h3>
        
        <div className="form-row">
          <label htmlFor="conflictMode">
            <i className="fas fa-code-branch" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            On Conflict
          </label>
          <select
            id="conflictMode"
            value={settings.conflictMode}
            onChange={(e) => updateSettings({ conflictMode: e.target.value as ConflictMode })}
          >
            {conflictModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {conflictModes.find(m => m.value === settings.conflictMode)?.description}
          </span>
        </div>
      </div>
    </div>
  );
}
