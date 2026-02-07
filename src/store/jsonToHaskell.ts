import { create } from 'zustand';
import type { HaskellGeneratorSettings } from '@/lib/haskell/types';

interface ValidationError {
  message: string;
  type: 'syntax' | 'type' | 'naming';
}

interface JsonToHaskellState {
  input: string;
  output: string;
  settings: HaskellGeneratorSettings;
  errors: ValidationError[];
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setErrors: (errors: ValidationError[]) => void;
  updateSettings: (settings: Partial<HaskellGeneratorSettings>) => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: HaskellGeneratorSettings = {
  rootClassName: 'Root',
  indentation: 2,
  useNullableTypes: true,
  outputMode: 'records',
  aesonStyle: 'generic',
  namingConvention: 'camelCase',
  deriveGeneric: true,
  deriveShow: true,
  deriveEq: true,
  generateToJSON: true,
  generateFromJSON: true,
  useStrictFields: false,
  addDocComments: true,
  modulePrefix: 'Data',
  fieldLabelModifier: true,
};

export const useJsonToHaskellStore = create<JsonToHaskellState>((set) => ({
  input: '',
  output: '',
  settings: DEFAULT_SETTINGS,
  errors: [],
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  setErrors: (errors) => set({ errors }),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  resetAll: () => set({ input: '', output: '', settings: DEFAULT_SETTINGS, errors: [] }),
}));
