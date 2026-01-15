 'use client';
 
 import { useLocalStorage } from '@/hooks/useLocalStorage';
 
 export type WorkspaceEditorSide = 'left' | 'right' | 'single';
 
export type WorkspaceKeyboardMapping = 'vscode' | 'sublime' | 'atom' | 'vim' | 'emacs' | 'basic';

 export interface WorkspaceEditorSettings {
   /** Apply workspace editor settings to the left editor */
   applyLeft: boolean;
   /** Apply workspace editor settings to the right editor */
   applyRight: boolean;
 
  /** Keyboard mapping preset (affects modifier-based editor behaviors) */
  keyboardMapping: WorkspaceKeyboardMapping;

   fontSize: number;
   wordWrap: boolean;
   showMinimap: boolean;
   showLineNumbers: boolean;
   highlightCurrentLine: boolean;
   showGlyphMargin: boolean;
 }
 
 export interface WorkspaceSettings {
   editor: WorkspaceEditorSettings;
 }
 
 export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
   editor: {
     applyLeft: true,
     applyRight: true,
    keyboardMapping: 'vscode',
     fontSize: 13,
     wordWrap: false,
     showMinimap: false,
     showLineNumbers: true,
     highlightCurrentLine: true,
     showGlyphMargin: true,
   },
 };
 
 export function useWorkspaceSettings() {
   return useLocalStorage<WorkspaceSettings>('dfp_workspace_settings', DEFAULT_WORKSPACE_SETTINGS);
 }
 
