/**
 * JSON to Protobuf Zustand Store
 * State management for Protobuf generation tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProtobufGeneratorSettings, ProtobufGenerationResult } from '@/lib/protobuf/types';
import { DEFAULT_PROTOBUF_SETTINGS } from '@/lib/protobuf/types';
import { jsonToProtobuf } from '@/lib/protobuf/generator';

interface JsonToProtobufState {
  // Input
  input: string;
  
  // Output
  result: ProtobufGenerationResult | null;
  
  // Settings
  settings: ProtobufGeneratorSettings;
  
  // Actions
  setInput: (input: string) => void;
  generate: () => void;
  updateSettings: (settings: Partial<ProtobufGeneratorSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
}

const DEFAULT_INPUT = `{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_active": true,
  "roles": ["admin", "user"],
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "age": 30,
    "country": "USA"
  },
  "created_at": "2026-01-17T10:30:00Z"
}`;

export const useJsonToProtobufStore = create<JsonToProtobufState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      result: null,
      settings: DEFAULT_PROTOBUF_SETTINGS,
      
      // Actions
      setInput: (input: string) => {
        set({ input });
        // Auto-generate
        setTimeout(() => get().generate(), 300);
      },
      
      generate: () => {
        const { input, settings } = get();
        
        if (!input.trim()) {
          set({ result: null });
          return;
        }
        
        const result = jsonToProtobuf(input, settings);
        set({ result });
      },
      
      updateSettings: (newSettings: Partial<ProtobufGeneratorSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
        // Re-generate with new settings
        setTimeout(() => get().generate(), 100);
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_PROTOBUF_SETTINGS });
        setTimeout(() => get().generate(), 100);
      },
      
      clear: () => {
        set({
          input: '',
          result: null,
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
    }),
    {
      name: 'json-to-protobuf-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
