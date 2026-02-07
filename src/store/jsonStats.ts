'use client';

import { create } from 'zustand';
import type {
  JsonStats,
  ActiveSection,
  ExportFormat,
  ExportSettings,
} from '@/lib/stats/types';
import { DEFAULT_EXPORT_SETTINGS } from '@/lib/stats/types';

// ============================================================================
// State Interface
// ============================================================================

interface JsonStatsState {
  // Input
  input: string;
  
  // Analysis results
  stats: JsonStats | null;
  
  // Validation
  isValid: boolean;
  error: string | null;
  
  // UI State
  isAnalyzing: boolean;
  activeSection: ActiveSection;
  
  // Export settings
  exportSettings: ExportSettings;
  
  // Actions - Input
  setInput: (input: string) => void;
  clearInput: () => void;
  
  // Actions - Stats
  setStats: (stats: JsonStats | null) => void;
  
  // Actions - Validation
  setIsValid: (isValid: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions - UI
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setActiveSection: (section: ActiveSection) => void;
  
  // Actions - Export
  updateExportSettings: (updates: Partial<ExportSettings>) => void;
  setExportFormat: (format: ExportFormat) => void;
  
  // Actions - Reset
  resetAll: () => void;
}

// ============================================================================
// Store
// ============================================================================

export const useJsonStatsStore = create<JsonStatsState>((set) => ({
  // Initial state
  input: '',
  stats: null,
  isValid: true,
  error: null,
  isAnalyzing: false,
  activeSection: 'overview',
  exportSettings: DEFAULT_EXPORT_SETTINGS,
  
  // Input actions
  setInput: (input) => set({ input }),
  
  clearInput: () => set({
    input: '',
    stats: null,
    isValid: true,
    error: null,
  }),
  
  // Stats actions
  setStats: (stats) => set({
    stats,
    isValid: stats?.isValid ?? true,
    error: stats?.error ?? null,
  }),
  
  // Validation actions
  setIsValid: (isValid) => set({ isValid }),
  
  setError: (error) => set({ error }),
  
  // UI actions
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  
  setActiveSection: (activeSection) => set({ activeSection }),
  
  // Export actions
  updateExportSettings: (updates) => set((state) => ({
    exportSettings: { ...state.exportSettings, ...updates },
  })),
  
  setExportFormat: (format) => set((state) => ({
    exportSettings: { ...state.exportSettings, format },
  })),
  
  // Reset actions
  resetAll: () => set({
    input: '',
    stats: null,
    isValid: true,
    error: null,
    isAnalyzing: false,
    activeSection: 'overview',
    exportSettings: DEFAULT_EXPORT_SETTINGS,
  }),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectHasInput = (state: JsonStatsState) =>
  state.input.trim() !== '';

export const selectHasStats = (state: JsonStatsState) =>
  state.stats !== null && state.stats.isValid;

export const selectQualityScore = (state: JsonStatsState) =>
  state.stats?.quality.score ?? 0;

export const selectTotalValues = (state: JsonStatsState) =>
  state.stats?.types.totalValues ?? 0;

export const selectMaxDepth = (state: JsonStatsState) =>
  state.stats?.structure.maxDepth ?? 0;

// Re-export types for convenience
export type { JsonStats, ActiveSection, ExportFormat, ExportSettings };
