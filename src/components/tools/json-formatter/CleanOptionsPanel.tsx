'use client';

import React from 'react';
import type { FormatterSettings } from '@/lib/formatter/types';

interface CleanOptionsPanelProps {
  settings: FormatterSettings;
  onUpdateSettings: (updates: Partial<FormatterSettings>) => void;
}

export function CleanOptionsPanel({
  settings,
  onUpdateSettings,
}: CleanOptionsPanelProps) {
  const cleanOptions = [
    {
      key: 'removeNulls' as const,
      label: 'Remove Null Values',
      icon: 'fas fa-ban',
      description: 'Remove all null values from the output',
    },
    {
      key: 'removeEmptyStrings' as const,
      label: 'Remove Empty Strings',
      icon: 'fas fa-eraser',
      description: 'Remove keys with empty string values ("")',
    },
    {
      key: 'removeEmptyArrays' as const,
      label: 'Remove Empty Arrays',
      icon: 'fas fa-list',
      description: 'Remove keys with empty array values ([])',
    },
    {
      key: 'removeEmptyObjects' as const,
      label: 'Remove Empty Objects',
      icon: 'fas fa-cube',
      description: 'Remove keys with empty object values ({})',
    },
  ];

  const enabledCount = cleanOptions.filter(opt => settings[opt.key]).length;

  return (
    <div className="clean-options-panel">
      <div className="panel-header">
        <span className="header-label">
          <i className="fas fa-broom"></i>
          Data Cleaning Options
        </span>
        {enabledCount > 0 && (
          <span className="enabled-badge">{enabledCount} enabled</span>
        )}
      </div>

      <div className="options-list">
        {cleanOptions.map((option) => (
          <div key={option.key} className="option-item">
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(e) => onUpdateSettings({ [option.key]: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-content">
                <span className="toggle-label">
                  <i className={option.icon}></i>
                  {option.label}
                </span>
                <span className="toggle-description">{option.description}</span>
              </span>
            </label>
          </div>
        ))}
      </div>

      {enabledCount > 0 && (
        <div className="warning-box">
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            {enabledCount} cleaning option{enabledCount > 1 ? 's' : ''} enabled. 
            This will modify your JSON data.
          </span>
        </div>
      )}

      <button
        className="clear-all-btn"
        onClick={() => onUpdateSettings({
          removeNulls: false,
          removeEmptyStrings: false,
          removeEmptyArrays: false,
          removeEmptyObjects: false,
        })}
        disabled={enabledCount === 0}
      >
        <i className="fas fa-times"></i>
        Disable All
      </button>

      <style jsx>{`
        .clean-options-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .header-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .header-label i {
          color: var(--primary);
        }

        .enabled-badge {
          padding: 0.125rem 0.5rem;
          background: var(--primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-item {
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }

        .option-toggle {
          display: flex;
          align-items: flex-start;
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
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-top: 2px;
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

        .toggle-content {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
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

        .toggle-description {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .warning-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 152, 0, 0.1);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--warning, #ff9800);
        }

        .warning-box i {
          flex-shrink: 0;
        }

        .clear-all-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-all-btn:hover:not(:disabled) {
          background: var(--elevated);
          color: var(--text);
        }

        .clear-all-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
