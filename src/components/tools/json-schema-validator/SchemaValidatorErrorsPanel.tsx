'use client';

import React from 'react';
import type { SchemaValidationError } from '@/lib/schema-validator/types';

interface SchemaValidatorErrorsPanelProps {
  errors: SchemaValidationError[];
  schemaErrors: string[];
}

export function SchemaValidatorErrorsPanel({ errors, schemaErrors }: SchemaValidatorErrorsPanelProps) {
  const hasSchemaErrors = schemaErrors.length > 0;
  const hasValidationErrors = errors.length > 0;
  const hasNoErrors = !hasSchemaErrors && !hasValidationErrors;

  return (
    <div className="settings-panel">
      <h3 className="settings-title">Validation Errors</h3>

      {hasNoErrors && (
        <div className="no-errors">
          <i className="fas fa-check-circle"></i>
          <p>No errors found</p>
          <span>Your data validates against the schema</span>
        </div>
      )}

      {hasSchemaErrors && (
        <div className="error-section">
          <h4 className="error-section-title">
            <i className="fas fa-file-alt"></i>
            Schema Errors ({schemaErrors.length})
          </h4>
          <div className="error-list">
            {schemaErrors.map((error, index) => (
              <div key={index} className="error-item schema-error">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasValidationErrors && (
        <div className="error-section">
          <h4 className="error-section-title">
            <i className="fas fa-times-circle"></i>
            Validation Errors ({errors.length})
          </h4>
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item validation-error">
                <div className="error-header">
                  <span className="error-path">
                    <i className="fas fa-map-marker-alt"></i>
                    {error.path || '(root)'}
                  </span>
                  <span className="error-keyword">{error.keyword}</span>
                </div>
                <div className="error-message">{error.message}</div>
                {error.suggestion && (
                  <div className="error-suggestion">
                    <i className="fas fa-lightbulb"></i>
                    {error.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .no-errors {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          text-align: center;
        }

        .no-errors i {
          font-size: 2.5rem;
          color: var(--success, #22c55e);
        }

        .no-errors p {
          font-weight: 500;
          color: var(--success, #22c55e);
          margin: 0;
        }

        .no-errors span {
          font-size: 0.8rem;
          color: var(--text-muted, #888);
        }

        .error-section {
          margin-bottom: 1.5rem;
        }

        .error-section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--danger, #ef4444);
        }

        .error-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .error-item {
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .schema-error {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: var(--warning, #f59e0b);
          border-left: 3px solid var(--warning, #f59e0b);
        }

        .validation-error {
          border-left: 3px solid var(--danger, #ef4444);
        }

        .error-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .error-path {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: monospace;
          color: var(--primary, #3b82f6);
        }

        .error-keyword {
          background: rgba(239, 68, 68, 0.2);
          color: var(--danger, #ef4444);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .error-message {
          color: var(--text-primary, #fff);
          margin-bottom: 0.5rem;
        }

        .error-suggestion {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          color: var(--info, #3b82f6);
          font-size: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color, #333);
        }

        .error-suggestion i {
          color: var(--warning, #f59e0b);
        }
      `}</style>
    </div>
  );
}
