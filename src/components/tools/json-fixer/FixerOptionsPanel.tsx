'use client';

import React from 'react';
import type { FixerSettings, ErrorSeverity, ErrorCategory } from '@/lib/json-fixer/types';

interface FixerOptionsPanelProps {
  settings: FixerSettings;
  updateSettings: (settings: Partial<FixerSettings>) => void;
}

const SEVERITY_OPTIONS: { value: ErrorSeverity; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'var(--danger)' },
  { value: 'high', label: 'High', color: '#ea580c' },
  { value: 'medium', label: 'Medium', color: 'var(--warning)' },
  { value: 'low', label: 'Low', color: 'var(--success)' },
];

const CATEGORY_OPTIONS: { value: ErrorCategory; label: string; icon: string }[] = [
  { value: 'syntax', label: 'Syntax', icon: 'fas fa-code' },
  { value: 'structure', label: 'Structure', icon: 'fas fa-sitemap' },
  { value: 'value', label: 'Values', icon: 'fas fa-font' },
  { value: 'formatting', label: 'Formatting', icon: 'fas fa-align-left' },
  { value: 'encoding', label: 'Encoding', icon: 'fas fa-text-height' },
  { value: 'semantic', label: 'Semantic', icon: 'fas fa-brain' },
];

export function FixerOptionsPanel({ settings, updateSettings }: FixerOptionsPanelProps) {
  const toggleSeverity = (severity: ErrorSeverity) => {
    const current = settings.showSeverity;
    if (current.includes(severity)) {
      if (current.length > 1) {
        updateSettings({ showSeverity: current.filter(s => s !== severity) });
      }
    } else {
      updateSettings({ showSeverity: [...current, severity] });
    }
  };

  const toggleCategory = (category: ErrorCategory) => {
    const current = settings.showCategories;
    if (current.includes(category)) {
      if (current.length > 1) {
        updateSettings({ showCategories: current.filter(c => c !== category) });
      }
    } else {
      updateSettings({ showCategories: [...current, category] });
    }
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-title">Detection</h3>
      
      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.autoDetect}
            onChange={(e) => updateSettings({ autoDetect: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-sync-alt"></i>
            Auto-detect errors
          </span>
        </label>
        <p className="settings-help">Automatically detect errors as you type</p>
      </div>

      <h3 className="settings-title">Show Severity</h3>
      <div className="severity-filter">
        {SEVERITY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`filter-btn ${settings.showSeverity.includes(opt.value) ? 'active' : ''}`}
            onClick={() => toggleSeverity(opt.value)}
            style={{
              '--severity-color': opt.color,
            } as React.CSSProperties}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <h3 className="settings-title">Show Categories</h3>
      <div className="category-filter">
        {CATEGORY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`category-btn ${settings.showCategories.includes(opt.value) ? 'active' : ''}`}
            onClick={() => toggleCategory(opt.value)}
          >
            <i className={opt.icon}></i>
            {opt.label}
          </button>
        ))}
      </div>

      <h3 className="settings-title">Display Options</h3>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.showExplanations}
            onChange={(e) => updateSettings({ showExplanations: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-graduation-cap"></i>
            Show explanations
          </span>
        </label>
        <p className="settings-help">Show educational error explanations</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.showContext}
            onChange={(e) => updateSettings({ showContext: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-eye"></i>
            Show context
          </span>
        </label>
        <p className="settings-help">Show surrounding code for each error</p>
      </div>

      <div className="settings-group">
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={settings.highlightErrors}
            onChange={(e) => updateSettings({ highlightErrors: e.target.checked })}
          />
          <span className="checkbox-label">
            <i className="fas fa-highlighter"></i>
            Highlight errors
          </span>
        </label>
        <p className="settings-help">Highlight errors in the editor</p>
      </div>

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
          margin-bottom: 1rem;
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

        .settings-help {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          margin-left: 0;
        }

        .severity-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .filter-btn {
          padding: 0.375rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--elevated);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-btn:hover {
          border-color: var(--severity-color);
        }

        .filter-btn.active {
          background: var(--severity-color);
          border-color: var(--severity-color);
          color: white;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--elevated);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .category-btn i {
          font-size: 0.7rem;
        }

        .category-btn:hover {
          border-color: var(--primary);
        }

        .category-btn.active {
          background: rgba(88, 166, 255, 0.15);
          border-color: var(--primary);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
