'use client';

import React from 'react';
import type { CleaningSettings } from '@/lib/json-cleaner/types';

interface CleaningOptionsPanelProps {
  settings: CleaningSettings;
  updateSettings: (settings: Partial<CleaningSettings>) => void;
}

export function CleaningOptionsPanel({ settings, updateSettings }: CleaningOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Remove Empty Values</h3>
      
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeNull}
            onChange={(e) => updateSettings({ removeNull: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-ban"></i>
            Remove null values
          </span>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeEmptyStrings}
            onChange={(e) => updateSettings({ removeEmptyStrings: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-text-slash"></i>
            Remove empty strings
          </span>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeEmptyArrays}
            onChange={(e) => updateSettings({ removeEmptyArrays: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-list"></i>
            Remove empty arrays
          </span>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeEmptyObjects}
            onChange={(e) => updateSettings({ removeEmptyObjects: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-cube"></i>
            Remove empty objects
          </span>
        </label>
      </div>

      <h3 className="settings-title">String Operations</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.trimStrings}
            onChange={(e) => updateSettings({ trimStrings: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-cut"></i>
            Trim whitespace
          </span>
        </label>
        <p className="settings-help">Remove leading/trailing whitespace from strings</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.removeWhitespaceOnly}
            onChange={(e) => updateSettings({ removeWhitespaceOnly: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-eraser"></i>
            Remove whitespace-only
          </span>
        </label>
        <p className="settings-help">Remove strings containing only whitespace</p>
      </div>

      <h3 className="settings-title">Array Operations</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.deduplicateArrays}
            onChange={(e) => updateSettings({ deduplicateArrays: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-clone"></i>
            Deduplicate arrays
          </span>
        </label>
        <p className="settings-help">Remove duplicate items from arrays</p>
      </div>

      <h3 className="settings-title">Object Operations</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.sortKeys}
            onChange={(e) => updateSettings({ sortKeys: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-sort-alpha-down"></i>
            Sort keys alphabetically
          </span>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.sortKeysDeep}
            onChange={(e) => updateSettings({ sortKeysDeep: e.target.checked })}
            disabled={!settings.sortKeys}
          />
          <span className="checkbox-label">
            <i className="fas fa-sitemap"></i>
            Sort nested keys
          </span>
        </label>
        <p className="settings-help">Sort keys in nested objects too</p>
      </div>

      <h3 className="settings-title">Output</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.minify}
            onChange={(e) => updateSettings({ minify: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-compress"></i>
            Minify output
          </span>
        </label>
      </div>

      {!settings.minify && (
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
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      )}

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
          margin-bottom: 0.875rem;
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

        .settings-checkbox input:disabled {
          opacity: 0.5;
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
