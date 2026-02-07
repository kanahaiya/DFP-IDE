'use client';

import React from 'react';
import type { QueryHistoryItem } from '@/lib/jsonpath/types';

interface JSONPathHistoryPanelProps {
  history: QueryHistoryItem[];
  onLoadQuery: (item: QueryHistoryItem) => void;
  onClearHistory: () => void;
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) {
    return 'Just now';
  }
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

export function JSONPathHistoryPanel({
  history,
  onLoadQuery,
  onClearHistory,
}: JSONPathHistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="history-panel">
        <h3 className="history-title">
          <i className="fas fa-history"></i>
          Query History
        </h3>
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>No queries yet</p>
          <span>Your recent queries will appear here</span>
        </div>
        
        <style jsx>{`
          .history-panel {
            padding: 1rem;
          }

          .history-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary, #aaa);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .empty-state {
            text-align: center;
            padding: 2rem 1rem;
            color: var(--text-muted, #888);
          }

          .empty-state i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            opacity: 0.5;
          }

          .empty-state p {
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }

          .empty-state span {
            font-size: 0.75rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3 className="history-title">
          <i className="fas fa-history"></i>
          Query History
        </h3>
        <button className="clear-btn" onClick={onClearHistory} title="Clear history">
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <button
            key={item.id}
            className="history-item"
            onClick={() => onLoadQuery(item)}
          >
            <code className="query-text">{item.query}</code>
            <div className="item-meta">
              <span className="match-count">
                <i className="fas fa-check-circle"></i>
                {item.matchCount} match{item.matchCount !== 1 ? 'es' : ''}
              </span>
              <span className="timestamp">{formatTimestamp(item.timestamp)}</span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .history-panel {
          padding: 1rem;
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .history-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .clear-btn {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: var(--text-muted, #888);
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: var(--error, #ef4444);
          color: white;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }

        .history-item:hover {
          background: var(--bg-secondary, #2a2a2a);
          border-color: var(--primary, #3b82f6);
        }

        .query-text {
          font-family: 'Fira Code', 'Monaco', monospace;
          font-size: 0.8rem;
          color: var(--text-primary, #fff);
          word-break: break-all;
          line-height: 1.4;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.7rem;
          color: var(--text-muted, #888);
        }

        .match-count {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--success, #10b981);
        }

        .timestamp {
          color: var(--text-muted, #888);
        }
      `}</style>
    </div>
  );
}
