'use client';

import { useYAMLStore } from '@/store/yaml';

export function YAMLAdvancedPanel() {
  const { settings, updateSettings } = useYAMLStore();

  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-cogs"></i> Advanced Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
          />
          <label htmlFor="sortKeys">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort keys alphabetically</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Organize object keys in A-Z order</span>
            </div>
          </label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="noRefs"
            checked={settings.noRefs}
            onChange={(e) => updateSettings({ noRefs: e.target.checked })}
          />
          <label htmlFor="noRefs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>No circular references</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔗 Prevent self-referencing objects</span>
            </div>
          </label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="forceQuotes"
            checked={settings.forceQuotes}
            onChange={(e) => updateSettings({ forceQuotes: e.target.checked })}
          />
          <label htmlFor="forceQuotes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Force quotes on all strings</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>✍️ Always add quotes around text values</span>
            </div>
          </label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="condenseFlow"
            checked={settings.condenseFlow}
            onChange={(e) => updateSettings({ condenseFlow: e.target.checked })}
          />
          <label htmlFor="condenseFlow">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Condense flow style</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>⚡ Remove spaces in inline collections</span>
            </div>
          </label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="noCompatMode"
            checked={settings.noCompatMode}
            onChange={(e) => updateSettings({ noCompatMode: e.target.checked })}
          />
          <label htmlFor="noCompatMode">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>No compatibility mode</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🚀 Use modern YAML features only</span>
            </div>
          </label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="skipInvalid"
            checked={settings.skipInvalid}
            onChange={(e) => updateSettings({ skipInvalid: e.target.checked })}
          />
          <label htmlFor="skipInvalid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Skip invalid values</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>⚠️ Ignore problematic data during conversion</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
