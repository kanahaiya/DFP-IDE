'use client';

import { useXMLStore } from '@/store/xml';

export function XMLFormatPanel() {
  const { settings, updateSettings } = useXMLStore();

  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Format Options</h3>
        
        <div className="form-row">
          <label htmlFor="rootElement">
            <i className="fas fa-code" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Root Element
          </label>
          <input
            type="text"
            id="rootElement"
            value={settings.rootElement}
            onChange={(e) => updateSettings({ rootElement: e.target.value || 'root' })}
            placeholder="root"
          />
          <span className="form-hint">Name of the XML root element</span>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="includeDeclaration"
            checked={settings.includeDeclaration}
            onChange={(e) => updateSettings({ includeDeclaration: e.target.checked })}
          />
          <label htmlFor="includeDeclaration">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Include XML Declaration</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>📄 Add &lt;?xml version=&quot;1.0&quot;?&gt; header</span>
            </div>
          </label>
        </div>

        <div className="form-row">
          <label htmlFor="encoding">
            <i className="fas fa-font" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Encoding
          </label>
          <select
            id="encoding"
            value={settings.encoding}
            onChange={(e) => updateSettings({ encoding: e.target.value })}
          >
            <option value="UTF-8">UTF-8 (recommended)</option>
            <option value="UTF-16">UTF-16</option>
            <option value="ISO-8859-1">ISO-8859-1 (Latin-1)</option>
            <option value="US-ASCII">US-ASCII</option>
          </select>
          <span className="form-hint">Character encoding for XML output</span>
        </div>

        <div className="form-row">
          <label htmlFor="indentation">
            <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Indentation
          </label>
          <select
            id="indentation"
            value={settings.indentation}
            onChange={(e) => updateSettings({ indentation: e.target.value as typeof settings.indentation })}
          >
            <option value="2spaces">2 spaces (recommended)</option>
            <option value="4spaces">4 spaces</option>
            <option value="tabs">Tab character</option>
            <option value="none">No indentation (minified)</option>
          </select>
          <span className="form-hint">Controls spacing depth for nested elements</span>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="lineBreaks"
            checked={settings.lineBreaks}
            onChange={(e) => updateSettings({ lineBreaks: e.target.checked })}
          />
          <label htmlFor="lineBreaks">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Add Line Breaks</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>↵ Insert newlines between elements</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
