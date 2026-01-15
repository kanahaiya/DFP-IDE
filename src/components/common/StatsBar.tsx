'use client';

import { useMemo } from 'react';
import { formatFileSize } from '@/lib/fileUtils';
import type { EditorStats, ValidationState } from '@/types';

interface DiffStats {
  total: number;
  added: number;
  removed: number;
  modified: number;
  typeChanged: number;
  moved: number;
}

interface StatsBarProps {
  text: string;
  className?: string;
  validationState?: ValidationState;
  diffStats?: DiffStats | null;
}

/**
 * Display character count, word count, line count, size, validation status, and optional diff stats
 */
export function StatsBar({ text, className = '', validationState, diffStats }: StatsBarProps) {
  const stats: EditorStats = useMemo(() => {
    const charCount = text.length;
    const lines = text.split('\n');
    const lineCount = lines.length;
    const wordCount = text.trim()
      ? text.trim().split(/\s+/).filter(Boolean).length
      : 0;
    const size = formatFileSize(new TextEncoder().encode(text).length);

    return {
      charCount,
      wordCount,
      lineCount,
      size,
    };
  }, [text]);

  return (
    <div className={`stats-bar ${className}`}>
      {/* Validation indicators - shown first */}
      {validationState && text.trim() && (
        <>
          {validationState.errorCount > 0 && (
            <div className="stat stat-error">
              <i className="fas fa-times-circle"></i>
              <span>{validationState.errorCount} Error{validationState.errorCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {validationState.warningCount > 0 && (
            <div className="stat stat-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{validationState.warningCount} Warning{validationState.warningCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {validationState.isValid && (
            <div className="stat stat-valid">
              <i className="fas fa-check-circle"></i>
              <span>JSON Valid</span>
            </div>
          )}
        </>
      )}

      {/* Diff stats - shown after validation status */}
      {diffStats && (
        <>
          <div className="stat-separator"></div>
          <div className="stat stat-diff-total">
            <span>Changes:</span>
            <span>{diffStats.total}</span>
          </div>
          <div className="stat stat-diff-added">
            <span>Added:</span>
            <span>{diffStats.added}</span>
          </div>
          <div className="stat stat-diff-removed">
            <span>Removed:</span>
            <span>{diffStats.removed}</span>
          </div>
          <div className="stat stat-diff-modified">
            <span>Modified:</span>
            <span>{diffStats.modified}</span>
          </div>
          <div className="stat stat-diff-type-changed">
            <span>Type Changed:</span>
            <span>{diffStats.typeChanged}</span>
          </div>
          <div className="stat stat-diff-moved">
            <span>Moved:</span>
            <span>{diffStats.moved}</span>
          </div>
        </>
      )}
      
      {/* Standard stats */}
      <div className="stat">
        <span>Characters:</span>
        <span id="charCount">{stats.charCount.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span>Words:</span>
        <span id="wordCount">{stats.wordCount.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span>Lines:</span>
        <span id="lineCount">{stats.lineCount.toLocaleString()}</span>
      </div>
      <div className="stat">
        <span>Size:</span>
        <span id="sizeInfo">{stats.size}</span>
      </div>
    </div>
  );
}
