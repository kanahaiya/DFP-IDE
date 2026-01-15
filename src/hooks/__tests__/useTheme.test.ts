import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    
    // Mock document.documentElement
    document.documentElement.setAttribute = jest.fn();
    
    // Mock theme-color meta tag
    const metaTag = document.createElement('meta');
    metaTag.name = 'theme-color';
    document.querySelector = jest.fn().mockReturnValue(metaTag);
    metaTag.setAttribute = jest.fn();
  });

  describe('Initialization', () => {
    it('should initialize with dark theme by default', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('dark');
    });

    it('should set mounted state', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
    });

    it('should apply theme attribute to document', async () => {
      renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
          'data-theme',
          'dark'
        );
      });
    });

    it('should update theme-color meta tag', async () => {
      renderHook(() => useTheme());
      
      const metaTag = document.querySelector('meta[name="theme-color"]');
      
      await waitFor(() => {
        expect(metaTag?.setAttribute).toHaveBeenCalledWith('content', '#1e1e1e');
      });
    });
  });

  describe('Theme Switching', () => {
    it('should toggle theme from dark to light', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.toggleTheme();
      });
      
      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
    });

    it('should toggle theme from light to dark', async () => {
      window.localStorage.setItem('dfp_theme', JSON.stringify('light'));
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.toggleTheme();
      });
      
      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
      });
    });

    it('should set specific theme', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
    });

    it('should update document attribute on theme change', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
          'data-theme',
          'light'
        );
      });
    });

    it('should update meta theme-color on theme change', async () => {
      const { result } = renderHook(() => useTheme());
      const metaTag = document.querySelector('meta[name="theme-color"]');
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      await waitFor(() => {
        expect(metaTag?.setAttribute).toHaveBeenCalledWith('content', '#f8fafc');
      });
    });
  });

  describe('Persistence', () => {
    it('should persist theme to localStorage', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      await waitFor(() => {
        expect(window.localStorage.getItem('dfp_theme')).toBe(JSON.stringify('light'));
      });
    });

    it('should load persisted theme on mount', async () => {
      window.localStorage.setItem('dfp_theme', JSON.stringify('light'));
      
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
    });
  });

  describe('Hydration Safety', () => {
    it('should become mounted after layout effect', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing meta theme-color tag', async () => {
      document.querySelector = jest.fn().mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      // Should not throw error
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(true).toBe(true);
    });

    it('should handle multiple rapid theme changes', async () => {
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
      });
      
      await waitFor(() => {
        expect(result.current.theme).toBe('light');
      });
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useTheme());
      
      // Should not throw error
      unmount();
      
      expect(true).toBe(true);
    });
  });

  describe('Theme Values', () => {
    it('should use correct dark theme color', async () => {
      const { result } = renderHook(() => useTheme());
      const metaTag = document.querySelector('meta[name="theme-color"]');
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      await waitFor(() => {
        expect(metaTag?.setAttribute).toHaveBeenLastCalledWith('content', '#1e1e1e');
      });
    });

    it('should use correct light theme color', async () => {
      const { result } = renderHook(() => useTheme());
      const metaTag = document.querySelector('meta[name="theme-color"]');
      
      await waitFor(() => {
        expect(result.current.mounted).toBe(true);
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      await waitFor(() => {
        expect(metaTag?.setAttribute).toHaveBeenCalledWith('content', '#f8fafc');
      });
    });
  });
});
