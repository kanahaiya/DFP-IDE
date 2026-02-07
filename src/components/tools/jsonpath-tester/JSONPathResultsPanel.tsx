'use client';

import React from 'react';
import type { JSONPathResult, JSONPathSettings } from '@/lib/jsonpath/types';
import { formatResultValue, matchesToTable } from '@/lib/jsonpath/executor';

interface JSONPathResultsPanelProps {
  result: JSONPathResult | null;
  settings: JSONPathSettings;
  isExecuting: boolean;
}

function TreeView({ data, level = 0 }: { data: unknown; level?: number }) {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);

  if (data === null) return <span className="tree-null">null</span>;
  if (data === undefined) return <span className="tree-undefined">undefined</span>;
  if (typeof data === 'boolean') return <span className="tree-boolean">{String(data)}</span>;
  if (typeof data === 'number') return <span className="tree-number">{data}</span>;
  if (typeof data === 'string') return <span className="tree-string">&quot;{data}&quot;</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="tree-empty">[]</span>;
    return (
      <div className="tree-node">
        <button className="tree-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <i className={`fas fa-caret-${isExpanded ? 'down' : 'right'}`}></i>
          <span className="tree-type">Array[{data.length}]</span>
        </button>
        {isExpanded && (
          <div className="tree-children">
            {data.map((item, index) => (
              <div key={index} className="tree-item">
                <span className="tree-key">{index}:</span>
                <TreeView data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="tree-empty">{'{}'}</span>;
    return (
      <div className="tree-node">
        <button className="tree-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <i className={`fas fa-caret-${isExpanded ? 'down' : 'right'}`}></i>
          <span className="tree-type">Object{'{' + keys.length + '}'}</span>
        </button>
        {isExpanded && (
          <div className="tree-children">
            {keys.map((key) => (
              <div key={key} className="tree-item">
                <span className="tree-key">{key}:</span>
                <TreeView data={(data as Record<string, unknown>)[key]} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

function TableView({ result, settings }: { result: JSONPathResult; settings: JSONPathSettings }) {
  const { headers, rows } = matchesToTable(result.matches);

  if (rows.length === 0) {
    return <div className="empty-message">No results to display</div>;
  }

  return (
    <div className="table-container">
      <table className="results-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cell === null ? (
                    <span className="null-value">null</span>
                  ) : cellIndex === 1 && settings.showPaths ? (
                    <code className="path-value">{String(cell)}</code>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function JSONPathResultsPanel({
  result,
  settings,
  isExecuting,
}: JSONPathResultsPanelProps) {
  if (isExecuting) {
    return (
      <div className="results-panel loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Executing query...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-panel empty">
        <i className="fas fa-search"></i>
        <span>Enter a JSONPath query to see results</span>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="results-panel error">
        <div className="error-header">
          <i className="fas fa-exclamation-circle"></i>
          <span>Query Error</span>
        </div>
        <pre className="error-message">{result.error}</pre>
      </div>
    );
  }

  if (result.matches.length === 0) {
    return (
      <div className="results-panel empty">
        <i className="fas fa-search"></i>
        <span>No matches found</span>
        <p>Try a different query or check your JSON structure</p>
      </div>
    );
  }

  const values = result.matches.map(m => m.value);

  return (
    <div className="results-panel">
      <div className="results-header">
        <span className="match-count">
          <i className="fas fa-check-circle"></i>
          {result.matchCount} match{result.matchCount !== 1 ? 'es' : ''}
        </span>
        <span className="exec-time">
          <i className="fas fa-clock"></i>
          {result.executionTime.toFixed(2)}ms
        </span>
      </div>

      <div className="results-content">
        {settings.resultFormat === 'json' && (
          <pre className="json-output">
            {settings.showPaths
              ? result.matches.map((m, i) => (
                  <div key={i} className="match-item">
                    <div className="match-path">
                      <i className="fas fa-map-marker-alt"></i>
                      <code>{m.path}</code>
                    </div>
                    <div className="match-value">
                      {formatResultValue(m.value, settings)}
                    </div>
                  </div>
                ))
              : formatResultValue(
                  settings.wrapResults ? values : values.length === 1 ? values[0] : values,
                  settings
                )}
          </pre>
        )}

        {settings.resultFormat === 'table' && (
          <TableView result={result} settings={settings} />
        )}

        {settings.resultFormat === 'tree' && (
          <div className="tree-output">
            <TreeView data={settings.wrapResults ? values : values.length === 1 ? values[0] : values} />
          </div>
        )}
      </div>

      <style jsx>{`
        .results-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .results-panel.loading,
        .results-panel.empty {
          align-items: center;
          justify-content: center;
          color: var(--text-muted, #888);
          text-align: center;
          gap: 0.5rem;
        }

        .results-panel.loading i,
        .results-panel.empty i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .results-panel.empty p {
          font-size: 0.75rem;
        }

        .results-panel.error {
          padding: 1rem;
        }

        .error-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--error, #ef4444);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .error-message {
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          color: var(--error, #ef4444);
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 4px;
          white-space: pre-wrap;
          margin: 0;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary, #252525);
          border-bottom: 1px solid var(--border-color, #333);
          font-size: 0.8rem;
        }

        .match-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--success, #10b981);
        }

        .exec-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted, #888);
        }

        .results-content {
          flex: 1;
          overflow: auto;
          padding: 1rem;
        }

        .json-output {
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }

        .match-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color, #333);
        }

        .match-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .match-path {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted, #888);
          margin-bottom: 0.5rem;
        }

        .match-path code {
          color: var(--primary, #3b82f6);
        }

        .match-value {
          padding-left: 1.5rem;
        }

        .tree-output {
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .results-table th,
        .results-table td {
          padding: 0.5rem 0.75rem;
          text-align: left;
          border: 1px solid var(--border-color, #333);
        }

        .results-table th {
          background: var(--bg-tertiary, #252525);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: var(--text-muted, #888);
        }

        .results-table tr:hover td {
          background: var(--bg-secondary, #2a2a2a);
        }

        .null-value {
          color: var(--text-muted, #888);
          font-style: italic;
        }

        .path-value {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--primary, #3b82f6);
        }

        .empty-message {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted, #888);
        }
      `}</style>
    </div>
  );
}
