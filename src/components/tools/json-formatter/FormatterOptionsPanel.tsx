'use client';

import React from 'react';
import type { FormatterSettings, IndentationType } from '@/lib/formatter/types';

interface FormatterOptionsPanelProps {
  settings: FormatterSettings;
  onUpdateSettings: (updates: Partial<FormatterSettings>) => void;
}

export function FormatterOptionsPanel({
  settings,
  onUpdateSettings,
}: FormatterOptionsPanelProps) {
  const indentationOptions: { value: IndentationType; label: string }[] = [
    { value: 2, label: '2 Spaces' },
    { value: 3, label: '3 Spaces' },
    { value: 4, label: '4 Spaces' },
    { value: 'tab', label: 'Tabs' },
  ];

  return (
    <div className="formatter-options-panel">
      {/* Indentation */}
      <div className="option-group">
        <label className="option-label">
          <i className="fas fa-indent"></i>
          Indentation
        </label>
        <div className="button-group">
          {indentationOptions.map((opt) => (
            <button
              key={String(opt.value)}
              className={`option-btn ${settings.indentation === opt.value ? 'active' : ''}`}
              onClick={() => onUpdateSettings({ indentation: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Keys */}
      <div className="option-group">
        <label className="option-toggle">
          <input
            type="checkbox"
            checked={settings.sortKeys}
            onChange={(e) => onUpdateSettings({ sortKeys: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            <i className="fas fa-sort-alpha-down"></i>
            Sort Keys Alphabetically
          </span>
        </label>
        <p className="option-description">
          Sort object keys A-Z at every nesting level
        </p>
      </div>

      {/* Trailing Newline */}
      <div className="option-group">
        <label className="option-toggle">
          <input
            type="checkbox"
            checked={settings.trailingNewline}
            onChange={(e) => onUpdateSettings({ trailingNewline: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            <i className="fas fa-level-down-alt"></i>
            Add Trailing Newline
          </span>
        </label>
        <p className="option-description">
          Add newline character at end of output
        </p>
      </div>

      {/* Escape Unicode */}
      <div className="option-group">
        <label className="option-toggle">
          <input
            type="checkbox"
            checked={settings.escapeUnicode}
            onChange={(e) => onUpdateSettings({ escapeUnicode: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            <i className="fas fa-globe"></i>
            Escape Unicode Characters
          </span>
        </label>
        <p className="option-description">
          Convert non-ASCII characters to \\uXXXX sequences
        </p>
      </div>

      <style jsx>{`
        .formatter-options-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .option-label i {
          color: var(--primary);
          width: 16px;
        }

        .button-group {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .option-btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.8rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: var(--card);
          color: var(--text);
        }

        .option-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .option-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .option-toggle input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: relative;
          width: 36px;
          height: 20px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .toggle-slider::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: var(--text-secondary);
          border-radius: 50%;
          transition: all 0.2s;
        }

        .option-toggle input:checked + .toggle-slider {
          background: var(--primary);
          border-color: var(--primary);
        }

        .option-toggle input:checked + .toggle-slider::after {
          transform: translateX(16px);
          background: white;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text);
        }

        .toggle-label i {
          color: var(--primary);
          width: 16px;
        }

        .option-description {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin: 0;
          padding-left: calc(36px + 0.75rem);
        }
      `}</style>
    </div>
  );
}
