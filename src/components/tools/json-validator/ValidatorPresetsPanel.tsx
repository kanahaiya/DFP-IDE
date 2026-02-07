'use client';

import React from 'react';
import type { ValidatorPreset } from '@/lib/json-validator/types';

interface ValidatorPresetsPanelProps {
  presets: ValidatorPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function ValidatorPresetsPanel({ presets, onApplyPreset }: ValidatorPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Validation Presets</h3>
      <p className="settings-description">
        Choose a preset to quickly configure validation settings for your use case.
      </p>

      <div className="presets-list">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className="preset-card"
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-icon">
              <i className={`fas ${preset.icon}`}></i>
            </div>
            <div className="preset-content">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </div>
            <div className="preset-action">
              <i className="fas fa-chevron-right"></i>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-description {
          font-size: 0.8rem;
          color: var(--text-muted, #888);
          margin-bottom: 1rem;
        }

        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .preset-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: var(--bg-tertiary, #252525);
          border: 1px solid var(--border-color, #333);
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s;
        }

        .preset-card:hover {
          border-color: var(--primary, #3b82f6);
          background: rgba(59, 130, 246, 0.05);
        }

        .preset-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          color: var(--primary, #3b82f6);
          flex-shrink: 0;
        }

        .preset-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .preset-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary, #fff);
        }

        .preset-description {
          font-size: 0.75rem;
          color: var(--text-muted, #888);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preset-action {
          color: var(--text-muted, #888);
          opacity: 0;
          transition: opacity 0.15s;
        }

        .preset-card:hover .preset-action {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
