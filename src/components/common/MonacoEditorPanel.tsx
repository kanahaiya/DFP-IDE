'use client';

import { useEffect, useRef, useMemo } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';
import { registerCSVLanguage, applyCSVColumnDecorations } from '@/lib/monaco/csv-language';
import type { EditorLanguage, ValidationError } from '@/types';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

interface MonacoEditorPanelProps {
  value: string;
  onChange?: (value: string) => void;
  language?: EditorLanguage;
  readOnly?: boolean;
  placeholder?: string;
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
  className?: string;
  onLoadSample?: () => void;
  emptyStateTitle?: string;
  emptyStateInstructions?: string[];
  validationErrors?: ValidationError[];
}

/**
 * Reusable Monaco Editor component with theme support
 */
export function MonacoEditorPanel({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder = '',
  onMount,
  className = '',
  onLoadSample,
  emptyStateTitle = 'Welcome to JSON to OpenAPI Converter',
  emptyStateInstructions = [
    'Pasting JSON from your API',
    'Uploading a .json file',
    'Loading a sample template',
  ],
  validationErrors = [],
}: MonacoEditorPanelProps) {
  const { theme, mounted } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const csvDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  // Derive showPlaceholder from value instead of using state
  const showPlaceholder = useMemo(() => !value || value.trim() === '', [value]);

  // Update Monaco Editor theme when app theme changes
  useEffect(() => {
    if (monacoRef.current && mounted) {
      const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [theme, mounted]);

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

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register CSV language support and apply column decorations
    if (language === 'csv') {
      try {
        registerCSVLanguage(monaco);
        
        // Apply initial column decorations
        const applyDecorations = () => {
          if (editorRef.current && monacoRef.current) {
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

    // Hide line numbers and decorations when empty
    const updateEditorOptions = () => {
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
      } else {
        editor.updateOptions({
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          lineDecorationsWidth: 10,
          folding: true,
          glyphMargin: true,
        });
      }
    };

    updateEditorOptions();
    editor.onDidChangeModelContent(updateEditorOptions);

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
    <div className={`monaco-editor-wrapper ${className}`}>
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
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            wordWrap: 'on',
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
