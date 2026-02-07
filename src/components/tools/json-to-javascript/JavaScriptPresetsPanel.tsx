'use client';

import React from 'react';
import type { JavaScriptPreset } from '@/lib/javascript/presets';

interface JavaScriptPresetsPanelProps {
  presets: JavaScriptPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function JavaScriptPresetsPanel({ presets, onApplyPreset }: JavaScriptPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">Quick Presets</h3>
      <p className="settings-hint" style={{ marginBottom: '1rem' }}>
        Click a preset to apply its settings instantly.
      </p>

      <div className="presets-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className="preset-card"
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-name">{preset.name}</div>
            <div className="preset-description">{preset.description}</div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .presets-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .preset-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .preset-card:hover {
          border-color: var(--primary);
          background: var(--elevated);
          transform: translateY(-1px);
        }

        .preset-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }

        .preset-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
