'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useJSONPathStore } from '@/store/jsonpath';
import { jsonpathTesterContent } from '@/data/jsonpath-tester-seo';
import { jsonpathTesterHelp } from '@/data/jsonpath-tester-help';
import { JSONPATH_SAMPLES } from '@/data/jsonpath-tester-samples';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import TabManager from '@/components/common/TabManager';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel'; // Direct import like JSON to OpenAPI

// Settings panels
import { JSONPathOptionsPanel } from '@/components/tools/jsonpath-tester/JSONPathOptionsPanel';
import { JSONPathHistoryPanel } from '@/components/tools/jsonpath-tester/JSONPathHistoryPanel';
import { JSONPathExamplesPanel } from '@/components/tools/jsonpath-tester/JSONPathExamplesPanel';
import { JSONPathPresetsPanel } from '@/components/tools/jsonpath-tester/JSONPathPresetsPanel';

type SettingsTabId = 'settings-options' | 'settings-examples' | 'settings-history' | 'settings-presets';

export default function JSONPathTesterPage() {
  const {
    jsonInput,
    query,
    result,
    jsonError,
    queryHistory,
    settings,
    setJsonInput,
    setQuery,
    execute,
    loadExample,
    loadQueryFromHistory,
    clearHistory,
    updateSettings,
    clear,
  } = useJSONPathStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-options');
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });

  // Tab management
  const {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    closeTab,
    renameTab,
    updateTab,
    switchTab,
    duplicateTab,
    closeOtherTabs,
    closeAllTabs,
    maxTabs,
    canAddTab,
  } = useTabs({ toolName: 'JSONPath Tester', storageKey: 'jsonpath-tester-tabs' });

  const isTabSyncingRef = useRef(false);

  // Sync tab data when switching tabs
  useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setJsonInput(activeTab.inputJSON || '');
    setQuery((activeTab.settings?.query as string) || '');
    const timer = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTabId, activeTab, setJsonInput, setQuery]);

  // Save tab data when input changes
  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) return;
    if (activeTab && activeTabId && (activeTab.inputJSON !== jsonInput || (activeTab.settings?.query as string) !== query)) {
      updateTab(activeTabId, {
        inputJSON: jsonInput,
        settings: {
          ...activeTab.settings,
          query,
        },
      });
    }
  }, [jsonInput, query, activeTabId, activeTab, updateTab]);

  // Debug result changes
  useEffect(() => {
    console.log('Result changed:', result);
    console.log('Query:', query);
    console.log('JSON Input length:', jsonInput?.length);
    if (result) {
      console.log('Result error:', result.error);
      console.log('Result matches:', result.matches);
      console.log('Matches length:', result.matches?.length);
    }
  }, [result, query, jsonInput]);

  // Debug layout changes
  useEffect(() => {
    console.log('Layout changed to:', layout);
    console.log('Size:', size);
  }, [layout, size]);

  // Tab handlers
  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setJsonInput(content);
    } catch {
      // Error handling
    }
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
    } catch {
      // Paste failed
    }
  };

  const handleCopyResults = async () => {
    if (!result || result.error || result.matches.length === 0) return;
    try {
      const values = result.matches.map(m => m.value);
      const output = JSON.stringify(values.length === 1 ? values[0] : values, null, 2);
      await copyToClipboard(output);
    } catch {
      // Copy failed
    }
  };

  const handleDownloadResults = () => {
    if (!result || result.error || result.matches.length === 0) return;
    const values = result.matches.map(m => m.value);
    const output = JSON.stringify(values.length === 1 ? values[0] : values, null, 2);
    downloadTextFile(output, 'results.json', 'application/json');
  };

  // Handle preset
  const handleApplyPreset = (presetSettings: Record<string, unknown>) => {
    updateSettings(presetSettings);
  };

  // Handle sample load
  const handleLoadSample = (sample: typeof JSONPATH_SAMPLES[0]) => {
    setJsonInput(sample.content);
    if (sample.defaultQuery) {
      setQuery(sample.defaultQuery);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(json|txt)$/i)) {
      return;
    }

    await handleFileUpload(file);
  };

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-options' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
        <button
          className={settingsTabId === 'settings-examples' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-examples')}
        >
          <i className="fas fa-lightbulb"></i> Examples
        </button>
        <button
          className={settingsTabId === 'settings-history' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-history')}
        >
          <i className="fas fa-history"></i> History
          {queryHistory.length > 0 && <span className="history-badge">{queryHistory.length}</span>}
        </button>
        <button
          className={settingsTabId === 'settings-presets' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-options' && (
          <JSONPathOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-examples' && (
          <JSONPathExamplesPanel onLoadExample={loadExample} />
        )}
        {settingsTabId === 'settings-history' && (
          <JSONPathHistoryPanel
            history={queryHistory}
            onLoadQuery={loadQueryFromHistory}
            onClearHistory={clearHistory}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <JSONPathPresetsPanel settings={settings} onApplyPreset={handleApplyPreset} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JSONPath Tester',
            description: jsonpathTesterContent.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'JSONPath expression testing',
              'Real-time query results',
              'Query history',
              'Multiple result views',
              'Syntax reference',
              'Pre-loaded examples',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSONPath Tester"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
        {/* Tab Manager */}
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
          onTabRename={renameTab}
          onAddTab={handleAddTab}
          onDuplicateTab={handleDuplicateTab}
          onCloseOtherTabs={closeOtherTabs}
          onCloseAllTabs={closeAllTabs}
          canAddTab={canAddTab}
          maxTabs={maxTabs}
        />

        {/* Editor Panels - Working Layout */}
        <div 
          ref={containerRef}
          className={`ide-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
          style={{
            display: 'flex',
            flexDirection: layout === 'vertical' ? 'column' : 'row',
            width: '100%',
            height: layout === 'vertical' ? '800px' : '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Left Panel - Input */}
          <div 
            className={`ide-pane ${isDragging ? 'drag-over' : ''}`}
            style={{
              width: layout === 'vertical' ? '100%' : `${size}%`,
              height: layout === 'vertical' ? '400px' : '100%',
              minHeight: layout === 'vertical' ? '400px' : 'auto',
              maxHeight: layout === 'vertical' ? '400px' : 'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <EditorToolbar
              label="JSON Input"
              onUpload={handleFileUpload}
              onPaste={handlePaste}
              onClear={clear}
              sampleTemplates={JSONPATH_SAMPLES.map(sample => ({
                name: sample.name,
                description: sample.description || '',
                content: sample.content,
                icon: sample.icon,
                iconColor: sample.iconColor
              }))}
              onLoadTemplate={(template) => {
                const sample = JSONPATH_SAMPLES.find(s => s.name === template.name);
                if (sample) {
                  handleLoadSample(sample);
                }
              }}
            />
          <MonacoEditorPanel
            value={jsonInput}
            onChange={setJsonInput}
            language="json"
            editorSide="left"
            placeholder="Paste your JSON data here..."
            emptyStateTitle="Welcome to JSONPath Tester"
            emptyStateInstructions={[
              'Pasting JSON data',
              'Uploading a .json file',
              'Loading a sample template',
            ]}
            onLoadSample={() => {
              if (JSONPATH_SAMPLES.length > 0) {
                setJsonInput(JSONPATH_SAMPLES[0].content);
              }
            }}
          />
          <StatsBar text={jsonInput} validationState={{
            isValid: !jsonError,
            errorCount: jsonError ? 1 : 0,
            warningCount: 0,
          }} />
          {jsonError && (
            <div className="editor-error">
              <i className="fas fa-exclamation-circle"></i>
              {jsonError}
            </div>
          )}
        </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Right Panel - Output */}
          <div 
            className="ide-pane"
            style={{
              width: layout === 'vertical' ? '100%' : `${100 - size}%`,
              height: layout === 'vertical' ? '400px' : '100%',
              minHeight: layout === 'vertical' ? '400px' : 'auto',
              maxHeight: layout === 'vertical' ? '400px' : 'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <OutputToolbar 
              label="Results" 
              onCopy={result && !result.error && result.matches.length > 0 ? handleCopyResults : undefined}
              onDownload={result && !result.error && result.matches.length > 0 ? handleDownloadResults : undefined}
              isQueryInput={true}
              query={query}
              onQueryChange={setQuery}
              onExecute={execute}
              onClearQuery={() => setQuery('')}
              placeholder="$.store.book[*].author"
              disabled={!jsonInput}
            />
            
            <MonacoEditorPanel
              value={result && !result.error && result.matches.length > 0 
                ? JSON.stringify(result.matches, null, 2)
                : result?.error 
                  ? `Error: ${result.error}`
                  : '[]'
              }
              onChange={() => {}} // Read-only
              language="json"
              editorSide="right"
              readOnly
              placeholder="Results will appear here"
              emptyStateTitle="JSONPath Results"
              emptyStateInstructions={[
                'Execute a JSONPath query to see results',
                'Use the query input in the toolbar above',
              ]}
            />
            
            <StatsBar text={result && !result.error && result.matches.length > 0 
              ? JSON.stringify(result.matches, null, 2)
              : result?.error 
                ? `Error: ${result.error}`
                : '[]'
            } />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonpathTesterContent.title}
            subtitle={jsonpathTesterContent.subtitle}
            features={jsonpathTesterContent.features}
            howToSteps={jsonpathTesterContent.howToSteps}
            educationalContent={jsonpathTesterContent.educationalContent}
            useCases={jsonpathTesterContent.useCases}
            technicalSpecs={jsonpathTesterContent.technicalSpecs}
            faqs={jsonpathTesterContent.faqs}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName={jsonpathTesterHelp.toolName}
        sections={jsonpathTesterHelp.sections}
      />

      <style jsx>{`
        /* Query and Results specific styles */
        .query-input-section {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          height: auto;
          max-height: 40vh;
        }

        .query-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
        }

        .toolbar-label {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .query-actions {
          display: flex;
          gap: 0.5rem;
        }

        .query-input-wrapper {
          padding: 0.75rem;
        }

        .query-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-family: 'Fira Code', 'Monaco', monospace;
          font-size: 0.95rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }

        .query-input:focus {
          border-color: var(--primary);
        }

        .query-input::placeholder {
          color: var(--text-muted);
        }

        .cheatsheet-wrapper {
          padding: 0 0.75rem 0.75rem;
        }

        .results-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          min-height: 0;
        }

        .results-wrapper {
          flex: 1;
          overflow: auto;
          min-height: 0;
        }

        .editor-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border-top: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
          font-size: 0.8rem;
        }

        .sidebar-tab {
          position: relative;
        }

        .history-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: var(--primary);
          color: white;
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 9999px;
          min-width: 16px;
          text-align: center;
        }

        /* Clean up ide-pane styles - header on top below tab manager (like JSON to OpenAPI) */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
        }
        
        .ide-pane:first-child .editor-toolbar {
          order: 1 !important;
          flex-shrink: 0 !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--elevated) !important;
        }
        
        .ide-pane .stats-bar {
          flex-shrink: 0 !important;
        }
        
        .ide-pane .editor-error {
          flex-shrink: 0 !important;
        }
        
        .ide-pane .output-toolbar {
          flex-shrink: 0 !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--elevated) !important;
        }
        
        /* Custom scrollbar for Monaco editors */
        .ide-pane ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .ide-pane ::-webkit-scrollbar-track {
          background: var(--bg);
          border-radius: 4px;
        }
        
        .ide-pane ::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
          transition: background .2s;
        }
        
        .ide-pane ::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
        
        /* Firefox scrollbar */
        .ide-pane {
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        /* Force vertical layout */
        .ide-editors.vertical {
          flex-direction: column !important;
          height: 800px !important;
        }

        .ide-editors.vertical .ide-pane {
          width: 100% !important;
          height: 400px !important;
          flex: none !important;
        }

        .ide-editors.vertical .ide-resizer {
          width: 100% !important;
          height: 5px !important;
          cursor: row-resize !important;
          flex: none !important;
        }
      `}</style>
    </>
  );
}
