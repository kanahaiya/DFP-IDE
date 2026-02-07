'use client';

import React from 'react';
import { JMESPATH_PRESETS } from '@/lib/jmespath/presets';
import type { JMESPathSettings } from '@/lib/jmespath/types';

interface JMESPathPresetsPanelProps {
  settings: JMESPathSettings;
  onApplyPreset: (settings: Partial<JMESPathSettings>) => void;
}

export function JMESPathPresetsPanel({ onApplyPreset }: JMESPathPresetsPanelProps) {
  return (
    <div className="presets-panel">
      <h3 className="presets-title">
        <i className="fas fa-magic"></i>
        Presets
      </h3>

      <div className="presets-list">
        {JMESPATH_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="preset-item"
            onClick={() => onApplyPreset(preset.settings)}
            title={preset.description}
          >
            <i className={preset.icon} style={{ color: preset.icon.includes('aws') ? '#FF9900' : undefined }}></i>
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-desc">{preset.description}</span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .presets-panel {
          padding: 1rem;
        }

        .presets-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .presets-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .preset-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .preset-item:hover {
          background: var(--bg-secondary, #2a2a2a);
          border-color: var(--primary, #3b82f6);
        }

        .preset-item i {
          font-size: 1.25rem;
          color: var(--primary, #3b82f6);
          width: 24px;
          text-align: center;
        }

        .preset-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .preset-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary, #fff);
        }

        .preset-desc {
          font-size: 0.75rem;
          color: var(--text-muted, #888);
        }
      `}</style>
    </div>
  );
}
