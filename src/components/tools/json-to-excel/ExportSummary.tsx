'use client';

import React from 'react';
import type { StructureAnalysis, ColumnConfig, ExportResult } from '@/lib/excel/types';

interface ExportSummaryProps {
  structure: StructureAnalysis | null;
  columns: ColumnConfig[];
  lastExportResult: ExportResult | null;
  onExport: () => void;
  isExporting: boolean;
  canExport: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function ExportSummary({
  structure,
  columns,
  lastExportResult,
  onExport,
  isExporting,
  canExport,
}: ExportSummaryProps) {
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="export-summary">
      {/* Data Summary */}
      {structure && (
        <div className="summary-section">
          <div className="section-title">
            <i className="fas fa-database"></i>
            Data Summary
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="item-label">Rows</span>
              <span className="item-value">{structure.rowCount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Columns</span>
              <span className="item-value">{visibleColumns.length}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Structure</span>
              <span className="item-value type-badge">{structure.type.replace(/_/g, ' ')}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Max Depth</span>
              <span className="item-value">{structure.maxDepth}</span>
            </div>
          </div>

          {/* Warnings */}
          {structure.warnings.length > 0 && (
            <div className="warnings">
              {structure.warnings.map((warning, index) => (
                <div key={index} className="warning-item">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export Button */}
      <div className="export-section">
        <button
          className="export-btn"
          onClick={onExport}
          disabled={!canExport || isExporting}
        >
          {isExporting ? (
            <>
              <div className="spinner"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <i className="fas fa-download"></i>
              <span>Download Excel</span>
            </>
          )}
        </button>
      </div>

      {/* Last Export Result */}
      {lastExportResult && (
        <div className={`export-result ${lastExportResult.success ? 'success' : 'error'}`}>
          {lastExportResult.success ? (
            <>
              <i className="fas fa-check-circle"></i>
              <div className="result-details">
                <span className="result-title">Export Successful</span>
                <span className="result-info">
                  {lastExportResult.filename}
                  {lastExportResult.fileSize && ` (${formatFileSize(lastExportResult.fileSize)})`}
                </span>
              </div>
            </>
          ) : (
            <>
              <i className="fas fa-times-circle"></i>
              <div className="result-details">
                <span className="result-title">Export Failed</span>
                <span className="result-info">{lastExportResult.error}</span>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .export-summary {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .section-title i {
          color: var(--primary);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }

        .item-label {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .item-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
        }

        .type-badge {
          font-size: 0.75rem;
          text-transform: capitalize;
        }

        .warnings {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .warning-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: rgba(255, 152, 0, 0.1);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: #ff9800;
        }

        .export-section {
          padding-top: 0.5rem;
        }

        .export-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--primary);
          border: none;
          border-radius: var(--radius-md);
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .export-result {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
        }

        .export-result.success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .export-result.success i {
          color: #4CAF50;
        }

        .export-result.error {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .export-result.error i {
          color: #f44336;
        }

        .export-result i {
          font-size: 1.25rem;
          margin-top: 0.125rem;
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .result-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }

        .result-info {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
