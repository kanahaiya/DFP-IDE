'use client';

import { useYAMLStore } from '@/store/yaml';

export function YAMLFormatPanel() {
  const { settings, updateSettings } = useYAMLStore();

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Format Options</h3>
        
        <div className="form-row">
          <label htmlFor="indentation">
            <i className="fas fa-indent" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Indentation
          </label>
          <select
            id="indentation"
            value={settings.indentation}
            onChange={(e) => {
              const value = e.target.value;
              updateSettings({ indentation: value === 'tab' ? 'tab' : parseInt(value) as 2 | 4 });
            }}
          >
            <option value="2">2 spaces (recommended)</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab character</option>
          </select>
          <span className="form-hint">⚙️ Controls spacing depth for nested elements</span>
        </div>

        <div className="form-row">
          <label htmlFor="quoteStyle">
            <i className="fas fa-quote-right" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Quote Style
          </label>
          <select
            id="quoteStyle"
            value={settings.quoteStyle}
            onChange={(e) => updateSettings({ quoteStyle: e.target.value as typeof settings.quoteStyle })}
          >
            <option value="auto">Auto-detect</option>
            <option value="single">Single quotes (&apos;text&apos;)</option>
            <option value="double">Double quotes (&quot;text&quot;)</option>
            <option value="none">No quotes (when possible)</option>
          </select>
          <span className="form-hint">📝 How string values are quoted in output</span>
        </div>

        <div className="form-row">
          <label htmlFor="flowStyle">
            <i className="fas fa-stream" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Flow Style
          </label>
          <select
            id="flowStyle"
            value={settings.flowStyle}
            onChange={(e) => updateSettings({ flowStyle: e.target.value as typeof settings.flowStyle })}
          >
            <option value="block">Block style (most readable)</option>
            <option value="flow">Flow style (compact)</option>
            <option value="mixed">Mixed (automatic)</option>
          </select>
          <span className="form-hint">🎨 Block style uses newlines, flow style is inline</span>
        </div>

        <div className="form-row">
          <label htmlFor="lineWidth">
            <i className="fas fa-arrows-alt-h" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Line Width
          </label>
          <input
            type="number"
            id="lineWidth"
            value={settings.lineWidth}
            onChange={(e) => updateSettings({ lineWidth: parseInt(e.target.value) })}
            min={-1}
            max={200}
            placeholder="Enter line width"
          />
          <span className="form-hint">💡 Maximum characters per line (-1 = unlimited)</span>
        </div>
      </div>
    </div>
  );
}
