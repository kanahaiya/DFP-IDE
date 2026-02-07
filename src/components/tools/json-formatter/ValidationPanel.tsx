'use client';

import React from 'react';
import type { ValidationError } from '@/lib/formatter/types';

interface ValidationPanelProps {
  isValid: boolean;
  errors: ValidationError[];
  onGoToError?: (line: number, column: number) => void;
}

export function ValidationPanel({
  isValid,
  errors,
  onGoToError,
}: ValidationPanelProps) {
  if (isValid) {
    return (
      <div className="validation-panel valid">
        <div className="status-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="status-text">
          <span className="status-title">Valid JSON</span>
          <span className="status-message">No syntax errors found</span>
        </div>

        <style jsx>{`
          .validation-panel {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            border-radius: var(--radius-md);
          }

          .validation-panel.valid {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
          }

          .status-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 1rem;
          }

          .valid .status-icon {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
          }

          .status-text {
            display: flex;
            flex-direction: column;
          }

          .status-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text);
          }

          .status-message {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="validation-panel invalid">
      <div className="panel-header">
        <div className="status-icon">
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="status-text">
          <span className="status-title">Invalid JSON</span>
          <span className="status-message">
            {errors.length} error{errors.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="errors-list">
        {errors.map((error, index) => (
          <div
            key={index}
            className="error-item"
            onClick={() => onGoToError?.(error.line, error.column)}
          >
            <div className="error-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>Line {error.line}, Column {error.column}</span>
            </div>
            <div className="error-message">{error.message}</div>
            {error.type && (
              <div className="error-type">{error.type}</div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .validation-panel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .validation-panel.invalid {
          padding: 0.75rem;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: var(--radius-md);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .invalid .status-icon {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }

        .status-text {
          display: flex;
          flex-direction: column;
        }

        .status-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .status-message {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .error-item {
          padding: 0.5rem 0.75rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s;
        }

        .error-item:hover {
          border-color: #f44336;
          background: rgba(244, 67, 54, 0.05);
        }

        .error-location {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .error-location i {
          color: #f44336;
          font-size: 0.7rem;
        }

        .error-message {
          font-size: 0.8rem;
          color: var(--text);
          font-family: var(--font-mono);
        }

        .error-type {
          display: inline-block;
          margin-top: 0.375rem;
          padding: 0.125rem 0.375rem;
          background: rgba(244, 67, 54, 0.15);
          color: #f44336;
          font-size: 0.65rem;
          font-weight: 600;
          border-radius: var(--radius-xs);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
