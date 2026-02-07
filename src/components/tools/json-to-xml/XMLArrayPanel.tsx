'use client';

import { useXMLStore } from '@/store/xml';

export function XMLArrayPanel() {
  const { settings, updateSettings } = useXMLStore();

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-list"></i> Array Handling</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="arrayWrapper"
            checked={settings.arrayWrapper}
            onChange={(e) => updateSettings({ arrayWrapper: e.target.checked })}
          />
          <label htmlFor="arrayWrapper">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Array Wrapper Element</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>📦 Wrap arrays in a container element</span>
            </div>
          </label>
        </div>

        {settings.arrayWrapper && (
          <div className="form-row">
            <label htmlFor="arrayWrapperName">
              <i className="fas fa-tag" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Wrapper Name
            </label>
            <input
              type="text"
              id="arrayWrapperName"
              value={settings.arrayWrapperName}
              onChange={(e) => updateSettings({ arrayWrapperName: e.target.value || 'items' })}
              placeholder="items"
            />
            <span className="form-hint">Name for the array wrapper element</span>
          </div>
        )}

        <div className="form-row">
          <label htmlFor="itemNaming">
            <i className="fas fa-i-cursor" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Item Element Naming
          </label>
          <select
            id="itemNaming"
            value={settings.itemNaming}
            onChange={(e) => updateSettings({ itemNaming: e.target.value as typeof settings.itemNaming })}
          >
            <option value="singular">Singular form (users → user)</option>
            <option value="custom">Custom name</option>
            <option value="parent">Use parent key name</option>
          </select>
          <span className="form-hint">How to name individual array item elements</span>
        </div>

        {settings.itemNaming === 'custom' && (
          <div className="form-row">
            <label htmlFor="customItemName">
              <i className="fas fa-pencil-alt" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Custom Item Name
            </label>
            <input
              type="text"
              id="customItemName"
              value={settings.customItemName}
              onChange={(e) => updateSettings({ customItemName: e.target.value || 'item' })}
              placeholder="item"
            />
            <span className="form-hint">Custom name for array item elements</span>
          </div>
        )}

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="includeArrayIndex"
            checked={settings.includeArrayIndex}
            onChange={(e) => updateSettings({ includeArrayIndex: e.target.checked })}
          />
          <label htmlFor="includeArrayIndex">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Include Index Attribute</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>#️⃣ Add index=&quot;0&quot; to array items</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
