'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { useJsonCleanerStore } from '@/store/jsonCleaner';
import { jsonCleanerSamples } from '@/data/json-cleaner-samples';
import { jsonCleanerSEO } from '@/data/json-cleaner-seo';
import { jsonCleanerHelp } from '@/data/json-cleaner-help';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { CleaningOptionsPanel } from '@/components/tools/json-cleaner/CleaningOptionsPanel';
import { TransformPanel } from '@/components/tools/json-cleaner/TransformPanel';
import { CleanerPresetsPanel } from '@/components/tools/json-cleaner/CleanerPresetsPanel';
import { CleaningSummary } from '@/components/tools/json-cleaner/CleaningSummary';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import { useJSONValidation } from '@/hooks/useJSONValidation';
import type { CleanerPreset } from '@/lib/json-cleaner/types';

// Dynamic imports for heavy components
const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then((mod) => ({ default: mod.MonacoEditorPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="editor-loading-skeleton">
        <div className="skeleton-shimmer" />
      </div>
    ),
  }
);

type SettingsTabId = 'settings-cleaning' | 'settings-transform' | 'settings-presets' | 'settings-summary';

export default function JsonCleanerPage() {
  const {
    input,
    output,
    cleaningResult,
    settings,
    isProcessing,
    setInput,
    process,
    updateCleaningSettings,
    updateTransformSettings,
    applyPreset,
    clear,
    formatOutput,
    minifyOutput,
  } = useJsonCleanerStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-cleaning');
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Layout and resizer hooks
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
  } = useTabs({ toolName: 'JSON Cleaner', storageKey: 'json-cleaner-tabs' });

  const isTabSyncingRef = useRef(false);

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  React.useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setInput(activeTab.inputJSON || '');
    const timer = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTabId, activeTab, setInput]);

  React.useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) return;
    updateTab(activeTabId, {
      inputJSON: input,
      outputJSON: output,
    });
  }, [activeTabId, input, output, updateTab]);
  
  // JSON validation
  const inputValidation = useJSONValidation(input, 500);
  const validationErrors = useMemo(() => 
    inputValidation.errors.concat(inputValidation.warnings),
    [inputValidation.errors, inputValidation.warnings]
  );
  const validationState = useMemo(() => ({
    isValid: inputValidation.isValid,
    errorCount: inputValidation.errors.length,
    warningCount: inputValidation.warnings.length,
  }), [inputValidation.isValid, inputValidation.errors.length, inputValidation.warnings.length]);

  // Handle file upload
  const handleUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
    } catch {
      // Error handling
    }
  }, [setInput]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Paste failed
    }
  }, [setInput]);

  // Handle clear
  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  // Handle sample template
  const handleLoadSample = useCallback((template: { content: string }) => {
    setInput(template.content);
  }, [setInput]);

  // Handle copy output
  const handleCopyOutput = useCallback(async () => {
    if (!output) return;
    await copyToClipboard(output);
  }, [output]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) return;
    downloadTextFile(output, 'cleaned.json', 'application/json');
  }, [output]);

  // Handle clean
  const handleClean = useCallback(() => {
    process();
  }, [process]);

  // Handle preset
  const handleApplyPreset = useCallback((presetId: CleanerPreset) => {
    applyPreset(presetId);
  }, [applyPreset]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      try {
        const content = await readFileAsText(files[0]);
        setInput(content);
      } catch {
        // Error handling
      }
    }
  }, [setInput]);

  const hasOutput = output.length > 0;

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-cleaning' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-cleaning')}
        >
          <i className="fas fa-broom"></i> Clean
        </button>
        <button
          className={settingsTabId === 'settings-transform' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-transform')}
        >
          <i className="fas fa-exchange-alt"></i> Transform
        </button>
        <button
          className={settingsTabId === 'settings-presets' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
        <button
          className={settingsTabId === 'settings-summary' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-summary')}
        >
          <i className="fas fa-chart-bar"></i> Stats
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-cleaning' && (
          <CleaningOptionsPanel
            settings={settings.cleaning}
            updateSettings={updateCleaningSettings}
          />
        )}
        {settingsTabId === 'settings-transform' && (
          <TransformPanel
            settings={settings.transform}
            updateSettings={updateTransformSettings}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <CleanerPresetsPanel onApplyPreset={handleApplyPreset} />
        )}
        {settingsTabId === 'settings-summary' && (
          <CleaningSummary result={cleaningResult} isProcessing={isProcessing} />
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
            name: 'JSON Cleaner',
            description: jsonCleanerSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Remove null values',
              'Remove empty strings',
              'Key name transformation',
              'Type conversion',
              'Flatten/unflatten objects',
              'Deduplicate arrays',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON Cleaner"
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
        >
          {/* Left Panel - Input */}
          <div 
            className={`ide-pane ${isDragging ? 'drag-over' : ''}`}
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${size}%`
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <EditorToolbar
              label="Input JSON"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={handleClear}
              sampleTemplates={jsonCleanerSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON Cleaner"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonCleanerSamples.length > 0) {
                  setInput(jsonCleanerSamples[0].content);
                }
              }}
              validationErrors={validationErrors}
            />
            <StatsBar text={input} validationState={validationState} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Right Panel - Output */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="Cleaned JSON"
              onCopy={hasOutput ? handleCopyOutput : undefined}
              onDownload={hasOutput ? handleDownload : undefined}
            >
              {hasOutput && (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleClean}
                    disabled={!input.trim() || isProcessing}
                    title="Clean JSON"
                    aria-label="Clean JSON"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span className="btn-text">Processing...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-broom"></i>
                        <span className="btn-text">Clean</span>
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={formatOutput}
                    title="Format output"
                    aria-label="Format output"
                  >
                    <i className="fas fa-indent"></i>
                    <span className="btn-text">Format</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={minifyOutput}
                    title="Minify output"
                    aria-label="Minify output"
                  >
                    <i className="fas fa-compress"></i>
                    <span className="btn-text">Minify</span>
                  </button>
                </>
              )}
            </OutputToolbar>
            <MonacoEditorPanel
              value={output}
              language="json"
              editorSide="right"
              readOnly
              placeholder="Cleaned JSON will appear here..."
              emptyStateTitle="Cleaned JSON Output"
              emptyStateInstructions={[
                'Cleaned JSON will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonCleanerSEO.heroTitle}
            subtitle={jsonCleanerSEO.heroSubtitle}
            features={jsonCleanerSEO.features}
            howToSteps={jsonCleanerSEO.howToSteps}
            educationalContent={jsonCleanerSEO.educationalContent}
            useCases={jsonCleanerSEO.useCases}
            technicalSpecs={jsonCleanerSEO.technicalSpecs}
            faqs={jsonCleanerSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON Cleaner"
        sections={jsonCleanerHelp}
      />

      <style jsx>{`
        /* Ensure ide-pane uses flex column layout */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
        }
        
        /* Ensure proper flex ordering */
        .ide-pane :global(.editor-toolbar),
        .ide-pane :global(.output-toolbar) {
          order: 1 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.monaco-editor-wrapper) {
          order: 2 !important;
          flex: 1 1 0 !important;
          min-height: 0 !important;
        }
        
        .ide-pane :global(.editor-errors) {
          order: 998 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.stats-bar) {
          order: 999 !important;
          flex-shrink: 0 !important;
          margin-top: auto !important;
        }
      `}</style>
    </>
  );
}
