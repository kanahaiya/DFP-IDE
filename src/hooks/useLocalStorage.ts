import { useState, useEffect } from 'react';

/**
 * Type-safe localStorage hook
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value - always initialize with the default value to avoid hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Listen for storage changes (from other components or tabs)
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      // Handle both native storage events and custom events
      if (e instanceof StorageEvent) {
        // Native storage event (from other tabs)
        if (e.key !== key) return;
      } else if (e instanceof CustomEvent) {
        // Custom event (from same tab/component)
        if (e.detail?.key !== key) return;
      }
      
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    };

    // Listen for custom storage events (same tab/component updates)
    window.addEventListener('local-storage', handleStorageChange);
    // Listen for native storage events (other tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
