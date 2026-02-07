'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
import { jsonToExcelContent } from '@/data/json-to-excel-seo';
import { jsonToExcelHelp } from '@/data/json-to-excel-help';
import { JSON_TO_EXCEL_SAMPLES } from '@/data/json-to-excel-samples';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { useJsonExcelStore } from '@/store/jsonExcel';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useJSONValidation } from '@/hooks/useJSONValidation';
import { readFileAsText } from '@/lib/fileUtils';
import { event as trackEvent } from '@/lib/analytics';

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
  ExcelOptionsPanel,
  ColumnManagerPanel,
  PreviewTable,
  ExportSummary,
} from '@/components/tools/json-to-excel';

export default function JsonToExcelPage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('settings-options');
  
  const {
    parseError,
    preview,
    structure,
    columns,
    settings,
    isExporting,
    lastExportResult,
    setInput,
    clearInput,
    toggleColumn,
    renameColumn: renameCol,
    reorderColumn,
    selectAll,
    deselectAll,
    updateSettings,
    exportExcel,
  } = useJsonExcelStore();

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
  } = useTabs({ toolName: 'JSON to Excel', storageKey: 'excel-tabs' });

  const [input, setInputLocal] = useState(activeTab?.inputJSON || '');
  const isTabSyncingRef = useRef(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);

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

  // Load tab data when switching to a different tab
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInputLocal(activeTab.inputJSON || '');
      const timer = setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, activeTab]);

  // Save current tab state when input changes (skip during tab sync)
  useEffect(() => {
    if (isTabSyncingRef.current) {
      return;
    }
    if (activeTab && activeTabId) {
      if (activeTab.inputJSON !== input) {
        updateTab(activeTabId, {
          inputJSON: input,
        });
      }
    }
  }, [input, activeTabId, activeTab, updateTab]);

  // Update store when local input changes (skip during tab sync)
  useEffect(() => {
    if (!isTabSyncingRef.current && input !== undefined) {
      setInput(input);
    }
  }, [input, setInput]);

  // Check if export is possible
  const canExport = useMemo(() => {
    return preview !== null && 
           preview.rows.length > 0 && 
           columns.some(col => col.visible) && 
           !isExporting;
  }, [preview, columns, isExporting]);

  // Handle file upload
  const handleUpload = useCallback(async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.txt';
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const content = await readFileAsText(file);
        setInputLocal(content);
        toast.success(`Loaded ${file.name}`);
        trackEvent('json_to_excel_file_upload', 'json_to_excel', 'file_upload');
      } catch {
        toast.error('Failed to read file');
      }
    };
    
    fileInput.click();
  }, [toast]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputLocal(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to read clipboard');
    }
  }, [toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    clearInput();
    toast.success('Cleared');
  }, [clearInput, toast]);

  // Handle export
  const handleExport = useCallback(async () => {
    const result = await exportExcel();
    if (result.success) {
      toast.success(`Downloaded ${result.filename}`);
      trackEvent('json_to_excel_export', 'json_to_excel', settings.format);
    } else {
      toast.error(result.error || 'Export failed');
    }
  }, [exportExcel, toast, settings.format]);

  // Handle load sample template
  const handleLoadSample = useCallback((sampleTemplate: { name: string; description: string; content: string }) => {
    const template = JSON_TO_EXCEL_SAMPLES.find(t => t.name === sampleTemplate.name);
    if (!template) return;
    
    setInputLocal(template.content);
    toast.success(`Loaded sample: ${template.name}`);
    trackEvent('json_to_excel_load_template', 'json_to_excel', template.id);
  }, [toast]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      try {
        const content = await readFileAsText(files[0]);
        setInputLocal(content);
        toast.success(`Loaded ${files[0].name}`);
      } catch {
        toast.error('Failed to read file');
      }
    }
  };

  // Generate JSON-LD schema
  const schemas = useMemo(() => generateAllSchemas(
    jsonToExcelContent.faqs,
    jsonToExcelContent.howToSteps,
    {
      toolName: 'JSON to Excel Converter',
      toolUrl: 'json-to-excel',
      description: jsonToExcelContent.description,
      featureList: jsonToExcelContent.features.map(f => f.title),
      howToTitle: jsonToExcelContent.howToSectionTitle,
      howToDescription: 'Step-by-step guide to convert JSON to Excel',
    }
  ), []);

  // Sample templates for dropdown
  const sampleOptions = useMemo(() => 
    JSON_TO_EXCEL_SAMPLES.map(t => ({
      name: t.name,
      description: t.description,
      content: t.content,
    })),
  []);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-options' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-cog"></i> Options
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-columns' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-columns')}
        >
          <i className="fas fa-columns"></i> Columns
        </button>
      </div>
      
      <div className="sidebar-content">
        {settingsTabId === 'settings-options' && (
          <ExcelOptionsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
        {settingsTabId === 'settings-columns' && (
          <ColumnManagerPanel
            columns={columns}
            onToggleColumn={toggleColumn}
            onRenameColumn={renameCol}
            onReorderColumn={reorderColumn}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
          />
        )}
      </div>
      
      {/* Export Summary */}
      <div className="export-section">
        <ExportSummary
          structure={structure}
          columns={columns}
          lastExportResult={lastExportResult}
          onExport={handleExport}
          isExporting={isExporting}
          canExport={canExport}
        />
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      
      <IDELayout
        toolName="JSON to Excel"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {/* Conversion Session Tabs */}
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
          onTabRename={renameTab}
          onAddTab={addTab}
          onDuplicateTab={duplicateTab}
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
              onChange={(value) => {
                const newValue = value || '';
                setInputLocal(newValue);
                if (!isTabSyncingRef.current) {
                  setInput(newValue);
                }
              }}
              language="json"
              editorSide="left"
              readOnly={false}
              placeholder="Paste your JSON here or upload a file..."
              emptyStateTitle="Welcome to JSON to Excel Converter"
              emptyStateInstructions={[
                'Pasting JSON array data',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (JSON_TO_EXCEL_SAMPLES.length > 0) {
                  const sampleContent = JSON_TO_EXCEL_SAMPLES[0].content;
                  setInputLocal(sampleContent);
                  if (!isTabSyncingRef.current) {
                    setInput(sampleContent);
                  }
                }
              }}
              validationErrors={parseError ? [{ line: 1, column: 1, message: parseError, severity: 'error' as const }] : validationErrors}
            />
            {parseError && (
              <div className="editor-errors">
                <div className="error-item">
                  <i className="fas fa-exclamation-circle"></i>
                  {parseError}
                </div>
              </div>
            )}
            <StatsBar text={input} validationState={validationState} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Right Panel - Preview */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="Excel Preview"
            >
              {canExport && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleExport}
                  disabled={!canExport}
                >
                  <i className="fas fa-download"></i>
                  <span className="btn-text">Download {settings.format.toUpperCase()}</span>
                </button>
              )}
            </OutputToolbar>
            <div className="preview-wrapper">
              <PreviewTable
                preview={preview}
                columns={columns}
              />
            </div>
            <StatsBar text={preview ? JSON.stringify(preview.rows) : ''} />
          </div>
        </div>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON to Excel"
        sections={jsonToExcelHelp}
      />

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonToExcelContent.title}
          subtitle={jsonToExcelContent.subtitle}
          trustBadges={jsonToExcelContent.trustBadges}
          features={jsonToExcelContent.features}
          howToSteps={jsonToExcelContent.howToSteps}
          howToSectionTitle={jsonToExcelContent.howToSectionTitle}
          featuresSectionTitle={jsonToExcelContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonToExcelContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonToExcelContent.comparisonSectionTitle}
          educationalContent={jsonToExcelContent.educational}
          useCases={jsonToExcelContent.useCases}
          whyChoose={jsonToExcelContent.whyChoose}
          technicalSpecs={jsonToExcelContent.technicalSpecs}
          comparison={jsonToExcelContent.comparison}
          faqs={jsonToExcelContent.faqs}
          relatedTools={jsonToExcelContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .preview-wrapper {
          flex: 1 1 0;
          min-height: 0;
          overflow: auto;
          position: relative;
          order: 2;
          background: var(--bg);
        }
        
        .export-section {
          margin-top: auto;
          padding: 1rem;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
