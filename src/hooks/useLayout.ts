'use client';

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { LayoutMode } from '@/types';

/**
 * Layout management hook
 * Handles split-pane layout switching (horizontal/vertical)
 */
export function useLayout() {
  const [layout, setLayout] = useLocalStorage<LayoutMode>('dfp_layout', 'horizontal');

  useEffect(() => {
    // Mobile-first: default to vertical on small screens
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile && !localStorage.getItem('dfp_layout')) {
        setLayout('vertical');
      }
    }
  }, [setLayout]);

  const toggleLayout = () => {
    const newLayout = layout === 'horizontal' ? 'vertical' : 'horizontal';
    setLayout(newLayout);
    
    // Trigger resize event for Monaco Editor after CSS transition completes
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350); // Wait for 300ms transition + 50ms buffer
  };

  return { layout, setLayout, toggleLayout };
}
