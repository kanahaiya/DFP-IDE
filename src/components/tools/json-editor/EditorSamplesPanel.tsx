'use client';

import React from 'react';
import { JSON_EDITOR_SAMPLES, type EditorSampleTemplate } from '@/data/json-editor-samples';

interface EditorSamplesPanelProps {
  onLoadSample: (sample: EditorSampleTemplate) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditorSamplesPanel({
  onLoadSample,
  isExpanded,
  onToggle,
}: EditorSamplesPanelProps) {
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
          <i className="fas fa-flask" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>Sample Data</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem' }}>
            {JSON_EDITOR_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onLoadSample(sample)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--elevated)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--elevated)')}
              >
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: `${sample.iconColor}20`,
                  }}
                >
                  <i className={sample.icon} style={{ color: sample.iconColor }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}>{sample.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sample.description}</div>
                </div>
                <i className="fas fa-arrow-right" style={{ color: 'var(--text-tertiary)' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
