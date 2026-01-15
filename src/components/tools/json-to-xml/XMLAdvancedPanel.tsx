'use client';

import { useXMLStore } from '@/store/xml';

export function XMLAdvancedPanel() {
  const { settings, updateSettings } = useXMLStore();

  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-cogs"></i> Data Type Handling</h3>
        
        <div className="form-row">
          <label htmlFor="cdataMode">
            <i className="fas fa-shield-alt" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            CDATA Wrapping
          </label>
          <select
            id="cdataMode"
            value={settings.cdataMode}
            onChange={(e) => updateSettings({ cdataMode: e.target.value as typeof settings.cdataMode })}
          >
            <option value="auto">Auto (wrap when needed)</option>
            <option value="force">Force (always wrap text)</option>
            <option value="disabled">Disabled (use entity encoding)</option>
          </select>
          <span className="form-hint">How to handle special characters in text</span>
        </div>

        <div className="form-row">
          <label htmlFor="nullHandling">
            <i className="fas fa-ban" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Null Value Handling
          </label>
          <select
            id="nullHandling"
            value={settings.nullHandling}
            onChange={(e) => updateSettings({ nullHandling: e.target.value as typeof settings.nullHandling })}
          >
            <option value="self-closing">Self-closing tag (&lt;key /&gt;)</option>
            <option value="empty">Empty element (&lt;key&gt;&lt;/key&gt;)</option>
            <option value="omit">Omit entirely</option>
            <option value="custom">Custom text</option>
          </select>
          <span className="form-hint">How to represent null values in XML</span>
        </div>

        {settings.nullHandling === 'custom' && (
          <div className="form-row">
            <label htmlFor="customNullText">
              <i className="fas fa-pencil-alt" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Custom Null Text
            </label>
            <input
              type="text"
              id="customNullText"
              value={settings.customNullText}
              onChange={(e) => updateSettings({ customNullText: e.target.value })}
              placeholder="null"
            />
            <span className="form-hint">Text to display for null values</span>
          </div>
        )}

        <div className="form-row">
          <label htmlFor="booleanFormat">
            <i className="fas fa-toggle-on" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Boolean Format
          </label>
          <select
            id="booleanFormat"
            value={settings.booleanFormat}
            onChange={(e) => updateSettings({ booleanFormat: e.target.value as typeof settings.booleanFormat })}
          >
            <option value="lowercase">Lowercase (true/false)</option>
            <option value="capitalized">Capitalized (True/False)</option>
            <option value="numeric">Numeric (1/0)</option>
          </select>
          <span className="form-hint">How to format boolean values</span>
        </div>

        <div className="form-row">
          <label htmlFor="attributeMode">
            <i className="fas fa-tags" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Attribute Mode
          </label>
          <select
            id="attributeMode"
            value={settings.attributeMode}
            onChange={(e) => updateSettings({ attributeMode: e.target.value as typeof settings.attributeMode })}
          >
            <option value="elements">Elements only (default)</option>
            <option value="attributes">Use attributes</option>
            <option value="smart">Smart (primitives as attributes)</option>
          </select>
          <span className="form-hint">Convert properties to elements or attributes</span>
        </div>
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-globe"></i> Namespace Support</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="namespaceEnabled"
            checked={settings.namespaceEnabled}
            onChange={(e) => updateSettings({ namespaceEnabled: e.target.checked })}
          />
          <label htmlFor="namespaceEnabled">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Enable Namespace</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔗 Add XML namespace to root element</span>
            </div>
          </label>
        </div>

        {settings.namespaceEnabled && (
          <>
            <div className="form-row">
              <label htmlFor="namespaceUri">
                <i className="fas fa-external-link-alt" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
                Namespace URI
              </label>
              <input
                type="text"
                id="namespaceUri"
                value={settings.namespaceUri}
                onChange={(e) => updateSettings({ namespaceUri: e.target.value })}
                placeholder="http://example.com/schema"
              />
              <span className="form-hint">The namespace URI</span>
            </div>

            <div className="form-row">
              <label htmlFor="namespacePrefix">
                <i className="fas fa-at" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
                Namespace Prefix
              </label>
              <input
                type="text"
                id="namespacePrefix"
                value={settings.namespacePrefix}
                onChange={(e) => updateSettings({ namespacePrefix: e.target.value })}
                placeholder="ns (optional)"
              />
              <span className="form-hint">Optional prefix (leave empty for default namespace)</span>
            </div>
          </>
        )}
      </div>

      <div className="settings-group">
        <h3><i className="fas fa-key"></i> Key Transformation</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
          />
          <label htmlFor="sortKeys">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort Keys Alphabetically</span>
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>🔤 Creates deterministic, git-friendly output</span>
            </div>
          </label>
        </div>

        <div className="form-row">
          <label htmlFor="keyTransform">
            <i className="fas fa-text-height" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Key Transform
          </label>
          <select
            id="keyTransform"
            value={settings.keyTransform}
            onChange={(e) => updateSettings({ keyTransform: e.target.value as typeof settings.keyTransform })}
          >
            <option value="none">None (keep original)</option>
            <option value="lowercase">lowercase</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="camelCase">camelCase</option>
            <option value="kebab-case">kebab-case</option>
          </select>
          <span className="form-hint">Transform JSON keys to different naming convention</span>
        </div>
      </div>
    </div>
  );
}
