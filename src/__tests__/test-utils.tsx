import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock file for testing file uploads
 */
export function createMockFile(
  name: string,
  size: number,
  type: string,
  content?: string
): File {
  const blob = new Blob([content || 'mock content'], { type });
  const file = new File([blob], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

/**
 * Mock JSON file
 */
export function createMockJSONFile(
  name: string = 'test.json',
  data: unknown = { test: 'data' }
): File {
  const content = JSON.stringify(data, null, 2);
  return createMockFile(name, content.length, 'application/json', content);
}

/**
 * Mock large text for performance testing
 */
export function generateLargeText(sizeInKB: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789\n';
  const charsPerIteration = 1024; // 1KB
  let text = '';
  
  for (let i = 0; i < sizeInKB; i++) {
    for (let j = 0; j < charsPerIteration; j++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return text;
}

/**
 * Mock large JSON for testing
 */
export function generateLargeJSON(arraySize: number): string {
  const items = Array.from({ length: arraySize }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`,
    tags: ['tag1', 'tag2', 'tag3'],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
  }));
  
  return JSON.stringify({ items }, null, 2);
}

/**
 * Measure render time
 */
export async function measureRenderTime(
  renderFn: () => void
): Promise<number> {
  const start = performance.now();
  renderFn();
  await waitFor(0); // Wait for next tick
  const end = performance.now();
  return end - start;
}

/**
 * Mock window.location
 */
export function mockLocation(url: string) {
  delete (window as any).location;
  window.location = new URL(url) as any;
}

/**
 * Mock navigator.clipboard
 */
export function mockClipboard() {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
      readText: jest.fn().mockResolvedValue(''),
    },
  });
}

/**
 * Mock fetch with custom response
 */
export function mockFetch(
  response: any,
  options?: { ok?: boolean; status?: number }
) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    text: () => Promise.resolve(typeof response === 'string' ? response : JSON.stringify(response)),
    json: () => Promise.resolve(response),
  });
}

/**
 * Mock localStorage
 */
export function createMockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
}

/**
 * Fire keyboard event
 */
export function fireKeyboardEvent(
  element: Element,
  key: string,
  options?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  }
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    ...options,
  });
  element.dispatchEvent(event);
}

/**
 * Wait for condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Condition timeout');
    }
    await waitFor(interval);
  }
}

/**
 * Mock Monaco Editor
 */
export const mockMonacoEditor = {
  create: jest.fn(() => ({
    getValue: jest.fn(() => ''),
    setValue: jest.fn(),
    dispose: jest.fn(),
    onDidChangeModelContent: jest.fn(),
    getModel: jest.fn(() => ({
      getValue: jest.fn(() => ''),
      setValue: jest.fn(),
    })),
    updateOptions: jest.fn(),
  })),
  editor: {
    setTheme: jest.fn(),
    setModelMarkers: jest.fn(),
  },
  MarkerSeverity: {
    Error: 8,
    Warning: 4,
    Info: 2,
    Hint: 1,
  },
  languages: {
    json: {
      jsonDefaults: {
        setDiagnosticsOptions: jest.fn(),
      },
    },
    register: jest.fn(),
    setMonarchTokensProvider: jest.fn(),
    getLanguages: jest.fn(() => []),
  },
};

/**
 * Performance profiler
 */
export class PerformanceProfiler {
  private marks: Map<string, number> = new Map();
  
  mark(name: string) {
    this.marks.set(name, performance.now());
  }
  
  measure(startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (start === undefined) {
      throw new Error(`Mark "${startMark}" not found`);
    }
    
    return (end || performance.now()) - start;
  }
  
  clear() {
    this.marks.clear();
  }
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
