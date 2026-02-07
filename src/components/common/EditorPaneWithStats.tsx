'use client';

import React, { ReactNode } from 'react';
import { StatsBar } from '@/components/common/StatsBar';
import type { ValidationState } from '@/types';

interface EditorPaneWithStatsProps {
  children: ReactNode;
  statsText?: string;
  validationState?: ValidationState;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable editor pane wrapper that includes stats bar at bottom
 * Ensures consistent stats bar placement across all tool pages
 */
export function EditorPaneWithStats({
  children,
  statsText = '',
  validationState,
  className = '',
  style,
}: EditorPaneWithStatsProps) {
  return (
    <div className={`ide-pane ${className}`} style={style}>
      {children}
      {statsText && (
        <StatsBar
          text={statsText}
          validationState={validationState}
        />
      )}
    </div>
  );
}
