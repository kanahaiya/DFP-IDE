'use client';

import { useEscaperStore } from '@/store/escaper';
import { getEscapeModes, getOutputFormats } from '@/lib/escaper/converter';
import type { EscapeMode, OutputFormat } from '@/lib/escaper/converter';

export function EscaperModePanel() {
  const { settings, updateSettings } = useEscaperStore();
  const escapeModes = getEscapeModes();
  const outputFormats = getOutputFormats();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-shield-alt"></i> Escape Mode</h3>
        
        <div className="form-row">
          <label htmlFor="escapeMode">
            <i className="fas fa-code" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Select Mode
          </label>
          <select
            id="escapeMode"
            value={settings.escapeMode}
            onChange={(e) => updateSettings({ escapeMode: e.target.value as EscapeMode })}
          >
            {escapeModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {escapeModes.find(m => m.value === settings.escapeMode)?.description}
          </span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-align-left"></i> Output Format</h3>
        
        <div className="form-row">
          <label htmlFor="outputFormat">
            <i className="fas fa-file-alt" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Preprocessing
          </label>
          <select
            id="outputFormat"
            value={settings.outputFormat}
            onChange={(e) => updateSettings({ outputFormat: e.target.value as OutputFormat })}
          >
            {outputFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {outputFormats.find(f => f.value === settings.outputFormat)?.description}
          </span>
        </div>
        
        {settings.outputFormat === 'formatted' && (
          <div className="form-row">
            <label htmlFor="indentation">
              <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Indentation
            </label>
            <select
              id="indentation"
              value={settings.indentation}
              onChange={(e) => updateSettings({ indentation: parseInt(e.target.value) as 2 | 4 })}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
            <span className="form-hint">Spaces per indentation level</span>
          </div>
        )}
      </div>
    </div>
  );
}
