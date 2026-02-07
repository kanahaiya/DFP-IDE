'use client';

import React, { useMemo } from 'react';
import type { ExportFormat } from '@/lib/json-generator/types';

interface PreviewPanelProps {
  data: Record<string, unknown>[] | null;
  output: string | null;
  format: ExportFormat;
}

export function PreviewPanel({ data, output, format }: PreviewPanelProps) {
  // Format preview data
  const previewContent = useMemo(() => {
    if (output) {
      return output;
    }
    
    if (data && data.length > 0) {
      return JSON.stringify(data, null, 2);
    }
    
    return null;
  }, [data, output]);

  // Get language for syntax highlighting hint
  const getLanguage = (): string => {
    if (output) {
      switch (format) {
        case 'json':
        case 'jsonl':
          return 'json';
        case 'csv':
          return 'csv';
        case 'typescript':
          return 'typescript';
        default:
          return 'json';
      }
    }
    return 'json';
  };

  if (!previewContent) {
    return (
      <div className="preview-empty">
        <i className="fas fa-file-code"></i>
        <p>Add fields to see a preview</p>
        <p className="hint">Generated data will appear here</p>
        
        <style jsx>{`
          .preview-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 2rem;
            text-align: center;
            color: var(--text-secondary);
          }

          .preview-empty i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.3;
          }

          .preview-empty p {
            margin: 0;
            font-size: 0.875rem;
          }

          .preview-empty .hint {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <span className="language-badge">{getLanguage().toUpperCase()}</span>
        {data && !output && (
          <span className="preview-badge">
            <i className="fas fa-eye"></i>
            Preview (3 records)
          </span>
        )}
      </div>
      
      <pre className="preview-content">
        <code>{previewContent}</code>
      </pre>

      <style jsx>{`
        .preview-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }

        .language-badge {
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
        }

        .preview-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          color: var(--text-secondary);
        }

        .preview-badge i {
          font-size: 0.625rem;
        }

        .preview-content {
          flex: 1;
          margin: 0;
          padding: 1rem;
          overflow: auto;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--text);
          background: var(--bg);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .preview-content code {
          font-family: inherit;
        }

        /* Basic syntax highlighting */
        .preview-content :global(.string) {
          color: var(--success);
        }

        .preview-content :global(.number) {
          color: var(--warning);
        }

        .preview-content :global(.boolean) {
          color: var(--info);
        }

        .preview-content :global(.null) {
          color: var(--text-muted);
        }

        .preview-content :global(.key) {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
