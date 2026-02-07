'use client';

import React from 'react';
import type { CleaningResult } from '@/lib/json-cleaner/types';

interface CleaningSummaryProps {
  result: CleaningResult | null;
  isProcessing: boolean;
}

export function CleaningSummary({ result, isProcessing }: CleaningSummaryProps) {
  if (isProcessing) {
    return (
      <div className="summary-panel">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Processing...</span>
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
          <i className="fas fa-broom"></i>
          <p>Configure options and click &quot;Clean JSON&quot;</p>
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

  const { stats } = result;

  return (
    <div className="summary-panel">
      {/* Status Banner */}
      <div className={`status-banner ${result.success ? 'success' : 'error'}`}>
        <i className={result.success ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
        <span>
          {result.success ? 'Cleaning complete!' : result.error || 'Cleaning failed'}
        </span>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatBytes(stats.inputSize)}</div>
          <div className="stat-label">Input Size</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatBytes(stats.outputSize)}</div>
          <div className="stat-label">Output Size</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.sizeReduction.toFixed(1)}%</div>
          <div className="stat-label">Size Reduction</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.removedItems}</div>
          <div className="stat-label">Items Removed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.transformedItems}</div>
          <div className="stat-label">Transforms</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{result.processingTime.toFixed(1)}ms</div>
          <div className="stat-label">Time</div>
        </div>
      </div>

      {/* Operations List */}
      {result.operations.length > 0 && (
        <div className="operations-section">
          <h4 className="section-title">Operations Applied</h4>
          <ul className="operations-list">
            {result.operations.map((op, index) => (
              <li key={index} className="operation-item">
                <i className="fas fa-check"></i>
                <span>{op.description}</span>
              </li>
            ))}
          </ul>
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
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stat-card {
          text-align: center;
          padding: 0.625rem;
          background: var(--elevated);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .stat-card.highlight {
          background: rgba(88, 166, 255, 0.1);
          border-color: var(--primary);
        }

        .stat-card.highlight .stat-value {
          color: var(--primary);
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
        }

        .stat-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 0.125rem;
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
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
        }

        .operation-item:last-child {
          border-bottom: none;
        }

        .operation-item i {
          color: var(--success);
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
