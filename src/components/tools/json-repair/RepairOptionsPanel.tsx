'use client';

import React from 'react';
import type { RepairSettings } from '@/lib/json-repair/types';

interface RepairOptionsPanelProps {
  settings: RepairSettings;
  updateSettings: (settings: Partial<RepairSettings>) => void;
}

export function RepairOptionsPanel({ settings, updateSettings }: RepairOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Quote Fixes</h3>
      
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixSingleQuotes}
            onChange={(e) => updateSettings({ fixSingleQuotes: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-quote-right"></i>
            Fix single quotes
          </span>
        </label>
        <p className="settings-help">Convert &apos; to &quot;</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixCurlyQuotes}
            onChange={(e) => updateSettings({ fixCurlyQuotes: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-text-width"></i>
            Fix curly quotes
          </span>
        </label>
        <p className="settings-help">Convert curly quotes to straight quotes</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.addMissingQuotes}
            onChange={(e) => updateSettings({ addMissingQuotes: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-plus-circle"></i>
            Add missing quotes
          </span>
        </label>
        <p className="settings-help">Quote unquoted keys and values</p>
      </div>

      <h3 className="settings-title">Punctuation Fixes</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixTrailingCommas}
            onChange={(e) => updateSettings({ fixTrailingCommas: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-eraser"></i>
            Remove trailing commas
          </span>
        </label>
        <p className="settings-help">Remove commas before ] or &#123;</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixMissingCommas}
            onChange={(e) => updateSettings({ fixMissingCommas: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-plus"></i>
            Add missing commas
          </span>
        </label>
        <p className="settings-help">Insert commas between elements</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixBrackets}
            onChange={(e) => updateSettings({ fixBrackets: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-code"></i>
            Fix brackets
          </span>
        </label>
        <p className="settings-help">Auto-close unclosed brackets/braces</p>
      </div>

      <h3 className="settings-title">Value Fixes</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixBooleans}
            onChange={(e) => updateSettings({ fixBooleans: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-toggle-on"></i>
            Fix booleans
          </span>
        </label>
        <p className="settings-help">Convert True/FALSE to true/false</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixNulls}
            onChange={(e) => updateSettings({ fixNulls: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-ban"></i>
            Fix nulls
          </span>
        </label>
        <p className="settings-help">Convert NULL/None to null</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixUndefined}
            onChange={(e) => updateSettings({ fixUndefined: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-question-circle"></i>
            Fix undefined
          </span>
        </label>
        <p className="settings-help">Convert undefined to null</p>
      </div>

      <h3 className="settings-title">Cleanup</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeComments}
            onChange={(e) => updateSettings({ removeComments: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-comment-slash"></i>
            Remove comments
          </span>
        </label>
        <p className="settings-help">Strip // and /* */ comments</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.unwrapJSONP}
            onChange={(e) => updateSettings({ unwrapJSONP: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-file-export"></i>
            Unwrap JSONP
          </span>
        </label>
        <p className="settings-help">Remove callback()</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.fixMongoDB}
            onChange={(e) => updateSettings({ fixMongoDB: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-database"></i>
            Fix MongoDB types
          </span>
        </label>
        <p className="settings-help">Convert ObjectId(), NumberLong(), etc.</p>
      </div>

      <h3 className="settings-title">Output</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.formatOutput}
            onChange={(e) => updateSettings({ formatOutput: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-align-left"></i>
            Format output
          </span>
        </label>
        <p className="settings-help">Prettify repaired JSON</p>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-indent"></i>
          Indentation
        </label>
        <select
          className="settings-select"
          value={settings.indentation === 'tab' ? 'tab' : String(settings.indentation)}
          onChange={(e) =>
            updateSettings({
              indentation: e.target.value === 'tab' ? 'tab' : parseInt(e.target.value, 10),
            })
          }
          disabled={!settings.formatOutput}
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-title:first-child {
          margin-top: 0;
        }

        .settings-group {
          margin-bottom: 1rem;
        }

        .settings-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .settings-checkbox input[type='checkbox'] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text);
        }

        .checkbox-label i {
          color: var(--text-secondary);
          width: 14px;
          font-size: 0.8rem;
        }

        .settings-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .settings-label i {
          color: var(--text-secondary);
          width: 14px;
          font-size: 0.8rem;
        }

        .settings-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--elevated);
          color: var(--text);
          font-size: 0.875rem;
        }

        .settings-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .settings-help {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          margin-left: 0;
        }
      `}</style>
    </div>
  );
}
