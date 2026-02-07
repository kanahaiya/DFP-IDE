'use client';

import React from 'react';

interface ToolIconProps {
  icon: string;
  toolId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Custom SVG icons for tools that don't have good Font Awesome matches
const CUSTOM_ICONS: Record<string, React.ReactNode> = {
  'json-to-haskell': (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      {/* Haskell Lambda Logo */}
      <path d="M0 23.5V0.5L5 8L10 0.5V23.5L5 16L0 23.5Z" transform="translate(2, 0)" />
      <path d="M6 0.5L11 8L16 0.5L11 8L16 15.5L11 23.5L6 16L11 8L6 0.5Z" transform="translate(5, 0)" />
    </svg>
  ),
};

// Alternative simpler Haskell icon (stylized λ)
const HASKELL_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M2 20V4L7 12L12 4V20L7 12L2 20Z" />
    <path d="M10 4L15 12L20 4L15 12L20 20L15 12L10 20L15 12L10 4Z" />
  </svg>
);

export function ToolIcon({ icon, toolId, className = '', style }: ToolIconProps) {
  // Check if we have a custom SVG icon for this tool
  if (toolId && toolId === 'json-to-haskell') {
    return (
      <span 
        className={`tool-icon-svg ${className}`} 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '1em',
          height: '1em',
          ...style 
        }}
      >
        {HASKELL_ICON}
      </span>
    );
  }

  // Check for other custom icons by toolId
  if (toolId && CUSTOM_ICONS[toolId]) {
    return (
      <span 
        className={`tool-icon-svg ${className}`} 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '1em',
          height: '1em',
          ...style 
        }}
      >
        {CUSTOM_ICONS[toolId]}
      </span>
    );
  }

  // Fall back to Font Awesome icon
  return <i className={`${icon} ${className}`} style={style}></i>;
}
