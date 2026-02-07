'use client';

import React from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';
import { NODE_TYPE_COLORS } from '@/lib/json-visualizer';

export function StatsPanel() {
  const { graph } = useJsonVisualizerStore();

  if (!graph) {
    return (
      <div className="stats-panel">
        <p className="no-data">No data loaded</p>
        <style jsx>{`
          .stats-panel {
            padding: 12px;
          }
          .no-data {
            color: var(--text-secondary);
            font-size: 12px;
            text-align: center;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  const { stats } = graph;

  const typeStats = [
    { type: 'object', count: stats.objectCount, label: 'Objects' },
    { type: 'array', count: stats.arrayCount, label: 'Arrays' },
    { type: 'string', count: stats.stringCount, label: 'Strings' },
    { type: 'number', count: stats.numberCount, label: 'Numbers' },
    { type: 'boolean', count: stats.booleanCount, label: 'Booleans' },
    { type: 'null', count: stats.nullCount, label: 'Nulls' },
  ].filter((s) => s.count > 0);

  return (
    <div className="stats-panel">
      {/* Overview Stats */}
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalNodes}</div>
          <div className="stat-label">Total Nodes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.maxDepth}</div>
          <div className="stat-label">Max Depth</div>
        </div>
      </div>

      {/* Type Distribution */}
      <div className="type-distribution">
        <h4 className="section-title">Type Distribution</h4>
        <div className="type-bars">
          {typeStats.map(({ type, count, label }) => {
            const percentage = (count / stats.totalNodes) * 100;
            const color = NODE_TYPE_COLORS[type as keyof typeof NODE_TYPE_COLORS];
            return (
              <div key={type} className="type-bar-item">
                <div className="bar-header">
                  <span className="bar-label" style={{ color }}>
                    {label}
                  </span>
                  <span className="bar-count">{count}</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="type-legend">
        <h4 className="section-title">Legend</h4>
        <div className="legend-grid">
          {Object.entries(NODE_TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: color }} />
              <span className="legend-label">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 12px;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .stat-card {
          padding: 12px;
          background: var(--elevated);
          border-radius: 8px;
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 10px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-distribution,
        .type-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          margin: 0;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .type-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .type-bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bar-label {
          font-size: 11px;
          font-weight: 500;
        }

        .bar-count {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .bar-track {
          height: 6px;
          background: var(--hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .legend-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-label {
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
