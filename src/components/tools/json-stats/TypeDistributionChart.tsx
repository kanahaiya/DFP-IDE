'use client';

import React from 'react';
import type { JsonStats } from '@/lib/stats/types';

interface TypeDistributionChartProps {
  stats: JsonStats;
}

export function TypeDistributionChart({ stats }: TypeDistributionChartProps) {
  const { counts } = stats.types;
  
  // Calculate cumulative percentages for CSS pie chart
  let cumulativePercent = 0;
  const gradientStops = counts.map(type => {
    const start = cumulativePercent;
    cumulativePercent += type.percentage;
    return `${type.color} ${start}% ${cumulativePercent}%`;
  }).join(', ');

  return (
    <div className="type-distribution">
      <h4 className="section-title">
        <i className="fas fa-chart-pie"></i>
        Type Distribution
      </h4>
      
      {/* CSS Pie Chart */}
      <div className="chart-container">
        <div 
          className="pie-chart"
          style={{
            background: `conic-gradient(${gradientStops || 'var(--border) 0% 100%'})`,
          }}
        >
          <div className="pie-center">
            <span className="total-count">{stats.types.totalValues}</span>
            <span className="total-label">values</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        {counts.map(type => (
          <div key={type.type} className="legend-item">
            <span 
              className="legend-dot" 
              style={{ background: type.color }}
            ></span>
            <span className="legend-label">{type.type}</span>
            <span className="legend-value">{type.count}</span>
            <span className="legend-percent">{type.percentage}%</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .type-distribution {
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
        
        .chart-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .pie-chart {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          position: relative;
        }
        
        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          background: var(--card);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .total-count {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text);
        }
        
        .total-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }
        
        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }
        
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .legend-label {
          flex: 1;
          color: var(--text);
          text-transform: capitalize;
        }
        
        .legend-value {
          color: var(--text-secondary);
          width: 40px;
          text-align: right;
        }
        
        .legend-percent {
          color: var(--text-secondary);
          width: 35px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
