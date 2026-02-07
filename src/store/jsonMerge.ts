'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  MergeSettings,
  MergeInput,
  MergeResult,
  ValidationError,
  ExportSettings,
} from '@/lib/merge/types';
import {
  DEFAULT_MERGE_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  MERGE_PRESETS,
} from '@/lib/merge/types';

// ============================================================================
// State Interface
// ============================================================================

interface JsonMergeState {
  // Inputs (2-5 panes)
  inputs: MergeInput[];
  maxInputs: number;
  minInputs: number;
  
  // Output
  output: string;
  mergeResult: MergeResult | null;
  
  // Settings
  settings: MergeSettings;
  exportSettings: ExportSettings;
  
  // Validation
  errors: ValidationError[];
  
  // UI State
  isMerging: boolean;
  activeInputId: string | null;
  showTreeView: boolean;
  
  // Actions - Inputs
  addInput: () => void;
  removeInput: (id: string) => void;
  updateInput: (id: string, content: string) => void;
  renameInput: (id: string, name: string) => void;
  setInputValid: (id: string, isValid: boolean, error?: string) => void;
  setActiveInput: (id: string | null) => void;
  reorderInputs: (fromIndex: number, toIndex: number) => void;
  
  // Actions - Output
  setOutput: (output: string) => void;
  setMergeResult: (result: MergeResult | null) => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<MergeSettings>) => void;
  updateExportSettings: (updates: Partial<ExportSettings>) => void;
  resetSettings: () => void;
  applyPreset: (presetId: string) => void;
  
  // Actions - Merge
  setIsMerging: (isMerging: boolean) => void;
  setErrors: (errors: ValidationError[]) => void;
  
  // Actions - UI
  toggleTreeView: () => void;
  
  // Actions - Reset
  resetAll: () => void;
  clearInputs: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const createDefaultInput = (index: number): MergeInput => ({
  id: uuidv4(),
  name: `Input ${index + 1}`,
  content: '',
  isValid: true,
});

const initialInputs: MergeInput[] = [
  createDefaultInput(0),
  createDefaultInput(1),
];

// ============================================================================
// Store
// ============================================================================

export const useJsonMergeStore = create<JsonMergeState>((set) => ({
  // Initial state
  inputs: initialInputs,
  maxInputs: 5,
  minInputs: 2,
  output: '',
  mergeResult: null,
  settings: DEFAULT_MERGE_SETTINGS,
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  errors: [],
  isMerging: false,
  activeInputId: null,
  showTreeView: false,
  
  // Input actions
  addInput: () => set((state) => {
    if (state.inputs.length >= state.maxInputs) {
      return state;
    }
    const newInput = createDefaultInput(state.inputs.length);
    return {
      inputs: [...state.inputs, newInput],
    };
  }),
  
  removeInput: (id) => set((state) => {
    if (state.inputs.length <= state.minInputs) {
      return state;
    }
    const newInputs = state.inputs.filter(input => input.id !== id);
    // Rename remaining inputs
    const renamedInputs = newInputs.map((input, idx) => ({
      ...input,
      name: input.name.startsWith('Input ') ? `Input ${idx + 1}` : input.name,
    }));
    return {
      inputs: renamedInputs,
      activeInputId: state.activeInputId === id ? null : state.activeInputId,
    };
  }),
  
  updateInput: (id, content) => set((state) => ({
    inputs: state.inputs.map(input =>
      input.id === id ? { ...input, content } : input
    ),
  })),
  
  renameInput: (id, name) => set((state) => ({
    inputs: state.inputs.map(input =>
      input.id === id ? { ...input, name } : input
    ),
  })),
  
  setInputValid: (id, isValid, error) => set((state) => ({
    inputs: state.inputs.map(input =>
      input.id === id ? { ...input, isValid, error } : input
    ),
  })),
  
  setActiveInput: (id) => set({ activeInputId: id }),
  
  reorderInputs: (fromIndex, toIndex) => set((state) => {
    const newInputs = [...state.inputs];
    const [removed] = newInputs.splice(fromIndex, 1);
    newInputs.splice(toIndex, 0, removed);
    // Rename to maintain order
    const renamedInputs = newInputs.map((input, idx) => ({
      ...input,
      name: input.name.startsWith('Input ') ? `Input ${idx + 1}` : input.name,
    }));
    return { inputs: renamedInputs };
  }),
  
  // Output actions
  setOutput: (output) => set({ output }),
  
  setMergeResult: (result) => set({
    mergeResult: result,
    output: result?.outputString || '',
  }),
  
  // Settings actions
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),
  
  updateExportSettings: (updates) => set((state) => ({
    exportSettings: { ...state.exportSettings, ...updates },
  })),
  
  resetSettings: () => set({
    settings: DEFAULT_MERGE_SETTINGS,
    exportSettings: DEFAULT_EXPORT_SETTINGS,
  }),
  
  applyPreset: (presetId) => set((state) => {
    // Import presets directly
    const preset = MERGE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return state;
    
    return {
      settings: { ...state.settings, ...preset.settings },
    };
  }),
  
  // Merge actions
  setIsMerging: (isMerging) => set({ isMerging }),
  
  setErrors: (errors) => set({ errors }),
  
  // UI actions
  toggleTreeView: () => set((state) => ({ showTreeView: !state.showTreeView })),
  
  // Reset actions
  resetAll: () => set({
    inputs: [createDefaultInput(0), createDefaultInput(1)],
    output: '',
    mergeResult: null,
    settings: DEFAULT_MERGE_SETTINGS,
    exportSettings: DEFAULT_EXPORT_SETTINGS,
    errors: [],
    isMerging: false,
    activeInputId: null,
    showTreeView: false,
  }),
  
  clearInputs: () => set((state) => ({
    inputs: state.inputs.map(input => ({
      ...input,
      content: '',
      isValid: true,
      error: undefined,
    })),
    output: '',
    mergeResult: null,
    errors: [],
  })),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectInputById = (state: JsonMergeState, id: string) =>
  state.inputs.find(input => input.id === id);

export const selectValidInputs = (state: JsonMergeState) =>
  state.inputs.filter(input => input.isValid && input.content.trim() !== '');

export const selectCanAddInput = (state: JsonMergeState) =>
  state.inputs.length < state.maxInputs;

export const selectCanRemoveInput = (state: JsonMergeState) =>
  state.inputs.length > state.minInputs;

export const selectHasContent = (state: JsonMergeState) =>
  state.inputs.some(input => input.content.trim() !== '');

export const selectAllInputsValid = (state: JsonMergeState) =>
  state.inputs.every(input => input.isValid);

// Re-export types for convenience
export type { MergeSettings, MergeInput, MergeResult, ValidationError, ExportSettings };
