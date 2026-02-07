'use client';

import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';

// Dynamic import for Monaco Editor
const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then((mod) => ({ default: mod.MonacoEditorPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="editor-loading">
        <div className="loading-spinner" />
        <span>Loading editor...</span>
      </div>
    ),
  }
);

interface InputPanelProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function InputPanel({ isCollapsed = false, onToggleCollapse }: InputPanelProps) {
  const {
    jsonInput,
    parseError,
    isLoading,
    setJsonInput,
    loadFromUrl,
    clearInput,
  } = useJsonVisualizerStore();

  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        setJsonInput(text);
      } catch (err) {
        console.error('Failed to read file:', err);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setJsonInput]
  );

  const handleLoadUrl = useCallback(async () => {
    if (!urlInput.trim()) return;
    await loadFromUrl(urlInput);
    setShowUrlInput(false);
    setUrlInput('');
  }, [urlInput, loadFromUrl]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      // Already handled by parseError
    }
  }, [jsonInput, setJsonInput]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
    } catch {
      // Already handled by parseError
    }
  }, [jsonInput, setJsonInput]);

  if (isCollapsed) {
    return (
      <div className="input-panel-collapsed">
        <button className="expand-btn" onClick={onToggleCollapse} title="Expand input panel">
          <i className="fas fa-chevron-right" />
          <span>Input</span>
        </button>
        <style jsx>{`
          .input-panel-collapsed {
            width: 40px;
            height: 100%;
            background: var(--card);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 12px;
          }
          .expand-btn {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            display: flex;
            align-items: center;
            gap: 8px;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 8px 4px;
            font-size: 12px;
          }
          .expand-btn:hover {
            color: var(--text);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="input-panel">
      {/* Toolbar */}
      <div className="input-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-title">JSON Input</span>
        </div>
        <div className="toolbar-right">
          <button
            className="toolbar-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload JSON file"
          >
            <i className="fas fa-upload" />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setShowUrlInput(!showUrlInput)}
            title="Load from URL"
          >
            <i className="fas fa-link" />
          </button>
          <button className="toolbar-btn" onClick={handleFormat} title="Format JSON">
            <i className="fas fa-indent" />
          </button>
          <button className="toolbar-btn" onClick={handleMinify} title="Minify JSON">
            <i className="fas fa-compress" />
          </button>
          <button className="toolbar-btn" onClick={clearInput} title="Clear">
            <i className="fas fa-trash" />
          </button>
          {onToggleCollapse && (
            <button className="toolbar-btn" onClick={onToggleCollapse} title="Collapse panel">
              <i className="fas fa-chevron-left" />
            </button>
          )}
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="url-input-container">
          <input
            type="text"
            placeholder="Enter JSON URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoadUrl()}
          />
          <button onClick={handleLoadUrl} disabled={isLoading}>
            {isLoading ? <i className="fas fa-spinner fa-spin" /> : 'Load'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {parseError && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Editor */}
      <div className="editor-container">
        <MonacoEditorPanel
          language="json"
          value={jsonInput}
          onChange={setJsonInput}
        />
      </div>

      <style jsx>{`
        .input-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          background: var(--card);
          overflow: hidden;
        }

        .input-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
          flex-shrink: 0;
          height: 40px;
        }

        .toolbar-title {
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
        }

        .toolbar-right {
          display: flex;
          gap: 4px;
        }

        .toolbar-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 6px 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: var(--hover);
          color: var(--text);
        }

        .url-input-container {
          display: flex;
          padding: 8px 12px;
          gap: 8px;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .url-input-container input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--input-bg);
          color: var(--text);
          font-size: 12px;
        }

        .url-input-container input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .url-input-container button {
          padding: 6px 12px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }

        .url-input-container button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(248, 81, 73, 0.1);
          border-bottom: 1px solid rgba(248, 81, 73, 0.3);
          color: var(--danger);
          font-size: 12px;
          flex-shrink: 0;
        }

        .editor-container {
          flex: 1 1 0;
          min-height: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-container :global(.monaco-editor-wrapper) {
          flex: 1 1 0;
          min-height: 0;
          height: 100%;
        }

        .editor-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 12px;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
