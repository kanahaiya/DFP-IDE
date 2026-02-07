'use client';

import React, { useState } from 'react';
import type { JsonStats } from '@/lib/stats/types';

interface StatsDashboardProps {
  stats: JsonStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'types' | 'keys' | 'values' | 'quality'>('overview');

  return (
    <div className="stats-dashboard">
      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-tachometer-alt"></i> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('structure')}
        >
          <i className="fas fa-sitemap"></i> Structure
        </button>
        <button
          className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          <i className="fas fa-chart-pie"></i> Types
        </button>
        <button
          className={`tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
          onClick={() => setActiveTab('keys')}
        >
          <i className="fas fa-key"></i> Keys
        </button>
        <button
          className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
          onClick={() => setActiveTab('values')}
        >
          <i className="fas fa-calculator"></i> Values
        </button>
        <button
          className={`tab-btn ${activeTab === 'quality' ? 'active' : ''}`}
          onClick={() => setActiveTab('quality')}
        >
          <i className="fas fa-check-double"></i> Quality
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'overview' && <OverviewSection stats={stats} />}
        {activeTab === 'structure' && <StructureSection stats={stats} />}
        {activeTab === 'types' && <TypesSection stats={stats} />}
        {activeTab === 'keys' && <KeysSection stats={stats} />}
        {activeTab === 'values' && <ValuesSection stats={stats} />}
        {activeTab === 'quality' && <QualitySection stats={stats} />}
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <span>Analyzed in {stats.processingTime}ms</span>
      </div>

      <style jsx>{`
        .stats-dashboard {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .dashboard-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          padding: 0.5rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }
        
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 0;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tab-btn:hover {
          background: var(--card);
          color: var(--text);
        }
        
        .tab-btn.active {
          background: var(--primary);
          color: white;
        }
        
        .dashboard-content {
          flex: 1;
          overflow: auto;
          padding: 1rem;
        }
        
        .dashboard-footer {
          padding: 0.5rem 1rem;
          background: var(--elevated);
          border-top: 1px solid var(--border);
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: right;
        }
      `}</style>
    </div>
  );
}

// Overview Section
function OverviewSection({ stats }: { stats: JsonStats }) {
  return (
    <div className="section">
      <div className="metrics-grid">
        <MetricCard
          icon="fas fa-weight"
          label="Size"
          value={stats.size.bytesFormatted}
          subtitle={`${stats.size.lines} lines`}
          color="#4CAF50"
        />
        <MetricCard
          icon="fas fa-layer-group"
          label="Depth"
          value={String(stats.structure.maxDepth)}
          subtitle={`${stats.structure.totalValues} values`}
          color="#2196F3"
        />
        <MetricCard
          icon="fas fa-key"
          label="Keys"
          value={String(stats.keys.uniqueKeys)}
          subtitle={`${stats.keys.totalKeyInstances} instances`}
          color="#9C27B0"
        />
        <MetricCard
          icon="fas fa-check-circle"
          label="Quality"
          value={`${stats.quality.score}%`}
          subtitle={`${stats.quality.issues.length} issues`}
          color={stats.quality.score >= 70 ? '#4CAF50' : stats.quality.score >= 40 ? '#FF9800' : '#F44336'}
        />
      </div>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h4><i className="fas fa-sitemap"></i> Structure</h4>
          <ul>
            <li>Root Type: <strong>{stats.structure.rootType}</strong></li>
            <li>Objects: <strong>{stats.structure.totalObjects}</strong></li>
            <li>Arrays: <strong>{stats.structure.totalArrays}</strong></li>
          </ul>
        </div>
        <div className="summary-card">
          <h4><i className="fas fa-chart-pie"></i> Types</h4>
          <ul>
            <li>Most Common: <strong>{stats.types.mostCommon}</strong></li>
            <li>Total Values: <strong>{stats.types.totalValues}</strong></li>
            <li>Type Count: <strong>{stats.types.counts.length}</strong></li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .summary-card {
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 0;
          padding: 1rem;
        }
        
        .summary-card h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.75rem 0;
        }
        
        .summary-card h4 i {
          color: var(--primary);
        }
        
        .summary-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .summary-card li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 0.25rem 0;
        }
        
        .summary-card li strong {
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

// Structure Section
function StructureSection({ stats }: { stats: JsonStats }) {
  return (
    <div className="section">
      <h3 className="section-title">Structure Analysis</h3>
      
      <div className="metrics-grid">
        <MetricCard icon="fas fa-layer-group" label="Max Depth" value={String(stats.structure.maxDepth)} color="#2196F3" />
        <MetricCard icon="fas fa-cube" label="Objects" value={String(stats.structure.totalObjects)} color="#FF9800" />
        <MetricCard icon="fas fa-list" label="Arrays" value={String(stats.structure.totalArrays)} color="#E91E63" />
        <MetricCard icon="fas fa-key" label="Total Keys" value={String(stats.structure.totalKeys)} color="#9C27B0" />
        <MetricCard icon="fas fa-database" label="Total Values" value={String(stats.structure.totalValues)} color="#4CAF50" />
      </div>
      
      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <span>
          Root type is <strong>{stats.structure.rootType}</strong>.
          {stats.structure.isHomogeneous && ' Array contains homogeneous elements.'}
          {stats.structure.maxDepth > 5 && ' Deep nesting detected - consider flattening.'}
        </span>
      </div>

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }
        
        .info-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .info-box i {
          color: #2196F3;
          margin-top: 0.1rem;
        }
        
        .info-box strong {
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

// Types Section
function TypesSection({ stats }: { stats: JsonStats }) {
  return (
    <div className="section">
      <h3 className="section-title">Type Distribution</h3>
      
      <div className="type-bars">
        {stats.types.counts.map(type => (
          <div key={type.type} className="type-bar">
            <div className="type-label">
              <span className="type-dot" style={{ background: type.color }}></span>
              <span className="type-name">{type.type}</span>
            </div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${type.percentage}%`,
                  background: type.color,
                }}
              ></div>
            </div>
            <span className="type-count">{type.count} ({type.percentage}%)</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        
        .type-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .type-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .type-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 80px;
        }
        
        .type-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .type-name {
          font-size: 0.85rem;
          color: var(--text);
          text-transform: capitalize;
        }
        
        .bar-container {
          flex: 1;
          height: 20px;
          background: var(--elevated);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          border-radius: var(--radius-sm);
          transition: width 0.3s ease;
        }
        
        .type-count {
          font-size: 0.8rem;
          color: var(--text-secondary);
          width: 100px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}

