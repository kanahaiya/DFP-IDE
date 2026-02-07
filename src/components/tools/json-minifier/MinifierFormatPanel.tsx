'use client';

import React from 'react';
import type { MinifierSettings, IndentationType } from '@/lib/minifier/types';

interface MinifierFormatPanelProps {
  settings: MinifierSettings;
  onUpdateSettings: (updates: Partial<MinifierSettings>) => void;
  onToggleMode: () => void;
}

export function MinifierFormatPanel({
  settings,
  onUpdateSettings,
  onToggleMode,
}: MinifierFormatPanelProps) {
  const indentOptions: { value: IndentationType; label: string }[] = [
    { value: 2, label: '2 Spaces' },
    { value: 3, label: '3 Spaces' },
    { value: 4, label: '4 Spaces' },
    { value: 'tab', label: 'Tabs' },
  ];

  return (
    <div className="panel-section">
      <h4 className="section-title">
        <i className="fas fa-exchange-alt"></i>
        Mode
      </h4>
      
      <div className="mode-buttons">
        <button
          className={`mode-btn ${settings.mode === 'minify' ? 'active' : ''}`}
          onClick={() => settings.mode !== 'minify' && onToggleMode()}
        >
          <i className="fas fa-compress-arrows-alt"></i>
          Minify
        </button>
        <button
          className={`mode-btn ${settings.mode === 'beautify' ? 'active' : ''}`}
          onClick={() => settings.mode !== 'beautify' && onToggleMode()}
        >
          <i className="fas fa-expand"></i>
          Beautify
        </button>
      </div>
      
      <p className="mode-description">
        {settings.mode === 'minify'
          ? 'Removes whitespace to create the smallest file size.'
          : 'Adds indentation for human-readable output.'}
      </p>

      {settings.mode === 'beautify' && (
        <>
          <h4 className="section-title" style={{ marginTop: '1.5rem' }}>
            <i className="fas fa-indent"></i>
            Indentation
          </h4>
          
          <div className="indent-options">
            {indentOptions.map(opt => (
              <button
                key={String(opt.value)}
                className={`indent-btn ${settings.indentation === opt.value ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ indentation: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      <h4 className="section-title" style={{ marginTop: '1.5rem' }}>
        <i className="fas fa-sort-alpha-down"></i>
        Key Ordering
      </h4>
      
      <div className="checkbox-row">
        <input
          type="checkbox"
          id="sortKeys"
          checked={settings.sortKeys}
          onChange={(e) => onUpdateSettings({ sortKeys: e.target.checked })}
        />
        <label htmlFor="sortKeys">
          Sort keys alphabetically
          <span className="checkbox-hint">
            Useful for version control and consistent output
          </span>
        </label>
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
          margin: 0 0 0.75rem 0;
        }
        
        .section-title i {
          color: var(--primary);
          width: 16px;
        }
        
        .mode-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .mode-btn:hover {
          border-color: var(--primary);
          color: var(--text);
        }
        
        .mode-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        
        .mode-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0.75rem 0 0 0;
          line-height: 1.4;
        }
        
        .indent-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        
        .indent-btn {
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .indent-btn:hover {
          border-color: var(--primary);
          color: var(--text);
        }
        
        .indent-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
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
        }
        
        .checkbox-row label {
          font-size: 0.85rem;
          color: var(--text);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .checkbox-hint {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
