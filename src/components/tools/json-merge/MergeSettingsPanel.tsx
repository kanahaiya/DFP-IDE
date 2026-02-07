'use client';

import React from 'react';
import type { MergeSettings, MergeStrategy, DuplicateKeyStrategy, ArrayOrdering, NullHandling } from '@/lib/merge/types';

interface MergeSettingsPanelProps {
  settings: MergeSettings;
  onUpdateSettings: (updates: Partial<MergeSettings>) => void;
}

const STRATEGY_OPTIONS: { value: MergeStrategy; label: string; description: string }[] = [
  {
    value: 'simple',
    label: 'Simple Merge',
    description: 'Later values override earlier ones (shallow)',
  },
  {
    value: 'deep',
    label: 'Deep Merge',
    description: 'Recursively merge nested objects',
  },
  {
    value: 'arrayConcatenation',
    label: 'Array Concatenation',
    description: 'Join all arrays together',
  },
  {
    value: 'arrayUnion',
    label: 'Array Union',
    description: 'Combine arrays, remove duplicates',
  },
  {
    value: 'nestedArrayMerge',
    label: 'Nested Array Merge',
    description: 'Match array elements by key field',
  },
];

const DUPLICATE_KEY_OPTIONS: { value: DuplicateKeyStrategy; label: string }[] = [
  { value: 'keepFirst', label: 'Keep First' },
  { value: 'keepLast', label: 'Keep Last' },
  { value: 'merge', label: 'Attempt Merge' },
];

const ARRAY_ORDERING_OPTIONS: { value: ArrayOrdering; label: string }[] = [
  { value: 'preserve', label: 'Preserve Order' },
  { value: 'sort', label: 'Sort Elements' },
  { value: 'unique', label: 'Remove Duplicates' },
];

const NULL_HANDLING_OPTIONS: { value: NullHandling; label: string }[] = [
  { value: 'include', label: 'Include Nulls' },
  { value: 'exclude', label: 'Exclude Nulls' },
  { value: 'preserveNonNull', label: 'Preserve Non-Null' },
];

export function MergeSettingsPanel({ settings, onUpdateSettings }: MergeSettingsPanelProps) {
  return (
    <div className="merge-settings-panel">
      {/* Merge Strategy */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-code-branch"></i>
          Merge Strategy
        </label>
        <div className="strategy-options">
          {STRATEGY_OPTIONS.map(option => (
            <div
              key={option.value}
              className={`strategy-option ${settings.strategy === option.value ? 'selected' : ''}`}
              onClick={() => onUpdateSettings({ strategy: option.value })}
            >
              <div className="strategy-radio">
                <input
                  type="radio"
                  name="strategy"
                  value={option.value}
                  checked={settings.strategy === option.value}
                  onChange={() => onUpdateSettings({ strategy: option.value })}
                />
              </div>
              <div className="strategy-content">
                <span className="strategy-label">{option.label}</span>
                <span className="strategy-desc">{option.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duplicate Key Strategy */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-key"></i>
          Duplicate Keys
        </label>
        <select
          className="settings-select"
          value={settings.duplicateKeyStrategy}
          onChange={(e) => onUpdateSettings({ duplicateKeyStrategy: e.target.value as DuplicateKeyStrategy })}
        >
          {DUPLICATE_KEY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Array Ordering */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-list-ol"></i>
          Array Ordering
        </label>
        <select
          className="settings-select"
          value={settings.arrayOrdering}
          onChange={(e) => onUpdateSettings({ arrayOrdering: e.target.value as ArrayOrdering })}
        >
          {ARRAY_ORDERING_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Array Merge Key (only for nestedArrayMerge) */}
      {settings.strategy === 'nestedArrayMerge' && (
        <div className="settings-group">
          <label className="settings-label">
            <i className="fas fa-fingerprint"></i>
            Array Match Key
          </label>
          <input
            type="text"
            className="settings-input"
            value={settings.arrayMergeKey || 'id'}
            onChange={(e) => onUpdateSettings({ arrayMergeKey: e.target.value })}
            placeholder="id"
          />
          <span className="settings-hint">Field used to match array elements</span>
        </div>
      )}

      {/* Null Handling */}
      <div className="settings-group">
        <label className="settings-label">
          <i className="fas fa-ban"></i>
          Null Values
        </label>
        <select
          className="settings-select"
          value={settings.nullHandling}
          onChange={(e) => onUpdateSettings({ nullHandling: e.target.value as NullHandling })}
        >
          {NULL_HANDLING_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .merge-settings-panel {
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
        
        .strategy-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .strategy-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .strategy-option:hover {
          background: var(--card);
          border-color: var(--primary);
        }
        
        .strategy-option.selected {
          background: rgba(88, 166, 255, 0.1);
          border-color: var(--primary);
        }
        
        .strategy-radio {
          padding-top: 2px;
        }
        
        .strategy-radio input {
          accent-color: var(--primary);
        }
        
        .strategy-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .strategy-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text);
        }
        
        .strategy-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .settings-select {
          width: 100%;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text);
          font-size: 0.85rem;
          cursor: pointer;
        }
        
        .settings-select:focus {
          outline: none;
          border-color: var(--primary);
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
