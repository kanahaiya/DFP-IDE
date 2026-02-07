'use client';

import React from 'react';
import type { RepairResult, RepairConfidence } from '@/lib/json-repair/types';

interface RepairSummaryProps {
  result: RepairResult | null;
  isRepairing: boolean;
}

function getConfidenceColor(confidence: RepairConfidence): string {
  switch (confidence) {
    case 'high':
      return 'var(--success)';
    case 'medium':
      return 'var(--warning)';
    case 'low':
      return 'var(--danger)';
  }
}

function getConfidenceIcon(confidence: RepairConfidence): string {
  switch (confidence) {
    case 'high':
      return 'fas fa-check-circle';
    case 'medium':
      return 'fas fa-exclamation-circle';
    case 'low':
      return 'fas fa-exclamation-triangle';
  }
}

export function RepairSummary({ result, isRepairing }: RepairSummaryProps) {
  if (isRepairing) {
    return (
      <div className="summary-panel">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Repairing JSON...</span>
        </div>
        <style jsx>{`
          .summary-panel {
            padding: 1rem;
          }
          .loading-state {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="summary-panel">
        <div className="empty-state">
          <i className="fas fa-wrench"></i>
          <p>Click &quot;Repair JSON&quot; to fix syntax errors</p>
        </div>
        <style jsx>{`
          .summary-panel {
            padding: 1rem;
          }
          .empty-state {
            text-align: center;
            padding: 2rem 1rem;
            color: var(--text-secondary);
          }
          .empty-state i {
            font-size: 2rem;
            margin-bottom: 0.75rem;
            opacity: 0.5;
          }
          .empty-state p {
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="summary-panel">
      {/* Status Banner */}
      <div className={`status-banner ${result.success && result.isValid ? 'success' : 'error'}`}>
        <i className={result.success && result.isValid ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
        <span>
          {result.success && result.isValid
            ? 'JSON repaired successfully!'
            : result.error || 'Repair failed'}
        </span>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{result.totalFixes}</div>
          <div className="stat-label">Fixes Applied</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: getConfidenceColor(result.confidence) }}>
            <i className={getConfidenceIcon(result.confidence)}></i>
          </div>
          <div className="stat-label">
            {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{result.repairTime.toFixed(1)}ms</div>
          <div className="stat-label">Repair Time</div>
        </div>
      </div>

      {/* Operations List */}
      {result.operations.length > 0 && (
        <div className="operations-section">
          <h4 className="section-title">Repairs Made</h4>
          <ul className="operations-list">
            {result.operations.map((op, index) => (
              <li key={index} className={`operation-item severity-${op.severity}`}>
                <i className={getSeverityIcon(op.severity)}></i>
                <span>{op.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No changes message */}
      {result.operations.length === 0 && result.success && (
        <div className="no-changes">
          <i className="fas fa-check"></i>
          <span>No repairs needed - JSON was already valid</span>
        </div>
      )}

      <style jsx>{`
        .summary-panel {
          padding: 1rem;
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .status-banner.success {
          background: rgba(59, 185, 80, 0.1);
          color: var(--success);
          border: 1px solid rgba(59, 185, 80, 0.3);
        }

        .status-banner.error {
          background: rgba(248, 81, 73, 0.1);
          color: var(--danger);
          border: 1px solid rgba(248, 81, 73, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .stat-card {
          text-align: center;
          padding: 0.75rem;
          background: var(--elevated);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .operations-section {
          margin-top: 1rem;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .operations-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .operation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem 0;
          font-size: 0.8rem;
          border-bottom: 1px solid var(--border);
        }

        .operation-item:last-child {
          border-bottom: none;
        }

        .operation-item i {
          margin-top: 0.1rem;
          font-size: 0.75rem;
        }

        .operation-item.severity-critical i {
          color: var(--danger);
        }

        .operation-item.severity-high i {
          color: #ea580c;
        }

        .operation-item.severity-medium i {
          color: var(--warning);
        }

        .operation-item.severity-low i {
          color: var(--success);
        }

        .no-changes {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--elevated);
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--success);
        }
      `}</style>
    </div>
  );
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'fas fa-exclamation-triangle';
    case 'high':
      return 'fas fa-exclamation-circle';
    case 'medium':
      return 'fas fa-info-circle';
    case 'low':
      return 'fas fa-check-circle';
    default:
      return 'fas fa-circle';
  }
}
