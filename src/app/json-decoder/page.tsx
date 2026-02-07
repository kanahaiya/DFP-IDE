'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { DecoderTypePanel } from '@/components/tools/json-decoder/DecoderTypePanel';
import { DecoderOptionsPanel } from '@/components/tools/json-decoder/DecoderOptionsPanel';
import { DecoderAdvancedPanel } from '@/components/tools/json-decoder/DecoderAdvancedPanel';
import { DecoderPresetsPanel } from '@/components/tools/json-decoder/DecoderPresetsPanel';
import { useDecoderStore } from '@/store/decoder';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { decodeJSON, type DecoderSettings } from '@/lib/decoder/converter';
import { validateInput } from '@/lib/decoder/validator';
import { DECODER_SAMPLES } from '@/data/json-decoder-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonDecoderHelpSections } from '@/data/json-decoder-help';
import { jsonDecoderContent } from '@/data/json-decoder-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function JSONDecoderPage() {
  const { 
    settings: globalSettings, 
    updateSettings, 
    setDecodingChain,
    setIsValidJSON 
  } = useDecoderStore();
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
  } = useTabs({ toolName: 'JSON Decoder', storageKey: 'decoder-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-type');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string; severity: 'error' | 'warning' }>>([]);
  // Stats is tracked but customStats was removed from StatsBar - keeping for potential future use
  const [, setStats] = useState<{ inputLength: number; outputLength: number; iterations: number } | null>(null);
  
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
        updateSettings(activeTab.settings as unknown as Partial<DecoderSettings>);
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
  
  // Perform decoding
  const performDecoding = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      setErrors([]);
      setStats(null);
      setDecodingChain([]);
      setIsValidJSON(false);
      return;
    }
    
    // Validate input
    const validation = validateInput(inputText);
    if (!validation.isValid) {
      setErrors(validation.errors.map(e => ({ ...e, severity: 'error' as const })));
      setOutputText('');
      setStats(null);
      return;
    }
    
    // Clear errors
    setErrors([]);
    
    // Decode
    const result = decodeJSON(inputText, settings);
    
    if (result.success) {
      setOutputText(result.output);
      setDecodingChain(result.decodingChain);
      setIsValidJSON(result.isValidJSON);
      setStats({
        inputLength: result.stats.inputLength,
        outputLength: result.stats.outputLength,
        iterations: result.stats.iterations,
      });
      trackEvent('decode', 'json_decoder', settings.decodingType);
    } else {
      setOutputText('');
      setErrors([{ line: 1, column: 1, message: result.error, severity: 'error' }]);
      setStats(null);
      setDecodingChain([]);
      setIsValidJSON(false);
    }
  }, [inputText, settings, setDecodingChain, setIsValidJSON]);
  
  // Debounced decoding
  useEffect(() => {
    const timer = setTimeout(() => {
      performDecoding();
    }, 300);
    return () => clearTimeout(timer);
  }, [performDecoding]);
  
  // Handlers
  const handleUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setInputText(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_decoder', file.type);
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
    setDecodingChain([]);
    setIsValidJSON(false);
    toast.info('Input cleared');
  }, [toast, setDecodingChain, setIsValidJSON]);
  
  const handleCopy = useCallback(async () => {
    if (!outputText) {
      toast.error('No output to copy');
      return;
    }
    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard');
      trackCopy('json_decoder');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);
  
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.error('No output to download');
      return;
    }
    const filename = `decoded_${getTimestamp()}.json`;
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
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: 0,
  };
  
  // Settings sidebar
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-type' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-type')}
        >
          <i className="fas fa-exchange-alt"></i> Type
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
        {settingsTabId === 'settings-type' && <DecoderTypePanel />}
        {settingsTabId === 'settings-options' && <DecoderOptionsPanel />}
        {settingsTabId === 'settings-advanced' && <DecoderAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <DecoderPresetsPanel />}
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
            label="Encoded Input"
            onUpload={handleUpload}
            onPaste={handlePaste}
            onClear={handleClear}
            sampleTemplates={DECODER_SAMPLES}
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
          <StatsBar text={inputText} />
        </div>
        
        <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>
        
        <div
          className="ide-pane"
          style={{
            [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`,
          }}
        >
          <OutputToolbar
            label="Decoded JSON Output"
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
          <MonacoEditorPanel
            value={outputText}
            language="json"
            readOnly={true}
            editorSide="right"
          />
          <StatsBar text={outputText} validationState={validationState} />
        </div>
      </div>
    </>
  );
  
  return (
    <>
      <IDELayout
        toolName="JSON Decoder"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonDecoderContent.title}
          subtitle={jsonDecoderContent.subtitle}
          trustBadges={jsonDecoderContent.trustBadges}
          features={jsonDecoderContent.features}
          howToSteps={jsonDecoderContent.howToSteps}
          faqs={jsonDecoderContent.faqs}
          technicalSpecs={jsonDecoderContent.technicalSpecs}
          useCases={jsonDecoderContent.useCases}
          whyChoose={jsonDecoderContent.whyChoose}
          comparison={jsonDecoderContent.comparisonTable?.rows}
          relatedTools={jsonDecoderContent.relatedTools}
          howToSectionTitle={jsonDecoderContent.howToSectionTitle}
          featuresSectionTitle={jsonDecoderContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonDecoderContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonDecoderContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD */}
      <JsonLd data={generateAllSchemas(
        jsonDecoderContent.faqs || [],
        jsonDecoderContent.howToSteps || [],
        {
          toolName: 'JSON Decoder',
          toolUrl: 'json-decoder',
          description: jsonDecoderContent.description || 'Decode URL, Base64, Hex, and other encoded JSON formats',
          featureList: jsonDecoderContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Decode JSON Online',
          howToDescription: 'Learn how to decode encoded JSON data using our free online decoder with auto-detection',
        }
      )} />
      
      <Footer />
      <ShareWidget />
      
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Decoder"
        sections={jsonDecoderHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
