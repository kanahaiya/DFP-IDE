'use client';

import React from 'react';
import type { FlowStats } from '@/lib/flow-viz/types';

interface FlowStatsPanelProps {
  stats: FlowStats;
}

export function FlowStatsPanel({ stats }: FlowStatsPanelProps) {
  return (
    <div className="flow-stats-panel">
      <div className="stats-header">
        <i className="fas fa-chart-bar"></i>
        <span>Statistics</span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Nodes</span>
          <span className="stat-value">{stats.totalNodes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Edges</span>
          <span className="stat-value">{stats.totalEdges}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Depth</span>
          <span className="stat-value">{stats.maxDepth}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Objects</span>
          <span className="stat-value stat-object">{stats.objectCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Arrays</span>
          <span className="stat-value stat-array">{stats.arrayCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Primitives</span>
          <span className="stat-value stat-primitive">{stats.primitiveCount}</span>
        </div>
      </div>

      <style jsx>{`
        .flow-stats-panel {
          padding: 1rem;
        }

        .stats-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 1rem;
        }

        .stats-header i {
          color: var(--primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .stat-label {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }

        .stat-object {
          color: #3b82f6;
        }

        .stat-array {
          color: #8b5cf6;
        }

        .stat-primitive {
          color: #22c55e;
        }
      `}</style>
    </div>
  );
}
