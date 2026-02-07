'use client';

import React from 'react';
import type { JSONPathSettings, ResultFormat } from '@/lib/jsonpath/types';

interface JSONPathOptionsPanelProps {
  settings: JSONPathSettings;
  updateSettings: (settings: Partial<JSONPathSettings>) => void;
}

const RESULT_FORMATS: Array<{ id: ResultFormat; name: string; icon: string }> = [
  { id: 'json', name: 'JSON', icon: 'fas fa-code' },
  { id: 'table', name: 'Table', icon: 'fas fa-table' },
  { id: 'tree', name: 'Tree', icon: 'fas fa-sitemap' },
];

const DEBOUNCE_OPTIONS = [
  { value: 100, label: '100ms (Fast)' },
  { value: 300, label: '300ms (Default)' },
  { value: 500, label: '500ms (Slow)' },
  { value: 1000, label: '1000ms (Large files)' },
];

export function JSONPathOptionsPanel({ settings, updateSettings }: JSONPathOptionsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Query Options</h3>

      {/* Auto Execute */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.autoExecute}
            onChange={(e) => updateSettings({ autoExecute: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-bolt"></i>
            Auto-execute queries
          </span>
        </label>
        <p className="settings-help">Run query automatically as you type</p>
      </div>

      {/* Debounce */}
      {settings.autoExecute && (
        <div className="settings-group">
          <label className="settings-label">
            <i className="fas fa-clock"></i>
            Debounce Delay
          </label>
          <select
            className="settings-select"
            value={settings.debounceMs}
            onChange={(e) => updateSettings({ debounceMs: Number(e.target.value) })}
          >
            {DEBOUNCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Result Format */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-eye"></i>
          Result Format
        </label>
        <div className="format-buttons">
          {RESULT_FORMATS.map((format) => (
            <button
              key={format.id}
              className={`format-btn ${settings.resultFormat === format.id ? 'active' : ''}`}
              onClick={() => updateSettings({ resultFormat: format.id })}
              title={format.name}
            >
              <i className={format.icon}></i>
              <span>{format.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Show Paths */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.showPaths}
            onChange={(e) => updateSettings({ showPaths: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-route"></i>
            Show paths
          </span>
        </label>
        <p className="settings-help">Display path to each matched element</p>
      </div>

      {/* Pretty Print */}
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.prettyPrint}
            onChange={(e) => updateSettings({ prettyPrint: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-align-left"></i>
            Pretty print results
          </span>
        </label>
        <p className="settings-help">Format JSON results with indentation</p>
      </div>

      {/* Indent Size */}
      {settings.prettyPrint && (
        <div className="settings-group">
          <label className="settings-label">
            <i className="fas fa-indent"></i>
            Indent Size
          </label>
          <select
            className="settings-select"
            value={settings.indentSize}
            onChange={(e) => updateSettings({ indentSize: Number(e.target.value) })}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
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
        }

        .format-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .format-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          color: var(--text-primary, #fff);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .format-btn:hover {
          background: var(--bg-secondary, #2a2a2a);
          border-color: var(--primary, #3b82f6);
        }

        .format-btn.active {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
        }
      `}</style>
    </div>
  );
}
