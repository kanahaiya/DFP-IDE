'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { useJsonFixerStore } from '@/store/jsonFixer';
import { jsonFixerSamples } from '@/data/json-fixer-samples';
import { jsonFixerSEO } from '@/data/json-fixer-seo';
import { jsonFixerHelp } from '@/data/json-fixer-help';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import TabManager from '@/components/common/TabManager';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { ErrorPanel } from '@/components/tools/json-fixer/ErrorPanel';
import { FixPreview } from '@/components/tools/json-fixer/FixPreview';
import { FixerOptionsPanel } from '@/components/tools/json-fixer/FixerOptionsPanel';
import type { ErrorItem, FixSuggestion } from '@/lib/json-fixer/types';

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

type SettingsTabId = 'settings-errors' | 'settings-options';

export default function JsonFixerPage() {
  const {
    input,
    detectionResult,
    settings,
    selectedErrorId,
    fixHistory,
    isDetecting,
    setInput,
    detect,
    selectError,
    applyFix,
    applyBestFix,
    applyAllHighConfidence,
    undoLastFix,
    updateSettings,
    clear,
    getFilteredErrors,
    getSelectedError,
  } = useJsonFixerStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-errors');
  const [showHelp, setShowHelp] = useState(false);
  const [showFixPreview, setShowFixPreview] = useState(false);
  const [previewError, setPreviewError] = useState<ErrorItem | null>(null);
  const [output, setOutput] = useState('');
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
  } = useTabs({ toolName: 'JSON Fixer', storageKey: 'json-fixer-tabs' });

  const isTabSyncingRef = React.useRef(false);

  useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setInput(activeTab.inputJSON || '');
    setOutput(activeTab.outputJSON ?? '');
    detect();
    const t = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(t);
  }, [activeTabId, activeTab, setInput, detect]);

  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId || !activeTab) return;
    if (activeTab.inputJSON !== input || activeTab.outputJSON !== output) {
      updateTab(activeTabId, { inputJSON: input, outputJSON: output });
    }
  }, [input, output, activeTabId, activeTab, updateTab]);

  // Initial detection
  useEffect(() => {
    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate error count
  const errorCount = detectionResult?.totalCount ?? 0;

  // Update output when input changes
  useEffect(() => {
    if (errorCount === 0 && input.trim()) {
      // JSON is valid, format it in output
      try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        setOutput(formatted);
      } catch {
        setOutput(input);
      }
    } else {
      // JSON has errors, show original input in output
      setOutput(input);
    }
  }, [input, errorCount]);

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

  // Handle download
  const handleDownload = useCallback(() => {
    try {
      const filename = `fixed-json-${getTimestamp()}.json`;
      downloadTextFile(output, filename, 'application/json');
    } catch {
      // Download failed
    }
  }, [output]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(output);
    } catch {
      // Copy failed
    }
  }, [output]);

  // Handle share
  const handleShare = async () => {
    try {
      const url = `/json-fixer?input=${encodeURIComponent(input)}`;
      await copyToClipboard(window.location.origin + url);
    } catch {
      // Share failed
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

    await handleUpload(file);
  };

  // Handle apply fix
  const handleApplyFix = useCallback((error: ErrorItem, suggestion: FixSuggestion) => {
    applyFix(error, suggestion);
    setShowFixPreview(false);
    setPreviewError(null);
  }, [applyFix]);

  // Handle fix all high confidence
  const handleFixAllHighConfidence = useCallback(() => {
    applyAllHighConfidence();
  }, [applyAllHighConfidence]);

  // Get filtered errors
  const filteredErrors = getFilteredErrors();
  const currentSelectedError = getSelectedError();
  void currentSelectedError; // Used for potential future features
  const fixableCount = detectionResult?.fixableCount ?? 0;
  const hasUndoHistory = fixHistory.length > 0;

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-errors' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-errors')}
        >
          <i className="fas fa-list"></i> Errors
          {errorCount > 0 && <span className="tab-badge">{errorCount}</span>}
        </button>
        <button
          className={settingsTabId === 'settings-options' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-errors' && (
          <ErrorPanel
            errors={filteredErrors}
            selectedErrorId={selectedErrorId}
            onSelectError={selectError}
            onApplyBestFix={applyBestFix}
            showExplanations={settings.showExplanations}
          />
        )}
        {settingsTabId === 'settings-options' && (
          <FixerOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'JSON Fixer',
        description: jsonFixerSEO.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Interactive JSON debugging',
          'All errors shown at once',
          'Click to navigate to error',
          'Fix preview before applying',
          'Error explanations',
          'Filter by severity',
          'Dual editor layout',
          'Real-time error detection',
        ],
      }} />

      <IDELayout
        toolName="JSON Fixer"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
          onTabRename={renameTab}
          onAddTab={() => addTab()}
          onDuplicateTab={duplicateTab}
          onCloseOtherTabs={closeOtherTabs}
          onCloseAllTabs={closeAllTabs}
          canAddTab={canAddTab}
          maxTabs={maxTabs}
        />

        {/* Status Bar - below tab manager */}
        <div className={`fixer-status-bar ${errorCount === 0 ? 'status-valid' : 'status-invalid'}`}>
          <div className="status-left">
            {isDetecting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Detecting errors...</span>
              </>
            ) : errorCount === 0 ? (
              <>
                <i className="fas fa-check-circle"></i>
                <span>No errors found - Valid JSON!</span>
              </>
            ) : (
              <>
                <i className="fas fa-exclamation-circle"></i>
                <span>{errorCount} error{errorCount !== 1 ? 's' : ''} found</span>
                {fixableCount > 0 && (
                  <span className="fixable-count">{fixableCount} fixable</span>
                )}
              </>
            )}
          </div>
          <div className="status-right">
            {fixableCount > 0 && (
              <button className="btn btn-warning btn-sm" onClick={handleFixAllHighConfidence}>
                <i className="fas fa-magic"></i>
                Fix All ({fixableCount})
              </button>
            )}
            {hasUndoHistory && (
              <button className="btn btn-secondary btn-sm" onClick={undoLastFix}>
                <i className="fas fa-undo"></i>
                Undo
              </button>
            )}
          </div>
        </div>

        {/* Editor Panels */}
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
              label="JSON Input"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={handleClear}
              sampleTemplates={jsonFixerSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here to find and fix errors..."
              emptyStateTitle="Welcome to JSON Fixer"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonFixerSamples.length > 0) {
                  setInput(jsonFixerSamples[0].content);
                }
              }}
            />
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
              label="Fixed JSON Output"
              onCopy={handleCopy}
              onDownload={handleDownload}
              onShare={handleShare}
            />
            <MonacoEditorPanel
              value={output}
              onChange={() => {}}
              language="json"
              editorSide="right"
              readOnly
              placeholder="Fixed JSON will appear here"
              emptyStateTitle="Fixed JSON Output"
              emptyStateInstructions={[
                'Fixed JSON will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
          </div>
        </div>

        {/* Unified stats bar at bottom (like JSON to OpenAPI) */}
        <div className="ide-unified-stats-bar">
          <div className="ide-stats-section" style={{ width: `${size}%` }}>
            <StatsBar
              text={input}
              validationState={{
                isValid: errorCount === 0,
                errorCount: errorCount,
                warningCount: 0,
              }}
            />
          </div>
          <div className="ide-stats-section" style={{ width: `${100 - size}%` }}>
            <StatsBar
              text={output}
              validationState={{
                isValid: errorCount === 0,
                errorCount: 0,
                warningCount: 0,
              }}
            />
          </div>
        </div>

        {/* Social Share Widget */}
        <ShareWidget />

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonFixerSEO.heroTitle}
            subtitle={jsonFixerSEO.heroSubtitle}
            features={jsonFixerSEO.features}
            howToSteps={jsonFixerSEO.howToSteps}
            educationalContent={jsonFixerSEO.educationalContent}
            useCases={jsonFixerSEO.useCases}
            technicalSpecs={jsonFixerSEO.technicalSpecs}
            faqs={jsonFixerSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Footer */}
      <Footer />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON Fixer"
        sections={jsonFixerHelp}
      />

      {/* Fix Preview Modal */}
      {showFixPreview && previewError && (
        <FixPreview
          error={previewError}
          input={input}
          onApplyFix={handleApplyFix}
          onClose={() => {
            setShowFixPreview(false);
            setPreviewError(null);
          }}
        />
      )}

      <style jsx>{`
        /* Ensure editor area takes remaining height so stats bar can sit at bottom (like JSON to OpenAPI) */
        .fixer-status-bar {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border);
        }
        :global(.ide-main > .ide-editors) {
          flex: 1 1 0 !important;
          min-height: 0 !important;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fixer-status-bar.status-valid {
          background: rgba(59, 185, 80, 0.1);
          color: var(--success);
        }

        .fixer-status-bar.status-invalid {
          background: rgba(248, 81, 73, 0.1);
          color: var(--danger);
        }

        .fixable-count {
          margin-left: 0.5rem;
          padding: 0.125rem 0.5rem;
          background: var(--warning);
          color: #000;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .tab-badge {
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
          margin-left: 0.25rem;
        }

        /* Header on top below tab manager (same as JSONPath / JSON to OpenAPI) */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          min-height: 0 !important;
        }
        .ide-pane:first-child :global(.editor-toolbar) {
          order: 1 !important;
          flex-shrink: 0 !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--elevated) !important;
        }
        .ide-pane :global(.output-toolbar) {
          order: 1 !important;
          flex-shrink: 0 !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--elevated) !important;
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
        /* Unified stats bar at bottom - one row, two sections (like JSON to OpenAPI) */
        .ide-unified-stats-bar {
          flex-shrink: 0;
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 22px;
          border-top: 1px solid rgba(0, 0, 0, 0.2);
          background: #007ACC;
          font-size: 12px;
          color: #FFFFFF;
        }
        .ide-stats-section {
          flex-shrink: 0;
          min-width: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .ide-stats-section:first-child {
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }
        .ide-stats-section :global(.stats-bar) {
          margin-top: 0 !important;
          border-top: none !important;
          background: transparent !important;
          flex: 1;
          min-width: 0;
        }
        [data-theme='light'] .ide-unified-stats-bar {
          background: #6C33AF;
          border-top-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
