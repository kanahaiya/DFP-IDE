'use client';

import React from 'react';
import { FORMATTER_PRESETS } from '@/lib/formatter/types';

interface FormatterPresetsPanelProps {
  onApplyPreset: (presetId: string) => void;
  currentPresetId?: string;
}

export function FormatterPresetsPanel({
  onApplyPreset,
  currentPresetId,
}: FormatterPresetsPanelProps) {
  return (
    <div className="formatter-presets-panel">
      <div className="panel-header">
        <i className="fas fa-magic"></i>
        <span>Quick Presets</span>
      </div>

      <div className="presets-grid">
        {FORMATTER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-card ${currentPresetId === preset.id ? 'active' : ''}`}
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-icon">
              <i className={preset.icon}></i>
            </div>
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-description">{preset.description}</span>
            </div>
            {currentPresetId === preset.id && (
              <div className="active-indicator">
                <i className="fas fa-check"></i>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="preset-tip">
        <i className="fas fa-lightbulb"></i>
        <span>Click a preset to apply its settings. Your custom changes will override preset defaults.</span>
      </div>

      <style jsx>{`
        .formatter-presets-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .panel-header i {
          color: var(--primary);
        }

        .presets-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .preset-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-card:hover {
          background: var(--card);
          border-color: var(--primary);
        }

        .preset-card.active {
          background: rgba(var(--primary-rgb, 59, 130, 246), 0.1);
          border-color: var(--primary);
        }

        .preset-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--card);
          border-radius: var(--radius-sm);
          color: var(--primary);
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .preset-card.active .preset-icon {
          background: var(--primary);
          color: white;
        }

        .preset-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex: 1;
          min-width: 0;
        }

        .preset-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .preset-description {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .active-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: var(--primary);
          border-radius: 50%;
          color: white;
          font-size: 0.6rem;
        }

        .preset-tip {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(var(--primary-rgb, 59, 130, 246), 0.1);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .preset-tip i {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 0.125rem;
        }
      `}</style>
    </div>
  );
}
