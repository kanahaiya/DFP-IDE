'use client';

import React, { useMemo, useCallback } from 'react';
import { Change, DiffStats } from '@/lib/json-diff/diffEngine';
import { getColorsByTheme } from '@/lib/json-diff/colors';
import { VirtualizedChangesList } from './VirtualizedChangesList';
import { useTheme } from '@/hooks/useTheme';

interface ReportViewProps {
  changes: Change[];
  stats: DiffStats | null;
}

export function ReportView({ changes, stats }: ReportViewProps) {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

  // Prepare histogram data
  const histogramData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { label: 'Added', value: stats.added || 0, type: 'ADDED' },
      { label: 'Removed', value: stats.removed || 0, type: 'REMOVED' },
      { label: 'Modified', value: stats.modified || 0, type: 'MODIFIED' },
      { label: 'Moved', value: stats.moved || 0, type: 'MOVED' },
      { label: 'Type Changed', value: stats.typeChanged || 0, type: 'TYPE_CHANGED' },
    ];
  }, [stats]);

  // Calculate max value for scaling
  const maxValue = useMemo(() => {
    if (!stats || stats.total === 0) return 1;
    return Math.max(...histogramData.map(d => d.value), 1);
  }, [histogramData, stats]);

  // Render function for change items (memoized for virtual scrolling)
  const renderChangeItem = useCallback((change: Change) => (
    <div
      className="report-change-item"
      style={{
        backgroundColor: 
          change.type === 'ADDED' ? colors.added.bg :
          change.type === 'REMOVED' ? colors.removed.bg :
          change.type === 'MODIFIED' ? colors.modified.bg :
          change.type === 'TYPE_CHANGED' ? colors.typeChanged.bg :
          colors.moved.bg,
        borderLeftColor:
          change.type === 'ADDED' ? colors.added.text :
          change.type === 'REMOVED' ? colors.removed.text :
          change.type === 'MODIFIED' ? colors.modified.text :
          change.type === 'TYPE_CHANGED' ? colors.typeChanged.text :
          colors.moved.text,
      }}
    >
      <div className="report-change-path">{change.jsonPath}</div>
      <div className="report-change-content">
        {change.type === 'MOVED' ? (
          <div>
            <div className="report-moved-info" style={{ color: colors.moved.text }}>
              <span className="font-bold">↔</span> Moved from index {change.oldIndex} to {change.newIndex}
            </div>
            <div className="report-moved-path">
              Old path: {change.oldPath}
            </div>
            <div className="report-moved-path">
              New path: {change.newPath}
            </div>
            {change.value && (
              <div className="report-change-value">
                Value: {JSON.stringify(change.value)}
              </div>
            )}
          </div>
        ) : change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED' ? (
          <div>
            <div style={{ color: colors.removed.text }}>
              <span className="font-bold">-</span> {JSON.stringify(change.oldValue)}
            </div>
            <div style={{ color: colors.added.text }}>
              <span className="font-bold">+</span> {JSON.stringify(change.newValue)}
            </div>
          </div>
        ) : (
          <div>
            <span className="font-bold">{change.type === 'ADDED' ? '+' : '-'}</span>{' '}
            {JSON.stringify(change.value || change.newValue || change.oldValue)}
          </div>
        )}
      </div>
    </div>
  ), [colors]);

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center opacity-60">
        No comparison data available
      </div>
    );
  }

  return (
    <div className="report-view">
      <div className="report-container">
        <h2 className="report-title">Diff Report</h2>
        
        {/* Statistics Cards */}
        <div className="report-stats-grid">
          <div className="report-stat-card">
            <div className="report-stat-label">Total Changes</div>
            <div className="report-stat-value">{stats.total}</div>
          </div>
          <div 
            className="report-stat-card"
            style={{
              backgroundColor: colors.added.bg,
              borderColor: colors.added.text,
              color: colors.added.text,
            }}
          >
            <div className="report-stat-label">Added</div>
            <div className="report-stat-value">{stats.added}</div>
          </div>
          <div
            className="report-stat-card"
            style={{
              backgroundColor: colors.removed.bg,
              borderColor: colors.removed.text,
              color: colors.removed.text,
            }}
          >
            <div className="report-stat-label">Removed</div>
            <div className="report-stat-value">{stats.removed}</div>
          </div>
          <div
            className="report-stat-card"
            style={{
              backgroundColor: colors.modified.bg,
              borderColor: colors.modified.text,
              color: colors.modified.text,
            }}
          >
            <div className="report-stat-label">Modified</div>
            <div className="report-stat-value">{stats.modified}</div>
          </div>
          <div
            className="report-stat-card"
            style={{
              backgroundColor: colors.moved.bg,
              borderColor: colors.moved.text,
              color: colors.moved.text,
            }}
          >
            <div className="report-stat-label">Moved</div>
            <div className="report-stat-value">{stats.moved || 0}</div>
          </div>
          <div
            className="report-stat-card"
            style={{
              backgroundColor: colors.typeChanged.bg,
              borderColor: colors.typeChanged.text,
              color: colors.typeChanged.text,
            }}
          >
            <div className="report-stat-label">Type Changed</div>
            <div className="report-stat-value">{stats.typeChanged}</div>
          </div>
        </div>

        {/* Change Histogram */}
        {stats.total > 0 && (
          <div className="report-histogram-container">
            <h3 className="report-subtitle">Change Distribution</h3>
            <div className="report-histogram">
              {/* Y-axis labels */}
              <div className="report-histogram-y-axis">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
              </div>
              
              <svg
                width="100%"
                height="200"
                viewBox="0 0 600 200"
                preserveAspectRatio="xMidYMid meet"
                className="overflow-visible"
              >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((percent) => (
                  <line
                    key={percent}
                    x1="0"
                    y1={200 - (percent / 100) * 180}
                    x2="600"
                    y2={200 - (percent / 100) * 180}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    className="text-gray-400 dark:text-gray-600"
                  />
                ))}
                
                {/* Bars */}
                {histogramData.map((item, index) => {
                  const barWidth = 100;
                  const barSpacing = 20;
                  const startX = 50 + index * (barWidth + barSpacing);
                  const barHeight = maxValue > 0 ? (item.value / maxValue) * 180 : 0;
                  const y = 200 - barHeight;
                  
                  const barColor = 
                    item.type === 'ADDED' ? colors.added.bg :
                    item.type === 'REMOVED' ? colors.removed.bg :
                    item.type === 'MODIFIED' ? colors.modified.bg :
                    item.type === 'MOVED' ? colors.moved.bg :
                    colors.typeChanged.bg;
                  
                  const textColor =
                    item.type === 'ADDED' ? colors.added.text :
                    item.type === 'REMOVED' ? colors.removed.text :
                    item.type === 'MODIFIED' ? colors.modified.text :
                    item.type === 'MOVED' ? colors.moved.text :
                    colors.typeChanged.text;
                  
                  return (
                    <g key={item.type}>
                      {/* Bar */}
                      <rect
                        x={startX}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={barColor}
                        rx="4"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      {/* Value label on bar */}
                      {item.value > 0 && (
                        <text
                          x={startX + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fill={textColor}
                          fontSize="12"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {item.value}
                        </text>
                      )}
                      {/* Category label */}
                      <text
                        x={startX + barWidth / 2}
                        y="195"
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="11"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="report-histogram-legend">
              {histogramData.map((item) => {
                const barColor = 
                  item.type === 'ADDED' ? colors.added.bg :
                  item.type === 'REMOVED' ? colors.removed.bg :
                  item.type === 'MODIFIED' ? colors.modified.bg :
                  item.type === 'MOVED' ? colors.moved.bg :
                  colors.typeChanged.bg;
                
                return (
                  <div key={item.type} className="report-legend-item">
                    <div
                      className="report-legend-color"
                      style={{ backgroundColor: barColor }}
                    />
                    <span>
                      {item.label}: {item.value} ({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Changes List */}
        <div className="report-changes-section">
          <h3 className="report-subtitle">
            All Changes
            {changes.length > 1000 && (
              <span className="report-virtual-hint">
                ({changes.length} changes - virtual scrolling enabled)
              </span>
            )}
          </h3>
          <VirtualizedChangesList
            items={changes}
            threshold={1000}
            estimatedItemHeight={180}
            overscan={10}
            className="report-changes-list"
            getKey={(change, index) => `${change?.jsonPath || 'change'}-${change?.type || 'unknown'}-${index}`}
            renderItem={renderChangeItem}
          />
        </div>
      </div>
    </div>
  );
}
