/**
 * JMESPath Query Tester Zustand Store
 * State management for JMESPath query testing tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  JMESPathSettings, 
  JMESPathResult, 
  QueryHistoryItem,
  JMESPathExample,
} from '@/lib/jmespath/types';
import { DEFAULT_JMESPATH_SETTINGS } from '@/lib/jmespath/types';
import { executeJMESPath, parseJSON, isEmptyResult } from '@/lib/jmespath/executor';
import { JMESPATH_EXAMPLES } from '@/lib/jmespath/examples';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY_ITEMS = 20;

interface JMESPathState {
  // Input
  jsonInput: string;
  query: string;
  
  // Results
  result: JMESPathResult | null;
  isExecuting: boolean;
  jsonError: string | null;
  
  // History
  queryHistory: QueryHistoryItem[];
  
  // Settings
  settings: JMESPathSettings;
  
  // Actions
  setJsonInput: (input: string) => void;
  setQuery: (query: string) => void;
  execute: () => void;
  loadExample: (example: JMESPathExample, queryIndex?: number) => void;
  loadQueryFromHistory: (historyItem: QueryHistoryItem) => void;
  clearHistory: () => void;
  updateSettings: (settings: Partial<JMESPathSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatJson: () => void;
}

const DEFAULT_JSON = JSON.stringify({
  Reservations: [
    {
      Instances: [
        { InstanceId: "i-abc12345", InstanceType: "t2.micro", State: { Name: "running" } },
        { InstanceId: "i-def67890", InstanceType: "t2.small", State: { Name: "stopped" } }
      ]
    },
    {
      Instances: [
        { InstanceId: "i-ghi11111", InstanceType: "t3.medium", State: { Name: "running" } }
      ]
    }
  ]
}, null, 2);

const DEFAULT_QUERY = 'Reservations[].Instances[].InstanceId';

export const useJMESPathStore = create<JMESPathState>()(
  persist(
    (set, get) => ({
      // Initial state
      jsonInput: DEFAULT_JSON,
      query: DEFAULT_QUERY,
      result: null,
      isExecuting: false,
      jsonError: null,
      queryHistory: [],
      settings: DEFAULT_JMESPATH_SETTINGS,
      
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
        const { jsonInput, query, queryHistory } = get();
        
        if (!jsonInput.trim() || !query.trim()) {
          return;
        }
        
        set({ isExecuting: true });
        
        // Execute query
        const result = executeJMESPath(jsonInput, query);
        
        // Add to history if successful
        if (!result.error) {
          const historyItem: QueryHistoryItem = {
            id: uuidv4(),
            query,
            timestamp: Date.now(),
            hasResult: !isEmptyResult(result.result),
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
      
      loadExample: (example: JMESPathExample, queryIndex: number = 0) => {
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
      
      updateSettings: (newSettings: Partial<JMESPathSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_JMESPATH_SETTINGS });
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
      name: 'jmespath-tester-storage',
      partialize: (state) => ({
        settings: state.settings,
        queryHistory: state.queryHistory,
      }),
    }
  )
);

// Export examples for easy access
export { JMESPATH_EXAMPLES };
