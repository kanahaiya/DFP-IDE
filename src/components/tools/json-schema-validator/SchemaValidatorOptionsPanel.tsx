'use client';

import React from 'react';
import type { SchemaValidatorSettings, SchemaDraft } from '@/lib/schema-validator/types';

interface SchemaValidatorOptionsPanelProps {
  settings: SchemaValidatorSettings;
  updateSettings: (settings: Partial<SchemaValidatorSettings>) => void;
}

const DRAFTS: Array<{ id: SchemaDraft; name: string }> = [
  { id: 'draft-04', name: 'Draft-04' },
  { id: 'draft-06', name: 'Draft-06' },
  { id: 'draft-07', name: 'Draft-07' },
  { id: '2019-09', name: 'Draft 2019-09' },
  { id: '2020-12', name: 'Draft 2020-12' },
];

export function SchemaValidatorOptionsPanel({ settings, updateSettings }: SchemaValidatorOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Validation Options</h3>

      {/* Draft Selection */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-code-branch"></i>
          Schema Draft
        </label>
        <select
          className="settings-select"
          value={settings.draft}
          onChange={(e) => updateSettings({ draft: e.target.value as SchemaDraft })}
          disabled={settings.autoDetectDraft}
        >
          {DRAFTS.map((draft) => (
            <option key={draft.id} value={draft.id}>
              {draft.name}
            </option>
          ))}
        </select>
      </div>

      {/* Auto Detect Draft */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.autoDetectDraft}
            onChange={(e) => updateSettings({ autoDetectDraft: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-magic"></i>
            Auto-detect draft from $schema
          </span>
        </label>
        <p className="settings-help">Detect version from schema&apos;s $schema property</p>
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
        <p className="settings-help">Enforce strict validation rules</p>
      </div>

      {/* All Errors */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.allErrors}
            onChange={(e) => updateSettings({ allErrors: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-list"></i>
            Show all errors
          </span>
        </label>
        <p className="settings-help">Report all errors instead of stopping at first</p>
      </div>

      {/* Validate Formats */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.validateFormats}
            onChange={(e) => updateSettings({ validateFormats: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-at"></i>
            Validate formats
          </span>
        </label>
        <p className="settings-help">Validate format keywords (email, uri, etc.)</p>
      </div>

      {/* Coerce Types */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.coerceTypes}
            onChange={(e) => updateSettings({ coerceTypes: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-exchange-alt"></i>
            Coerce types
          </span>
        </label>
        <p className="settings-help">Attempt to convert types (e.g., string to number)</p>
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

        .settings-select:disabled {
          opacity: 0.5;
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
