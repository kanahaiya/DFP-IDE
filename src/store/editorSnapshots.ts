'use client';

import { create } from 'zustand';
import type { EditorLanguage } from '@/types';
import type { WorkspaceEditorSide } from '@/hooks/useWorkspaceSettings';

export type DiffType = 'ADDED' | 'REMOVED' | 'MODIFIED' | 'TYPE_CHANGED' | 'MOVED';

export interface LineDiff {
  lineNumber: number;
  type: DiffType;
}

export interface EditorSnapshot {
  side: WorkspaceEditorSide;
  value: string;
  language: EditorLanguage;
  readOnly: boolean;
  diffs?: LineDiff[]; // Line-level diff highlighting
  cursorLine?: number; // Current cursor line (for current-line highlight in PNG export)
}

type SnapshotsBySide = Partial<Record<WorkspaceEditorSide, EditorSnapshot>>;

interface EditorSnapshotsState {
  byPath: Record<string, SnapshotsBySide>;
  setSnapshot: (path: string, snapshot: EditorSnapshot) => void;
  clearSnapshot: (path: string, side: WorkspaceEditorSide) => void;
  setDiffs: (path: string, side: WorkspaceEditorSide, diffs: LineDiff[]) => void;
  setCursorLine: (path: string, side: WorkspaceEditorSide, cursorLine: number | undefined) => void;
}
 
export const useEditorSnapshotsStore = create<EditorSnapshotsState>((set) => ({
  byPath: {},
  setSnapshot: (path, snapshot) =>
    set((state) => ({
      byPath: {
        ...state.byPath,
        [path]: {
          ...(state.byPath[path] || {}),
          [snapshot.side]: snapshot,
        },
      },
    })),
  clearSnapshot: (path, side) =>
    set((state) => {
      const current = state.byPath[path];
      if (!current) return state;
      const next = { ...current };
      delete next[side];
      return {
        byPath: {
          ...state.byPath,
          [path]: next,
        },
      };
    }),
  setDiffs: (path, side, diffs) =>
    set((state) => {
      const current = state.byPath[path];
      if (!current || !current[side]) return state;
      return {
        byPath: {
          ...state.byPath,
          [path]: {
            ...current,
            [side]: {
              ...current[side]!,
              diffs,
            },
          },
        },
      };
    }),
  setCursorLine: (path, side, cursorLine) =>
    set((state) => {
      const current = state.byPath[path];
      if (!current || !current[side]) return state;
      return {
        byPath: {
          ...state.byPath,
          [path]: {
            ...current,
            [side]: {
              ...current[side]!,
              cursorLine,
            },
          },
        },
      };
    }),
}));
 
