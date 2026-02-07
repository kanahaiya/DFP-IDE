'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { HelpModal } from '@/components/common/HelpModal';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { event as trackEvent } from '@/lib/analytics';
import { executeJSONPath } from '@/lib/jsonpath/executor';
import type { JSONPathSettings } from '@/lib/jsonpath/types';

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
  processorType: 'jsonpath' | 'jmespath' | 'json-fixer' | 'json-repair' | 'json-converter';
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
    processorType,
    outputLanguage = 'json',
    helpContent,
    defaultSettings,
    inputPlaceholder = 'Enter your input here...',
    outputPlaceholder = 'Results will appear here...',
  } = config;

  // Processor function based on type
  const getProcessor = useCallback(() => {
    switch (processorType) {
      case 'jsonpath':
        return async (input: string, settings: Record<string, unknown>) => {
          return executeJSONPath(input, (settings.query as string) || '$', settings as unknown as JSONPathSettings);
        };
      default:
        return async () => {
          return { error: 'Processor not implemented' };
        };
    }
  }, [processorType]);

  // Tool state
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<unknown | null>(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [error, setError] = useState<string | null>(null);
  const [, setIsExecuting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Tool actions
  const execute = useCallback(async () => {
    if (!input) {
      setError('Please provide input');
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      const processor = getProcessor();
      const result = await processor(input, settings);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput(null);
    } finally {
      setIsExecuting(false);
    }
  }, [input, settings, getProcessor]);

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
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  style={{
                    width: '100%',
                    height: '400px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    resize: 'none',
                  }}
                />
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
              />
              <div className="results-wrapper">
                {!output ? (
                  <div className="results-hint" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '400px',
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                  }}>
                    <i className="fas fa-info-circle"></i>
                    {error || 'Execute to see results'}
                  </div>
                ) : (
                  <textarea
                    value={typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                    onChange={() => {}} // Read-only
                    placeholder={outputPlaceholder}
                    readOnly
                    style={{
                      width: '100%',
                      height: '400px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      padding: '10px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      resize: 'none',
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
