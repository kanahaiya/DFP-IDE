'use client';

import React from 'react';
import type { JavaScriptGeneratorSettings, QuoteStyle } from '@/lib/javascript/types';

interface JavaScriptFormatPanelProps {
  settings: JavaScriptGeneratorSettings;
  updateSettings: (updates: Partial<JavaScriptGeneratorSettings>) => void;
}

export function JavaScriptFormatPanel({ settings, updateSettings }: JavaScriptFormatPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Quote Style</h3>

      {/* Quote Style */}
      <div className="settings-group">
        <label className="settings-label">String Quotes</label>
        <select
          className="settings-select"
          value={settings.quoteStyle}
          onChange={(e) => updateSettings({ quoteStyle: e.target.value as QuoteStyle })}
        >
          <option value="single">Single Quotes (&apos;)</option>
          <option value="double">Double Quotes (&quot;)</option>
        </select>
      </div>

      {/* Quote Keys */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="quoteKeys"
          checked={settings.quoteKeys}
          onChange={(e) => updateSettings({ quoteKeys: e.target.checked })}
        />
        <label htmlFor="quoteKeys">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Always Quote Keys</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Quote all object keys, even valid identifiers</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Punctuation</h3>

      {/* Trailing Comma */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="trailingComma"
          checked={settings.trailingComma}
          onChange={(e) => updateSettings({ trailingComma: e.target.checked })}
        />
        <label htmlFor="trailingComma">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Trailing Commas</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Add comma after last item in arrays/objects</span>
          </div>
        </label>
      </div>

      {/* Semicolons */}
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="semicolon"
          checked={settings.semicolon}
          onChange={(e) => updateSettings({ semicolon: e.target.checked })}
        />
        <label htmlFor="semicolon">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>Semicolons</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>Include semicolons at end of statements</span>
          </div>
        </label>
      </div>

      <h3 className="settings-section-title" style={{ marginTop: '1.5rem' }}>Indentation</h3>

      {/* Indentation */}
      <div className="settings-group">
        <label className="settings-label">Indentation</label>
        <select
          className="settings-select"
          value={settings.useSpaces ? settings.indentSize : 'tab'}
          onChange={(e) => {
            if (e.target.value === 'tab') {
              updateSettings({ useSpaces: false });
            } else {
              updateSettings({ useSpaces: true, indentSize: Number(e.target.value) });
            }
          }}
        >
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tabs</option>
        </select>
      </div>
    </div>
  );
}
