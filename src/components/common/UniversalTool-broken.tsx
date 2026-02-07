/* eslint-disable @typescript-eslint/ban-ts-comment -- legacy broken component */
// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { HelpModal } from '@/components/common/HelpModal';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { event as trackEvent } from '@/lib/analytics';

// Define SampleTemplate interface locally since it's not exported
interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
  defaultQuery?: string;
}

// Types for the universal tool
export interface ToolConfig {
  name: string;
  storageKey: string;
  samples: SampleTemplate[];
  processor: (input: string, settings: Record<string, unknown>) => Promise<unknown>;
  inputLanguage?: string;
  outputLanguage?: string;
  seoContent: {
    title: string;
    description: string;
    keywords: string[];
  };
  helpContent: {
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  defaultSettings: Record<string, unknown>;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
}

// Universal Tool Component
export function UniversalTool({
  config,
}: {
  config: ToolConfig;
}) {
  const {
    name,
    storageKey,
    samples,
    processor,
    inputLanguage = 'json',
    outputLanguage = 'json',
    helpContent,
    defaultSettings,
  } = config;

  // Tool state
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<unknown | null>(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Monaco editor refs
  const outputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const inputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Monaco editors
  useEffect(() => {
    // Initialize input editor
    if (inputContainerRef.current && !inputEditorRef.current) {
      inputEditorRef.current = monaco.editor.create(inputContainerRef.current, {
        value: '',
        language: inputLanguage,
        theme: 'vs-dark',
        readOnly: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        wordWrap: 'on',
        automaticLayout: true,
      });

      // Add change listener
      inputEditorRef.current.onDidChangeModelContent(() => {
        const value = inputEditorRef.current?.getValue() || '';
        setInput(value);
      });
    }

    // Initialize output editor
    if (outputContainerRef.current && !outputEditorRef.current) {
      outputEditorRef.current = monaco.editor.create(outputContainerRef.current, {
        value: '',
        language: outputLanguage,
        theme: 'vs-dark',
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        wordWrap: 'on',
        automaticLayout: true,
      });
    }

    return () => {
      if (inputEditorRef.current) {
        inputEditorRef.current.dispose();
        inputEditorRef.current = null;
      }
      if (outputEditorRef.current) {
        outputEditorRef.current.dispose();
        outputEditorRef.current = null;
      }
    };
  }, [inputLanguage, outputLanguage]);

  // Update output editor when output changes
  useEffect(() => {
    if (outputEditorRef.current && output) {
      const value = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
      outputEditorRef.current.setValue(value);
    }
  }, [output]);

  // Update input editor when input changes externally
  useEffect(() => {
    if (inputEditorRef.current && input !== inputEditorRef.current.getValue()) {
      inputEditorRef.current.setValue(input);
    }
  }, [input]);

  // Tool actions
  const execute = useCallback(async () => {
    console.log('=== EXECUTE CALLED ===');
    console.log('Input:', input);
    console.log('Settings:', settings);
    console.log('Input length:', input.length);
    console.log('Query:', settings.query);
    
    if (!input || input.trim() === '') {
      console.log('No input provided');
      setError('Please provide input');
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      console.log('Calling processor...');
      const result = await processor(input, settings);
      console.log('Processor returned:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', result ? Object.keys(result) : 'null');
      
      setOutput(result);
      setError(null);
      console.log('Output set successfully');
    } catch (e) {
      console.error('Processor error:', e);
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput(null);
    } finally {
      setIsExecuting(false);
      console.log('Execute finished');
    }
  }, [input, settings, processor]);

  const clear = useCallback(() => {
    setInput('');
    setOutput(null);
    setError(null);
  }, []);

  const loadSample = useCallback((sample: SampleTemplate) => {
    setInput(sample.content);
    if (sample.defaultQuery && 'query' in settings) {
      setSettings({ ...settings, query: sample.defaultQuery });
    }
    trackEvent('load_sample', storageKey, sample.name);
    console.log('Sample loaded:', sample.name);
  }, [settings, storageKey]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
    } catch {
      setError('Failed to read file');
    }
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      setError('Failed to paste from clipboard');
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
      await copyToClipboard(text);
    } catch {
      setError('Failed to copy to clipboard');
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    const filename = `${storageKey}-output.${outputLanguage === 'yaml' ? 'yaml' : 'json'}`;
    downloadTextFile(text, filename);
  }, [output, storageKey, outputLanguage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        execute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [execute]);

  // Debug output state
  useEffect(() => {
    console.log('Output state:', { output, error, isExecuting });
  }, [output, error, isExecuting]);

  return (
    <>
      <IDELayout toolName={name}>
        <div className="ide-container">
          {/* Main Content */}
          <div className="ide-content">
            {/* Input Panel */}
            <div className="ide-pane">
              <EditorToolbar
                label="Input"
                onUpload={handleFileUpload}
                onPaste={handlePaste}
                onClear={clear}
                sampleTemplates={samples}
                onLoadTemplate={loadSample}
              />
              <div className="editor-wrapper">
                <div 
                  ref={inputContainerRef}
                  style={{
                    width: '100%',
                    height: '350px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                  }}
                />
                {/* Query Input */}
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '4px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '5px',
                  }}>JSONPath Query:</div>
                  <input
                    type="text"
                    value={settings.query || ''}
                    onChange={(e) => setSettings({ ...settings, query: e.target.value })}
                    placeholder="$.store.book[*].author"
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      padding: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
              {error && (
                <div className="editor-error" style={{
                  padding: '10px',
                  backgroundColor: 'var(--error-bg)',
                  color: 'var(--error-text)',
                  border: '1px solid var(--error-border)',
                  marginTop: '10px',
                }}>
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              {/* StatsBar temporarily removed - will add back with correct props */}
            </div>

            {/* Output Panel */}
            <div className="ide-pane">
              <OutputToolbar
                label="Output"
                onCopy={output ? handleCopy : undefined}
                onDownload={output ? handleDownload : undefined}
                onExecute={execute}
                query={settings.query || ''}
                onQueryChange={(query) => setSettings({ ...settings, query })}
                onClearQuery={() => setSettings({ ...settings, query: '' })}
                isQueryInput={true}
                placeholder="$.store.book[*].author"
                disabled={!input}
              />
              <div className="results-wrapper">
                {/* Temporary debug info */}
                <div style={{
                  padding: '10px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  marginBottom: '10px',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}>
                  <div>Input length: {input.length}</div>
                  <div>Query: {settings.query || 'none'}</div>
                  <div>Output: {output ? 'exists' : 'null'}</div>
                  <div>Error: {error || 'none'}</div>
                  <div>Executing: {isExecuting ? 'yes' : 'no'}</div>
                </div>
                
                {!output ? (
                  <div className="results-hint" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '400px',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                  }}>
                    <i className="fas fa-info-circle"></i>
                    {error || 'Execute to see results'}
                  </div>
                ) : (
                  <div 
                    ref={outputContainerRef}
                    style={{
                      width: '100%',
                      height: '400px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                    }}
                  />
                )}
              </div>
              {/* StatsBar temporarily removed - will add back with correct props */}
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <HelpModal
            isOpen={showHelp}
            onClose={() => setShowHelp(false)}
            toolName={name}
            sections={helpContent.sections}
          />
        )}
      </IDELayout>

      {/* SEO Content temporarily removed - will add back with correct props */}
    </>
  );
}
