'use client';

import React from 'react';
import { useJSONDiffStore } from '@/store/jsonDiff';

export function ComparisonOptionsPanel() {
  const { settings, updateSettings } = useJSONDiffStore();
  
  return (
    <div className="settings-panel">
      <div className="panel-section">
        <h3 className="section-title">Array Comparison</h3>
        <div className="form-group">
          <label htmlFor="arrayStrategy">Strategy</label>
          <select
            id="arrayStrategy"
            value={settings.arrayStrategy}
            onChange={(e) => updateSettings({ arrayStrategy: e.target.value as 'index' | 'identifier' | 'lcs' })}
            className="select-input"
          >
            <option value="identifier">Identifier-based</option>
            <option value="lcs">LCS Algorithm</option>
            <option value="index">Index-based</option>
          </select>
          <p className="helper-text">
            {settings.arrayStrategy === 'identifier' && 'Match array items by id/uuid/key fields'}
            {settings.arrayStrategy === 'lcs' && 'Use Longest Common Subsequence algorithm'}
            {settings.arrayStrategy === 'index' && 'Match items by array index'}
          </p>
        </div>
        
        {settings.arrayStrategy === 'identifier' && (
          <div className="form-group">
            <label htmlFor="identifierFields">ID Fields (comma-separated)</label>
            <input
              type="text"
              id="identifierFields"
              value={settings.identifierFields.join(', ')}
              onChange={(e) => updateSettings({ 
                identifierFields: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="text-input"
              placeholder="id, uuid, key, _id"
            />
          </div>
        )}
      </div>
      
      <div className="panel-section">
        <h3 className="section-title">Ignore Options</h3>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.ignoreCaseKeys}
              onChange={(e) => updateSettings({ ignoreCaseKeys: e.target.checked })}
            />
            <span>Ignore Key Case</span>
          </label>
          <p className="helper-text">Treat object keys like &quot;apiKey&quot; and &quot;APIKey&quot; as equal</p>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.ignoreCaseValues}
              onChange={(e) => updateSettings({ ignoreCaseValues: e.target.checked })}
            />
            <span>Ignore Value Case</span>
          </label>
          <p className="helper-text">Treat string values like &quot;ABC&quot; and &quot;abc&quot; as equal</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.ignoreWhitespace}
              onChange={(e) => updateSettings({ ignoreWhitespace: e.target.checked })}
            />
            <span>Ignore Whitespace</span>
          </label>
          <p className="helper-text">Ignore spacing differences in strings</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.ignoreKeyOrder}
              onChange={(e) => updateSettings({ ignoreKeyOrder: e.target.checked })}
            />
            <span>Ignore Key Order</span>
          </label>
          <p className="helper-text">Order of object keys doesn&apos;t matter</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.ignoreArrayOrder}
              onChange={(e) => updateSettings({ ignoreArrayOrder: e.target.checked })}
            />
            <span>Ignore Array Order</span>
          </label>
          <p className="helper-text">Array items can be in any order</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.structureOnly}
              onChange={(e) => updateSettings({ structureOnly: e.target.checked })}
            />
            <span>Structure-Only Mode</span>
          </label>
          <p className="helper-text">Compare only keys and types, not values</p>
        </div>
      </div>
      
      <div className="panel-section">
        <h3 className="section-title">Display Options</h3>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showGlyphMargin}
              onChange={(e) => updateSettings({ showGlyphMargin: e.target.checked })}
            />
            <span>Show Change Indicators</span>
          </label>
          <p className="helper-text">Display symbolic notation (-, ~, T) in the glyph margin</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.highlightCurrentLine}
              onChange={(e) => updateSettings({ highlightCurrentLine: e.target.checked })}
            />
            <span>Highlight Current Line</span>
          </label>
          <p className="helper-text">Highlight the line where cursor is positioned</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
            />
            <span>Word Wrap</span>
          </label>
          <p className="helper-text">Wrap long lines automatically</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showMinimap}
              onChange={(e) => updateSettings({ showMinimap: e.target.checked })}
            />
            <span>Show Minimap</span>
          </label>
          <p className="helper-text">Display code minimap on the right side</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.showStatusBar}
              onChange={(e) => updateSettings({ showStatusBar: e.target.checked })}
            />
            <span>Show Status Bar</span>
          </label>
          <p className="helper-text">Display file statistics at the bottom</p>
        </div>
      </div>
      
      <div className="panel-section">
        <h3 className="section-title">Filtering & Patterns</h3>
        <div className="form-group">
          <label htmlFor="subTreePath">Sub-Tree Path</label>
          <input
            type="text"
            id="subTreePath"
            value={settings.subTreePath}
            onChange={(e) => updateSettings({ subTreePath: e.target.value })}
            className="text-input"
            placeholder="$.data.users (leave empty for full comparison)"
          />
          <p className="helper-text">Compare only this JSONPath subtree</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="includePatterns">Include Patterns</label>
          <textarea
            id="includePatterns"
            value={settings.includePatterns.join('\n')}
            onChange={(e) => updateSettings({ 
              includePatterns: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
            })}
            className="text-input"
            placeholder="$.data.*&#10;$.meta.*"
            rows={3}
          />
          <p className="helper-text">One pattern per line (JSONPath)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="excludePatterns">Exclude Patterns</label>
          <textarea
            id="excludePatterns"
            value={settings.excludePatterns.join('\n')}
            onChange={(e) => updateSettings({ 
              excludePatterns: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
            })}
            className="text-input"
            placeholder="$..internal.*&#10;$..secret.*"
            rows={3}
          />
          <p className="helper-text">One pattern per line (JSONPath)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="ignorePatterns">Ignore Patterns</label>
          <textarea
            id="ignorePatterns"
            value={settings.ignorePatterns.join('\n')}
            onChange={(e) => updateSettings({ 
              ignorePatterns: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
            })}
            className="text-input"
            placeholder="$.timestamp&#10;$..id&#10;$.users[*].password"
            rows={3}
          />
          <p className="helper-text">Ignore changes at these JSONPaths (e.g., $.timestamp, $..id, $.users[*].password)</p>
        </div>
      </div>
      
      <div className="panel-section">
        <h3 className="section-title">Advanced Options</h3>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.strictTypeChecking}
              onChange={(e) => updateSettings({ strictTypeChecking: e.target.checked })}
            />
            <span>Strict Type Checking</span>
          </label>
          <p className="helper-text">No type coercion (e.g., &quot;1&quot; ≠ 1)</p>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.treatNullAsMissing}
              onChange={(e) => updateSettings({ treatNullAsMissing: e.target.checked })}
            />
            <span>Treat Null as Missing</span>
          </label>
          <p className="helper-text">null values are treated as if the key is missing</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="floatTolerance">Float Tolerance</label>
          <input
            type="number"
            id="floatTolerance"
            value={settings.floatTolerance}
            onChange={(e) => updateSettings({ floatTolerance: parseFloat(e.target.value) })}
            className="text-input"
            min="0"
            max="1"
            step="0.0001"
          />
          <p className="helper-text">Tolerance for floating-point comparisons</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="maxDepth">Max Depth</label>
          <input
            type="number"
            id="maxDepth"
            value={settings.maxDepth === Infinity ? '' : settings.maxDepth}
            onChange={(e) => updateSettings({ 
              maxDepth: e.target.value === '' ? Infinity : parseInt(e.target.value, 10)
            })}
            className="text-input"
            min="1"
            placeholder="Unlimited"
          />
          <p className="helper-text">Maximum nesting depth to compare</p>
        </div>
      </div>
    </div>
  );
}
