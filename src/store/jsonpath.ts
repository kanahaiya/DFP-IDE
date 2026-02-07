/**
 * JSONPath Tester Zustand Store
 * State management for JSONPath query testing tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  JSONPathSettings, 
  JSONPathResult, 
  QueryHistoryItem,
  JSONPathExample,
} from '@/lib/jsonpath/types';
import { DEFAULT_JSONPATH_SETTINGS } from '@/lib/jsonpath/types';
import { executeJSONPath, parseJSON } from '@/lib/jsonpath/executor';
import { JSONPATH_EXAMPLES } from '@/lib/jsonpath/examples';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY_ITEMS = 20;

interface JSONPathState {
  // Input
  jsonInput: string;
  query: string;
  
  // Results
  result: JSONPathResult | null;
  isExecuting: boolean;
  jsonError: string | null;
  
  // History
  queryHistory: QueryHistoryItem[];
  
  // Settings
  settings: JSONPathSettings;
  
  // Actions
  setJsonInput: (input: string) => void;
  setQuery: (query: string) => void;
  execute: () => void;
  loadExample: (example: JSONPathExample, queryIndex?: number) => void;
  loadQueryFromHistory: (historyItem: QueryHistoryItem) => void;
  clearHistory: () => void;
  updateSettings: (settings: Partial<JSONPathSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatJson: () => void;
}

const DEFAULT_JSON = JSON.stringify({
  store: {
    book: [
      { category: "reference", author: "Nigel Rees", title: "Sayings of the Century", price: 8.95 },
      { category: "fiction", author: "Evelyn Waugh", title: "Sword of Honour", price: 12.99 },
      { category: "fiction", author: "Herman Melville", title: "Moby Dick", isbn: "0-553-21311-3", price: 8.99 },
      { category: "fiction", author: "J. R. R. Tolkien", title: "The Lord of the Rings", isbn: "0-395-19395-8", price: 22.99 }
    ],
    bicycle: { color: "red", price: 19.95 }
  }
}, null, 2);

const DEFAULT_QUERY = '$.store.book[*].author';

export const useJSONPathStore = create<JSONPathState>()(
  persist(
    (set, get) => ({
      // Initial state
      jsonInput: DEFAULT_JSON,
      query: DEFAULT_QUERY,
      result: null,
      isExecuting: false,
      jsonError: null,
      queryHistory: [],
      settings: DEFAULT_JSONPATH_SETTINGS,
      
      // Actions
      setJsonInput: (input: string) => {
        // Validate JSON
        const { error } = parseJSON(input);
        set({ jsonInput: input, jsonError: error || null });
        
        // Auto-execute if enabled
        if (get().settings.autoExecute && !error) {
          setTimeout(() => get().execute(), get().settings.debounceMs);
        }
      },
      
      setQuery: (query: string) => {
        set({ query });
        
        // Auto-execute if enabled
        if (get().settings.autoExecute) {
          setTimeout(() => get().execute(), get().settings.debounceMs);
        }
      },
      
      execute: () => {
        const { jsonInput, query, settings, queryHistory } = get();
        
        if (!jsonInput.trim() || !query.trim()) {
          return;
        }
        
        set({ isExecuting: true });
        
        // Execute query
        const result = executeJSONPath(jsonInput, query, settings);
        
        // Add to history if successful
        if (!result.error) {
          const historyItem: QueryHistoryItem = {
            id: uuidv4(),
            query,
            timestamp: Date.now(),
            matchCount: result.matchCount,
            isSuccessful: true,
          };
          
          // Check if query already exists in history
          const existingIndex = queryHistory.findIndex(h => h.query === query);
          let newHistory: QueryHistoryItem[];
          
          if (existingIndex >= 0) {
            // Update existing entry and move to top
            newHistory = [
              historyItem,
              ...queryHistory.filter((_, i) => i !== existingIndex),
            ];
          } else {
            // Add new entry
            newHistory = [historyItem, ...queryHistory];
          }
          
          // Limit history size
          if (newHistory.length > MAX_HISTORY_ITEMS) {
            newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
          }
          
          set({ 
            result, 
            isExecuting: false,
            queryHistory: newHistory,
          });
        } else {
          set({ result, isExecuting: false });
        }
      },
      
      loadExample: (example: JSONPathExample, queryIndex: number = 0) => {
        const query = example.queries[queryIndex]?.query || example.queries[0]?.query || '';
        set({
          jsonInput: example.json,
          query,
          jsonError: null,
          result: null,
        });
        
        // Execute immediately
        setTimeout(() => get().execute(), 100);
      },
      
      loadQueryFromHistory: (historyItem: QueryHistoryItem) => {
        set({ query: historyItem.query });
        setTimeout(() => get().execute(), 100);
      },
      
      clearHistory: () => {
        set({ queryHistory: [] });
      },
      
      updateSettings: (newSettings: Partial<JSONPathSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_JSONPATH_SETTINGS });
      },
      
      clear: () => {
        set({
          jsonInput: '',
          query: '',
          result: null,
          jsonError: null,
        });
      },
      
      formatJson: () => {
        const { jsonInput, settings } = get();
        try {
          const parsed = JSON.parse(jsonInput);
          set({ 
            jsonInput: JSON.stringify(parsed, null, settings.indentSize),
            jsonError: null,
          });
        } catch {
          // Invalid JSON, can't format
        }
      },
    }),
    {
      name: 'jsonpath-tester-storage',
      partialize: (state) => ({
        settings: state.settings,
        queryHistory: state.queryHistory,
      }),
    }
  )
);

// Export examples for easy access
export { JSONPATH_EXAMPLES };
