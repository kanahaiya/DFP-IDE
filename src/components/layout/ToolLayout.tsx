'use client';

import React, { ReactNode } from 'react';
import { StatsBar } from '@/components/common/StatsBar';
import type { ValidationState } from '@/types';

interface ToolLayoutProps {
  children: ReactNode;
  statsText?: string;
  validationState?: ValidationState;
  className?: string;
}

/**
 * Reusable layout wrapper for all tools with integrated stats bar at bottom
 * Ensures consistent stats bar placement and styling across all tools
 */
export function ToolLayout({
  children,
  statsText = '',
  validationState,
  className = '',
}: ToolLayoutProps) {
  return (
    <div className={`tool-layout ${className}`}>
      <div className="tool-layout-content">
        {children}
      </div>
      {statsText && (
        <StatsBar
          text={statsText}
          validationState={validationState}
          className="tool-layout-stats"
        />
      )}
    </div>
  );
}
