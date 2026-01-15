'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { registerCSVLanguage, applyCSVColumnDecorations } from '@/lib/monaco/csv-language';
import { useWorkspaceSettings, type WorkspaceEditorSide } from '@/hooks/useWorkspaceSettings';
import { useEditorSnapshotsStore } from '@/store/editorSnapshots';
import type { EditorLanguage, ValidationError } from '@/types';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import type { MonacoDecoration } from '@/lib/json-diff/diffHighlighter';

interface MonacoEditorPanelProps {
  value: string;
  onChange?: (value: string) => void;
  language?: EditorLanguage;
  readOnly?: boolean;
  placeholder?: string;
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
  className?: string;
  editorSide?: WorkspaceEditorSide;
  onLoadSample?: () => void;
  emptyStateTitle?: string;
  emptyStateInstructions?: string[];
  validationErrors?: ValidationError[];
  decorations?: MonacoDecoration[]; // Diff decorations for highlighting changes
  showGlyphMargin?: boolean; // Show glyph margin with change indicators
  wordWrap?: boolean; // Enable word wrap
  showMinimap?: boolean; // Show minimap
  highlightCurrentLine?: boolean; // Highlight current line
  showLineNumbers?: boolean; // Show line numbers
  fontSize?: number; // Editor font size
}

/**
 * Reusable Monaco Editor component with theme support
 */
