import { renderHook, act } from '@testing-library/react';
import { useJSONValidation } from '../useJSONValidation';

describe('useJSONValidation', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Basic Validation', () => {
    it('should return valid for empty string', () => {
      const { result } = renderHook(() => useJSONValidation(''));
      
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
      expect(result.current.warnings).toEqual([]);
    });

    it('should return valid for valid JSON', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": "data"}'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it('should return invalid for malformed JSON', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": }'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors.length).toBeGreaterThan(0);
    });

    it('should detect unclosed brackets', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": "data"'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors[0].message).toBeTruthy();
    });

    it('should detect trailing commas', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": "data",}'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(false);
    });

    it('should detect unquoted keys', () => {
      const { result } = renderHook(() => useJSONValidation('{test: "data"}'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(false);
    });
  });

  describe('Debouncing', () => {
    it('should debounce validation by default (500ms)', () => {
      const { result, rerender } = renderHook(
        ({ json }) => useJSONValidation(json),
        { initialProps: { json: '{"test": 1}' } }
      );

      // Initial state
      expect(result.current.isValid).toBe(true);

      // Update to invalid JSON
      rerender({ json: '{"test":' });

      // Should not validate immediately
      expect(result.current.isValid).toBe(true);

      // Advance by debounce time
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Now should be invalid
      expect(result.current.isValid).toBe(false);
    });

    it('should use custom debounce time', () => {
      const { result, rerender } = renderHook(
        ({ json }) => useJSONValidation(json, 1000),
        { initialProps: { json: '{"test": 1}' } }
      );

      rerender({ json: '{"test":' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not be validated yet
      expect(result.current.isValid).toBe(true);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Now should be validated
      expect(result.current.isValid).toBe(false);
    });

    it('should cancel previous debounce on rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ json }) => useJSONValidation(json),
        { initialProps: { json: '{"a": 1}' } }
      );

      // Rapid changes
      rerender({ json: '{"a": 1' });
      act(() => {
        jest.advanceTimersByTime(200);
      });

      rerender({ json: '{"a": 1,' });
      act(() => {
        jest.advanceTimersByTime(200);
      });

      rerender({ json: '{"a": 1, "b": 2}' });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should only validate the final value
      expect(result.current.isValid).toBe(true);
    });
  });

  describe('Error Position Detection', () => {
    it('should detect error line and column', () => {
      const { result } = renderHook(() => 
        useJSONValidation('{\n  "test": "data"\n  "error": "here"\n}')
      );
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.errors[0]).toHaveProperty('line');
      expect(result.current.errors[0]).toHaveProperty('column');
    });

    it('should calculate position from character offset', () => {
      const { result } = renderHook(() => 
        useJSONValidation('{"test": }')
      );
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      const error = result.current.errors[0];
      expect(error.line).toBeGreaterThan(0);
      expect(error.column).toBeGreaterThan(0);
    });

    it('should handle multiline JSON errors', () => {
      const json = `{
  "first": "value",
  "second": "value"
  "third": "error here"
}`;
      
      const { result } = renderHook(() => useJSONValidation(json));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.errors[0].line).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Error Messages', () => {
    it('should provide helpful error messages', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": }'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.errors[0].message).toBeTruthy();
      expect(result.current.errors[0].severity).toBe('error');
    });

    it('should enhance error message for unexpected token', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": ]'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      const message = result.current.errors[0].message;
      expect(message).toContain('Unexpected token');
    });

    it('should provide specific message for unexpected end', () => {
      const { result } = renderHook(() => useJSONValidation('{"test": "data"'));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      const message = result.current.errors[0].message;
      expect(message).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle large JSON efficiently', () => {
      const largeJSON = JSON.stringify({
        data: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: `item-${i}` }))
      });
      
      const start = performance.now();
      const { result } = renderHook(() => useJSONValidation(largeJSON));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      const end = performance.now();
      
      expect(result.current.isValid).toBe(true);
      // Be lenient in CI/slow machines
      expect(end - start).toBeLessThan(1000);
    });

    it('should cleanup debounce timer on unmount', () => {
      const { unmount } = renderHook(() => useJSONValidation('{"test": 1}'));
      
      unmount();
      
      // Should not cause errors when advancing timers
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null input', () => {
      const { result } = renderHook(() => useJSONValidation(null as any));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
    });

    it('should handle undefined input', () => {
      const { result } = renderHook(() => useJSONValidation(undefined as any));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
    });

    it('should handle whitespace-only input', () => {
      const { result } = renderHook(() => useJSONValidation('   \n   \t   '));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it('should handle special characters', () => {
      const { result } = renderHook(() => 
        useJSONValidation('{"emoji": "👋", "unicode": "你好"}')
      );
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
    });

    it('should handle deeply nested JSON', () => {
      const nested = { a: { b: { c: { d: { e: { f: { g: 'deep' } } } } } } };
      const { result } = renderHook(() => useJSONValidation(JSON.stringify(nested)));
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current.isValid).toBe(true);
    });
  });
});
