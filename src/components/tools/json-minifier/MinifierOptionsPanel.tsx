'use client';

import React from 'react';
import type { MinifierSettings } from '@/lib/minifier/types';

interface MinifierOptionsPanelProps {
  settings: MinifierSettings;
  onUpdateSettings: (updates: Partial<MinifierSettings>) => void;
}

export function MinifierOptionsPanel({
  settings,
  onUpdateSettings,
}: MinifierOptionsPanelProps) {
  const cleaningOptions = [
    {
      id: 'removeNulls',
      key: 'removeNulls' as const,
      label: 'Remove null values',
      hint: 'Strips keys with null values',
    },
    {
      id: 'removeEmptyStrings',
      key: 'removeEmptyStrings' as const,
      label: 'Remove empty strings',
      hint: 'Strips keys with "" values',
    },
    {
      id: 'removeEmptyArrays',
      key: 'removeEmptyArrays' as const,
      label: 'Remove empty arrays',
      hint: 'Strips keys with [] values',
    },
    {
      id: 'removeEmptyObjects',
      key: 'removeEmptyObjects' as const,
      label: 'Remove empty objects',
      hint: 'Strips keys with {} values',
    },
  ];

  const advancedOptions = [
    {
      id: 'escapeUnicode',
      key: 'escapeUnicode' as const,
      label: 'Escape Unicode characters',
      hint: 'Convert non-ASCII to \\uXXXX format',
    },
    {
      id: 'trailingNewline',
      key: 'trailingNewline' as const,
      label: 'Add trailing newline',
      hint: 'Add \\n at end of output',
    },
  ];

  const hasAnyCleaningEnabled = cleaningOptions.some(
    opt => settings[opt.key]
  );

  const handleClearAll = () => {
    const updates: Partial<MinifierSettings> = {};
    cleaningOptions.forEach(opt => {
      updates[opt.key] = false;
    });
    onUpdateSettings(updates);
  };

  return (
    <div className="panel-section">
      <h4 className="section-title">
        <i className="fas fa-broom"></i>
        Cleaning Options
      </h4>
      
      <p className="section-description">
        Remove unwanted values to reduce file size further.
        These options modify your data.
      </p>

      <div className="options-list">
        {cleaningOptions.map(opt => (
          <div key={opt.id} className="checkbox-row">
            <input
              type="checkbox"
              id={opt.id}
              checked={settings[opt.key]}
              onChange={(e) => onUpdateSettings({ [opt.key]: e.target.checked })}
            />
            <label htmlFor={opt.id}>
              {opt.label}
              <span className="checkbox-hint">{opt.hint}</span>
            </label>
          </div>
        ))}
      </div>

      {hasAnyCleaningEnabled && (
        <button className="clear-all-btn" onClick={handleClearAll}>
          <i className="fas fa-undo"></i>
          Clear All Cleaning Options
        </button>
      )}

      <h4 className="section-title" style={{ marginTop: '1.5rem' }}>
        <i className="fas fa-cog"></i>
        Advanced Options
      </h4>

      <div className="options-list">
        {advancedOptions.map(opt => (
          <div key={opt.id} className="checkbox-row">
            <input
              type="checkbox"
              id={opt.id}
              checked={settings[opt.key]}
              onChange={(e) => onUpdateSettings({ [opt.key]: e.target.checked })}
            />
            <label htmlFor={opt.id}>
              {opt.label}
              <span className="checkbox-hint">{opt.hint}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="warning-box">
        <i className="fas fa-info-circle"></i>
        <span>
          Cleaning options will remove data from your JSON. 
          Make sure this is intentional before using.
        </span>
      </div>

      <style jsx>{`
        .panel-section {
          padding: 1rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .section-title i {
          color: var(--primary);
          width: 16px;
        }
        
        .section-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }
        
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .checkbox-row input[type="checkbox"] {
          margin-top: 0.25rem;
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .checkbox-row label {
          font-size: 0.85rem;
          color: var(--text);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        
        .checkbox-hint {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .clear-all-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem;
          margin-top: 1rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .clear-all-btn:hover {
          border-color: var(--primary);
          color: var(--text);
        }
        
        .warning-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          margin-top: 1rem;
          background: rgba(255, 152, 0, 0.1);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .warning-box i {
          color: #ff9800;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
      `}</style>
    </div>
  );
}
