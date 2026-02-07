'use client';

import React from 'react';
import type { RepairMode } from '@/lib/json-repair/types';
import { REPAIR_PRESETS } from '@/lib/json-repair/presets';

interface RepairPresetsPanelProps {
  currentMode: RepairMode;
  onApplyPreset: (presetId: RepairMode) => void;
  recommendedPreset?: RepairMode;
}

export function RepairPresetsPanel({
  currentMode,
  onApplyPreset,
  recommendedPreset,
}: RepairPresetsPanelProps) {
  return (
    <div className="presets-panel">
      <h3 className="presets-title">Repair Presets</h3>
      <p className="presets-description">
        Choose a preset that matches your repair needs
      </p>

      <div className="presets-list">
        {REPAIR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-card ${currentMode === preset.id ? 'active' : ''} ${
              recommendedPreset === preset.id ? 'recommended' : ''
            }`}
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-header">
              <i className={preset.icon}></i>
              <span className="preset-name">{preset.name}</span>
              {recommendedPreset === preset.id && (
                <span className="recommended-badge">
                  <i className="fas fa-star"></i>
                </span>
              )}
            </div>
            <p className="preset-description">{preset.description}</p>
            {currentMode === preset.id && (
              <span className="active-indicator">
                <i className="fas fa-check"></i> Active
              </span>
            )}
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
            <strong>Strict:</strong> Safe fixes only. Won&apos;t make risky changes.
          </li>
          <li>
            <strong>Standard:</strong> Balanced approach for general use.
          </li>
          <li>
            <strong>Lenient:</strong> Aggressive repair for broken JSON.
          </li>
          <li>
            <strong>LLM:</strong> Optimized for AI-generated output.
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

        .preset-card.active {
          border-color: var(--primary);
          background: rgba(88, 166, 255, 0.1);
        }

        .preset-card.recommended {
          border-color: var(--warning);
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

        .recommended-badge {
          margin-left: auto;
          color: var(--warning);
          font-size: 0.75rem;
        }

        .preset-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .active-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: var(--success);
          margin-top: 0.25rem;
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
