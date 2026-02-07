'use client';

import React from 'react';
import type { ErrorItem, ErrorSeverity } from '@/lib/json-fixer/types';
import { ERROR_TYPE_INFO } from '@/lib/json-fixer/types';

interface ErrorPanelProps {
  errors: ErrorItem[];
  selectedErrorId: string | null;
  onSelectError: (errorId: string) => void;
  onApplyBestFix: (error: ErrorItem) => void;
  showExplanations: boolean;
}

function getSeverityColor(severity: ErrorSeverity): string {
  switch (severity) {
    case 'critical':
      return 'var(--danger)';
    case 'high':
      return '#ea580c';
    case 'medium':
      return 'var(--warning)';
    case 'low':
      return 'var(--success)';
  }
}

export function ErrorPanel({
  errors,
  selectedErrorId,
  onSelectError,
  onApplyBestFix,
  showExplanations,
}: ErrorPanelProps) {
  if (errors.length === 0) {
    return (
      <div className="error-panel-empty">
        <i className="fas fa-check-circle"></i>
        <p>No errors found!</p>
        <span>Your JSON is valid</span>
        <style jsx>{`
          .error-panel-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1rem;
            text-align: center;
            color: var(--success);
          }
          .error-panel-empty i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.7;
          }
          .error-panel-empty p {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
          }
          .error-panel-empty span {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="error-panel">
      <div className="error-header">
        <span className="error-count">
          {errors.length} error{errors.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <ul className="error-list">
        {errors.map((error) => {
          const typeInfo = ERROR_TYPE_INFO[error.type];
          const isSelected = error.id === selectedErrorId;

          return (
            <li
              key={error.id}
              className={`error-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectError(error.id)}
            >
              <div className="error-main">
                <div className="error-icon" style={{ color: getSeverityColor(error.severity) }}>
                  <i className={typeInfo.icon}></i>
                </div>
                <div className="error-content">
                  <div className="error-title">
                    <span className="error-type">{typeInfo.title}</span>
                    <span className="error-location">Line {error.line}:{error.column}</span>
                  </div>
                  <p className="error-message">{error.message}</p>
                  {showExplanations && isSelected && (
                    <div className="error-explanation">
                      <pre>{error.explanation}</pre>
                    </div>
                  )}
                </div>
              </div>

              {error.fixable && (
                <div className="error-actions">
                  <button
                    className="fix-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyBestFix(error);
                    }}
                  >
                    <i className="fas fa-wrench"></i>
                    Fix
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .error-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .error-header {
          padding: 0.75rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }

        .error-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--danger);
        }

        .error-list {
          flex: 1;
          overflow-y: auto;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .error-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .error-item:hover {
          background: var(--hover);
        }

        .error-item.selected {
          background: rgba(88, 166, 255, 0.1);
          border-left: 3px solid var(--primary);
        }

        .error-main {
          display: flex;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .error-icon {
          font-size: 1rem;
          margin-top: 0.125rem;
        }

        .error-content {
          flex: 1;
          min-width: 0;
        }

        .error-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .error-type {
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--text);
        }

        .error-location {
          font-size: 0.7rem;
          color: var(--text-secondary);
          padding: 0.125rem 0.375rem;
          background: var(--elevated);
          border-radius: 4px;
        }

        .error-message {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .error-explanation {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: var(--elevated);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .error-explanation pre {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
          white-space: pre-wrap;
          font-family: var(--font-mono);
          line-height: 1.5;
        }

        .error-actions {
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
        }

        .fix-button {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.625rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .fix-button:hover {
          background: var(--primary-dark);
        }
      `}</style>
    </div>
  );
}
