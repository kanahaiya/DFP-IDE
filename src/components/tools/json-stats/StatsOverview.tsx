'use client';

import React from 'react';
import type { JsonStats } from '@/lib/stats/types';

interface StatsOverviewProps {
  stats: JsonStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const qualityColor = stats.quality.score >= 70 
    ? 'var(--success)' 
    : stats.quality.score >= 40 
      ? 'var(--warning)' 
      : 'var(--error)';

  return (
    <div className="stats-overview">
      <h4 className="section-title">
        <i className="fas fa-tachometer-alt"></i>
        Quick Stats
      </h4>
      
      <div className="stats-list">
        <div className="stat-item">
          <span className="stat-label">Size</span>
          <span className="stat-value">{stats.size.bytesFormatted}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lines</span>
          <span className="stat-value">{stats.size.lines}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Minified</span>
          <span className="stat-value">{stats.size.minifiedFormatted}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Max Depth</span>
          <span className="stat-value">{stats.structure.maxDepth}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Objects</span>
          <span className="stat-value">{stats.structure.totalObjects}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Arrays</span>
          <span className="stat-value">{stats.structure.totalArrays}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Values</span>
          <span className="stat-value">{stats.structure.totalValues}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Unique Keys</span>
          <span className="stat-value">{stats.keys.uniqueKeys}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Most Common Type</span>
          <span className="stat-value">{stats.types.mostCommon}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Quality Score</span>
          <span className="stat-value" style={{ color: qualityColor }}>
            {stats.quality.score}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Issues Found</span>
          <span className="stat-value">{stats.quality.issues.length}</span>
        </div>
      </div>

      <style jsx>{`
        .stats-overview {
          padding: 1rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 1rem 0;
        }
        
        .section-title i {
          color: var(--primary);
        }
        
        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .stat-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }
        
        .stat-divider {
          height: 1px;
          background: var(--border);
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
