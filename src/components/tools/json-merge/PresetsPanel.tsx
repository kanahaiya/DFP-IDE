'use client';

import React from 'react';
import { MERGE_PRESETS, type MergeStrategy } from '@/lib/merge/types';

interface PresetsPanelProps {
  onApplyPreset: (presetId: string) => void;
  currentStrategy: MergeStrategy;
}

export function PresetsPanel({ onApplyPreset, currentStrategy }: PresetsPanelProps) {
  // Find if any preset matches current strategy
  const activePreset = MERGE_PRESETS.find(p => p.settings.strategy === currentStrategy);
  
  return (
    <div className="presets-panel">
      <div className="presets-header">
        <i className="fas fa-magic"></i>
        <span>Quick Presets</span>
      </div>
      <p className="presets-description">
        Apply predefined settings for common merge scenarios
      </p>
      
      <div className="presets-list">
        {MERGE_PRESETS.map(preset => (
          <div
            key={preset.id}
            className={`preset-card ${activePreset?.id === preset.id ? 'active' : ''}`}
            onClick={() => onApplyPreset(preset.id)}
          >
            <div className="preset-icon">
              <i className={preset.icon}></i>
            </div>
            <div className="preset-content">
              <h4 className="preset-name">{preset.name}</h4>
              <p className="preset-desc">{preset.description}</p>
            </div>
            {activePreset?.id === preset.id && (
              <div className="preset-active-badge">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .presets-panel {
          padding: 1rem;
        }
        
        .presets-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        
        .presets-header i {
          color: var(--primary);
        }
        
        .presets-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
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
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .preset-card:hover {
          background: var(--card);
          border-color: var(--primary);
          transform: translateX(4px);
        }
        
        .preset-card.active {
          background: rgba(88, 166, 255, 0.1);
          border-color: var(--primary);
        }
        
        .preset-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card);
          border-radius: var(--radius-md);
          color: var(--primary);
          font-size: 1rem;
        }
        
        .preset-card.active .preset-icon {
          background: var(--primary);
          color: white;
        }
        
        .preset-content {
          flex: 1;
          min-width: 0;
        }
        
        .preset-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }
        
        .preset-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .preset-active-badge {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          border-radius: 50%;
          color: white;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
}
