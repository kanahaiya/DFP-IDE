'use client';

import React from 'react';
import type { MergeSettings, ExportSettings, IndentationType } from '@/lib/merge/types';

interface OutputOptionsPanelProps {
  settings: MergeSettings;
  exportSettings: ExportSettings;
  onUpdateSettings: (updates: Partial<MergeSettings>) => void;
  onUpdateExportSettings: (updates: Partial<ExportSettings>) => void;
}

const INDENTATION_OPTIONS: { value: IndentationType; label: string }[] = [
  { value: 2, label: '2 Spaces' },
  { value: 3, label: '3 Spaces' },
  { value: 4, label: '4 Spaces' },
  { value: 'tab', label: 'Tabs' },
  { value: 'minified', label: 'Minified' },
];

export function OutputOptionsPanel({
  settings,
  exportSettings,
  onUpdateSettings,
  onUpdateExportSettings,
}: OutputOptionsPanelProps) {
  return (
    <div className="output-options-panel">
      {/* Indentation */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-indent"></i>
          Indentation
        </label>
        <div className="indent-options">
          {INDENTATION_OPTIONS.map(option => (
            <button
              key={String(option.value)}
              className={`indent-button ${settings.indentation === option.value ? 'selected' : ''}`}
              onClick={() => {
                onUpdateSettings({ indentation: option.value });
                onUpdateExportSettings({ indentation: option.value });
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Keys */}
      <div className="settings-group">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="sortKeys"
            checked={settings.sortKeys}
            onChange={(e) => {
              onUpdateSettings({ sortKeys: e.target.checked });
              onUpdateExportSettings({ sortKeys: e.target.checked });
            }}
          />
          <label htmlFor="sortKeys">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Sort Keys Alphabetically</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Order object keys A-Z in output
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Ignore Case */}
      <div className="settings-group">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="ignoreCase"
            checked={settings.ignoreCase}
            onChange={(e) => onUpdateSettings({ ignoreCase: e.target.checked })}
          />
          <label htmlFor="ignoreCase">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Ignore Key Case</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Treat &quot;Name&quot; and &quot;name&quot; as same key
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Download Filename */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-file-download"></i>
          Download Filename
        </label>
        <input
          type="text"
          className="settings-input"
          value={exportSettings.filename || ''}
          onChange={(e) => onUpdateExportSettings({ filename: e.target.value || undefined })}
          placeholder="merged-json-{timestamp}.json"
        />
        <span className="settings-hint">Leave empty for auto-generated name</span>
      </div>

      {/* Include Stats in Export */}
      <div className="settings-group">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="includeStats"
            checked={exportSettings.includeStats}
            onChange={(e) => onUpdateExportSettings({ includeStats: e.target.checked })}
          />
          <label htmlFor="includeStats">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Include Merge Stats</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                Add statistics as comments (when downloading)
              </span>
            </div>
          </label>
        </div>
      </div>

      <style jsx>{`
        .output-options-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1rem;
        }
        
        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .settings-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }
        
        .settings-label i {
          color: var(--primary);
          width: 16px;
          text-align: center;
        }
        
        .indent-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .indent-button {
          padding: 0.5rem 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .indent-button:hover {
          background: var(--card);
          border-color: var(--primary);
        }
        
        .indent-button.selected {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        
        .settings-input {
          width: 100%;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text);
          font-size: 0.85rem;
        }
        
        .settings-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        .settings-hint {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
