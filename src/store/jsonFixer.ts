/**
 * JSON Fixer Zustand Store
 * State management for JSON fixer tool
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ErrorItem, DetectionResult, FixerSettings, FixSuggestion } from '@/lib/json-fixer/types';
import { DEFAULT_FIXER_SETTINGS } from '@/lib/json-fixer/types';
import { detectErrors } from '@/lib/json-fixer/detector';
import { applyFix, recalculateOffsets, getBestFix, autoFixHighConfidence } from '@/lib/json-fixer/fixer';

interface JsonFixerState {
  // Input
  input: string;
  
  // Detection result
  detectionResult: DetectionResult | null;
  isDetecting: boolean;
  
  // Selected error
  selectedErrorId: string | null;
  
  // Fix history
  fixHistory: Array<{
    errorId: string;
    suggestion: FixSuggestion;
    beforeText: string;
    afterText: string;
  }>;
  
  // Settings
  settings: FixerSettings;
  
  // Actions
  setInput: (input: string) => void;
  detect: () => void;
  selectError: (errorId: string | null) => void;
  applyFix: (error: ErrorItem, suggestion: FixSuggestion) => boolean;
  applyBestFix: (error: ErrorItem) => boolean;
  applyAllHighConfidence: () => { applied: number; skipped: number };
  undoLastFix: () => void;
  updateSettings: (settings: Partial<FixerSettings>) => void;
  resetSettings: () => void;
  clear: () => void;
  formatInput: () => void;
  
  // Computed helpers
  getFilteredErrors: () => ErrorItem[];
  getSelectedError: () => ErrorItem | null;
}

const DEFAULT_INPUT = `{
  'name': 'John Doe',
  'email': 'john@example.com'
  "age": 30,
  "isActive": True,
  "tags": ["developer", "designer",],
  "metadata": None
}`;

export const useJsonFixerStore = create<JsonFixerState>()(
  persist(
    (set, get) => ({
      // Initial state
      input: DEFAULT_INPUT,
      detectionResult: null,
      isDetecting: false,
      selectedErrorId: null,
      fixHistory: [],
      settings: DEFAULT_FIXER_SETTINGS,
      
      // Actions
      setInput: (input: string) => {
        set({ input, selectedErrorId: null });
        
        // Auto-detect if enabled
        const { settings } = get();
        if (settings.autoDetect) {
          setTimeout(() => {
            get().detect();
          }, settings.debounceMs);
        }
      },
      
      detect: () => {
        const { input } = get();
        set({ isDetecting: true });
        
        try {
          const result = detectErrors(input);
          set({
            detectionResult: result,
            isDetecting: false,
            selectedErrorId: result.errors.length > 0 ? result.errors[0].id : null,
          });
        } catch {
          set({ isDetecting: false });
        }
      },
      
      selectError: (errorId: string | null) => {
        set({ selectedErrorId: errorId });
      },
      
      applyFix: (error: ErrorItem, suggestion: FixSuggestion) => {
        const { input, detectionResult, fixHistory } = get();
        
        const fixResult = applyFix(input, error, suggestion);
        
        if (fixResult.success && fixResult.appliedFix) {
          // Add to history
          const newHistory = [
            ...fixHistory,
            {
              errorId: error.id,
              suggestion: fixResult.appliedFix,
              beforeText: fixResult.original,
              afterText: fixResult.fixed,
            },
          ];
          
          // Update errors with new offsets
          const remainingErrors = detectionResult
            ? recalculateOffsets(
                detectionResult.errors.filter(e => e.id !== error.id),
                fixResult.appliedFix
              )
            : [];
          
          set({
            input: fixResult.fixed,
            fixHistory: newHistory,
            detectionResult: detectionResult
              ? {
                  ...detectionResult,
                  errors: remainingErrors,
                  totalCount: remainingErrors.length,
                  fixableCount: remainingErrors.filter(e => e.fixable).length,
                }
              : null,
            selectedErrorId: remainingErrors.length > 0 ? remainingErrors[0].id : null,
          });
          
          return true;
        }
        
        return false;
      },
      
      applyBestFix: (error: ErrorItem) => {
        const bestFix = getBestFix(error);
        if (bestFix) {
          return get().applyFix(error, bestFix);
        }
        return false;
      },
      
      applyAllHighConfidence: () => {
        const { input, detectionResult } = get();
        
        if (!detectionResult || detectionResult.errors.length === 0) {
          return { applied: 0, skipped: 0 };
        }
        
        const { fixed, appliedCount, skippedCount } = autoFixHighConfidence(
          input,
          detectionResult.errors
        );
        
        // Update state
        set({
          input: fixed,
          fixHistory: [], // Clear history after bulk fix
        });
        
        // Re-detect errors
        get().detect();
        
        return { applied: appliedCount, skipped: skippedCount };
      },
      
      undoLastFix: () => {
        const { fixHistory } = get();
        
        if (fixHistory.length === 0) return;
        
        const lastFix = fixHistory[fixHistory.length - 1];
        const newHistory = fixHistory.slice(0, -1);
        
        set({
          input: lastFix.beforeText,
          fixHistory: newHistory,
        });
        
        // Re-detect errors
        get().detect();
      },
      
      updateSettings: (newSettings: Partial<FixerSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      resetSettings: () => {
        set({ settings: DEFAULT_FIXER_SETTINGS });
      },
      
      clear: () => {
        set({
          input: '',
          detectionResult: null,
          selectedErrorId: null,
          fixHistory: [],
        });
      },
      
      formatInput: () => {
        const { input } = get();
        try {
          const parsed = JSON.parse(input);
          const formatted = JSON.stringify(parsed, null, 2);
          set({ input: formatted });
          get().detect();
        } catch {
          // Input is invalid, can't format
        }
      },
      
      // Computed helpers
      getFilteredErrors: () => {
        const { detectionResult, settings } = get();
        
        if (!detectionResult) return [];
        
        return detectionResult.errors.filter(
          error =>
            settings.showSeverity.includes(error.severity) &&
            settings.showCategories.includes(error.category)
        );
      },
      
      getSelectedError: () => {
        const { detectionResult, selectedErrorId } = get();
        
        if (!detectionResult || !selectedErrorId) return null;
        
        return detectionResult.errors.find(e => e.id === selectedErrorId) || null;
      },
    }),
    {
      name: 'json-fixer-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
