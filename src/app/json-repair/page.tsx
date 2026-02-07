'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useJsonRepairStore } from '@/store/jsonRepair';
import { jsonRepairSamples } from '@/data/json-repair-samples';
import { jsonRepairSEO } from '@/data/json-repair-seo';
import { jsonRepairHelp } from '@/data/json-repair-help';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { RepairOptionsPanel } from '@/components/tools/json-repair/RepairOptionsPanel';
import { RepairPresetsPanel } from '@/components/tools/json-repair/RepairPresetsPanel';
import { RepairSummary } from '@/components/tools/json-repair/RepairSummary';
import { recommendPreset } from '@/lib/json-repair/presets';
import type { RepairMode } from '@/lib/json-repair/types';

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

type SettingsTabId = 'settings-options' | 'settings-presets' | 'settings-summary';

export default function JsonRepairPage() {
  const {
    input,
    output,
    result,
    settings,
    isRepairing,
    autoRepair,
    setInput,
    setOutput,
    repair,
    updateSettings,
    applyPreset,
    clear,
    toggleAutoRepair,
    formatOutput,
    minifyOutput,
  } = useJsonRepairStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-options');
  const [showHelp, setShowHelp] = useState(false);
  const [recommendedPreset, setRecommendedPreset] = useState<RepairMode | undefined>();
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);

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
  } = useTabs({ toolName: 'JSON Repair', storageKey: 'json-repair-tabs' });

  const isTabSyncingRef = useRef(false);

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setInput(activeTab.inputJSON || '');
    setOutput(activeTab.outputJSON || '');
    const timer = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTabId, activeTab, setInput, setOutput]);

  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) return;
    updateTab(activeTabId, {
      inputJSON: input,
      outputJSON: output,
    });
  }, [activeTabId, input, output, updateTab]);

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

  // Update recommended preset when input changes
  useEffect(() => {
    if (input.trim()) {
      const recommended = recommendPreset(input);
      setRecommendedPreset(recommended);
    }
  }, [input]);

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

  // Handle copy input - used in InputToolbar
  const handleCopyInput = useCallback(async () => {
    if (!input) return;
    await copyToClipboard(input);
  }, [input]);
  void handleCopyInput; // Available for InputToolbar

  // Handle copy output
  const handleCopyOutput = useCallback(async () => {
    if (!output) return;
    await copyToClipboard(output);
  }, [output]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) return;
    downloadTextFile(output, 'repaired.json', 'application/json');
  }, [output]);

  // Handle repair
  const handleRepair = useCallback(() => {
    repair();
  }, [repair]);

  // Handle preset application
  const handleApplyPreset = useCallback((presetId: RepairMode) => {
    applyPreset(presetId);
  }, [applyPreset]);

  // Determine status
  const hasOutput = output.length > 0;
  const isValid = result?.isValid ?? false;

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
          className={settingsTabId === 'settings-presets' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
        <button
          className={settingsTabId === 'settings-summary' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-summary')}
        >
          <i className="fas fa-list-alt"></i> Summary
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-options' && (
          <RepairOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <RepairPresetsPanel
            currentMode={settings.mode}
            onApplyPreset={handleApplyPreset}
            recommendedPreset={recommendedPreset}
          />
        )}
        {settingsTabId === 'settings-summary' && (
          <RepairSummary result={result} isRepairing={isRepairing} />
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
            name: 'JSON Repair Tool',
            description: jsonRepairSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Automatic JSON repair',
              'Fix quotes and commas',
              'Bracket matching',
              'Boolean/null correction',
              'Comment removal',
              'JSONP unwrapping',
              'MongoDB type conversion',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON Repair"
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

        {/* Editor Panels */}
        <div 
          ref={containerRef}
          className={`ide-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
        >
          {/* Input Editor */}
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
              label="Broken JSON"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={handleClear}
              sampleTemplates={jsonRepairSamples}
              onLoadTemplate={handleLoadSample}
              onAction={handleRepair}
              actionLabel="Repair JSON"
              actionIcon="fas fa-wrench"
              actionVariant="primary"
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your broken JSON here..."
              emptyStateTitle="Welcome to JSON Repair"
              emptyStateInstructions={[
                'Pasting broken JSON',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonRepairSamples.length > 0) {
                  setInput(jsonRepairSamples[0].content);
                }
              }}
            />
            <StatsBar text={input} validationState={{
              isValid: input.trim() ? false : true, // Input is never "valid" until repaired
              errorCount: input.trim() ? 1 : 0, // Show error if there's content
              warningCount: 0,
            }} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Output Editor */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="Repaired JSON"
              onCopy={hasOutput ? handleCopyOutput : undefined}
              onDownload={hasOutput ? handleDownload : undefined}
            >
              <label className="auto-repair-toggle">
                <input
                  type="checkbox"
                  checked={autoRepair}
                  onChange={toggleAutoRepair}
                />
                <span>Auto-repair</span>
              </label>
              <div className="toolbar-separator" aria-hidden />
              {hasOutput && (
                <>
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
              placeholder="Repaired JSON will appear here..."
              emptyStateTitle="Repaired JSON Output"
              emptyStateInstructions={[
                'Repaired JSON will appear here',
                'Use the input panel to paste your broken JSON',
              ]}
            />
            {/* Status indicator */}
            {hasOutput && (
              <div className={`status-bar ${isValid ? 'status-valid' : 'status-invalid'}`}>
                <i className={isValid ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
                <span>
                  {isValid ? 'Valid JSON' : 'Repair incomplete - some errors remain'}
                </span>
                {result?.totalFixes !== undefined && result.totalFixes > 0 && (
                  <span className="fix-count">{result.totalFixes} fixes applied</span>
                )}
              </div>
            )}
            <StatsBar text={output} validationState={{
              isValid: isValid,
              errorCount: isValid ? 0 : 1,
              warningCount: 0,
            }} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonRepairSEO.heroTitle}
            subtitle={jsonRepairSEO.heroSubtitle}
            features={jsonRepairSEO.features}
            howToSteps={jsonRepairSEO.howToSteps}
            educationalContent={jsonRepairSEO.educationalContent}
            useCases={jsonRepairSEO.useCases}
            technicalSpecs={jsonRepairSEO.technicalSpecs}
            faqs={jsonRepairSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON Repair"
        sections={jsonRepairHelp}
      />

      <style jsx>{`
        .tool-container {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - var(--header-height));
          background: var(--bg);
        }

        .tool-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--card);
          border-bottom: 1px solid var(--border);
        }

        .tool-header-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tool-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .tool-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }

        .tool-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .auto-repair-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .auto-repair-toggle input {
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
        }

        .tool-main {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .tool-sidebar {
          width: 280px;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          background: var(--card);
          border-right: 1px solid var(--border);
          overflow: hidden;
        }

        .sidebar-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
        }

        .sidebar-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.625rem 0.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-tab:hover {
          color: var(--text);
          background: var(--hover);
        }

        .sidebar-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          background: var(--card);
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
        }

        .tool-editors {
          flex: 1;
          display: flex;
          gap: 0;
          overflow: hidden;
        }

        .editor-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          border-right: 1px solid var(--border);
        }

        .editor-panel:last-child {
          border-right: none;
        }

        .editor-content {
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .status-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          border-top: 1px solid var(--border);
        }

        .status-bar.status-valid {
          background: rgba(59, 185, 80, 0.1);
          color: var(--success);
        }

        .status-bar.status-invalid {
          background: rgba(248, 81, 73, 0.1);
          color: var(--danger);
        }

        .fix-count {
          margin-left: auto;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .tool-main {
            flex-direction: column;
          }

          .tool-sidebar {
            width: 100%;
            min-width: 100%;
            max-height: 200px;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }

          .tool-editors {
            flex-direction: column;
          }

          .editor-panel {
            border-right: none;
            border-bottom: 1px solid var(--border);
            min-height: 300px;
          }
        }

        @media (max-width: 768px) {
          .tool-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .tool-header-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
}
