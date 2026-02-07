'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { EscaperModePanel } from '@/components/tools/json-escaper/EscaperModePanel';
import { EscaperOptionsPanel } from '@/components/tools/json-escaper/EscaperOptionsPanel';
import { EscaperAdvancedPanel } from '@/components/tools/json-escaper/EscaperAdvancedPanel';
import { EscaperPresetsPanel } from '@/components/tools/json-escaper/EscaperPresetsPanel';
import { useEscaperStore } from '@/store/escaper';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { escapeJSON, type EscaperSettings } from '@/lib/escaper/converter';
import { validateInput } from '@/lib/escaper/validator';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { ESCAPER_SAMPLES } from '@/data/json-escaper-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonEscaperHelpSections } from '@/data/json-escaper-help';
import { jsonEscaperContent } from '@/data/json-escaper-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function JSONEscaperPage() {
  const { settings: globalSettings, updateSettings } = useEscaperStore();
  const toast = useToast();
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
  } = useTabs({ toolName: 'JSON Escaper', storageKey: 'escaper-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-mode');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string; severity: 'error' | 'warning' }>>([]);
  const [, setStats] = useState<{ inputLength: number; outputLength: number; escapedChars: number } | null>(null);
  
  // Use global settings directly
  const settings = globalSettings;
  
  // Refs to track syncing
  const isTabSyncingRef = useRef(false);
  
  // Sync global settings to active tab
  useEffect(() => {
    if (activeTabId && !isTabSyncingRef.current) {
      updateTab(activeTabId, {
        settings: globalSettings as unknown as Record<string, unknown>,
      });
    }
  }, [activeTabId, globalSettings, updateTab]);
  
  // Load tab content
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInputText(activeTab.inputJSON || '');
      setOutputText(activeTab.outputJSON || '');
      if (activeTab.settings) {
        updateSettings(activeTab.settings as unknown as Partial<EscaperSettings>);
      }
      setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 100);
    }
  }, [activeTabId, activeTab, updateSettings]);
  
  // Save tab content (debounced)
  useEffect(() => {
    if (activeTabId && !isTabSyncingRef.current) {
      const timer = setTimeout(() => {
        updateTab(activeTabId, {
          inputJSON: inputText,
          outputJSON: outputText,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, inputText, outputText, updateTab]);
  
  // Perform escaping
  const performEscaping = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      setErrors([]);
      setStats(null);
      return;
    }
    
    // Validate input
    const validation = validateInput(inputText);
    const warningErrors = validation.warnings.map(w => ({
      line: w.line,
      column: w.column,
      message: w.message,
      severity: 'warning' as const,
    }));
    
    setErrors(warningErrors);
    
    // Escape
    const result = escapeJSON(inputText, settings);
    
    if (result.success) {
      setOutputText(result.output);
      setStats({
        inputLength: result.stats.inputLength,
        outputLength: result.stats.outputLength,
        escapedChars: result.stats.escapedChars,
      });
      trackEvent('escape', 'json_escaper', settings.escapeMode);
    } else {
      setOutputText('');
      setErrors([{ line: 1, column: 1, message: result.error, severity: 'error' }]);
      setStats(null);
    }
  }, [inputText, settings]);
  
  // Debounced escaping
  useEffect(() => {
    const timer = setTimeout(() => {
      performEscaping();
    }, 300);
    return () => clearTimeout(timer);
  }, [performEscaping]);
  
  // Handlers
  const handleUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setInputText(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_escaper', file.type);
    } catch (error) {
      toast.error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [toast]);
  
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  }, [toast]);
  
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setErrors([]);
    setStats(null);
    toast.info('Input cleared');
  }, [toast]);
  
  const handleAutoCorrect = useCallback(() => {
    const result = autoCorrectJSON(inputText);
    if (result.success) {
      setInputText(result.output);
      toast.success('Input fixed and formatted!');
    } else if (result.error) {
      toast.error(result.error);
    } else {
      toast.info('No corrections needed');
    }
  }, [inputText, toast]);
  
  const handleCopy = useCallback(async () => {
    if (!outputText) {
      toast.error('No output to copy');
      return;
    }
    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard');
      trackCopy('json_escaper');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);
  
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.error('No output to download');
      return;
    }
    const filename = `escaped_${settings.escapeMode}_${getTimestamp()}.txt`;
    downloadTextFile(outputText, filename);
    toast.success(`Downloaded ${filename}`);
    trackDownload('txt');
  }, [outputText, settings.escapeMode, toast]);
  
  const handleLoadSample = useCallback((sample: { name: string; content: string }) => {
    setInputText(sample.content);
    toast.info(`Loaded "${sample.name}" sample`);
  }, [toast]);
  
  // Drag and drop
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
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleUpload(file);
    }
  }, [handleUpload]);
  
  // Wrapper for addTab
  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);
  
  // Validation state for stats bar
  const validationState = {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errorCount: errors.filter(e => e.severity === 'error').length,
    warningCount: errors.filter(e => e.severity === 'warning').length,
  };
  
  // Settings sidebar
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-mode' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-mode')}
        >
          <i className="fas fa-shield-alt"></i> Mode
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-options' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-advanced' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-advanced')}
        >
          <i className="fas fa-cog"></i> Advanced
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      
      <div className="settings-content">
        {settingsTabId === 'settings-mode' && <EscaperModePanel />}
        {settingsTabId === 'settings-options' && <EscaperOptionsPanel />}
        {settingsTabId === 'settings-advanced' && <EscaperAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <EscaperPresetsPanel />}
      </div>
    </div>
  );
  
  // Main content
  const mainContent = (
    <>
      <TabManager
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={switchTab}
        onTabClose={closeTab}
        onTabRename={renameTab}
        onAddTab={handleAddTab}
        onDuplicateTab={duplicateTab}
        onCloseOtherTabs={closeOtherTabs}
        onCloseAllTabs={closeAllTabs}
        canAddTab={canAddTab}
        maxTabs={maxTabs}
      />
      
      <div
        ref={containerRef}
        className={`ide-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
      >
        <div
          className={`ide-pane ${isDragging ? 'drag-over' : ''}`}
          style={{
            [layout === 'vertical' ? 'height' : 'width']: `${size}%`,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EditorToolbar
            label="Input (JSON or Text)"
            onUpload={handleUpload}
            onPaste={handlePaste}
            onClear={handleClear}
            onAutoCorrect={handleAutoCorrect}
            sampleTemplates={ESCAPER_SAMPLES}
            onLoadTemplate={handleLoadSample}
          />
          <MonacoEditorPanel
            value={inputText}
            onChange={setInputText}
            language="json"
            readOnly={false}
            editorSide="left"
            validationErrors={errors}
          />
          <StatsBar text={inputText} validationState={validationState} />
        </div>
        
        <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>
        
        <div
          className="ide-pane"
          style={{
            [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`,
          }}
        >
          <OutputToolbar
            label={`Escaped Output (${settings.escapeMode})`}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
          <MonacoEditorPanel
            value={outputText}
            language="plaintext"
            readOnly={true}
            editorSide="right"
          />
          <StatsBar text={outputText} />
        </div>
      </div>
    </>
  );
  
  return (
    <>
      <IDELayout
        toolName="JSON Escaper"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonEscaperContent.title}
          subtitle={jsonEscaperContent.subtitle}
          trustBadges={jsonEscaperContent.trustBadges}
          features={jsonEscaperContent.features}
          howToSteps={jsonEscaperContent.howToSteps}
          faqs={jsonEscaperContent.faqs}
          technicalSpecs={jsonEscaperContent.technicalSpecs}
          useCases={jsonEscaperContent.useCases}
          whyChoose={jsonEscaperContent.whyChoose}
          comparison={jsonEscaperContent.comparisonTable?.rows}
          relatedTools={jsonEscaperContent.relatedTools}
          howToSectionTitle={jsonEscaperContent.howToSectionTitle}
          featuresSectionTitle={jsonEscaperContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonEscaperContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonEscaperContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD */}
      <JsonLd data={generateAllSchemas(
        jsonEscaperContent.faqs || [],
        jsonEscaperContent.howToSteps || [],
        {
          toolName: 'JSON Escaper',
          toolUrl: 'json-escaper',
          description: jsonEscaperContent.description || 'Escape JSON strings for JavaScript, HTML, URL, and more',
          featureList: jsonEscaperContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Escape JSON Strings Online',
          howToDescription: 'Learn how to escape JSON strings for various contexts using our free online escaper',
        }
      )} />
      
      <Footer />
      <ShareWidget />
      
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Escaper"
        sections={jsonEscaperHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
