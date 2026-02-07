'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { useToast } from '@/store/toast';
import { Footer } from '@/components/layout/Footer';
import { HelpModal } from '@/components/common/HelpModal';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { jsonFormatterContent } from '@/data/json-formatter-seo';
import { jsonFormatterHelp } from '@/data/json-formatter-help';
import { JSON_FORMATTER_SAMPLES } from '@/data/json-formatter-samples';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { useJsonFormatterStore } from '@/store/jsonFormatter';
import { readFileAsText } from '@/lib/fileUtils';
import { event as trackEvent } from '@/lib/analytics';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import { useJSONValidation } from '@/hooks/useJSONValidation';

// Dynamic imports for heavy components
const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then(mod => ({ default: mod.MonacoEditorPanel })),
  { 
    ssr: false,
    loading: () => <div className="editor-loading-skeleton"><div className="skeleton-shimmer" /></div>
  }
);

// Import UI components
import {
  FormatterOptionsPanel,
  CleanOptionsPanel,
  FormatterPresetsPanel,
  ValidationPanel,
} from '@/components/tools/json-formatter';

export default function JsonFormatterPage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('settings-format');
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    input,
    output,
    settings,
    errors,
    isValid,
    isProcessing,
    setInput,
    updateSettings,
    applyPreset,
    format,
    minify,
    updateTree,
    clearInput,
  } = useJsonFormatterStore();
  
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
  } = useTabs({ toolName: 'JSON Formatter', storageKey: 'json-formatter-tabs' });

  const isTabSyncingRef = useRef(false);

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);
  
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

  useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setInput(activeTab.inputJSON || '');
    const timer = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTabId, activeTab, setInput]);

  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) return;
    updateTab(activeTabId, {
      inputJSON: input,
      outputJSON: output,
    });
  }, [activeTabId, input, output, updateTab]);

  // Process JSON when input or settings change (debounced)
  useEffect(() => {
    if (!input.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      format();
      if (settings.viewMode === 'tree' || settings.viewMode === 'split') {
        updateTree();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [input, settings, format, updateTree]);

  // Handle file upload
  const handleUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
      toast.success(`Loaded ${file.name}`);
      trackEvent('json_formatter_file_upload', 'json_formatter', 'file_upload');
    } catch {
      toast.error('Failed to read file');
    }
  }, [setInput, toast]);
  
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
        toast.success(`Loaded ${files[0].name}`);
      } catch {
        toast.error('Failed to read file');
      }
    }
  }, [setInput, toast]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to read clipboard');
    }
  }, [setInput, toast]);

  // Handle copy output
  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.error('Nothing to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard');
      trackEvent('json_formatter_copy', 'json_formatter', 'copy');
    } catch {
      toast.error('Failed to copy');
    }
  }, [output, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) {
      toast.error('Nothing to download');
      return;
    }
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Downloaded formatted.json');
    trackEvent('json_formatter_download', 'json_formatter', 'download');
  }, [output, toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    clearInput();
    toast.success('Cleared');
  }, [clearInput, toast]);

  // Handle minify
  const handleMinify = useCallback(() => {
    minify();
    trackEvent('json_formatter_minify', 'json_formatter', 'minify');
  }, [minify]);

  // Handle load sample template
  const handleLoadSample = useCallback((sampleTemplate: { name: string; description: string; content: string }) => {
    const template = JSON_FORMATTER_SAMPLES.find(t => t.name === sampleTemplate.name);
    if (!template) return;
    
    setInput(template.content);
    toast.success(`Loaded sample: ${template.name}`);
    trackEvent('json_formatter_load_template', 'json_formatter', template.id);
  }, [setInput, toast]);

  // Generate JSON-LD schema
  const schemas = useMemo(() => generateAllSchemas(
    jsonFormatterContent.faqs,
    jsonFormatterContent.howToSteps,
    {
      toolName: 'JSON Formatter Tool',
      toolUrl: 'json-formatter',
      description: jsonFormatterContent.description,
      featureList: jsonFormatterContent.features.map(f => f.title),
      howToTitle: jsonFormatterContent.howToSectionTitle,
      howToDescription: 'Step-by-step guide to format JSON online',
    }
  ), []);

  // Sample templates for dropdown
  const sampleOptions = useMemo(() => 
    JSON_FORMATTER_SAMPLES.map(t => ({
      name: t.name,
      description: t.description,
      content: t.content,
    })),
  []);


  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-panel">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-format' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-format')}
        >
          <i className="fas fa-indent"></i> Format
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-clean' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-clean')}
        >
          <i className="fas fa-broom"></i> Clean
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      
      <div className="sidebar-content">
        {settingsTabId === 'settings-format' && (
          <FormatterOptionsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
        {settingsTabId === 'settings-clean' && (
          <CleanOptionsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <FormatterPresetsPanel
            onApplyPreset={applyPreset}
          />
        )}
      </div>
      
      {/* Validation Status */}
      <div className="validation-section">
        <ValidationPanel
          isValid={isValid}
          errors={errors}
        />
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      
      <IDELayout
        toolName="JSON Formatter"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
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
              sampleTemplates={sampleOptions}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={(value) => setInput(value || '')}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here or upload a file..."
              emptyStateTitle="Welcome to JSON Formatter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (sampleOptions.length > 0) {
                  setInput(sampleOptions[0].content);
                }
              }}
              validationErrors={validationErrors}
            />
            {errors.length > 0 && (
              <div className="editor-errors">
                <div className="error-item">
                  <i className="fas fa-exclamation-triangle"></i>
                  {errors[0].message}
                </div>
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
              label="Formatted Output"
              icon="fa-check-circle"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleMinify}
                disabled={!output}
                title="Minify JSON"
              >
                <i className="fas fa-compress-arrows-alt"></i>
                <span className="btn-text">Minify</span>
              </button>
            </OutputToolbar>
            {isProcessing ? (
              <div className="analyzing-overlay">
                <div className="spinner"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <MonacoEditorPanel
                value={output}
                language="json"
                editorSide="right"
                readOnly
                placeholder="Formatted JSON will appear here..."
                emptyStateTitle="Formatted JSON Output"
                emptyStateInstructions={[
                  'Formatted JSON will appear here',
                  'Use the input panel to paste your JSON',
                ]}
              />
            )}
            <StatsBar text={output} />
          </div>
        </div>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON Formatter"
        sections={jsonFormatterHelp}
      />

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonFormatterContent.title}
          subtitle={jsonFormatterContent.subtitle}
          trustBadges={jsonFormatterContent.trustBadges}
          features={jsonFormatterContent.features}
          howToSteps={jsonFormatterContent.howToSteps}
          howToSectionTitle={jsonFormatterContent.howToSectionTitle}
          featuresSectionTitle={jsonFormatterContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonFormatterContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonFormatterContent.comparisonSectionTitle}
          educationalContent={jsonFormatterContent.educational}
          useCases={jsonFormatterContent.useCases}
          whyChoose={jsonFormatterContent.whyChoose}
          technicalSpecs={jsonFormatterContent.technicalSpecs}
          comparison={jsonFormatterContent.comparison}
          faqs={jsonFormatterContent.faqs}
          relatedTools={jsonFormatterContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        /* Ensure ide-pane uses flex column layout and fills full height */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          min-height: 0 !important;
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
        }
        
        .analyzing-overlay {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-secondary);
          min-height: 200px;
        }
        
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .settings-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .validation-section {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </>
  );
}
