'use client';

import React from 'react';
import { EDITOR_PRESETS } from '@/lib/json-editor/presets';

interface EditorPresetsPanelProps {
  currentPresetId?: string;
  onApplyPreset: (presetId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditorPresetsPanel({
  currentPresetId,
  onApplyPreset,
  isExpanded,
  onToggle,
}: EditorPresetsPanelProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-palette" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>Presets</span>
        </div>
        <i 
          className="fas fa-chevron-down" 
          style={{ 
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-secondary)'
          }} 
        />
      </button>

      {isExpanded && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', paddingTop: '1rem' }}>
            {EDITOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.75rem',
                  background: currentPresetId === preset.id ? 'var(--primary-subtle)' : 'var(--elevated)',
                  border: currentPresetId === preset.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentPresetId !== preset.id) {
                    e.currentTarget.style.background = 'var(--hover)';
                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPresetId !== preset.id) {
                    e.currentTarget.style.background = 'var(--elevated)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <i 
                    className={preset.icon}
                    style={{ color: currentPresetId === preset.id ? 'var(--primary)' : 'var(--text-secondary)' }}
                  />
                  <span style={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: currentPresetId === preset.id ? 'var(--primary)' : 'var(--text)'
                  }}>
                    {preset.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {preset.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
