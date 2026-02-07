'use client';

import React from 'react';

interface FlowSearchPanelProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  matchCount: number;
}

export function FlowSearchPanel({
  searchText,
  onSearchChange,
  matchCount,
}: FlowSearchPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3 className="settings-title">
          <i className="fas fa-search"></i>
          Search
        </h3>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="setting-input search-input"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search keys, values, paths..."
            />
            {searchText && (
              <button
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {searchText && (
            <div className="search-results">
              <span className="search-count">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'} found
              </span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-input-wrapper {
          position: relative;
        }

        .search-input {
          padding-right: 2rem !important;
        }

        .search-clear-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
        }

        .search-clear-btn:hover {
          color: var(--text-primary);
        }

        .search-results {
          margin-top: 0.5rem;
        }

        .search-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
