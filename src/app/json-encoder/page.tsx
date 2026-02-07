'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { EncoderTypePanel } from '@/components/tools/json-encoder/EncoderTypePanel';
import { EncoderOptionsPanel } from '@/components/tools/json-encoder/EncoderOptionsPanel';
import { EncoderAdvancedPanel } from '@/components/tools/json-encoder/EncoderAdvancedPanel';
import { EncoderPresetsPanel } from '@/components/tools/json-encoder/EncoderPresetsPanel';
import { useEncoderStore } from '@/store/encoder';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { encodeJSON, type EncoderSettings } from '@/lib/encoder/converter';
import { validateInput } from '@/lib/encoder/validator';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { ENCODER_SAMPLES } from '@/data/json-encoder-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonEncoderHelpSections } from '@/data/json-encoder-help';
import { jsonEncoderContent } from '@/data/json-encoder-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function JSONEncoderPage() {
  const { settings: globalSettings, updateSettings } = useEncoderStore();
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
  } = useTabs({ toolName: 'JSON Encoder', storageKey: 'encoder-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-type');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string; severity: 'error' | 'warning' }>>([]);
  // Stats is tracked but customStats was removed from StatsBar - keeping for potential future use
  const [, setStats] = useState<{ inputLength: number; outputLength: number; ratio: number } | null>(null);
  
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
        updateSettings(activeTab.settings as unknown as Partial<EncoderSettings>);
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
  
  // Perform encoding
  const performEncoding = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      setErrors([]);
      setStats(null);
      return;
    }
    
    // Validate input
    const validation = validateInput(inputText);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setOutputText('');
      setStats(null);
      return;
    }
    
    // Clear errors
    setErrors([]);
    
    // Encode
    const result = encodeJSON(inputText, settings);
    
    if (result.success) {
      setOutputText(result.output);
      setStats({
        inputLength: result.stats.inputLength,
        outputLength: result.stats.outputLength,
        ratio: result.stats.compressionRatio,
      });
      trackEvent('encode', 'json_encoder', settings.encodingType);
    } else {
      setOutputText('');
      setErrors([{ line: 1, column: 1, message: result.error, severity: 'error' }]);
      setStats(null);
    }
  }, [inputText, settings]);
  
  // Debounced encoding
  useEffect(() => {
    const timer = setTimeout(() => {
      performEncoding();
    }, 300);
    return () => clearTimeout(timer);
  }, [performEncoding]);
  
  // Handlers
  const handleUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setInputText(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_encoder', file.type);
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
      trackCopy('json_encoder');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);
  
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.error('No output to download');
      return;
    }
    const filename = `encoded_${settings.encodingType}_${getTimestamp()}.txt`;
    downloadTextFile(outputText, filename);
    toast.success(`Downloaded ${filename}`);
    trackDownload('txt');
  }, [outputText, settings.encodingType, toast]);
  
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
        {settingsTabId === 'settings-type' && <EncoderTypePanel />}
        {settingsTabId === 'settings-options' && <EncoderOptionsPanel />}
        {settingsTabId === 'settings-advanced' && <EncoderAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <EncoderPresetsPanel />}
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
            label="JSON Input"
            onUpload={handleUpload}
            onPaste={handlePaste}
            onClear={handleClear}
            onAutoCorrect={handleAutoCorrect}
            sampleTemplates={ENCODER_SAMPLES}
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
            label={`Encoded Output (${settings.encodingType.toUpperCase()})`}
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
        toolName="JSON Encoder"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonEncoderContent.title}
          subtitle={jsonEncoderContent.subtitle}
          trustBadges={jsonEncoderContent.trustBadges}
          features={jsonEncoderContent.features}
          howToSteps={jsonEncoderContent.howToSteps}
          faqs={jsonEncoderContent.faqs}
          technicalSpecs={jsonEncoderContent.technicalSpecs}
          useCases={jsonEncoderContent.useCases}
          whyChoose={jsonEncoderContent.whyChoose}
          comparison={jsonEncoderContent.comparisonTable?.rows}
          relatedTools={jsonEncoderContent.relatedTools}
          howToSectionTitle={jsonEncoderContent.howToSectionTitle}
          featuresSectionTitle={jsonEncoderContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonEncoderContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonEncoderContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD */}
      <JsonLd data={generateAllSchemas(
        jsonEncoderContent.faqs || [],
        jsonEncoderContent.howToSteps || [],
        {
          toolName: 'JSON Encoder',
          toolUrl: 'json-encoder',
          description: jsonEncoderContent.description || 'Encode JSON to URL, Base64, Hex, and other formats',
          featureList: jsonEncoderContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Encode JSON Online',
          howToDescription: 'Learn how to encode JSON data to various formats using our free online encoder',
        }
      )} />
      
      <Footer />
      <ShareWidget />
      
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Encoder"
        sections={jsonEncoderHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
