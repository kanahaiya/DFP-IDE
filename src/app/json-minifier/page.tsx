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
import { jsonMinifierContent } from '@/data/json-minifier-seo';
import { jsonMinifierHelp } from '@/data/json-minifier-help';
import { JSON_MINIFIER_SAMPLES } from '@/data/json-minifier-samples';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { useJsonMinifierStore } from '@/store/jsonMinifier';
import { processJSON, tryAutoFix } from '@/lib/minifier';
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
import { MinifierFormatPanel } from '@/components/tools/json-minifier/MinifierFormatPanel';
import { MinifierOptionsPanel } from '@/components/tools/json-minifier/MinifierOptionsPanel';
import { MinifierPresetsPanel } from '@/components/tools/json-minifier/MinifierPresetsPanel';

export default function JsonMinifierPage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('settings-format');
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    input,
    output,
    settings,
    errors,
    isProcessing,
    setInput,
    setResult,
    updateSettings,
    applyPreset,
    toggleMode,
    clearInput,
    setIsProcessing,
  } = useJsonMinifierStore();
  
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
  } = useTabs({ toolName: 'JSON Minifier', storageKey: 'json-minifier-tabs' });

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
      setResult(null);
      return;
    }

    setIsProcessing(true);
    
    const timer = setTimeout(() => {
      const result = processJSON(input, settings);
      setResult(result);
      setIsProcessing(false);
      
      if (result.success) {
        trackEvent('json_minifier_process', 'json_minifier', settings.mode);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [input, settings, setResult, setIsProcessing]);

  // Handle file upload
  const handleUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
      toast.success(`Loaded ${file.name}`);
      trackEvent('json_minifier_file_upload', 'json_minifier', 'file_upload');
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
      trackEvent('json_minifier_copy', 'json_minifier', 'copy');
    } catch {
      toast.error('Failed to copy');
    }
  }, [output, toast]);

  // Handle download with proper file utils
  const handleDownloadFile = useCallback(() => {
    if (!output) return;
    const filename = settings.mode === 'minify' ? 'minified.json' : 'beautified.json';
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
    trackEvent('json_minifier_download', 'json_minifier', settings.mode);
  }, [output, settings.mode, toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    clearInput();
    toast.success('Cleared');
  }, [clearInput, toast]);

  // Handle auto-fix
  const handleAutoFix = useCallback(() => {
    if (!input) return;
    
    const { fixed, changes } = tryAutoFix(input);
    if (changes.length > 0) {
      setInput(fixed);
      toast.success(`Auto-fixed: ${changes.join(', ')}`);
      trackEvent('json_minifier_autofix', 'json_minifier', 'autofix');
    } else {
      toast.info('No common issues found to fix');
    }
  }, [input, setInput, toast]);

  // Handle load sample template
  const handleLoadSample = useCallback((sampleTemplate: { name: string; description: string; content: string }) => {
    const template = JSON_MINIFIER_SAMPLES.find(t => t.name === sampleTemplate.name);
    if (!template) return;
    
    setInput(template.content);
    toast.success(`Loaded sample: ${template.name}`);
    trackEvent('json_minifier_load_template', 'json_minifier', template.id);
  }, [setInput, toast]);

  // Generate JSON-LD schema
  const schemas = useMemo(() => generateAllSchemas(
    jsonMinifierContent.faqs,
    jsonMinifierContent.howToSteps,
    {
      toolName: 'JSON Minifier Tool',
      toolUrl: 'json-minifier',
      description: jsonMinifierContent.description,
      featureList: jsonMinifierContent.features.map(f => f.title),
      howToTitle: jsonMinifierContent.howToSectionTitle,
      howToDescription: 'Step-by-step guide to minify JSON online',
    }
  ), []);

  // Sample templates for dropdown
  const sampleOptions = useMemo(() => 
    JSON_MINIFIER_SAMPLES.map(t => ({
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
          <i className="fas fa-text-height"></i> Format
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-options' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-options')}
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
          <MinifierFormatPanel
            settings={settings}
            onUpdateSettings={updateSettings}
            onToggleMode={toggleMode}
          />
        )}
        {settingsTabId === 'settings-options' && (
          <MinifierOptionsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <MinifierPresetsPanel
            onApplyPreset={applyPreset}
            currentMode={settings.mode}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      
      <IDELayout
        toolName="JSON Minifier"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        <div className="json-minifier-tab-scope">
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
              emptyStateTitle="Welcome to JSON Minifier"
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
                  <span>{errors[0].message}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleAutoFix}
                    title="Try to auto-fix common errors"
                  >
                    <i className="fas fa-wrench"></i>
                    <span className="btn-text">Auto-Fix</span>
                  </button>
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
              label={settings.mode === 'minify' ? 'Minified Output' : 'Beautified Output'}
              icon={settings.mode === 'minify' ? 'fa-compress-arrows-alt' : 'fa-expand'}
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownloadFile : undefined}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={toggleMode}
                title={`Switch to ${settings.mode === 'minify' ? 'Beautify' : 'Minify'}`}
              >
                <i className="fas fa-exchange-alt"></i>
                <span className="btn-text">Switch Mode</span>
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
                placeholder={`${settings.mode === 'minify' ? 'Minified' : 'Beautified'} JSON will appear here...`}
                emptyStateTitle={`${settings.mode === 'minify' ? 'Minified' : 'Beautified'} JSON Output`}
                emptyStateInstructions={[
                  `${settings.mode === 'minify' ? 'Minified' : 'Beautified'} JSON will appear here`,
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
        toolName="JSON Minifier"
        sections={jsonMinifierHelp}
      />

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonMinifierContent.title}
          subtitle={jsonMinifierContent.subtitle}
          trustBadges={jsonMinifierContent.trustBadges}
          features={jsonMinifierContent.features}
          howToSteps={jsonMinifierContent.howToSteps}
          howToSectionTitle={jsonMinifierContent.howToSectionTitle}
          featuresSectionTitle={jsonMinifierContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonMinifierContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonMinifierContent.comparisonSectionTitle}
          educationalContent={jsonMinifierContent.educational}
          useCases={jsonMinifierContent.useCases}
          whyChoose={jsonMinifierContent.whyChoose}
          technicalSpecs={jsonMinifierContent.technicalSpecs}
          comparison={jsonMinifierContent.comparison}
          faqs={jsonMinifierContent.faqs}
          relatedTools={jsonMinifierContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        :global(.json-minifier-tab-scope .tab-manager .tab),
        :global(.json-minifier-tab-scope .tab-manager .tab-add) {
          border-radius: 0 !important;
        }

        /* Ensure ide-pane fills full height and stats bar appears at bottom */
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
        
        .analyzing-overlay {
          order: 2 !important;
          flex: 1 1 0 !important;
          min-height: 0 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-secondary);
        }
        
        .ide-pane :global(.editor-errors) {
          order: 998 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.stats-bar) {
          order: 999 !important;
          flex-shrink: 0 !important;
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
      `}</style>
    </>
  );
}
