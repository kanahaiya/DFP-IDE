'use client';

import React from 'react';
import type { JsonStats } from '@/lib/json-validator/types';

interface ValidatorStatsPanelProps {
  stats: JsonStats | null;
}

export function ValidatorStatsPanel({ stats }: ValidatorStatsPanelProps) {
  if (!stats) {
    return (
      <div className="settings-panel">
        <h3 className="settings-title">JSON Statistics</h3>
        <div className="no-stats">
          <i className="fas fa-chart-bar"></i>
          <p>Enter valid JSON to see statistics</p>
        </div>

        <style jsx>{`
          .settings-panel {
            padding: 1rem;
          }

          .settings-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary, #aaa);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .no-stats {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 2rem;
            color: var(--text-muted, #888);
            text-align: center;
          }

          .no-stats i {
            font-size: 2rem;
            opacity: 0.5;
          }
        `}</style>
      </div>
    );
  }

  const statItems = [
    { label: 'Total Keys', value: stats.totalKeys, icon: 'fa-key' },
    { label: 'Total Values', value: stats.totalValues, icon: 'fa-database' },
    { label: 'Max Depth', value: stats.depth, icon: 'fa-layer-group' },
    { label: 'Objects', value: stats.objectCount, icon: 'fa-cube' },
    { label: 'Arrays', value: stats.arrayCount, icon: 'fa-list' },
    { label: 'Strings', value: stats.stringCount, icon: 'fa-font' },
    { label: 'Numbers', value: stats.numberCount, icon: 'fa-hashtag' },
    { label: 'Booleans', value: stats.booleanCount, icon: 'fa-toggle-on' },
    { label: 'Nulls', value: stats.nullCount, icon: 'fa-ban' },
    { label: 'File Size', value: stats.sizeFormatted, icon: 'fa-file' },
  ];

  return (
    <div className="settings-panel">
      <h3 className="settings-title">JSON Statistics</h3>

      <div className="stats-grid">
        {statItems.map((item) => (
          <div key={item.label} className="stat-item">
            <div className="stat-icon">
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Type Distribution */}
      <h4 className="stats-subtitle">Type Distribution</h4>
      <div className="type-distribution">
        {[
          { label: 'Objects', count: stats.objectCount, color: '#3b82f6' },
          { label: 'Arrays', count: stats.arrayCount, color: '#8b5cf6' },
          { label: 'Strings', count: stats.stringCount, color: '#22c55e' },
          { label: 'Numbers', count: stats.numberCount, color: '#f59e0b' },
          { label: 'Booleans', count: stats.booleanCount, color: '#ef4444' },
          { label: 'Nulls', count: stats.nullCount, color: '#6b7280' },
        ]
          .filter((item) => item.count > 0)
          .map((item) => (
            <div key={item.label} className="dist-item">
              <div className="dist-bar-container">
                <div
                  className="dist-bar"
                  style={{
                    width: `${(item.count / stats.totalValues) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="dist-info">
                <span className="dist-label">{item.label}</span>
                <span className="dist-value">
                  {item.count} ({((item.count / stats.totalValues) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
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
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-tertiary, #252525);
          border-radius: 8px;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 6px;
          color: var(--primary, #3b82f6);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-weight: 600;
          font-size: 1rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted, #888);
          text-transform: uppercase;
        }

        .stats-subtitle {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .type-distribution {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dist-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dist-bar-container {
          height: 8px;
          background: var(--bg-tertiary, #252525);
          border-radius: 4px;
          overflow: hidden;
        }

        .dist-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .dist-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .dist-label {
          color: var(--text-secondary, #aaa);
        }

        .dist-value {
          color: var(--text-muted, #888);
        }
      `}</style>
    </div>
  );
}
