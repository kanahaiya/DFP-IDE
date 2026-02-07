'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { UnescaperModePanel } from '@/components/tools/json-unescaper/UnescaperModePanel';
import { UnescaperOptionsPanel } from '@/components/tools/json-unescaper/UnescaperOptionsPanel';
import { UnescaperAdvancedPanel } from '@/components/tools/json-unescaper/UnescaperAdvancedPanel';
import { UnescaperPresetsPanel } from '@/components/tools/json-unescaper/UnescaperPresetsPanel';
import { useUnescaperStore } from '@/store/unescaper';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { unescapeJSON, getEscapeLevel, type UnescaperSettings } from '@/lib/unescaper/converter';
import { validateInput } from '@/lib/unescaper/validator';
import { UNESCAPER_SAMPLES } from '@/data/json-unescaper-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonUnescaperHelpSections } from '@/data/json-unescaper-help';
import { jsonUnescaperContent } from '@/data/json-unescaper-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function JSONUnescaperPage() {
  const { 
    settings: globalSettings, 
    updateSettings, 
    setUnescapeChain, 
    setIsValidJSON, 
    setEscapeLevel 
  } = useUnescaperStore();
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
  } = useTabs({ toolName: 'JSON Unescaper', storageKey: 'unescaper-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-mode');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string; severity: 'error' | 'warning' }>>([]);
  const [, setStats] = useState<{ inputLength: number; outputLength: number; unescapedLayers: number } | null>(null);
  
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
        updateSettings(activeTab.settings as unknown as Partial<UnescaperSettings>);
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
  
  // Perform unescaping
  const performUnescaping = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      setErrors([]);
      setStats(null);
      setUnescapeChain([]);
      setIsValidJSON(false);
      setEscapeLevel(0);
      return;
    }
    
    // Detect escape level
    const detectedLevel = getEscapeLevel(inputText);
    setEscapeLevel(detectedLevel);
    
    // Validate input
    const validation = validateInput(inputText);
    const warningErrors = validation.warnings.map(w => ({
      line: w.line,
      column: w.column,
      message: w.message,
      severity: 'warning' as const,
    }));
    
    setErrors(warningErrors);
    
    // Unescape
    const result = unescapeJSON(inputText, settings);
    
    if (result.success) {
      setOutputText(result.output);
      setUnescapeChain(result.unescapeChain);
      setIsValidJSON(result.isValidJSON);
      setStats({
        inputLength: result.stats.inputLength,
        outputLength: result.stats.outputLength,
        unescapedLayers: result.stats.unescapedLayers,
      });
      trackEvent('unescape', 'json_unescaper', settings.unescapeMode);
    } else {
      setOutputText('');
      setErrors([{ line: 1, column: 1, message: result.error, severity: 'error' }]);
      setStats(null);
      setUnescapeChain([]);
      setIsValidJSON(false);
    }
  }, [inputText, settings, setUnescapeChain, setIsValidJSON, setEscapeLevel]);
  
  // Debounced unescaping
  useEffect(() => {
    const timer = setTimeout(() => {
      performUnescaping();
    }, 300);
    return () => clearTimeout(timer);
  }, [performUnescaping]);
  
  // Handlers
  const handleUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setInputText(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_unescaper', file.type);
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
    setUnescapeChain([]);
    setIsValidJSON(false);
    setEscapeLevel(0);
    toast.info('Input cleared');
  }, [toast, setUnescapeChain, setIsValidJSON, setEscapeLevel]);
  
  const handleCopy = useCallback(async () => {
    if (!outputText) {
      toast.error('No output to copy');
      return;
    }
    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard');
      trackCopy('json_unescaper');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);
  
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.error('No output to download');
      return;
    }
    const filename = `unescaped_${getTimestamp()}.json`;
    downloadTextFile(outputText, filename);
    toast.success(`Downloaded ${filename}`);
    trackDownload('json');
  }, [outputText, toast]);
  
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
          <i className="fas fa-unlock"></i> Mode
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
        {settingsTabId === 'settings-mode' && <UnescaperModePanel />}
        {settingsTabId === 'settings-options' && <UnescaperOptionsPanel />}
        {settingsTabId === 'settings-advanced' && <UnescaperAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <UnescaperPresetsPanel />}
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
            label="Escaped Input"
            onUpload={handleUpload}
            onPaste={handlePaste}
            onClear={handleClear}
            sampleTemplates={UNESCAPER_SAMPLES}
            onLoadTemplate={handleLoadSample}
          />
          <MonacoEditorPanel
            value={inputText}
            onChange={setInputText}
            language="plaintext"
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
            label={`Unescaped Output (${settings.unescapeMode})`}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
          <MonacoEditorPanel
            value={outputText}
            language="json"
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
        toolName="JSON Unescaper"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonUnescaperContent.title}
          subtitle={jsonUnescaperContent.subtitle}
          trustBadges={jsonUnescaperContent.trustBadges}
          features={jsonUnescaperContent.features}
          howToSteps={jsonUnescaperContent.howToSteps}
          faqs={jsonUnescaperContent.faqs}
          technicalSpecs={jsonUnescaperContent.technicalSpecs}
          useCases={jsonUnescaperContent.useCases}
          whyChoose={jsonUnescaperContent.whyChoose}
          comparison={jsonUnescaperContent.comparisonTable?.rows}
          relatedTools={jsonUnescaperContent.relatedTools}
          howToSectionTitle={jsonUnescaperContent.howToSectionTitle}
          featuresSectionTitle={jsonUnescaperContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonUnescaperContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonUnescaperContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD */}
      <JsonLd data={generateAllSchemas(
        jsonUnescaperContent.faqs || [],
        jsonUnescaperContent.howToSteps || [],
        {
          toolName: 'JSON Unescaper',
          toolUrl: 'json-unescaper',
          description: jsonUnescaperContent.description || 'Unescape JSON strings with auto-detection and multi-layer support',
          featureList: jsonUnescaperContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Unescape JSON Strings Online',
          howToDescription: 'Learn how to unescape JSON strings using our free online unescaper with auto-detection',
        }
      )} />
      
      <Footer />
      <ShareWidget />
      
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Unescaper"
        sections={jsonUnescaperHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
