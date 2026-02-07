'use client';

import React from 'react';
import type { TransformSettings, KeyCase } from '@/lib/json-cleaner/types';

interface TransformPanelProps {
  settings: TransformSettings;
  updateSettings: (settings: Partial<TransformSettings>) => void;
}

const KEY_CASE_OPTIONS: { value: KeyCase | 'none'; label: string; example: string }[] = [
  { value: 'none', label: 'No change', example: '' },
  { value: 'camelCase', label: 'camelCase', example: 'myPropertyName' },
  { value: 'PascalCase', label: 'PascalCase', example: 'MyPropertyName' },
  { value: 'snake_case', label: 'snake_case', example: 'my_property_name' },
  { value: 'kebab-case', label: 'kebab-case', example: 'my-property-name' },
  { value: 'SCREAMING_SNAKE_CASE', label: 'SCREAMING_SNAKE', example: 'MY_PROPERTY_NAME' },
];

export function TransformPanel({ settings, updateSettings }: TransformPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Key Transformation</h3>
      
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-key"></i>
          Key naming convention
        </label>
        <select
          className="settings-select"
          value={settings.keyCase || 'none'}
          onChange={(e) =>
            updateSettings({
              keyCase: e.target.value === 'none' ? null : (e.target.value as KeyCase),
            })
          }
        >
          {KEY_CASE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.example && `(${opt.example})`}
            </option>
          ))}
        </select>
      </div>

      {settings.keyCase && (
        <div className="settings-group">
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.keyTransformDeep}
              onChange={(e) => updateSettings({ keyTransformDeep: e.target.checked })}
            />
            <span className="checkbox-label">
              <i className="fas fa-sitemap"></i>
              Transform nested keys
            </span>
          </label>
        </div>
      )}

      <h3 className="settings-title">Type Conversion</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.stringToNumber}
            onChange={(e) => updateSettings({ stringToNumber: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-hashtag"></i>
            String to number
          </span>
        </label>
        <p className="settings-help">&quot;123&quot; → 123</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.stringToBoolean}
            onChange={(e) => updateSettings({ stringToBoolean: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-toggle-on"></i>
            String to boolean
          </span>
        </label>
        <p className="settings-help">&quot;true&quot;/&quot;false&quot; → true/false</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.numberToString}
            onChange={(e) => updateSettings({ numberToString: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-font"></i>
            Number to string
          </span>
        </label>
        <p className="settings-help">123 → &quot;123&quot;</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.booleanToString}
            onChange={(e) => updateSettings({ booleanToString: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-text-width"></i>
            Boolean to string
          </span>
        </label>
        <p className="settings-help">true → &quot;true&quot;</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.nullToString}
            onChange={(e) => updateSettings({ nullToString: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-ban"></i>
            Null to string
          </span>
        </label>
        <p className="settings-help">null → &quot;null&quot;</p>
      </div>

      <h3 className="settings-title">Structure Transform</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.flatten}
            onChange={(e) => updateSettings({ flatten: e.target.checked, unflatten: false })}
          />
          <span className="checkbox-label">
            <i className="fas fa-compress-arrows-alt"></i>
            Flatten object
          </span>
        </label>
        <p className="settings-help">Nested → flat with dot notation</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.unflatten}
            onChange={(e) => updateSettings({ unflatten: e.target.checked, flatten: false })}
          />
          <span className="checkbox-label">
            <i className="fas fa-expand-arrows-alt"></i>
            Unflatten object
          </span>
        </label>
        <p className="settings-help">Flat → nested structure</p>
      </div>

      {(settings.flatten || settings.unflatten) && (
        <div className="settings-group">
          <label className="settings-label">
            <i className="fas fa-grip-lines-vertical"></i>
            Key separator
          </label>
          <input
            type="text"
            className="settings-input"
            value={settings.flattenSeparator}
            onChange={(e) => updateSettings({ flattenSeparator: e.target.value || '.' })}
            placeholder="."
          />
          <p className="settings-help">Separator for nested keys (default: .)</p>
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

        .settings-select,
        .settings-input {
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
