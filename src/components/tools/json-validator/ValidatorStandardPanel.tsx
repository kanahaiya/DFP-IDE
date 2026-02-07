'use client';

import React from 'react';
import type { ValidatorSettings, JsonStandard } from '@/lib/json-validator/types';

interface ValidatorStandardPanelProps {
  settings: ValidatorSettings;
  updateSettings: (settings: Partial<ValidatorSettings>) => void;
}

const STANDARDS: Array<{ id: JsonStandard; name: string; description: string }> = [
  {
    id: 'RFC8259',
    name: 'RFC 8259 (Current)',
    description: 'The most recent and strictest JSON standard (2017)',
  },
  {
    id: 'RFC7159',
    name: 'RFC 7159',
    description: 'Previous JSON standard (2014)',
  },
  {
    id: 'ECMA404',
    name: 'ECMA-404',
    description: 'ECMA International JSON standard',
  },
];

export function ValidatorStandardPanel({ settings, updateSettings }: ValidatorStandardPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">JSON Standard</h3>

      {/* Standard Selection */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-book"></i>
          Validation Standard
        </label>
        <div className="standard-options">
          {STANDARDS.map((standard) => (
            <label key={standard.id} className="standard-option">
              <input
                type="radio"
                name="standard"
                value={standard.id}
                checked={settings.standard === standard.id}
                onChange={() => updateSettings({ standard: standard.id })}
              />
              <div className="standard-content">
                <span className="standard-name">{standard.name}</span>
                <span className="standard-description">{standard.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Extension Options (when not in strict mode) */}
      <h3 className="settings-title">Allowed Extensions</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.allowComments}
            onChange={(e) => updateSettings({ allowComments: e.target.checked })}
            disabled={settings.strictMode}
          />
          <span className="checkbox-label">
            <i className="fas fa-comment"></i>
            Allow comments
          </span>
        </label>
        <p className="settings-help">Allow // and /* */ style comments</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.allowTrailingCommas}
            onChange={(e) => updateSettings({ allowTrailingCommas: e.target.checked })}
            disabled={settings.strictMode}
          />
          <span className="checkbox-label">
            <i className="fas fa-list"></i>
            Allow trailing commas
          </span>
        </label>
        <p className="settings-help">Allow commas after the last item</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.allowSingleQuotes}
            onChange={(e) => updateSettings({ allowSingleQuotes: e.target.checked })}
            disabled={settings.strictMode}
          />
          <span className="checkbox-label">
            <i className="fas fa-quote-right"></i>
            Allow single quotes
          </span>
        </label>
        <p className="settings-help">Allow single quotes for strings</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.allowUnquotedKeys}
            onChange={(e) => updateSettings({ allowUnquotedKeys: e.target.checked })}
            disabled={settings.strictMode}
          />
          <span className="checkbox-label">
            <i className="fas fa-key"></i>
            Allow unquoted keys
          </span>
        </label>
        <p className="settings-help">Allow object keys without quotes</p>
      </div>

      {settings.strictMode && (
        <p className="strict-mode-notice">
          <i className="fas fa-info-circle"></i>
          Extensions are disabled in strict mode
        </p>
      )}

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 1rem;
          margin-top: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-title:first-child {
          margin-top: 0;
        }

        .settings-group {
          margin-bottom: 1.25rem;
        }

        .settings-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .settings-label i {
          color: var(--text-muted, #888);
          width: 16px;
        }

        .standard-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .standard-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .standard-option:hover {
          border-color: var(--primary, #3b82f6);
          background: rgba(59, 130, 246, 0.05);
        }

        .standard-option input[type='radio'] {
          margin-top: 0.25rem;
          accent-color: var(--primary, #3b82f6);
        }

        .standard-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .standard-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .standard-description {
          font-size: 0.75rem;
          color: var(--text-muted, #888);
        }

        .settings-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .settings-checkbox input[type='checkbox'] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--primary, #3b82f6);
        }

        .settings-checkbox input[type='checkbox']:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .checkbox-label i {
          color: var(--text-muted, #888);
          width: 16px;
        }

        .settings-help {
          font-size: 0.75rem;
          color: var(--text-muted, #888);
          margin-top: 0.25rem;
          margin-left: 0;
        }

        .strict-mode-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--warning, #f59e0b);
        }
      `}</style>
    </div>
  );
}
