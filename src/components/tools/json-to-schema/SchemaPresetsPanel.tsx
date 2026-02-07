'use client';

import React from 'react';
import type { SchemaGeneratorPreset } from '@/lib/schema-generator/types';

interface SchemaPresetsPanelProps {
  presets: SchemaGeneratorPreset[];
  onApplyPreset: (presetId: string) => void;
}

export function SchemaPresetsPanel({ presets, onApplyPreset }: SchemaPresetsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-group">
        <h3><i className="fas fa-magic"></i> Quick Presets</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
          Apply predefined settings for common use cases.
        </p>

        <div className="presets-list">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="settings-option"
              onClick={() => onApplyPreset(preset.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem',
                background: 'var(--elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--primary-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--primary)',
                flexShrink: 0,
                fontSize: '1rem'
              }}>
                <i className={`fas ${preset.icon}`}></i>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text)' }}>{preset.name}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{preset.description}</span>
              </div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                <i className="fas fa-chevron-right"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
