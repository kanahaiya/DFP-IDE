'use client';

import { useCSVStore, type Indentation } from '@/store/csv';

/**
 * Panel for JSON formatting options
 */
export function FormattingPanel() {
  const { settings, updateSettings } = useCSVStore();

  const handleIndentationChange = (indentation: Indentation) => {
    updateSettings({ indentation });
  };

  return (
    <div className="settings-panel-content">
      {/* Indentation */}
      <div className="settings-group">
        <h3><i className="fas fa-indent"></i> Indentation</h3>
        
        <div className="form-row">
          <label htmlFor="indentation-select">Spacing</label>
          <select
            id="indentation-select"
            value={settings.indentation}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'tab' || value === 'minified') {
                handleIndentationChange(value);
              } else {
                handleIndentationChange(parseInt(value) as 2 | 4);
              }
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value="tab">Tab</option>
            <option value="minified">Minified (no spaces)</option>
          </select>
        </div>
      </div>

      {/* Sorting */}
      <div className="settings-group">
        <h3><i className="fas fa-sort-alpha-down"></i> Sorting</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
          />
          <label htmlFor="sortKeys">Sort keys alphabetically</label>
        </div>
      </div>

      {/* Compact Mode */}
      <div className="settings-group">
        <h3><i className="fas fa-compress"></i> Compact Mode</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="compactOutput"
            checked={settings.compactOutput}
            onChange={(e) => updateSettings({ compactOutput: e.target.checked })}
          />
          <label htmlFor="compactOutput">Compact output</label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="settings-group">
        <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
        
        <button
          className="btn btn-secondary"
          style={{ width: '100%' }}
          onClick={() => updateSettings({
            indentation: 2,
            sortKeys: false,
            compactOutput: false,
          })}
        >
          <i className="fas fa-undo"></i>
          Reset Formatting
        </button>
      </div>
    </div>
  );
}
