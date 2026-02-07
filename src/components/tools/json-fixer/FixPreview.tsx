'use client';

import React from 'react';
import type { ErrorItem, FixSuggestion } from '@/lib/json-fixer/types';
import { generateFixPreview } from '@/lib/json-fixer/fixer';

interface FixPreviewProps {
  error: ErrorItem;
  input: string;
  onApplyFix: (error: ErrorItem, suggestion: FixSuggestion) => void;
  onClose: () => void;
}

export function FixPreview({ error, input, onApplyFix, onClose }: FixPreviewProps) {
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<FixSuggestion | null>(
    error.suggestions[0] || null
  );

  const preview = selectedSuggestion
    ? generateFixPreview(input, selectedSuggestion)
    : null;

  return (
    <div className="fix-preview-overlay" onClick={onClose}>
      <div className="fix-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fix-preview-header">
          <h3>Fix Preview</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="fix-preview-content">
          <div className="error-summary">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <strong>{error.type.replace(/_/g, ' ')}</strong>
              <span>Line {error.line}, Column {error.column}</span>
            </div>
          </div>

          <p className="error-message">{error.message}</p>

          {error.suggestions.length > 1 && (
            <div className="suggestions-list">
              <label>Available fixes:</label>
              {error.suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className={`suggestion-option ${
                    selectedSuggestion?.id === suggestion.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <span className={`confidence-badge ${suggestion.confidence}`}>
                    {suggestion.confidence}
                  </span>
                  <span>{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}

          {preview && (
            <div className="preview-comparison">
              <div className="preview-section">
                <label>Before:</label>
                <pre className="preview-code before">
                  {preview.before}
                </pre>
              </div>
              <div className="preview-arrow">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="preview-section">
                <label>After:</label>
                <pre className="preview-code after">
                  {preview.after}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="fix-preview-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => selectedSuggestion && onApplyFix(error, selectedSuggestion)}
            disabled={!selectedSuggestion}
          >
            <i className="fas fa-check"></i>
            Apply Fix
          </button>
        </div>
      </div>

      <style jsx>{`
        .fix-preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .fix-preview-modal {
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          background: var(--card);
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .fix-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }

        .fix-preview-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
        }

        .close-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--text);
        }

        .fix-preview-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        .error-summary {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(248, 81, 73, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .error-summary i {
          color: var(--danger);
          font-size: 1.25rem;
        }

        .error-summary div {
          display: flex;
          flex-direction: column;
        }

        .error-summary strong {
          font-size: 0.9rem;
          color: var(--text);
          text-transform: capitalize;
        }

        .error-summary span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .error-message {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .suggestions-list {
          margin-bottom: 1.25rem;
        }

        .suggestions-list label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .suggestion-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .suggestion-option:hover {
          border-color: var(--primary);
        }

        .suggestion-option.selected {
          border-color: var(--primary);
          background: rgba(88, 166, 255, 0.1);
        }

        .confidence-badge {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
        }

        .confidence-badge.high {
          background: rgba(59, 185, 80, 0.2);
          color: var(--success);
        }

        .confidence-badge.medium {
          background: rgba(255, 193, 7, 0.2);
          color: var(--warning);
        }

        .confidence-badge.low {
          background: rgba(248, 81, 73, 0.2);
          color: var(--danger);
        }

        .suggestion-option span:last-child {
          font-size: 0.8rem;
          color: var(--text);
        }

        .preview-comparison {
          background: var(--elevated);
          border-radius: 8px;
          padding: 1rem;
        }

        .preview-section label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.375rem;
          text-transform: uppercase;
        }

        .preview-code {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 0;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .preview-code.before {
          background: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.3);
          color: var(--text);
        }

        .preview-code.after {
          background: rgba(59, 185, 80, 0.1);
          border: 1px solid rgba(59, 185, 80, 0.3);
          color: var(--text);
        }

        .preview-arrow {
          text-align: center;
          padding: 0.5rem;
          color: var(--text-secondary);
        }

        .fix-preview-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border);
          background: var(--elevated);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
        }

        .btn-secondary:hover {
          background: var(--hover);
        }

        .btn-primary {
          background: var(--primary);
          border: none;
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
