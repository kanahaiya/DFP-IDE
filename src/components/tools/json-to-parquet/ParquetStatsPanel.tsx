'use client';

import React from 'react';
import type { ParquetStats } from '@/lib/parquet/types';

interface ParquetStatsPanelProps {
  stats: ParquetStats;
}

export function ParquetStatsPanel({ stats }: ParquetStatsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-chart-bar"></i>
          Statistics
        </h3>
      </div>

      <div className="settings-content">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Rows</span>
            <span className="stat-value">{stats.rowCount.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Columns</span>
            <span className="stat-value">{stats.columnCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Est. Size</span>
            <span className="stat-value">{stats.estimatedSize}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Compression</span>
            <span className="stat-value">{stats.compression}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
