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
    // Mobile-first: default to vertical on small screens (only if no preference is saved)
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const savedLayout = localStorage.getItem('dfp_layout');
      if (isMobile && !savedLayout) {
        // Use setTimeout to ensure this runs after the localStorage load effect
        setTimeout(() => {
          setLayout('vertical');
        }, 0);
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