export function MonacoEditorPanel({
  value,
  decorations,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder = '',
  onMount,
  className = '',
  editorSide = 'single',
  onLoadSample,
  emptyStateTitle = 'Welcome to JSON to OpenAPI Converter',
  emptyStateInstructions = [
    'Pasting JSON from your API',
    'Uploading a .json file',
    'Loading a sample template',
  ],
  validationErrors = [],
  showGlyphMargin = true,
  wordWrap = false,
  showMinimap = false,
  highlightCurrentLine = true,
  showLineNumbers = true,
  fontSize = 13,
}: MonacoEditorPanelProps) {
  const pathname = usePathname() || '/';
  const { theme, mounted } = useTheme();
  const [workspaceSettings] = useWorkspaceSettings();
  const setSnapshot = useEditorSnapshotsStore((s) => s.setSnapshot);
  const clearSnapshot = useEditorSnapshotsStore((s) => s.clearSnapshot);
  const setCursorLine = useEditorSnapshotsStore((s) => s.setCursorLine);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const csvDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  const wsEditor = workspaceSettings.editor;
  const workspaceApplies =
    editorSide === 'left'
      ? wsEditor.applyLeft
      : editorSide === 'right'
        ? wsEditor.applyRight
        : wsEditor.applyLeft || wsEditor.applyRight;

  const effectiveFontSize = workspaceApplies ? wsEditor.fontSize : fontSize;
  const effectiveWordWrap = workspaceApplies ? wsEditor.wordWrap : wordWrap;
  const effectiveMinimap = workspaceApplies ? wsEditor.showMinimap : showMinimap;
  const effectiveShowGlyphMargin = workspaceApplies ? wsEditor.showGlyphMargin : showGlyphMargin;
  const effectiveKeyboardMapping = workspaceApplies ? wsEditor.keyboardMapping : 'vscode';
  
  // Determine multi-cursor modifier based on keyboard mapping
  const effectiveMultiCursorModifier = (() => {
    switch (effectiveKeyboardMapping) {
      case 'sublime':
      case 'atom':
        return 'ctrlCmd'; // Sublime/Atom style: Ctrl/Cmd + click for multi-cursor
      case 'vscode':
      case 'vim':
      case 'emacs':
      case 'basic':
      default:
        return 'alt'; // VS Code style: Alt + click for multi-cursor
    }
  })();
  // Important: allow caller to force-disable (e.g. per-side current change logic)
  const effectiveHighlightCurrentLine =
    highlightCurrentLine && (!workspaceApplies || wsEditor.highlightCurrentLine);
  const effectiveShowLineNumbers =
    showLineNumbers && (!workspaceApplies || wsEditor.showLineNumbers);

  // Derive showPlaceholder from value instead of using state
  const showPlaceholder = useMemo(() => !value || value.trim() === '', [value]);

  const applyEditorDisplayOptions = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const isEmpty = !editor.getValue().trim();
    if (isEmpty && !readOnly) {
      editor.updateOptions({
        lineNumbers: 'off',
        lineNumbersMinChars: 0,
        renderLineHighlight: 'none',
        lineDecorationsWidth: 0,
        folding: false,
        glyphMargin: false,
      });
      return;
    }

    editor.updateOptions({
      lineNumbers: effectiveShowLineNumbers ? 'on' : 'off',
      lineNumbersMinChars: 3,
      renderLineHighlight: effectiveHighlightCurrentLine ? 'all' : 'none',
      lineDecorationsWidth: 10,
      folding: true,
      glyphMargin: effectiveShowGlyphMargin,
    });
  }, [
    effectiveHighlightCurrentLine,
    effectiveShowGlyphMargin,
    effectiveShowLineNumbers,
    readOnly,
  ]);

  // Register editor content snapshot (used for PNG export)
  useEffect(() => {
    setSnapshot(pathname, {
      side: editorSide,
      value,
      language,
      readOnly,
    });

    return () => {
      clearSnapshot(pathname, editorSide);
    };
  }, [pathname, editorSide, value, language, readOnly, setSnapshot, clearSnapshot]);

  // Update Monaco Editor theme when app theme changes
  useEffect(() => {
    if (monacoRef.current && mounted) {
      const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [theme, mounted]);

  // Keep display options (glyph margin, line numbers, current line) in sync when toggles change
  useEffect(() => {
    applyEditorDisplayOptions();
  }, [applyEditorDisplayOptions, value]);

  // Update Monaco Editor markers when validation errors change
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // Convert validation errors to Monaco markers
    const markers = validationErrors.map((err) => ({
      severity: err.severity === 'error'
        ? monacoRef.current.MarkerSeverity.Error
        : monacoRef.current.MarkerSeverity.Warning,
      startLineNumber: err.line,
      startColumn: err.column,
      endLineNumber: err.endLine || err.line,
      endColumn: err.endColumn || err.column + 1,
      message: err.message,
      source: 'json-validator',
    }));

    // Set markers on the model
    monacoRef.current.editor.setModelMarkers(model, 'json-validator', markers);
  }, [validationErrors]);

  // Apply diff decorations when they change
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !decorations || decorations.length === 0) {
      return;
    }

    try {
      // Convert MonacoDecoration to editor.IModelDeltaDecoration
      const monacoDecorations = decorations as editor.IModelDeltaDecoration[];
      const decorationsCollection = editorRef.current.createDecorationsCollection(monacoDecorations);
      
      // Clean up on unmount or when decorations change
      return () => {
        decorationsCollection.clear();
      };
    } catch (error) {
      console.warn('Error applying decorations:', error);
    }
  }, [decorations]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Make Monaco available to client-side utilities (e.g. PNG export colorization)
    (window as unknown as { monaco?: Monaco }).monaco = monaco;

    // Register CSV language support and apply column decorations
    if (language === 'csv') {
      try {
        registerCSVLanguage(monaco);
        
        // Apply initial column decorations
        const applyDecorations = () => {
          if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            // In tests, the editor/model might be a partial mock.
            if (
              !model ||
              typeof (model as unknown as Partial<Pick<editor.ITextModel, 'getLineCount'>>).getLineCount !== 'function' ||
              typeof (model as unknown as Partial<Pick<editor.ITextModel, 'getLineContent'>>).getLineContent !== 'function'
            ) {
              return;
            }
            csvDecorationsRef.current = applyCSVColumnDecorations(
              editorRef.current,
              monacoRef.current,
              ','
            );
          }
        };

        // Apply decorations on content change
        editor.onDidChangeModelContent(() => {
          // Debounce decoration updates
          const timer = setTimeout(applyDecorations, 150);
          return () => clearTimeout(timer);
        });

        // Initial application
        setTimeout(applyDecorations, 100);
      } catch (error) {
        console.warn('Error setting up CSV decorations:', error);
      }
    }

    // Configure JSON diagnostics for validation
    if (language === 'json') {
      try {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: false,
          schemas: [],
          enableSchemaRequest: false,
        });
      } catch (error) {
        console.warn('Error configuring JSON diagnostics:', error);
      }
    }

    // Register custom languages if needed
    try {
      const languages = monaco.languages.getLanguages();
      const hasCsv = languages.some((lang: { id: string }) => lang.id === 'csv');

      if (!hasCsv && language === 'csv') {
        monaco.languages.register({
          id: 'csv',
          extensions: ['.csv'],
          aliases: ['CSV', 'csv'],
          mimetypes: ['text/csv'],
        });

        monaco.languages.setMonarchTokensProvider('csv', {
          defaultToken: '',
          tokenizer: {
            root: [
              [/".*?"/, 'string'],
              [/""/, 'string.escape'],
              [/[^,"\r\n;|\t]+/, 'identifier'],
              [/[,\t;|]/, 'delimiter'],
              [/\r?\n/, 'white'],
            ],
          },
        });
      }
    } catch (error) {
      console.warn('Error registering custom language:', error);
    }

    // Apply display options (and re-apply on content changes)
    applyEditorDisplayOptions();
    editor.onDidChangeModelContent(() => applyEditorDisplayOptions());

    // Track cursor line for PNG export (current-line highlight)
    const maybeEditor = editor as unknown as Partial<
      Pick<editor.IStandaloneCodeEditor, 'getPosition' | 'onDidChangeCursorPosition' | 'addCommand'>
    >;
    const initialPos = typeof maybeEditor.getPosition === 'function' ? editor.getPosition() : null;
    setCursorLine(pathname, editorSide, initialPos?.lineNumber);
    if (typeof maybeEditor.onDidChangeCursorPosition === 'function') {
      editor.onDidChangeCursorPosition((e) => {
        setCursorLine(pathname, editorSide, e.position?.lineNumber);
      });
    }

    // Ensure Select All works reliably (Cmd+A on macOS, Ctrl+A on Windows/Linux,
    // and also Ctrl+A on macOS for users expecting that behavior).
    const selectAll = () => {
      const action = editor.getAction('editor.action.selectAll');
      if (action) {
        void action.run();
        return;
      }
      const model = editor.getModel();
      if (!model) return;
      editor.setSelection(model.getFullModelRange());
    };

    // Ensure Undo works reliably
    const undo = () => {
      editor.trigger('keyboard', 'undo', null);
    };

    // Ensure Redo works reliably
    const redo = () => {
      editor.trigger('keyboard', 'redo', null);
    };

    if (typeof maybeEditor.addCommand === 'function') {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, selectAll);
      // Note: on macOS, Monaco uses WinCtrl for the physical Ctrl key.
      editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyA, selectAll);
      const winCtrl = (monaco.KeyMod as unknown as { WinCtrl?: number }).WinCtrl;
      if (typeof winCtrl === 'number') {
        editor.addCommand(winCtrl | monaco.KeyCode.KeyA, selectAll);
      }

      // Undo: Ctrl/Cmd + Z
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo);
      editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyZ, undo);
      if (typeof winCtrl === 'number') {
        editor.addCommand(winCtrl | monaco.KeyCode.KeyZ, undo);
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo);
      editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyY, redo);
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);
      editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);
      if (typeof winCtrl === 'number') {
        editor.addCommand(winCtrl | monaco.KeyCode.KeyY, redo);
        editor.addCommand(winCtrl | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);
      }

      // Add keyboard mapping-specific keybindings
      const keymap = effectiveKeyboardMapping;

      // Emacs-style keybindings (Ctrl+N/P/F/B navigation)
      if (keymap === 'emacs') {
        // Ctrl+N = next line (down)
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyN, () => {
          editor.trigger('keyboard', 'cursorDown', null);
        });
        // Ctrl+P = previous line (up)
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyP, () => {
          editor.trigger('keyboard', 'cursorUp', null);
        });
        // Ctrl+F = forward (right)
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyF, () => {
          editor.trigger('keyboard', 'cursorRight', null);
        });
        // Ctrl+B = backward (left)
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyB, () => {
          editor.trigger('keyboard', 'cursorLeft', null);
        });
        // Ctrl+E = end of line
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyE, () => {
          editor.trigger('keyboard', 'cursorEnd', null);
        });
        // Ctrl+K = kill line (delete to end of line)
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyK, () => {
          editor.trigger('keyboard', 'deleteAllRight', null);
        });
        // Ctrl+D = delete character
        editor.addCommand(monaco.KeyMod.Ctrl | monaco.KeyCode.KeyD, () => {
          editor.trigger('keyboard', 'deleteRight', null);
        });
      }

      // Vim-style keybindings (basic hjkl navigation with Alt modifier to avoid conflicts)
      if (keymap === 'vim') {
        // Alt+H = left
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyH, () => {
          editor.trigger('keyboard', 'cursorLeft', null);
        });
        // Alt+J = down
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyJ, () => {
          editor.trigger('keyboard', 'cursorDown', null);
        });
        // Alt+K = up
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyK, () => {
          editor.trigger('keyboard', 'cursorUp', null);
        });
        // Alt+L = right
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyL, () => {
          editor.trigger('keyboard', 'cursorRight', null);
        });
        // Alt+W = word right
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyW, () => {
          editor.trigger('keyboard', 'cursorWordEndRight', null);
        });
        // Alt+B = word left
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyB, () => {
          editor.trigger('keyboard', 'cursorWordStartLeft', null);
        });
        // Alt+0 = beginning of line
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Digit0, () => {
          editor.trigger('keyboard', 'cursorHome', null);
        });
        // Alt+$ (Shift+4) = end of line
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.Digit4, () => {
          editor.trigger('keyboard', 'cursorEnd', null);
        });
        // Alt+G+G = go to top (simplified: Alt+G)
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyG, () => {
          editor.trigger('keyboard', 'cursorTop', null);
        });
        // Alt+Shift+G = go to bottom
        editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyG, () => {
          editor.trigger('keyboard', 'cursorBottom', null);
        });
      }
    }

    // Extra safety: some environments/browsers can swallow Cmd/Ctrl+A before Monaco handles it.
    // Intercept at the editor level and force-select all.
    try {
      editor.onKeyDown((e) => {
        const isA = e.keyCode === monaco.KeyCode.KeyA;
        const hasModifier = e.ctrlKey || e.metaKey;
        if (!isA || !hasModifier) return;
        e.preventDefault();
        e.stopPropagation();
        selectAll();
      });
    } catch {
      // ignore
    }

    // Ultra safety: capture-phase DOM handler to beat any global app hotkeys.
    // Only triggers when THIS editor has focus.
    try {
      const onKeyDownCapture = (ev: KeyboardEvent) => {
        const hasModifier = ev.ctrlKey || ev.metaKey;
        if (!hasModifier) return;

        // Monaco focus guard to avoid stealing shortcuts from other inputs.
        if (typeof (editor as unknown as { hasTextFocus?: () => boolean }).hasTextFocus === 'function') {
          if (!(editor as unknown as { hasTextFocus: () => boolean }).hasTextFocus()) return;
        }

        const keyLower = ev.key.toLowerCase();
        const codeLower = typeof ev.code === 'string' ? ev.code.toLowerCase() : '';

        // Select All: Ctrl/Cmd + A
        const isA = keyLower === 'a' || codeLower === 'keya';
        if (isA && !ev.shiftKey) {
          ev.preventDefault();
          ev.stopPropagation();
          if (typeof (ev as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation === 'function') {
            (ev as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
          }
          selectAll();
          return;
        }

        // Undo: Ctrl/Cmd + Z (without Shift)
        const isZ = keyLower === 'z' || codeLower === 'keyz';
        if (isZ && !ev.shiftKey) {
          ev.preventDefault();
          ev.stopPropagation();
          if (typeof (ev as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation === 'function') {
            (ev as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
          }
          undo();
          return;
        }

        // Redo: Ctrl/Cmd + Shift + Z
        if (isZ && ev.shiftKey) {
          ev.preventDefault();
          ev.stopPropagation();
          if (typeof (ev as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation === 'function') {
            (ev as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
          }
          redo();
          return;
        }

        // Redo: Ctrl/Cmd + Y
        const isY = keyLower === 'y' || codeLower === 'keyy';
        if (isY) {
          ev.preventDefault();
          ev.stopPropagation();
          if (typeof (ev as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation === 'function') {
            (ev as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
          }
          redo();
          return;
        }
      };

      // Listen on window (earliest) and document (backup) in capture phase.
      window.addEventListener('keydown', onKeyDownCapture, true);
      document.addEventListener('keydown', onKeyDownCapture, true);
      editor.onDidDispose(() => {
        window.removeEventListener('keydown', onKeyDownCapture, true);
        document.removeEventListener('keydown', onKeyDownCapture, true);
      });
    } catch {
      // ignore
    }

    if (onMount) {
      onMount(editor);
    }
  };

  const handleChange = (value: string | undefined) => {
    const newValue = value || '';
    if (onChange) {
      onChange(newValue);
    }
  };

  const showEmptyState = showPlaceholder && !readOnly && onLoadSample;

  return (
    <div
      data-editor-side={editorSide}
      data-editor-path={pathname}
      tabIndex={0}
      onFocus={() => {
        // Ensure keyboard focus moves into Monaco (so OS shortcuts like Cmd/Ctrl+A act on the editor).
        if (typeof editorRef.current?.focus === 'function') {
          editorRef.current.focus();
        }
      }}
      onMouseDownCapture={(e) => {
        // Ensure clicks anywhere in the panel focus Monaco.
        // This prevents OS select-all (Cmd/Ctrl+A) from acting on the page when Monaco didn't get focus.
        const editor = editorRef.current;
        if (!editor || typeof editor.focus !== 'function') return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        // Don't steal focus from actual form controls / buttons (e.g. empty state CTA).
        if (target.closest('button, a, input, textarea, select, [role="button"]')) return;
        editor.focus();
      }}
      className={`monaco-editor-wrapper ${className} ${
        effectiveHighlightCurrentLine ? 'current-line-enabled' : 'current-line-disabled'
      }`}
    >
      {mounted && (
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={handleChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          onMount={handleEditorMount}
          loading=""
          options={{
            readOnly,
            minimap: { enabled: effectiveMinimap },
            fontSize: effectiveFontSize,
            lineHeight: 20,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            wordWrap: effectiveWordWrap ? 'on' : 'off',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: false,
            formatOnType: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            renderValidationDecorations: 'on',
            occurrencesHighlight: 'off',
            renderLineHighlight: effectiveHighlightCurrentLine ? 'all' : 'none',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            selectOnLineNumbers: true,
            selectionHighlight: true,
            // VS Code-like vs Sublime-like multi-cursor modifier behavior
            multiCursorModifier: effectiveMultiCursorModifier,
            suggest: {
              showWords: false,
              showSnippets: false,
            },
          }}
        />
      )}
      {showEmptyState && (
        <div className="editor-empty-state">
          <div className="empty-state-icon">👋</div>
          <h3 className="empty-state-title">{emptyStateTitle}</h3>
          <div className="empty-state-instructions">
            <p>Get started by:</p>
            <ul>
              {emptyStateInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
          <button className="btn btn-primary" onClick={onLoadSample}>
            <i className="fas fa-file-code"></i> Load Sample JSON
          </button>
          <div className="empty-state-tip">
            <i className="fas fa-lightbulb"></i>
            <span>Pro tip: Use <kbd>Ctrl+Enter</kbd> to generate</span>
          </div>
        </div>
      )}
      {showPlaceholder && placeholder && !showEmptyState && (
        <div className="editor-placeholder">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <span>{placeholder}</span>
          </div>
        </div>
      )}
    </div>
  );
}
