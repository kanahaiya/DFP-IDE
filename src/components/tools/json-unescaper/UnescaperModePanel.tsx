'use client';

import { useUnescaperStore } from '@/store/unescaper';
import { getUnescapeModes } from '@/lib/unescaper/converter';
import type { UnescapeMode } from '@/lib/unescaper/converter';

export function UnescaperModePanel() {
  const { settings, updateSettings, escapeLevel } = useUnescaperStore();
  const unescapeModes = getUnescapeModes();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-unlock"></i> Unescape Mode</h3>
        
        <div className="form-row">
          <label htmlFor="unescapeMode">
            <i className="fas fa-code" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Select Mode
          </label>
          <select
            id="unescapeMode"
            value={settings.unescapeMode}
            onChange={(e) => updateSettings({ unescapeMode: e.target.value as UnescapeMode })}
          >
            {unescapeModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {unescapeModes.find(m => m.value === settings.unescapeMode)?.description}
          </span>
        </div>
        
        {escapeLevel > 0 && (
          <div 
            className="escape-level-indicator"
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'var(--primary-bg)',
              borderRadius: '6px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-layer-group" style={{ color: 'var(--primary)' }}></i>
            <span>Detected Escape Level: <strong>{escapeLevel}</strong></span>
          </div>
        )}
      </div>
      
      {(settings.unescapeMode === 'multiLayer' || settings.unescapeMode === 'auto') && (
        <div className="settings-group">
          <h3><i className="fas fa-sitemap"></i> Multi-Layer Options</h3>
          
          <div className="form-row">
            <label htmlFor="maxDepth">
              <i className="fas fa-arrows-alt-v" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Max Depth
            </label>
            <select
              id="maxDepth"
              value={settings.maxDepth}
              onChange={(e) => updateSettings({ maxDepth: parseInt(e.target.value) })}
            >
              <option value="3">3 levels</option>
              <option value="5">5 levels</option>
              <option value="10">10 levels</option>
            </select>
            <span className="form-hint">Maximum nesting depth to unescape</span>
          </div>
        </div>
      )}
    </div>
  );
}
