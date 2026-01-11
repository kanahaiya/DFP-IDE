'use client';

import { useEffect, useState } from 'react';
import type { Monaco } from '@monaco-editor/react';

/**
 * Monaco editor initialization hook
 * Provides Monaco instance and loading state
 */
export function useMonaco() {
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Monaco is loaded via @monaco-editor/react's loader
    // This hook just tracks the loading state
    const checkMonaco = () => {
      if (typeof window !== 'undefined' && (window as any).monaco) {
        setMonaco((window as any).monaco);
        setIsLoading(false);
      }
    };

    checkMonaco();
    
    // Check periodically during initial load
    const interval = setInterval(checkMonaco, 100);
    
    // Cleanup after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { monaco, isLoading };
}

/**
 * Configure JSON language diagnostics for Monaco Editor
 */
export function configureJSONDiagnostics(monaco: Monaco) {
  try {
    // Enable JSON validation with strict settings
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false,
      schemaValidation: 'error',
      schemaRequest: 'error',
    });
  } catch (error) {
    console.warn('Error configuring JSON diagnostics:', error);
  }
}

/**
 * Register custom languages with Monaco
 */
export function registerCustomLanguages(monaco: Monaco) {
  try {
    // Register CSV language if not already registered
    const languages = monaco.languages.getLanguages();
    const hasCsv = languages.some((lang: { id: string }) => lang.id === 'csv');
    
    if (!hasCsv) {
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

      monaco.languages.setLanguageConfiguration('csv', {
        brackets: [],
        autoClosingPairs: [{ open: '"', close: '"' }],
        surroundingPairs: [{ open: '"', close: '"' }],
      });
    }
  } catch (error) {
    console.warn('Error registering custom Monaco languages:', error);
  }
}
