'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { SearchOptions, SearchResult } from '@/lib/json-editor/types';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  searchOptions: SearchOptions;
  searchResults: SearchResult[];
  currentIndex: number;
  onOptionsChange: (options: Partial<SearchOptions>) => void;
  onSearch: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClear: () => void;
}

export function SearchBar({
  isOpen,
  onClose,
  searchOptions,
  searchResults,
  currentIndex,
  onOptionsChange,
  onSearch,
  onNext,
  onPrev,
  onClear,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (e.shiftKey) {
          onPrev();
        } else {
          if (searchResults.length > 0) {
            onNext();
          } else {
            onSearch();
          }
        }
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (e.shiftKey) {
          onPrev();
        } else {
          onNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults.length, onClose, onSearch, onNext, onPrev]);

  if (!isOpen) return null;

  const hasResults = searchResults.length > 0;
  const resultText = hasResults 
    ? `${currentIndex + 1} of ${searchResults.length}`
    : searchOptions.query ? 'No results' : '';

  return (
    <div className="search-bar-container">
      <div className="search-row">
        {/* Search input */}
        <div className="search-input-wrap">
          <i className="fas fa-search search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={searchOptions.query}
            onChange={(e) => {
              onOptionsChange({ query: e.target.value });
              // Auto-search with debounce
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="Search keys and values..."
            className="search-input"
          />
          {searchOptions.query && (
            <div className="search-meta">
              <span className={`result-text ${hasResults ? '' : 'no-results'}`}>
                {resultText}
              </span>
              <button
                onClick={() => {
                  onOptionsChange({ query: '' });
                  onClear();
                }}
                className="icon-btn"
                title="Clear search"
                aria-label="Clear search"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="nav-buttons">
          <button
            onClick={onPrev}
            disabled={!hasResults}
            className="icon-btn"
            title="Previous (Shift+Enter)"
          >
            <i className="fas fa-chevron-up" />
          </button>
          <button
            onClick={onNext}
            disabled={!hasResults}
            className="icon-btn"
            title="Next (Enter)"
          >
            <i className="fas fa-chevron-down" />
          </button>
        </div>

        {/* Options toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`icon-btn ${showOptions ? 'active' : ''}`}
          title="Search options"
        >
          <i className="fas fa-sliders-h" />
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="icon-btn"
          title="Close (Esc)"
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Options panel */}
      {showOptions && (
        <div className="search-options">
          <label className="opt">
            <input
              type="checkbox"
              checked={searchOptions.matchCase}
              onChange={(e) => onOptionsChange({ matchCase: e.target.checked })}
            />
            <span>Match case</span>
          </label>

          <label className="opt">
            <input
              type="checkbox"
              checked={searchOptions.matchWholeWord}
              onChange={(e) => onOptionsChange({ matchWholeWord: e.target.checked })}
            />
            <span>Whole word</span>
          </label>

          <label className="opt">
            <input
              type="checkbox"
              checked={searchOptions.useRegex}
              onChange={(e) => onOptionsChange({ useRegex: e.target.checked })}
            />
            <span>Regex</span>
          </label>

          <div className="divider" />

          <label className="opt">
            <input
              type="checkbox"
              checked={searchOptions.searchKeys}
              onChange={(e) => onOptionsChange({ searchKeys: e.target.checked })}
            />
            <span>Search keys</span>
          </label>

          <label className="opt">
            <input
              type="checkbox"
              checked={searchOptions.searchValues}
              onChange={(e) => onOptionsChange({ searchValues: e.target.checked })}
            />
            <span>Search values</span>
          </label>
        </div>
      )}

      <style jsx>{`
        .search-bar-container {
          padding: 0.5rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-input-wrap {
          position: relative;
          flex: 1;
          min-width: 180px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          font-size: 0.875rem;
          pointer-events: none;
          opacity: 0.9;
        }

        .search-input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.45rem 4.75rem 0.45rem 2.1rem;
          font-size: 0.875rem;
          color: var(--text);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.15);
        }

        .search-meta {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .result-text.no-results {
          color: var(--warning);
        }

        .nav-buttons {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .icon-btn:hover:not(:disabled) {
          background: var(--hover);
          color: var(--text);
        }

        .icon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .icon-btn.active {
          background: rgba(88, 166, 255, 0.15);
          color: var(--primary);
        }

        .search-options {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1rem;
          align-items: center;
          font-size: 0.875rem;
          color: var(--text);
        }

        .opt {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
        }

        .opt input {
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
        }

        .divider {
          width: 1px;
          height: 16px;
          background: var(--border);
        }
      `}</style>
    </div>
  );
}
