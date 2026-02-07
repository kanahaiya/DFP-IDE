'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useJMESPathStore } from '@/store/jmespath';
import { jmespathTesterContent } from '@/data/jmespath-tester-seo';
import { jmespathTesterHelp } from '@/data/jmespath-tester-help';
import { JMESPATH_SAMPLES } from '@/data/jmespath-tester-samples';
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
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';

import type { JMESPathSettings } from '@/lib/jmespath/types';
import { JMESPathOptionsPanel } from '@/components/tools/jmespath-tester/JMESPathOptionsPanel';
import { JMESPathHistoryPanel } from '@/components/tools/jmespath-tester/JMESPathHistoryPanel';
import { JMESPathExamplesPanel } from '@/components/tools/jmespath-tester/JMESPathExamplesPanel';
import { JMESPathPresetsPanel } from '@/components/tools/jmespath-tester/JMESPathPresetsPanel';

type SettingsTabId = 'settings-options' | 'settings-examples' | 'settings-history' | 'settings-presets';

export default function JMESPathTesterPage() {
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
  } = useJMESPathStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-options');
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });

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
  } = useTabs({ toolName: 'JMESPath Tester', storageKey: 'jmespath-tester-tabs' });

  const isTabSyncingRef = useRef(false);

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

  const handleAddTab = useCallback(() => addTab(), [addTab]);
  const handleDuplicateTab = useCallback((tabId: string) => duplicateTab(tabId), [duplicateTab]);

  const handleFileUpload = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setJsonInput(content);
    } catch {
      // Error handling
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
    } catch {
      // Paste failed
    }
  };

  const hasValidResult = result && !result.error;
  const resultOutputText = hasValidResult
    ? JSON.stringify(result.result, null, settings.prettyPrint ? settings.indentSize : 0)
    : result?.error
      ? `Error: ${result.error}`
      : '';

  const handleCopyResults = async () => {
    if (!hasValidResult) return;
    try {
      const output = typeof result!.result === 'string'
        ? result!.result
        : JSON.stringify(result!.result, null, settings.indentSize);
      await copyToClipboard(output);
    } catch {
      // Copy failed
    }
  };

  const handleDownloadResults = () => {
    if (!hasValidResult) return;
    const output = typeof result!.result === 'string'
      ? result!.result
      : JSON.stringify(result!.result, null, settings.indentSize);
    downloadTextFile(output, 'jmespath-results.json', 'application/json');
  };

  const handleApplyPreset = (presetSettings: Partial<JMESPathSettings>) => {
    updateSettings(presetSettings);
  };

  const handleLoadSample = (sample: (typeof JMESPATH_SAMPLES)[0]) => {
    setJsonInput(sample.content);
    if (sample.defaultQuery) {
      setQuery(sample.defaultQuery);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const file = files[0];
    if (!file.name.match(/\.(json|txt)$/i)) return;
    await handleFileUpload(file);
  };

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
          <JMESPathOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-examples' && (
          <JMESPathExamplesPanel onLoadExample={loadExample} />
        )}
        {settingsTabId === 'settings-history' && (
          <JMESPathHistoryPanel
            history={queryHistory}
            onLoadQuery={loadQueryFromHistory}
            onClearHistory={clearHistory}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <JMESPathPresetsPanel settings={settings} onApplyPreset={handleApplyPreset} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JMESPath Tester',
            description: jmespathTesterContent.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            featureList: [
              'JMESPath query testing',
              'AWS CLI compatible',
              'Real-time results',
              'Query history',
              'Syntax reference',
              'Pre-loaded examples',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JMESPath Tester"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
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
          {/* Left Panel - JSON Input */}
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
              sampleTemplates={JMESPATH_SAMPLES.map((sample) => ({
                name: sample.name,
                description: sample.description || '',
                content: sample.content,
                icon: sample.icon,
                iconColor: sample.iconColor,
              }))}
              onLoadTemplate={(template) => {
                const sample = JMESPATH_SAMPLES.find((s) => s.name === template.name);
                if (sample) handleLoadSample(sample);
              }}
            />
            <MonacoEditorPanel
              value={jsonInput}
              onChange={setJsonInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON data here..."
              emptyStateTitle="Welcome to JMESPath Tester"
              emptyStateInstructions={[
                'Pasting JSON data',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (JMESPATH_SAMPLES.length > 0) {
                  setJsonInput(JMESPATH_SAMPLES[0].content);
                  if (JMESPATH_SAMPLES[0].defaultQuery) setQuery(JMESPATH_SAMPLES[0].defaultQuery);
                }
              }}
            />
            <StatsBar
              text={jsonInput}
              validationState={{
                isValid: !jsonError,
                errorCount: jsonError ? 1 : 0,
                warningCount: 0,
              }}
            />
            {jsonError && (
              <div className="editor-error">
                <i className="fas fa-exclamation-circle"></i>
                {jsonError}
              </div>
            )}
          </div>

          <div ref={resizerRef} className="ide-resizer" id="mainResizer" />

          {/* Right Panel - Results */}
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
              onCopy={hasValidResult ? handleCopyResults : undefined}
              onDownload={hasValidResult ? handleDownloadResults : undefined}
              isQueryInput={true}
              query={query}
              onQueryChange={setQuery}
              onExecute={execute}
              onClearQuery={() => setQuery('')}
              placeholder="Reservations[].Instances[].InstanceId"
              disabled={!jsonInput}
            />
            <MonacoEditorPanel
              value={resultOutputText}
              onChange={() => {}}
              language="json"
              editorSide="right"
              readOnly
              placeholder="Results will appear here"
              emptyStateTitle="JMESPath Results"
              emptyStateInstructions={[
                'Execute a JMESPath query to see results',
                'Use the query input in the toolbar above',
              ]}
            />
            <StatsBar text={resultOutputText} />
          </div>
        </div>

        <article id="seo-content">
          <SEOContent
            title={jmespathTesterContent.title}
            subtitle={jmespathTesterContent.subtitle}
            features={jmespathTesterContent.features}
            howToSteps={jmespathTesterContent.howToSteps}
            educationalContent={jmespathTesterContent.educationalContent}
            useCases={jmespathTesterContent.useCases}
            technicalSpecs={jmespathTesterContent.technicalSpecs}
            faqs={jmespathTesterContent.faqs}
          />
        </article>
      </IDELayout>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName={jmespathTesterHelp.toolName}
        sections={jmespathTesterHelp.sections}
      />

      <style jsx>{`
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
        }
        .ide-pane ::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
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
