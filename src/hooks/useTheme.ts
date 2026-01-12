'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '@/types';

/**
 * Theme management hook
 * Handles theme switching and persistence
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('dfp_theme', 'dark');
  const [mounted, setMounted] = useState(false);

  // Use layout effect to avoid hydration mismatch
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update theme-color meta tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          theme === 'dark' ? '#1e1e1e' : '#f8fafc'
        );
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme, mounted };
}
