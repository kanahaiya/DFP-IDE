'use client';

import { useCSVStore, type Delimiter } from '@/store/csv';

/**
 * Settings panel for CSV parsing configuration
 */
export function SettingsPanel() {
  const { settings, updateSettings } = useCSVStore();

  const handleDelimiterChange = (delimiter: Delimiter) => {
    updateSettings({ delimiter });
  };

  const handleCustomDelimiterChange = (customDelimiter: string) => {
    updateSettings({ customDelimiter });
  };

  return (
    <div className="settings-panel-content">
      {/* Delimiter Settings */}
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Delimiter</h3>
        
        <div className="form-row">
          <label htmlFor="delimiter-select">Delimiter Type</label>
          <select
            id="delimiter-select"
            value={settings.delimiter}
            onChange={(e) => handleDelimiterChange(e.target.value as Delimiter)}
          >
            <option value="auto">Auto-detect</option>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab (\t)</option>
            <option value="|">Pipe (|)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {settings.delimiter === 'custom' && (
          <div className="form-row">
            <label htmlFor="custom-delimiter">Custom Delimiter</label>
            <input
              type="text"
              id="custom-delimiter"
              value={settings.customDelimiter}
              onChange={(e) => handleCustomDelimiterChange(e.target.value)}
              maxLength={1}
              placeholder="Enter delimiter"
            />
          </div>
        )}
      </div>

      {/* CSV Structure */}
      <div className="settings-group">
        <h3><i className="fas fa-file-csv"></i> CSV Structure</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="hasHeader"
            checked={settings.hasHeader}
            onChange={(e) => updateSettings({ hasHeader: e.target.checked })}
          />
          <label htmlFor="hasHeader">First row as header</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="trimWhitespace"
            checked={settings.trimWhitespace}
            onChange={(e) => updateSettings({ trimWhitespace: e.target.checked })}
          />
          <label htmlFor="trimWhitespace">Trim whitespace</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="skipEmptyLines"
            checked={settings.skipEmptyLines}
            onChange={(e) => updateSettings({ skipEmptyLines: e.target.checked })}
          />
          <label htmlFor="skipEmptyLines">Skip empty lines</label>
        </div>
      </div>

      {/* Data Type Parsing */}
      <div className="settings-group">
        <h3><i className="fas fa-magic"></i> Data Type Parsing</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="parseNumbers"
            checked={settings.parseNumbers}
            onChange={(e) => updateSettings({ parseNumbers: e.target.checked })}
          />
          <label htmlFor="parseNumbers">Parse numbers</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="parseBooleans"
            checked={settings.parseBooleans}
            onChange={(e) => updateSettings({ parseBooleans: e.target.checked })}
          />
          <label htmlFor="parseBooleans">Parse booleans</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="parseNulls"
            checked={settings.parseNulls}
            onChange={(e) => updateSettings({ parseNulls: e.target.checked })}
          />
          <label htmlFor="parseNulls">Parse null values</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="parseDates"
            checked={settings.parseDates}
            onChange={(e) => updateSettings({ parseDates: e.target.checked })}
          />
          <label htmlFor="parseDates">Parse dates (ISO 8601)</label>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="settings-group">
        <h3><i className="fas fa-shield-alt"></i> Advanced Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="quoteHandling"
            checked={settings.quoteHandling}
            onChange={(e) => updateSettings({ quoteHandling: e.target.checked })}
          />
          <label htmlFor="quoteHandling">Handle quoted fields</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="escapeHandling"
            checked={settings.escapeHandling}
            onChange={(e) => updateSettings({ escapeHandling: e.target.checked })}
          />
          <label htmlFor="escapeHandling">Handle escape characters</label>
        </div>
      </div>
    </div>
  );
}