// Keys Section
function KeysSection({ stats }: { stats: JsonStats }) {
  return (
    <div className="section">
      <h3 className="section-title">Key Analysis</h3>
      
      <div className="metrics-grid">
        <MetricCard icon="fas fa-fingerprint" label="Unique Keys" value={String(stats.keys.uniqueKeys)} color="#9C27B0" />
        <MetricCard icon="fas fa-copy" label="Total Instances" value={String(stats.keys.totalKeyInstances)} color="#2196F3" />
        <MetricCard icon="fas fa-text-width" label="Avg Length" value={String(stats.keys.averageKeyLength)} color="#4CAF50" />
      </div>
      
      {stats.keys.topKeys.length > 0 && (
        <div className="keys-table">
          <h4>Most Common Keys</h4>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Count</th>
                  <th>Sample Path</th>
                </tr>
              </thead>
              <tbody>
                {stats.keys.topKeys.slice(0, 10).map(key => (
                  <tr key={key.key}>
                    <td><code>{key.key}</code></td>
                    <td>{key.count}</td>
                    <td className="path-cell">{key.paths[0] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {stats.keys.caseVariations.length > 0 && (
        <div className="warning-box">
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            Case variations found: {stats.keys.caseVariations.map(v => v.variations.join(', ')).join('; ')}
          </span>
        </div>
      )}

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }
        
        .keys-table h4 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        
        th, td {
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        
        th {
          background: var(--elevated);
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        td code {
          background: var(--elevated);
          padding: 0.15rem 0.35rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }
        
        .path-cell {
          color: var(--text-secondary);
          font-family: monospace;
          font-size: 0.75rem;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .warning-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255, 152, 0, 0.1);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .warning-box i {
          color: #FF9800;
          margin-top: 0.1rem;
        }
      `}</style>
    </div>
  );
}

// Values Section
function ValuesSection({ stats }: { stats: JsonStats }) {
  return (
    <div className="section">
      <h3 className="section-title">Value Statistics</h3>
      
      <div className="value-cards">
        <div className="value-card">
          <h4><i className="fas fa-font" style={{ color: '#4CAF50' }}></i> Strings</h4>
          <div className="value-stats">
            <div className="stat-row"><span>Count:</span><strong>{stats.values.strings.count}</strong></div>
            <div className="stat-row"><span>Avg Length:</span><strong>{stats.values.strings.averageLength}</strong></div>
            <div className="stat-row"><span>Min/Max:</span><strong>{stats.values.strings.minLength}/{stats.values.strings.maxLength}</strong></div>
            <div className="stat-row"><span>Empty:</span><strong>{stats.values.strings.emptyCount}</strong></div>
            {stats.values.strings.urlCount > 0 && (
              <div className="stat-row"><span>URLs:</span><strong>{stats.values.strings.urlCount}</strong></div>
            )}
            {stats.values.strings.emailCount > 0 && (
              <div className="stat-row"><span>Emails:</span><strong>{stats.values.strings.emailCount}</strong></div>
            )}
          </div>
        </div>
        
        <div className="value-card">
          <h4><i className="fas fa-hashtag" style={{ color: '#2196F3' }}></i> Numbers</h4>
          <div className="value-stats">
            <div className="stat-row"><span>Count:</span><strong>{stats.values.numbers.count}</strong></div>
            <div className="stat-row"><span>Average:</span><strong>{stats.values.numbers.average}</strong></div>
            <div className="stat-row"><span>Min/Max:</span><strong>{stats.values.numbers.min}/{stats.values.numbers.max}</strong></div>
            <div className="stat-row"><span>Sum:</span><strong>{stats.values.numbers.sum}</strong></div>
            <div className="stat-row"><span>Integers:</span><strong>{stats.values.numbers.integerCount}</strong></div>
            <div className="stat-row"><span>Floats:</span><strong>{stats.values.numbers.floatCount}</strong></div>
          </div>
        </div>
        
        <div className="value-card">
          <h4><i className="fas fa-list" style={{ color: '#E91E63' }}></i> Arrays</h4>
          <div className="value-stats">
            <div className="stat-row"><span>Count:</span><strong>{stats.values.arrays.count}</strong></div>
            <div className="stat-row"><span>Avg Length:</span><strong>{stats.values.arrays.averageLength}</strong></div>
            <div className="stat-row"><span>Min/Max:</span><strong>{stats.values.arrays.minLength}/{stats.values.arrays.maxLength}</strong></div>
            <div className="stat-row"><span>Empty:</span><strong>{stats.values.arrays.emptyCount}</strong></div>
            <div className="stat-row"><span>Total Elements:</span><strong>{stats.values.arrays.totalElements}</strong></div>
          </div>
        </div>
        
        <div className="value-card">
          <h4><i className="fas fa-toggle-on" style={{ color: '#9C27B0' }}></i> Booleans & Nulls</h4>
          <div className="value-stats">
            <div className="stat-row"><span>Booleans:</span><strong>{stats.values.booleans.count}</strong></div>
            <div className="stat-row"><span>True:</span><strong>{stats.values.booleans.trueCount}</strong></div>
            <div className="stat-row"><span>False:</span><strong>{stats.values.booleans.falseCount}</strong></div>
            <div className="stat-row"><span>Nulls:</span><strong>{stats.values.nulls.count}</strong></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        
        .value-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
        }
        
        .value-card {
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 0;
          padding: 1rem;
        }
        
        .value-card h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.75rem 0;
        }
        
        .value-stats {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        
        .stat-row span {
          color: var(--text-secondary);
        }
        
        .stat-row strong {
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

// Quality Section
function QualitySection({ stats }: { stats: JsonStats }) {
  const scoreColor = stats.quality.score >= 70 ? '#4CAF50' : stats.quality.score >= 40 ? '#FF9800' : '#F44336';
  
  return (
    <div className="section">
      <h3 className="section-title">Data Quality</h3>
      
      <div className="quality-score">
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <span className="score-value" style={{ color: scoreColor }}>{stats.quality.score}</span>
          <span className="score-label">Score</span>
        </div>
        <div className="score-description">
          {stats.quality.score >= 90 && 'Excellent - Clean, consistent data'}
          {stats.quality.score >= 70 && stats.quality.score < 90 && 'Good - Minor issues to address'}
          {stats.quality.score >= 40 && stats.quality.score < 70 && 'Fair - Some quality concerns'}
          {stats.quality.score < 40 && 'Needs Attention - Significant issues found'}
        </div>
      </div>
      
      <div className="issue-counts">
        <div className="issue-count">
          <i className="fas fa-ban" style={{ color: '#9E9E9E' }}></i>
          <span>{stats.quality.nullCount} nulls</span>
        </div>
        <div className="issue-count">
          <i className="fas fa-text-slash" style={{ color: '#FF9800' }}></i>
          <span>{stats.quality.emptyStringCount} empty strings</span>
        </div>
        <div className="issue-count">
          <i className="fas fa-list" style={{ color: '#E91E63' }}></i>
          <span>{stats.quality.emptyArrayCount} empty arrays</span>
        </div>
        <div className="issue-count">
          <i className="fas fa-cube" style={{ color: '#2196F3' }}></i>
          <span>{stats.quality.emptyObjectCount} empty objects</span>
        </div>
      </div>
      
      {stats.quality.suggestions.length > 0 && (
        <div className="suggestions">
          <h4><i className="fas fa-lightbulb"></i> Suggestions</h4>
          <ul>
            {stats.quality.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        
        .quality-score {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .score-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .score-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        
        .score-description {
          font-size: 0.9rem;
          color: var(--text);
        }
        
        .issue-counts {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .issue-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .suggestions {
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 0;
          padding: 1rem;
        }
        
        .suggestions h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.75rem 0;
        }
        
        .suggestions h4 i {
          color: #FFC107;
        }
        
        .suggestions ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        
        .suggestions li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ color }}>
        <i className={icon}></i>
      </div>
      <div className="metric-content">
        <span className="metric-value">{value}</span>
        <span className="metric-label">{label}</span>
        {subtitle && <span className="metric-subtitle">{subtitle}</span>}
      </div>

      <style jsx>{`
        .metric-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        
        .metric-icon {
          font-size: 1.25rem;
        }
        
        .metric-content {
          display: flex;
          flex-direction: column;
        }
        
        .metric-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }
        
        .metric-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .metric-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
