'use client';

import React from 'react';
import type { NodeStats } from '@/lib/json-editor/types';
import { formatMemorySize } from '@/lib/json-editor/history';

interface EditorStatsPanelProps {
  stats: NodeStats | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditorStatsPanel({
  stats,
  isExpanded,
  onToggle,
}: EditorStatsPanelProps) {
  if (!stats) return null;

  const statItems = [
    { label: 'Total Nodes', value: stats.totalNodes, icon: 'fas fa-sitemap', color: 'text-cyan-400' },
    { label: 'Objects', value: stats.objectCount, icon: 'fas fa-brackets-curly', color: 'text-blue-400' },
    { label: 'Arrays', value: stats.arrayCount, icon: 'fas fa-brackets-square', color: 'text-yellow-400' },
    { label: 'Strings', value: stats.stringCount, icon: 'fas fa-quote-right', color: 'text-green-400' },
    { label: 'Numbers', value: stats.numberCount, icon: 'fas fa-hashtag', color: 'text-orange-400' },
    { label: 'Booleans', value: stats.booleanCount, icon: 'fas fa-toggle-on', color: 'text-purple-400' },
    { label: 'Nulls', value: stats.nullCount, icon: 'fas fa-minus', color: 'text-stone-400' },
    { label: 'Max Depth', value: stats.maxDepth, icon: 'fas fa-layer-group', color: 'text-pink-400' },
    { label: 'Size', value: formatMemorySize(stats.fileSize), icon: 'fas fa-weight-hanging', color: 'text-teal-400' },
  ];

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
          <i className="fas fa-chart-pie" style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>Statistics</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', paddingTop: '1rem' }}>
            {statItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: 'var(--elevated)',
                }}
              >
                <i className={item.icon} style={{ color: 'var(--primary)', marginBottom: '0.25rem' }} />
                <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text)' }}>{item.value}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
