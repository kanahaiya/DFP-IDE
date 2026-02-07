'use client';

import React from 'react';
import type { PreviewData, ColumnConfig } from '@/lib/excel/types';

interface PreviewTableProps {
  preview: PreviewData | null;
  columns: ColumnConfig[];
}

export function PreviewTable({ preview, columns }: PreviewTableProps) {
  if (!preview || preview.rows.length === 0) {
    return (
      <div className="preview-empty">
        <i className="fas fa-table"></i>
        <span>No preview available</span>
        <span className="hint">Enter valid JSON to see preview</span>

        <style jsx>{`
          .preview-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 200px;
            color: var(--text-tertiary);
            text-align: center;
            background: transparent;
          }

          .preview-empty i {
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
          }

          .preview-empty span {
            font-size: 0.9rem;
          }

          .preview-empty .hint {
            font-size: 0.75rem;
            margin-top: 0.25rem;
          }
        `}</style>
      </div>
    );
  }

  // Get visible columns in order
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="preview-table-wrapper">
      <div className="preview-header">
        <div className="preview-info">
          <span className="info-item">
            <i className="fas fa-table"></i>
            {preview.totalRows} rows × {visibleColumns.length} columns
          </span>
          {preview.truncated && (
            <span className="truncated-badge">
              <i className="fas fa-info-circle"></i>
              Showing first 100 rows
            </span>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="preview-table">
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.key} title={col.originalKey}>
                  {col.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {visibleColumns.map((col) => (
                  <td key={col.key} title={formatCellValue(row[col.key])}>
                    {formatCellValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .preview-table-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: transparent;
          border-radius: 0;
          overflow: hidden;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }

        .preview-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .info-item i {
          color: var(--primary);
        }

        .truncated-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          background: rgba(255, 152, 0, 0.15);
          color: #ff9800;
          font-size: 0.7rem;
          border-radius: var(--radius-sm);
        }

        .table-container {
          flex: 1;
          overflow: auto;
        }

        .preview-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .preview-table th,
        .preview-table td {
          padding: 0.5rem 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-table th {
          background: var(--elevated);
          font-weight: 600;
          color: var(--text);
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .preview-table td {
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .preview-table tr:hover td {
          background: var(--elevated);
        }

        .preview-table tr:nth-child(even) td {
          background: rgba(0, 0, 0, 0.02);
        }

        .preview-table tr:nth-child(even):hover td {
          background: var(--elevated);
        }
      `}</style>
    </div>
  );
}
