'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { MessageBox, useMessage } from '@/components/common/MessageBox';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { YAMLFormatPanel } from '@/components/tools/json-to-yaml/YAMLFormatPanel';
import { YAMLAdvancedPanel } from '@/components/tools/json-to-yaml/YAMLAdvancedPanel';
import { YAMLPresetsPanel } from '@/components/tools/json-to-yaml/YAMLPresetsPanel';
import { useYAMLStore } from '@/store/yaml';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { convertJSONToYAML } from '@/lib/yaml/converter';
import { validateJSON } from '@/lib/yaml/validator';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { YAML_SAMPLES } from '@/data/json-to-yaml-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonToYAMLHelpSections } from '@/data/json-to-yaml-help';
import { jsonToYAMLContent } from '@/data/json-to-yaml-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import type { EditorLanguage } from '@/types';

export default function JSONToYAMLPage() {
  const { settings: globalSettings, updateSettings } = useYAMLStore();
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
  } = useTabs({ toolName: 'JSON to YAML', storageKey: 'yaml-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { message, type, showMessage, clearMessage } = useMessage();
  const [settingsTabId, setSettingsTabId] = useState('settings-format');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use global settings directly (presets update these)
  const settings = globalSettings;
  
  // Sync global settings to active tab whenever they change
  useEffect(() => {
    if (activeTabId && !isTabSyncingRef.current) {
      updateTab(activeTabId, {
        settings: globalSettings as unknown as Record<string, unknown>,
      });
    }
  }, [activeTabId, globalSettings, updateTab]);
  
  // Refs to track syncing and prevent unnecessary conversions
  const isTabSyncingRef = useRef(false);
  const lastConvertedInputRef = useRef('');
  const lastConvertedSettingsRef = useRef('');
  
  // Fixed languages for one-way conversion
  const inputLanguage: EditorLanguage = 'json';
  const outputLanguage: EditorLanguage = 'yaml';
  
  // Validation state
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string }>>([]);
  
  const validationState = useMemo(() => ({
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: 0,
  }), [errors]);

  // Wrapper for addTab to initialize new tabs with current settings
  const handleAddTab = useCallback(() => {
    const newTab = addTab();
    if (newTab && activeTabId) {
      updateTab(newTab.id, {
        settings: settings as unknown as Record<string, unknown>,
      });
    }
    return newTab;
  }, [addTab, activeTabId, settings, updateTab]);

  // Wrapper for duplicateTab
  const handleDuplicateTab = useCallback((tabId: string) => {
    const newTab = duplicateTab(tabId);
    return newTab;
  }, [duplicateTab]);

  // Convert function
  const performConversion = useCallback(() => {
    try {
      // Don't convert if we're syncing tabs
      if (isTabSyncingRef.current) {
        return;
      }

      // Don't convert if input is empty
      if (!inputText || !inputText.trim()) {
        setOutputText('');
        setErrors([]);
        clearMessage();
        lastConvertedInputRef.current = '';
        lastConvertedSettingsRef.current = '';
        return;
      }

      // Create a hash of current settings to detect changes
      const settingsHash = JSON.stringify(settings);
      
      // Skip conversion if nothing changed
      if (
        inputText === lastConvertedInputRef.current &&
        settingsHash === lastConvertedSettingsRef.current
      ) {
        return;
      }

      // Validate JSON input
      const validationErrors = validateJSON(inputText);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setOutputText('');
        return;
      }
      
      setErrors([]);

      // Perform JSON to YAML conversion
      const result = convertJSONToYAML(inputText, settings);
      
      if (result.success && result.output) {
        setOutputText(result.output);
        clearMessage();
        lastConvertedInputRef.current = inputText;
        lastConvertedSettingsRef.current = settingsHash;
        
        // Track successful conversion
        trackEvent('yaml_conversion', 'tool_usage', 'json-to-yaml');
      } else if (result.errors) {
        setErrors(result.errors);
        setOutputText('');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setOutputText('');
    }
  }, [inputText, settings, clearMessage, showMessage]);

  // Debounced conversion - 300ms for faster response
  useEffect(() => {
    // Skip if we're syncing tabs
    if (isTabSyncingRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      performConversion();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputText, settings, performConversion]);

  // Load tab data when switching tabs
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      
      // Load input from the tab
      const tabInput = activeTab.inputJSON || '';
      setInputText(tabInput);
      
      // Load tab's settings into the store
      if (activeTab.settings) {
        const currentSettingsStr = JSON.stringify(globalSettings);
        const tabSettingsStr = JSON.stringify({ ...globalSettings, ...activeTab.settings });
        if (currentSettingsStr !== tabSettingsStr) {
          updateSettings(activeTab.settings);
        }
      }
      
      // Clear refs to force fresh conversion
      lastConvertedInputRef.current = '';
      lastConvertedSettingsRef.current = '';
      
      // Release sync lock - let the debounced effect handle conversion
      const timer = setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 50);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId, activeTab]);

  // Save current tab state when input/output/settings changes
  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) {
      return;
    }

    // Don't save if we have input but no output (conversion still pending)
    if (inputText && !outputText) {
      return;
    }

    const currentSettings = settings;
    
    updateTab(activeTabId, {
      inputJSON: inputText,
      outputJSON: outputText,
      settings: currentSettings as unknown as Record<string, unknown>,
    });
  }, [activeTabId, inputText, outputText, settings, updateTab]);


  // Handle file upload
  const handleUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setInputText(content);
      toast.success(`File "${file.name}" loaded successfully (${sizeMB} MB)`);
    } catch {
      toast.error('Failed to read file');
    }
  }, [toast]);

  // Handle drag and drop
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
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const content = await readFileAsText(file);
      setInputText(content);
      toast.success('File loaded successfully');
    } catch {
      toast.error('Failed to read file');
    }
  }, [toast]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast.success('Content pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  }, [toast]);

  // Handle auto-correct
  const handleAutoCorrect = useCallback(() => {
    if (!inputText.trim()) {
      toast.warning('No input to fix');
      return;
    }

    const result = autoCorrectJSON(inputText);
    if (result.success) {
      setInputText(result.output);
      toast.success('Input fixed and formatted!');
      trackEvent('auto_correct', 'tool_usage', 'json_success');
    } else {
      toast.error(`Could not auto-correct: ${result.error}`);
      trackEvent('auto_correct', 'tool_usage', 'json_failure');
    }
  }, [inputText, toast]);

  // Handle sample template selection
  const handleLoadTemplate = useCallback((template: { name: string; content: string; description: string }) => {
    setInputText(template.content);
    showMessage(`Loaded: ${template.name}`, 'success');
    
    // Track template load
    trackEvent('yaml_template_load', 'tool_usage', template.name);
  }, [showMessage]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setErrors([]);
    lastConvertedInputRef.current = '';
    lastConvertedSettingsRef.current = '';
  }, []);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!outputText) {
      toast.warning('No output to copy');
      return;
    }

    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard!');
      trackCopy(outputLanguage);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [outputText, outputLanguage, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.warning('No output to download');
      return;
    }

    const extension = outputLanguage === 'yaml' ? 'yaml' : 'json';
    const filename = `converted-${getTimestamp()}.${extension}`;
    downloadTextFile(outputText, filename);
    toast.success(`Downloaded ${filename} successfully!`);
    trackDownload(extension);
  }, [outputText, outputLanguage, toast]);

  // Handle share (placeholder)
  const handleShare = useCallback(() => {
    showMessage('Share feature coming soon', 'info');
  }, [showMessage]);

  // Sample templates for dropdown - always use JSON samples
  const sampleTemplates = useMemo(() => 
    YAML_SAMPLES.map(s => ({ 
      name: s.name, 
      description: s.description, 
      content: s.json,
      icon: 'fas fa-file-code', 
      iconColor: '#58A6FF' 
    })),
    []
  );

  // Settings Sidebar Content
  const settingsSidebar = (
    <>
      <div className="sidebar-nav">
        <div
          className={`sidebar-tab ${settingsTabId === 'settings-format' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-format')}
        >
          Format
        </div>
        <div
          className={`sidebar-tab ${settingsTabId === 'settings-advanced' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-advanced')}
        >
          Advanced
        </div>
        <div
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          Presets
        </div>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-format' && <YAMLFormatPanel />}
        {settingsTabId === 'settings-advanced' && <YAMLAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <YAMLPresetsPanel />}
      </div>
    </>
  );

  return (
    <>
      {/* Skip to Content Link - for accessibility */}
      <a href="#seo-content" className="skip-to-content">
        Skip to Article Content
      </a>

      <main>
        <IDELayout 
          toolName="JSON to YAML Converter"
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
            onAddTab={handleAddTab}
            onDuplicateTab={handleDuplicateTab}
            onCloseOtherTabs={closeOtherTabs}
            onCloseAllTabs={closeAllTabs}
            canAddTab={canAddTab}
            maxTabs={maxTabs}
          />
          
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
                label={`${inputLanguage.toUpperCase()} Input`}
                onUpload={handleUpload}
                onPaste={handlePaste}
                onUrl={() => {}}
                onClear={handleClear}
                onAutoCorrect={handleAutoCorrect}
                sampleTemplates={sampleTemplates}
                onLoadTemplate={handleLoadTemplate}
              />
              
              <MonacoEditorPanel
                value={inputText}
                onChange={setInputText}
                language={inputLanguage}
                placeholder={`Paste your ${inputLanguage.toUpperCase()} data here or drag & drop a file...`}
              />
              
              <StatsBar text={inputText} validationState={validationState} />
              
              {message && (
                <div style={{ padding: '0.5rem 1rem' }}>
                  <MessageBox message={message} type={type} onClose={clearMessage} />
                </div>
              )}
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
                label={`${outputLanguage.toUpperCase()} Output`}
                onValidate={() => {}}
                onCopy={handleCopy} 
                onDownload={handleDownload} 
                onShare={handleShare}
              />
              
              <MonacoEditorPanel
                value={outputText}
                language={outputLanguage}
                readOnly
                placeholder={`${outputLanguage.toUpperCase()} output will appear here...`}
              />
              
              <StatsBar text={outputText} />
            </div>
          </div>

          {/* Social Share Widget */}
          <ShareWidget />

          {/* Help Documentation Modal */}
          <HelpModal
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
            toolName="JSON to YAML Converter"
            sections={jsonToYAMLHelpSections}
          />
        </IDELayout>
      </main>

      {/* SEO Content Below the Tool */}
      <SEOContent 
        title={jsonToYAMLContent.title}
        subtitle={jsonToYAMLContent.subtitle}
        trustBadges={jsonToYAMLContent.trustBadges}
        howToSectionTitle={jsonToYAMLContent.howToSectionTitle}
        howToSteps={jsonToYAMLContent.howToSteps}
        featuresSectionTitle={jsonToYAMLContent.featuresSectionTitle}
        features={jsonToYAMLContent.features}
        useCases={jsonToYAMLContent.useCases}
        whyChooseSectionTitle={jsonToYAMLContent.whyChooseSectionTitle}
        whyChoose={jsonToYAMLContent.whyChoose}
        comparisonSectionTitle={jsonToYAMLContent.comparisonSectionTitle}
        comparison={jsonToYAMLContent.comparisonTable.rows}
        faqs={jsonToYAMLContent.faqs}
        relatedTools={jsonToYAMLContent.relatedTools}
        technicalSpecs={jsonToYAMLContent.technicalSpecs}
      />

      {/* JSON-LD Structured Data */}
      <JsonLd data={generateAllSchemas(
        jsonToYAMLContent.faqs,
        jsonToYAMLContent.howToSteps,
        {
          toolName: 'JSON to YAML Converter',
          toolUrl: '/json-to-yaml',
          description: jsonToYAMLContent.subtitle,
          featureList: jsonToYAMLContent.features.map(f => f.title),
          howToTitle: 'How to Convert JSON to YAML Online',
          howToDescription: 'Learn how to convert JSON to YAML with our free online converter featuring Kubernetes, Docker, and Ansible presets',
        }
      )} />

      {/* Footer */}
      <Footer />
    </>
  );
}
