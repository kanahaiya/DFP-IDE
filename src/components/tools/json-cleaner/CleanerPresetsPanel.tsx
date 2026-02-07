'use client';

import React from 'react';
import type { CleanerPreset } from '@/lib/json-cleaner/types';
import { CLEANER_PRESETS } from '@/lib/json-cleaner/presets';

interface CleanerPresetsPanelProps {
  onApplyPreset: (presetId: CleanerPreset) => void;
}

export function CleanerPresetsPanel({ onApplyPreset }: CleanerPresetsPanelProps) {
  return (
    <div className="presets-panel">
      <h3 className="presets-title">Cleaning Presets</h3>
      <p className="presets-description">
        Choose a preset that matches your cleaning needs
      </p>

      <div className="presets-list">
        {CLEANER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="preset-card"
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-header">
              <i className={preset.icon}></i>
              <span className="preset-name">{preset.name}</span>
            </div>
            <p className="preset-description">{preset.description}</p>
          </button>
        ))}
      </div>

      <div className="preset-info">
        <h4 className="info-title">
          <i className="fas fa-info-circle"></i>
          About Presets
        </h4>
        <ul className="info-list">
          <li>
            <strong>Minimal:</strong> Safe for all use cases. Only removes undefined.
          </li>
          <li>
            <strong>Standard:</strong> Common operations. Trims strings, removes whitespace-only.
          </li>
          <li>
            <strong>Aggressive:</strong> Maximum cleaning. Removes all empty values.
          </li>
          <li>
            <strong>API Ready:</strong> For API responses. Sorts keys, converts to camelCase.
          </li>
          <li>
            <strong>Storage:</strong> Minimum size. Removes everything unnecessary, minifies.
          </li>
        </ul>
      </div>

      <style jsx>{`
        .presets-panel {
          padding: 1rem;
        }

        .presets-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .presets-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .preset-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.875rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .preset-card:hover {
          border-color: var(--primary);
          background: var(--hover);
        }

        .preset-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preset-header i {
          color: var(--primary);
          font-size: 0.9rem;
        }

        .preset-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text);
        }

        .preset-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .preset-info {
          margin-top: 1.5rem;
          padding: 0.875rem;
          background: var(--elevated);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .info-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.75rem;
        }

        .info-title i {
          color: var(--info);
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding: 0.25rem 0;
        }

        .info-list li strong {
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
