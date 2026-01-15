'use client';

import React, { useEffect } from 'react';
import { Change } from '@/lib/json-diff/diffEngine';
import { getDecorationsForChanges } from '@/lib/json-diff/diffHighlighter';

interface SplitDiffViewProps {
  leftJSON: string;
  rightJSON: string;
  changes: Change[];
  currentChangeIndex: number;
}

export function SplitDiffView({
  leftJSON,
  rightJSON,
  changes,
  currentChangeIndex,
}: SplitDiffViewProps) {
  
  // Apply decorations when changes update
  useEffect(() => {
    if (!leftJSON || !rightJSON || changes.length === 0) return;
    
    try {
      // Format JSON for display
      const formattedLeft = JSON.stringify(JSON.parse(leftJSON), null, 2);
      const formattedRight = JSON.stringify(JSON.parse(rightJSON), null, 2);
      
      // Get decorations
      const leftDecorations = getDecorationsForChanges(formattedLeft, changes, 'left');
      const rightDecorations = getDecorationsForChanges(formattedRight, changes, 'right');
      
      // Apply decorations to editors (if Monaco instance is available)
      // Note: This is a simplified version. Full implementation would need
      // access to Monaco editor instances to apply decorations
      console.log('Decorations ready:', { leftDecorations, rightDecorations });
    } catch (error) {
      console.error('Failed to apply decorations:', error);
    }
  }, [leftJSON, rightJSON, changes]);
  
  // Scroll to current change
  useEffect(() => {
    if (currentChangeIndex >= 0 && currentChangeIndex < changes.length) {
      const change = changes[currentChangeIndex];
      // TODO: Implement scroll to change logic
      console.log('Jump to change:', change);
    }
  }, [currentChangeIndex, changes]);
  
  return (
    <div className="split-diff-view">
      <div className="diff-editor left-editor">
        <div className="editor-header">
          <span className="editor-title">Left (Original)</span>
        </div>
        <div className="editor-content">
          <pre className="json-display">{leftJSON ? JSON.stringify(JSON.parse(leftJSON), null, 2) : ''}</pre>
        </div>
      </div>
      
      <div className="diff-editor right-editor">
        <div className="editor-header">
          <span className="editor-title">Right (Modified)</span>
        </div>
        <div className="editor-content">
          <pre className="json-display">{rightJSON ? JSON.stringify(JSON.parse(rightJSON), null, 2) : ''}</pre>
        </div>
      </div>
    </div>
  );
}
