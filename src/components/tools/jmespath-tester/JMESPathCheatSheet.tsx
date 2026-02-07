'use client';

import React, { useState } from 'react';
import { JMESPATH_SYNTAX, JMESPATH_FUNCTIONS } from '@/lib/jmespath/types';

interface JMESPathCheatSheetProps {
  onInsertQuery?: (query: string) => void;
}

export function JMESPathCheatSheet({ onInsertQuery }: JMESPathCheatSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'syntax' | 'functions'>('syntax');

  return (
    <div className="cheatsheet-panel">
      <button
        className="cheatsheet-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="cheatsheet-title">
          <i className="fas fa-book"></i>
          Syntax Reference
        </h3>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
      </button>

      {isExpanded && (
        <div className="cheatsheet-content">
          <div className="cheatsheet-tabs">
            <button
              className={`tab-btn ${activeTab === 'syntax' ? 'active' : ''}`}
              onClick={() => setActiveTab('syntax')}
            >
              Syntax
            </button>
            <button
              className={`tab-btn ${activeTab === 'functions' ? 'active' : ''}`}
              onClick={() => setActiveTab('functions')}
            >
              Functions
            </button>
          </div>

          {activeTab === 'syntax' && (
            <table className="syntax-table">
              <thead>
                <tr>
                  <th>Syntax</th>
                  <th>Name</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                {JMESPATH_SYNTAX.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <code className="syntax-code">{item.syntax}</code>
                    </td>
                    <td className="name-cell">
                      <span className="syntax-name">{item.name}</span>
                      <span className="syntax-desc">{item.description}</span>
                    </td>
                    <td>
                      {onInsertQuery ? (
                        <button
                          className="example-btn"
                          onClick={() => onInsertQuery(item.example)}
                          title="Click to use this query"
                        >
                          <code>{item.example}</code>
                        </button>
                      ) : (
                        <code className="example-code">{item.example}</code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'functions' && (
            <table className="syntax-table">
              <thead>
                <tr>
                  <th>Function</th>
                  <th>Description</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                {JMESPATH_FUNCTIONS.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <code className="syntax-code">{item.syntax}</code>
                    </td>
                    <td className="name-cell">
                      <span className="syntax-desc">{item.description}</span>
                    </td>
                    <td>
                      {onInsertQuery ? (
                        <button
                          className="example-btn"
                          onClick={() => onInsertQuery(item.example)}
                          title="Click to use this query"
                        >
                          <code>{item.example}</code>
                        </button>
                      ) : (
                        <code className="example-code">{item.example}</code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style jsx>{`
        .cheatsheet-panel {
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          overflow: hidden;
        }

        .cheatsheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--text-primary, #fff);
        }

        .cheatsheet-header:hover {
          background: var(--bg-secondary, #2a2a2a);
        }

        .cheatsheet-title {
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

        .cheatsheet-content {
          border-top: 1px solid var(--border-color, #333);
        }

        .cheatsheet-tabs {
          display: flex;
          padding: 0.5rem;
          gap: 0.5rem;
          background: var(--bg-secondary, #2a2a2a);
        }

        .tab-btn {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 4px;
          background: var(--bg-tertiary, #252525);
          color: var(--text-primary, #fff);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: var(--bg-primary, #1e1e1e);
        }

        .tab-btn.active {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
        }

        .syntax-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          max-height: 250px;
          overflow-y: auto;
          display: block;
        }

        .syntax-table thead,
        .syntax-table tbody,
        .syntax-table tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }

        .syntax-table th {
          text-align: left;
          padding: 0.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted, #888);
          border-bottom: 1px solid var(--border-color, #333);
        }

        .syntax-table td {
          padding: 0.5rem;
          border-bottom: 1px solid var(--border-color, #222);
          vertical-align: top;
        }

        .syntax-table tr:last-child td {
          border-bottom: none;
        }

        .syntax-code {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--primary, #3b82f6);
          background: var(--bg-secondary, #2a2a2a);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }

        .name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .syntax-name {
          font-weight: 500;
          color: var(--text-primary, #fff);
        }

        .syntax-desc {
          font-size: 0.7rem;
          color: var(--text-muted, #888);
        }

        .example-btn {
          border: none;
          background: var(--bg-secondary, #2a2a2a);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .example-btn:hover {
          background: var(--primary, #3b82f6);
        }

        .example-btn code {
          font-family: 'Fira Code', monospace;
          font-size: 0.7rem;
          color: var(--success, #10b981);
        }

        .example-btn:hover code {
          color: white;
        }

        .example-code {
          font-family: 'Fira Code', monospace;
          font-size: 0.7rem;
          color: var(--success, #10b981);
        }
      `}</style>
    </div>
  );
}
