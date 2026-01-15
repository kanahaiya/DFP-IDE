'use client';

import React from 'react';
import { Change } from '@/lib/json-diff/diffEngine';
import { getColorsByTheme } from '@/lib/json-diff/colors';
import { useTheme } from '@/hooks/useTheme';

interface UnifiedDiffViewProps {
  changes: Change[];
}

export function UnifiedDiffView({ changes }: UnifiedDiffViewProps) {
  const { theme } = useTheme();
  const colors = getColorsByTheme(theme);

  if (!changes || changes.length === 0) {
    return (
      <div className="unified-diff-view">
        <div className="unified-diff-empty">
          No differences found
        </div>
      </div>
    );
  }

  return (
    <div className="unified-diff-view">
      <div className="unified-diff-content">
        {changes.map((change, index) => {
          const linePrefix = 
            change.type === 'ADDED' ? '+' :
            change.type === 'REMOVED' ? '-' :
            change.type === 'MODIFIED' ? '~' :
            change.type === 'MOVED' ? '→' :
            '±';

          const lineColor = 
            change.type === 'ADDED' ? colors.added :
            change.type === 'REMOVED' ? colors.removed :
            change.type === 'MODIFIED' ? colors.modified :
            change.type === 'MOVED' ? colors.moved :
            colors.typeChanged;

          return (
            <div
              key={index}
              className="unified-diff-line"
              style={{
                backgroundColor: lineColor.bg,
                borderLeftColor: lineColor.text,
              }}
            >
              <span className="unified-line-prefix" style={{ color: lineColor.text }}>
                {linePrefix}
              </span>
              <span className="unified-line-path">{change.jsonPath}</span>
              <div className="unified-line-content">
                {change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED' ? (
                  <>
                    <div className="unified-old-value" style={{ color: colors.removed.text }}>
                      - {JSON.stringify(change.oldValue)}
                    </div>
                    <div className="unified-new-value" style={{ color: colors.added.text }}>
                      + {JSON.stringify(change.newValue)}
                    </div>
                  </>
                ) : change.type === 'MOVED' ? (
                  <div className="unified-moved-info">
                    Moved from index {change.oldIndex} to {change.newIndex}
                    {change.value && <div>Value: {JSON.stringify(change.value)}</div>}
                  </div>
                ) : (
                  <div className="unified-single-value">
                    {JSON.stringify(change.value || change.newValue || change.oldValue)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
