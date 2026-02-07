'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useJsonValidatorStore } from '@/store/jsonValidator';
import { VALIDATOR_PRESETS, applyPreset } from '@/lib/json-validator/presets';
import { jsonValidatorSamples } from '@/data/json-validator-samples';
import { jsonValidatorSEO } from '@/data/json-validator-seo';
import { jsonValidatorHelp } from '@/data/json-validator-help';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';

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

// Settings panels
import { ValidatorOptionsPanel } from '@/components/tools/json-validator/ValidatorOptionsPanel';
import { ValidatorStandardPanel } from '@/components/tools/json-validator/ValidatorStandardPanel';
import { ValidatorStatsPanel } from '@/components/tools/json-validator/ValidatorStatsPanel';
import { ValidatorPresetsPanel } from '@/components/tools/json-validator/ValidatorPresetsPanel';

type SettingsTabId = 'settings-options' | 'settings-standard' | 'settings-stats' | 'settings-presets';

export default function JsonValidatorPage() {
  const {
    input,
    result,
    autoFixResult,
    settings,
    setInput,
    validate,
    autoFix,
    applyAutoFix,
    updateSettings,
    clear,
    formatInput,
  } = useJsonValidatorStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-options');
  const [showHelp, setShowHelp] = useState(false);
  const [showAutoFixPreview, setShowAutoFixPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [output, setOutput] = useState('');

  // Layout and resizer hooks
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });

  // Tab management
  const {
    tabs,
    activeTabId,
    addTab,
    closeTab,
    renameTab,
    switchTab,
    duplicateTab,
    closeOtherTabs,
    closeAllTabs,
    maxTabs,
    canAddTab,
  } = useTabs({ toolName: 'JSON Validator', storageKey: 'json-validator-tabs' });

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  // Initial validation
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update output when result changes
  useEffect(() => {
    if (result?.isValid && input) {
      // Show formatted JSON as output
      try {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } catch {
        setOutput('');
      }
    } else {
      setOutput('');
    }
  }, [result, input]);

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
    setOutput('');
  }, [clear]);

  // Handle format
  const handleFormat = useCallback(() => {
    formatInput();
  }, [formatInput]);

  // Handle copy output
  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await copyToClipboard(output);
    } catch {
      // Copy failed
    }
  }, [output]);

  // Handle download output
  const handleDownload = useCallback(() => {
    if (!output) return;
    downloadTextFile(output, 'validated.json', 'application/json');
  }, [output]);

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyPreset(settings, presetId);
    updateSettings(newSettings);
    // Re-validate with new settings
    setTimeout(() => validate(), 100);
  };

  // Handle auto-fix
  const handleAutoFix = () => {
    const fixResult = autoFix();
    if (fixResult.success) {
      setShowAutoFixPreview(true);
    }
  };

  // Handle apply auto-fix
  const handleApplyFix = () => {
    applyAutoFix();
    setShowAutoFixPreview(false);
  };

  // Calculate status
  const isValid = result?.isValid ?? false;
  const errorCount = result?.errors.length ?? 0;
  const warningCount = result?.warnings.length ?? 0;
  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;
  const hasFixableErrors = result?.errors.some(e => e.fixable) ?? false;

  // Validation state for stats bar
  const validationState = useMemo(() => ({
    isValid,
    errorCount,
    warningCount,
  }), [isValid, errorCount, warningCount]);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-options' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-standard' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-standard')}
        >
          <i className="fas fa-gavel"></i> Standard
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-stats' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-stats')}
        >
          <i className="fas fa-chart-bar"></i> Stats
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-options' && (
          <ValidatorOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-standard' && (
          <ValidatorStandardPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-stats' && (
          <ValidatorStatsPanel stats={result?.stats ?? null} />
        )}
        {settingsTabId === 'settings-presets' && (
          <ValidatorPresetsPanel
            presets={VALIDATOR_PRESETS}
            onApplyPreset={handleApplyPreset}
          />
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
            name: 'JSON Validator',
            description: jsonValidatorSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'JSON syntax validation',
              'RFC 8259 compliance',
              'Detailed error messages',
              'Auto-fix common errors',
              'JSON statistics',
              'Multiple validation modes',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON Validator"
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

        {/* Validation Status Banner */}
        <div className={`validation-status ${isValid ? 'status-valid' : 'status-invalid'}`}>
          {isValid ? (
            <>
              <i className="fas fa-check-circle"></i>
              <span>Valid JSON</span>
              {result?.validationTime && (
                <span className="validation-time">({result.validationTime.toFixed(1)}ms)</span>
              )}
            </>
          ) : (
            <>
              <i className="fas fa-exclamation-circle"></i>
              <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
              {hasWarnings && <span> • {warningCount} warning{warningCount !== 1 ? 's' : ''}</span>}
              {hasFixableErrors && (
                <button className="btn btn-sm btn-warning" onClick={handleAutoFix}>
                  <i className="fas fa-magic"></i> Auto-Fix
                </button>
              )}
            </>
          )}
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
              onAutoCorrect={handleFormat}
              sampleTemplates={jsonValidatorSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here to validate..."
              emptyStateTitle="Welcome to JSON Validator"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonValidatorSamples.length > 0) {
                  setInput(jsonValidatorSamples[0].content);
                }
              }}
            />
            {/* Errors Display */}
            {hasErrors && (
              <div className="editor-errors">
                {result?.errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>Line {error.line}, Col {error.column}: {error.message}</span>
                  </div>
                ))}
              </div>
            )}
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
              label="Validated Output"
              icon="fa-check-circle"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            >
              {hasFixableErrors && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleAutoFix}
                  title="Attempt to fix common errors"
                >
                  <i className="fas fa-magic"></i>
                  <span className="btn-text">Auto-Fix</span>
                </button>
              )}
            </OutputToolbar>
            <MonacoEditorPanel
              value={output}
              language="json"
              editorSide="right"
              readOnly
              placeholder="Formatted JSON will appear here after validation..."
              emptyStateTitle="Validation Output"
              emptyStateInstructions={[
                'Valid JSON will be formatted and displayed here',
                'Enter JSON in the input panel to validate',
              ]}
            />
            {/* Warnings Display */}
            {hasWarnings && (
              <div className="editor-warnings">
                {result?.warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Line {warning.line}, Col {warning.column}: {warning.message}</span>
                  </div>
                ))}
              </div>
            )}
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonValidatorSEO.heroTitle}
            subtitle={jsonValidatorSEO.heroSubtitle}
            features={jsonValidatorSEO.features}
            howToSteps={jsonValidatorSEO.howToSteps}
            educationalContent={jsonValidatorSEO.educationalContent}
            useCases={jsonValidatorSEO.useCases}
            technicalSpecs={jsonValidatorSEO.technicalSpecs}
            faqs={jsonValidatorSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON Validator"
        sections={jsonValidatorHelp}
      />

      {/* Auto-Fix Preview Modal */}
      {showAutoFixPreview && autoFixResult && (
        <div className="modal-overlay" onClick={() => setShowAutoFixPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-magic"></i> Auto-Fix Preview</h3>
              <button className="modal-close" onClick={() => setShowAutoFixPreview(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {autoFixResult.success ? (
                <>
                  <p className="fix-summary">
                    <i className="fas fa-check-circle text-success"></i>
                    {autoFixResult.changes.length} fix{autoFixResult.changes.length !== 1 ? 'es' : ''} applied
                  </p>
                  <div className="fix-changes">
                    {autoFixResult.changes.map((change, index) => (
                      <div key={index} className="fix-change-item">
                        <span className="change-location">Line {change.line}</span>
                        <span className="change-type">{change.type}</span>
                        <span className="change-description">{change.description}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="fix-failure">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                  Could not fully fix all errors. {autoFixResult.remainingErrors} error(s) remain.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAutoFixPreview(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleApplyFix}>
                <i className="fas fa-check"></i> Apply Fixes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Validation Status Banner */
        .validation-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          font-weight: 500;
          background: var(--elevated);
        }
        
        .status-valid {
          color: var(--success);
        }
        
        .status-invalid {
          color: var(--danger);
        }
        
        .validation-time {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-left: auto;
        }

        .validation-status .btn {
          margin-left: auto;
        }

        /* Ensure ide-pane uses flex column layout */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          min-height: 0 !important;
        }
        
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
        
        .ide-pane :global(.editor-errors),
        .ide-pane :global(.editor-warnings) {
          order: 998 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.stats-bar) {
          order: 999 !important;
          flex-shrink: 0 !important;
        }

        /* Error/Warning Panels */
        :global(.editor-errors),
        :global(.editor-warnings) {
          padding: 0.5rem 0.75rem;
          background: var(--elevated);
          border-top: 1px solid var(--border);
          max-height: 150px;
          overflow-y: auto;
        }

        :global(.editor-errors) {
          background: rgba(248, 81, 73, 0.1);
          border-top-color: rgba(248, 81, 73, 0.3);
        }

        :global(.editor-warnings) {
          background: rgba(245, 158, 11, 0.1);
          border-top-color: rgba(245, 158, 11, 0.3);
        }

        :global(.error-item),
        :global(.warning-item) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          padding: 0.25rem 0;
        }

        :global(.error-item) {
          color: var(--danger);
        }

        :global(.warning-item) {
          color: var(--warning);
        }

        :global(.error-item i),
        :global(.warning-item i) {
          flex-shrink: 0;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: var(--card);
          border-radius: 12px;
          border: 1px solid var(--border);
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text);
        }
        
        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: var(--text);
        }
        
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
        }
        
        .fix-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .fix-changes {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .fix-change-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
        
        .change-location {
          color: var(--text-secondary);
          min-width: 60px;
          font-family: var(--font-mono);
        }
        
        .change-type {
          color: var(--primary);
          min-width: 100px;
          font-weight: 500;
        }
        
        .text-success {
          color: var(--success);
        }
        
        .text-warning {
          color: var(--warning);
        }

        .fix-failure {
          color: var(--warning);
        }
      `}</style>
    </>
  );
}
