'use client';

import { useMemo } from 'react';
import { formatFileSize } from '@/lib/fileUtils';
import type { EditorStats, ValidationState } from '@/types';

interface StatsBarProps {
  text: string;
  className?: string;
  validationState?: ValidationState;
}

/**
 * Display character count, word count, line count, size, and validation status
 */
export function StatsBar({ text, className = '', validationState }: StatsBarProps) {
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
      {/* Validation indicators - shown first for visibility */}
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
