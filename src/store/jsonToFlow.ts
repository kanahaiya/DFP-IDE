/**
 * JSON to Flow Zustand Store
 * State management for Flow visualization tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlowSettings, FlowGenerationResult } from '@/lib/flow-viz/types';
import { DEFAULT_FLOW_SETTINGS } from '@/lib/flow-viz/types';
import { jsonToFlow, searchNodes } from '@/lib/flow-viz/layoutEngine';

interface JsonToFlowState {
  // Input
  input: string;

  // Output
  result: FlowGenerationResult | null;

  // Settings
  settings: FlowSettings;

  // Search
  searchText: string;
  highlightedNodes: string[];

  // Actions
  setInput: (input: string) => void;
  generate: () => void;
  updateSettings: (settings: Partial<FlowSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
  setSearchText: (text: string) => void;
}

const DEFAULT_INPUT = `{
  "company": "Acme Corp",
  "employees": [
    {
      "id": 1,
      "name": "John Doe",
      "role": "CEO",
      "department": {
        "name": "Executive",
        "budget": 1000000
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "role": "CTO",
      "department": {
        "name": "Technology",
        "budget": 500000
      }
    }
  ],
  "products": [
    {
      "name": "Widget Pro",
      "price": 99.99,
      "inStock": true
    }
  ],
  "settings": {
    "notifications": true,
    "theme": "dark"
  }
}`;

export const useJsonToFlowStore = create<JsonToFlowState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      settings: DEFAULT_FLOW_SETTINGS,
      searchText: '',
      highlightedNodes: [],

      // Actions
      setInput: (input: string) => {
        set({ input });
        // Auto-generate
        setTimeout(() => get().generate(), 300);
      },

      generate: () => {
        const { input, settings } = get();

        if (!input.trim()) {
          set({ result: null, highlightedNodes: [] });
          return;
        }

        const result = jsonToFlow(input, settings);
        set({ result });

        // Re-run search if there's search text
        const { searchText } = get();
        if (searchText && result.success) {
          const highlighted = searchNodes(result.nodes, searchText);
          set({ highlightedNodes: highlighted });
        }
      },

      updateSettings: (newSettings: Partial<FlowSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        // Re-generate with new settings
        setTimeout(() => get().generate(), 100);
      },

      resetSettings: () => {
        set({ settings: DEFAULT_FLOW_SETTINGS });
        setTimeout(() => get().generate(), 100);
      },

      clear: () => {
        set({
          input: '',
          result: null,
          searchText: '',
          highlightedNodes: [],
        });
      },

      formatInput: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          const formatted = JSON.stringify(parsed, null, 2);
          set({ input: formatted });
        } catch {
          // Invalid JSON, don't format
        }
      },

      setSearchText: (text: string) => {
        set({ searchText: text });
        const { result } = get();
        if (result?.success) {
          const highlighted = searchNodes(result.nodes, text);
          set({ highlightedNodes: highlighted });
        }
      },
    }),
    {
      name: 'json-to-flow-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
