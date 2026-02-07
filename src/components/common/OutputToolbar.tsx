'use client';

import React from 'react';

interface OutputToolbarProps {
  onCopy?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onClear?: () => void;
  onValidate?: () => void;
  onPreview?: () => void;
  label?: string;
  icon?: string;
  children?: React.ReactNode;
  // JSONPath specific props
  query?: string;
  onQueryChange?: (query: string) => void;
  onExecute?: () => void;
  onClearQuery?: () => void;
  isQueryInput?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Output editor toolbar with copy, download, share, and clear actions
 */
export function OutputToolbar({
  onCopy,
  onDownload,
  onShare,
  onClear,
  onValidate,
  onPreview,
  label = 'Output',
  icon = 'fa-file-code',
  children,
  query,
  onQueryChange,
  onExecute,
  onClearQuery,
  isQueryInput,
  placeholder,
  disabled,
}: OutputToolbarProps) {
  const safe =
    (fn?: () => void) =>
    () => {
      try {
        fn?.();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <>
      <div className="editor-toolbar">
        {isQueryInput ? (
          <>
            <div className="query-input-wrapper">
              <input
                type="text"
                className="query-input-header"
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onExecute?.();
                  }
                }}
                placeholder={placeholder || "$.store.book[*].author"}
                style={{
                  borderRadius: '0px',
                  WebkitBorderRadius: '0px',
                  MozBorderRadius: '0px',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              />
            </div>
            <div className="editor-toolbar-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={safe(onExecute)}
                disabled={disabled || !query?.trim()}
              >
                <i className="fas fa-play"></i>
                <span className="btn-text">Run</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={safe(onClearQuery)}
              >
                <i className="fas fa-trash"></i>
                <span className="btn-text">Clear</span>
              </button>
              {onCopy && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onCopy)}
                  title="Copy to clipboard"
                  aria-label="Copy to clipboard"
                >
                  <i className="fas fa-copy"></i>
                  <span className="btn-text">Copy</span>
                </button>
              )}
              {onDownload && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onDownload)}
                  title="Download file"
                  aria-label="Download file"
                >
                  <i className="fas fa-download"></i>
                  <span className="btn-text">Download</span>
                </button>
              )}
              {onShare && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onShare)}
                  title="Share link"
                  aria-label="Share link"
                >
                  <i className="fas fa-share-alt"></i>
                  <span className="btn-text">Share</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="editor-toolbar-label">
              <i className={`fas ${icon}`}></i>
              {label}
            </div>
            <div className="editor-toolbar-actions">
              {children}
              {onValidate && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onValidate)}
                  title="Validate spec"
                  aria-label="Validate spec"
                >
                  <i className="fas fa-check-circle"></i>
                  <span className="btn-text">Validate</span>
                </button>
              )}
              {onPreview && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onPreview)}
                  title="Preview in Swagger UI"
                  aria-label="Preview in Swagger UI"
                >
                  <i className="fas fa-eye"></i>
                  <span className="btn-text">Preview</span>
                </button>
              )}
              {(onValidate || onPreview) && <div className="toolbar-separator"></div>}
              {onCopy && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onCopy)}
                  title="Copy to clipboard"
                  aria-label="Copy to clipboard"
                >
                  <i className="fas fa-copy"></i>
                  <span className="btn-text">Copy</span>
                </button>
              )}
              {onDownload && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onDownload)}
                  title="Download file"
                  aria-label="Download file"
                >
                  <i className="fas fa-download"></i>
                  <span className="btn-text">Download</span>
                </button>
              )}
              {onShare && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onShare)}
                  title="Share link"
                  aria-label="Share link"
                >
                  <i className="fas fa-share-alt"></i>
                  <span className="btn-text">Share</span>
                </button>
              )}
              {onClear && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={safe(onClear)}
                  title="Clear output"
                  aria-label="Clear output"
                >
                  <i className="fas fa-times"></i>
                  <span className="btn-text">Clear</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* CSS styles for query input */}
      <style jsx>{`
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
          border-radius: 0;
        }
        
        .query-input-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          margin-right: 0.5rem;
        }
        
        .query-input-header {
          flex: 1;
          padding: 0.75rem 1rem;
          height: 44px;
          font-family: 'Fira Code', 'Monaco', monospace;
          font-size: 0.95rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 0 !important;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          min-width: 300px;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        /* Override global input styles */
        .editor-toolbar .query-input-header {
          border-radius: 0 !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        .editor-toolbar input[type="text"].query-input-header {
          border-radius: 0 !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        /* Ultra-specific override */
        input.query-input-header[type="text"] {
          border-radius: 0 !important;
          -webkit-border-radius: 0 !important;
          -moz-border-radius: 0 !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        /* Force rectangular corners on all levels */
        * .query-input-header {
          border-radius: 0 !important;
        }
        
        * input.query-input-header {
          border-radius: 0 !important;
        }
        
        .query-input-header:focus {
          border-color: var(--primary);
        }
        
        .query-input-header::placeholder {
          color: var(--text-muted);
        }
        
        .query-input-header:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
