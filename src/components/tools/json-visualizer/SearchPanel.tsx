'use client';

import React, { useCallback } from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';

export function SearchPanel() {
  const {
    searchOptions,
    searchResults,
    currentSearchIndex,
    setSearchQuery,
    updateSearchOptions,
    nextSearchResult,
    prevSearchResult,
    clearSearch,
  } = useJsonVisualizerStore();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          prevSearchResult();
        } else {
          nextSearchResult();
        }
      }
      if (e.key === 'Escape') {
        clearSearch();
      }
    },
    [nextSearchResult, prevSearchResult, clearSearch]
  );

  return (
    <div className="search-panel">
      {/* Search Input */}
      <div className="search-input-container">
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchOptions.query}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {searchOptions.query && (
          <button className="clear-btn" onClick={clearSearch}>
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Search Results Counter */}
      {searchOptions.query && (
        <div className="search-results-info">
          {searchResults.length > 0 ? (
            <>
              <span className="results-count">
                {currentSearchIndex + 1} of {searchResults.length}
              </span>
              <div className="nav-buttons">
                <button
                  className="nav-btn"
                  onClick={prevSearchResult}
                  disabled={searchResults.length === 0}
                  title="Previous (Shift+Enter)"
                >
                  <i className="fas fa-chevron-up" />
                </button>
                <button
                  className="nav-btn"
                  onClick={nextSearchResult}
                  disabled={searchResults.length === 0}
                  title="Next (Enter)"
                >
                  <i className="fas fa-chevron-down" />
                </button>
              </div>
            </>
          ) : (
            <span className="no-results">No results found</span>
          )}
        </div>
      )}

      {/* Search Options */}
      <div className="search-options">
        <label className="option-item">
          <input
            type="checkbox"
            checked={searchOptions.searchKeys}
            onChange={(e) => updateSearchOptions({ searchKeys: e.target.checked })}
          />
          <span>Keys</span>
        </label>
        <label className="option-item">
          <input
            type="checkbox"
            checked={searchOptions.searchValues}
            onChange={(e) => updateSearchOptions({ searchValues: e.target.checked })}
          />
          <span>Values</span>
        </label>
        <label className="option-item">
          <input
            type="checkbox"
            checked={searchOptions.matchCase}
            onChange={(e) => updateSearchOptions({ matchCase: e.target.checked })}
          />
          <span>Match Case</span>
        </label>
      </div>

      {/* Results List */}
      {searchOptions.query && searchResults.length > 0 && (
        <div className="results-list">
          {searchResults.slice(0, 10).map((result, index) => (
            <button
              key={`${result.nodeId}-${index}`}
              className={`result-item ${index === currentSearchIndex ? 'active' : ''}`}
              onClick={() => {
                // Navigate to this result
                const store = useJsonVisualizerStore.getState();
                store.selectNodeById(result.nodeId);
              }}
            >
              <span className={`match-type ${result.matchType}`}>
                {result.matchType}
              </span>
              <span className="result-path">{result.path}</span>
            </button>
          ))}
          {searchResults.length > 10 && (
            <div className="more-results">
              + {searchResults.length - 10} more results
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          border-bottom: 1px solid var(--border);
        }

        .search-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          transition: border-color 0.2s;
        }

        .search-input-container:focus-within {
          border-color: var(--primary);
        }

        .search-icon {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text);
          font-size: 12px;
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-secondary);
        }

        .clear-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 2px;
          font-size: 10px;
        }

        .clear-btn:hover {
          color: var(--text);
        }

        .search-results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-count {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .no-results {
          font-size: 11px;
          color: var(--danger);
        }

        .nav-buttons {
          display: flex;
          gap: 4px;
        }

        .nav-btn {
          background: var(--elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
        }

        .nav-btn:hover:not(:disabled) {
          background: var(--hover);
          color: var(--text);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .search-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .option-item input {
          accent-color: var(--primary);
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 200px;
          overflow-y: auto;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: var(--elevated);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          color: var(--text);
        }

        .result-item:hover {
          background: var(--hover);
        }

        .result-item.active {
          background: var(--primary);
          color: white;
        }

        .match-type {
          font-size: 9px;
          padding: 2px 5px;
          border-radius: 3px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .match-type.key {
          background: rgba(79, 70, 229, 0.2);
          color: #4F46E5;
        }

        .match-type.value {
          background: rgba(217, 119, 6, 0.2);
          color: #D97706;
        }

        .result-item.active .match-type {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .result-path {
          font-size: 11px;
          font-family: 'Fira Code', monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .more-results {
          font-size: 11px;
          color: var(--text-secondary);
          text-align: center;
          padding: 6px;
        }
      `}</style>
    </div>
  );
}
