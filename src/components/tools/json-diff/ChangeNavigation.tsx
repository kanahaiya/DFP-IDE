'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Change } from '@/lib/json-diff/diffEngine';

interface ChangeNavigationProps {
  currentIndex: number;
  totalChanges: number;
  changes: Change[];
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onJumpTo: (index: number) => void;
  onFilterChange?: (filters: string[]) => void;
  selectedFilters?: string[];
}

export function ChangeNavigation({
  currentIndex,
  totalChanges,
  changes,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  onJumpTo,
  onFilterChange,
  selectedFilters = ['all'],
}: ChangeNavigationProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [jsonPathInput, setJsonPathInput] = useState('');
  const [jsonPathError, setJsonPathError] = useState<string | null>(null);
  const [isEditingPath, setIsEditingPath] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilter]);

  // Update jump input with current change path when not editing
  useEffect(() => {
    const currentChange = changes[currentIndex];
    if (!isEditingPath && currentChange && currentChange.jsonPath) {
      setJsonPathInput(currentChange.jsonPath);
      setJsonPathError(null);
    }
  }, [currentIndex, changes, isEditingPath]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't handle shortcuts when focused in Monaco editor
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) {
        return;
      }

      // Close filter on Escape
      if (e.key === 'Escape') {
        setShowFilter(false);
        return;
      }

      // Next change
      if (e.key === ']' || (e.shiftKey && e.key === 'J')) {
        e.preventDefault();
        if (hasNext) onNext();
      }

      // Previous change
      if (e.key === '[' || (e.shiftKey && e.key === 'K')) {
        e.preventDefault();
        if (hasPrevious) onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrevious, onNext, onPrevious]);

  const handleJumpTo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    if (!isNaN(index) && index >= 0 && index < totalChanges) {
      onJumpTo(index);
    }
  };

  const handleJSONPathJump = useCallback(() => {
    if (!jsonPathInput.trim()) return;

    // Find the change that matches this path
    const matchingIndex = changes.findIndex(c => c.jsonPath === jsonPathInput);
    if (matchingIndex !== -1) {
      onJumpTo(matchingIndex);
      setJsonPathError(null);
      setIsEditingPath(false);
    } else {
      setJsonPathError('No change found at this path');
    }
  }, [jsonPathInput, changes, onJumpTo]);

  const handleJSONPathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJSONPathJump();
    } else if (e.key === 'Escape') {
      // Reset to current change path
      const currentChange = changes[currentIndex];
      if (currentChange && currentChange.jsonPath) {
        setJsonPathInput(currentChange.jsonPath);
      } else {
        setJsonPathInput('');
      }
      setJsonPathError(null);
      setIsEditingPath(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Changes', count: changes.length },
    { value: 'ADDED', label: 'Added', count: changes.filter(c => c.type === 'ADDED').length },
    { value: 'REMOVED', label: 'Removed', count: changes.filter(c => c.type === 'REMOVED').length },
    { value: 'MODIFIED', label: 'Modified', count: changes.filter(c => c.type === 'MODIFIED').length },
    { value: 'TYPE_CHANGED', label: 'Type Changed', count: changes.filter(c => c.type === 'TYPE_CHANGED').length },
    { value: 'MOVED', label: 'Moved', count: changes.filter(c => c.type === 'MOVED').length },
  ];

  const handleFilterToggle = (filterValue: string) => {
    if (!onFilterChange) return;

    let newFilters: string[];

    if (filterValue === 'all') {
      newFilters = selectedFilters.includes('all') ? [] : ['all'];
    } else {
      if (selectedFilters.includes('all')) {
        newFilters = [filterValue];
      } else if (selectedFilters.includes(filterValue)) {
        newFilters = selectedFilters.filter(f => f !== filterValue);
        if (newFilters.length === 0) {
          newFilters = ['all'];
        }
      } else {
        newFilters = [...selectedFilters, filterValue];
      }
    }

    onFilterChange(newFilters);
  };

  const getFilterLabel = () => {
    if (selectedFilters.includes('all') || selectedFilters.length === 0) {
      return 'All Changes';
    }
    if (selectedFilters.length === 1) {
      return filterOptions.find(opt => opt.value === selectedFilters[0])?.label || 'Filter';
    }
    return `${selectedFilters.length} Selected`;
  };

  const hasNoChanges = totalChanges === 0;

  return (
    <nav className="change-navigation">
      <div className="navigation-controls">
        {hasNoChanges ? (
          <span className="navigation-empty">No changes to display</span>
        ) : (
          <>
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="btn btn-sm"
              title="Previous Change ([)"
              aria-label={`Go to previous change. Currently on change ${currentIndex + 1} of ${totalChanges}`}
            >
              <i className="fas fa-chevron-left"></i> Prev
            </button>

            <span className="change-counter">
              Change {totalChanges > 0 ? currentIndex + 1 : 0} of {totalChanges}
            </span>

            {totalChanges > 0 && (
              <select
                value={currentIndex}
                onChange={handleJumpTo}
                className="change-select"
                aria-label="Jump to specific change"
              >
                {changes.map((change, i) => (
                  <option key={i} value={i}>
                    {change.jsonPath} ({change.type})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={onNext}
              disabled={!hasNext}
              className="btn btn-sm"
              title="Next Change (])"
              aria-label={`Go to next change. Currently on change ${currentIndex + 1} of ${totalChanges}`}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* JSONPath Jump Input */}
        {!hasNoChanges && (
          <div className="jsonpath-jump">
            <label htmlFor="jsonpath-input" className="jsonpath-label">
              Jump to:
            </label>
            <input
              id="jsonpath-input"
              type="text"
              value={jsonPathInput}
              onChange={(e) => {
                setJsonPathInput(e.target.value);
                setJsonPathError(null);
                setIsEditingPath(true);
              }}
              onFocus={() => setIsEditingPath(true)}
              onBlur={() => setIsEditingPath(false)}
              onKeyDown={handleJSONPathKeyDown}
              placeholder={changes[currentIndex]?.jsonPath || "$.user.email"}
              className="jsonpath-input"
              aria-label="Enter JSONPath to jump to specific change"
            />
            <button
              onClick={handleJSONPathJump}
              className="btn btn-sm btn-primary"
              aria-label="Jump to JSONPath"
            >
              Go
            </button>
            {jsonPathError && (
              <span className="jsonpath-error" role="alert">
                {jsonPathError}
              </span>
            )}
          </div>
        )}

        {/* Filter Dropdown */}
        {onFilterChange && !hasNoChanges && (
          <div className="filter-dropdown-container" ref={filterRef}>
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="filter-dropdown-button"
              aria-label={`Filter changes. Currently showing: ${getFilterLabel()}`}
              aria-expanded={showFilter}
            >
              <i className="fas fa-filter"></i> Filter: {getFilterLabel()}
              <i className={`fas fa-chevron-${showFilter ? 'up' : 'down'}`}></i>
            </button>
            {showFilter && (
              <div className="filter-dropdown-menu">
                {filterOptions.map(option => (
                  <label
                    key={option.value}
                    className={`filter-option-label ${selectedFilters.includes(option.value) ? 'selected' : ''}`}
                    role="menuitemcheckbox"
                    aria-checked={selectedFilters.includes(option.value)}
                    data-filter={option.value}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option.value)}
                      onChange={() => handleFilterToggle(option.value)}
                      className="filter-option-checkbox"
                      aria-label={`Show ${option.label} changes`}
                    />
                    <span className="filter-option-text">
                      {option.label}
                      {option.count > 0 && (
                        <span className="filter-option-count">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
