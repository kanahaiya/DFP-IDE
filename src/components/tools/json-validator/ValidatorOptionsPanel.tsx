'use client';

import React from 'react';
import type { ValidatorSettings } from '@/lib/json-validator/types';

interface ValidatorOptionsPanelProps {
  settings: ValidatorSettings;
  updateSettings: (settings: Partial<ValidatorSettings>) => void;
}

export function ValidatorOptionsPanel({ settings, updateSettings }: ValidatorOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Validation Options</h3>

      {/* Auto Validate */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.autoValidate}
            onChange={(e) => updateSettings({ autoValidate: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-sync-alt"></i>
            Auto-validate on change
          </span>
        </label>
        <p className="settings-help">Automatically validate as you type</p>
      </div>

      {/* Strict Mode */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.strictMode}
            onChange={(e) => updateSettings({ strictMode: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-gavel"></i>
            Strict mode
          </span>
        </label>
        <p className="settings-help">Enforce strict JSON syntax rules</p>
      </div>

      {/* Detect Duplicate Keys */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.detectDuplicateKeys}
            onChange={(e) => updateSettings({ detectDuplicateKeys: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-clone"></i>
            Detect duplicate keys
          </span>
        </label>
        <p className="settings-help">Warn about duplicate object keys</p>
      </div>

      {/* Show Statistics */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.showStatistics}
            onChange={(e) => updateSettings({ showStatistics: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-chart-bar"></i>
            Show statistics
          </span>
        </label>
        <p className="settings-help">Display JSON structure statistics</p>
      </div>

      {/* Indentation */}
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
        <p className="settings-help">Indentation for formatted output</p>
      </div>

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-group {
          margin-bottom: 1.25rem;
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

        .settings-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .settings-label i {
          color: var(--text-muted, #888);
          width: 16px;
        }

        .settings-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          color: var(--text-primary, #fff);
          font-size: 0.9rem;
        }

        .settings-help {
          font-size: 0.75rem;
          color: var(--text-muted, #888);
          margin-top: 0.25rem;
          margin-left: 0;
        }
      `}</style>
    </div>
  );
}
