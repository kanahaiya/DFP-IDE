/**
 * Zustand store for JSON Diff tool state management
 */

import { create } from 'zustand';

export type ViewMode = 'split' | 'unified' | 'tree' | 'report';
export type ArrayStrategy = 'index' | 'identifier' | 'lcs';

export interface JSONDiffSettings {
  // Comparison options
  /**
   * @deprecated Use ignoreCaseKeys / ignoreCaseValues instead.
   * Kept for backward compatibility with any persisted UI state.
   */
  ignoreCase: boolean;
  /** Ignore casing differences in object keys (e.g. apiKey vs APIKey) */
  ignoreCaseKeys: boolean;
  /** Ignore casing differences in string values (e.g. "ABC" vs "abc") */
  ignoreCaseValues: boolean;
  ignoreWhitespace: boolean;
  ignoreArrayOrder: boolean;
  ignoreProperties: string[];
  arrayStrategy: ArrayStrategy;
  identifierFields: string[];
  structureOnly: boolean; // Compare only keys/types, not values
  
  // Display options
  viewMode: ViewMode;
  showLineNumbers: boolean;
  highlightSyntax: boolean;
  showGlyphMargin: boolean;
  highlightCurrentLine: boolean;
  wordWrap: boolean;
  showMinimap: boolean;
  showStatusBar: boolean;
  indentSize: number;
  
  // Filtering & Patterns
  subTreePath: string; // Focus comparison on specific JSONPath
  includePatterns: string[]; // JSONPath patterns to include
  excludePatterns: string[]; // JSONPath patterns to exclude
  ignorePatterns: string[]; // JSONPath patterns to ignore
  
  // Advanced options
  deepCompare: boolean;
  strictTypeChecking: boolean;
  treatNullAsMissing: boolean;
  ignoreKeyOrder: boolean;
  floatTolerance: number;
  maxDepth: number;
}

export interface JSONDiffState {
  // Settings
  settings: JSONDiffSettings;
  
  // Navigation
  currentChangeIndex: number;
  changeFilter: string[];
  
  // Actions
  updateSettings: (settings: Partial<JSONDiffSettings>) => void;
  setCurrentChangeIndex: (index: number) => void;
  setChangeFilter: (filter: string[]) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: JSONDiffSettings = {
  // Comparison options
  ignoreCase: false,
  ignoreCaseKeys: false,
  ignoreCaseValues: false,
  ignoreWhitespace: false,
  ignoreArrayOrder: false,
  ignoreProperties: [],
  arrayStrategy: 'identifier',
  identifierFields: ['id', 'uuid', 'key', '_id'],
  structureOnly: false,
  
  // Display options
  viewMode: 'split',
  showLineNumbers: true,
  highlightSyntax: true,
  showGlyphMargin: true,
  highlightCurrentLine: true,
  wordWrap: false,
  showMinimap: false,
  showStatusBar: true,
  indentSize: 2,
  
  // Filtering & Patterns
  subTreePath: '',
  includePatterns: [],
  excludePatterns: [],
  ignorePatterns: [],
  
  // Advanced options
  deepCompare: true,
  strictTypeChecking: true,
  treatNullAsMissing: false,
  ignoreKeyOrder: false,
  floatTolerance: 0.0001,
  maxDepth: Infinity,
};

export const useJSONDiffStore = create<JSONDiffState>((set) => ({
  settings: defaultSettings,
  currentChangeIndex: -1,
  changeFilter: ['all'],
  
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  
  setCurrentChangeIndex: (index) =>
    set({ currentChangeIndex: index }),
  
  setChangeFilter: (filter) =>
    set({ changeFilter: filter }),
  
  resetSettings: () =>
    set({
      settings: defaultSettings,
      currentChangeIndex: -1,
      changeFilter: ['all'],
    }),
}));
