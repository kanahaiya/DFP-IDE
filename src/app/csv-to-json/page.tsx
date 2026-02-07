'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { SettingsPanel } from '@/components/tools/csv-to-json/SettingsPanel';
import { OutputFormatToggle } from '@/components/tools/csv-to-json/OutputFormatToggle';
import { FormattingPanel } from '@/components/tools/csv-to-json/FormattingPanel';
import { useCSVStore } from '@/store/csv';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { convertCSVToJSON } from '@/lib/csv/converter';
import { csvSampleTemplates, getDefaultSample } from '@/lib/csv/sampleTemplates';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { createShareUrl, getUrlParam, safeDecodeParam } from '@/lib/urlUtils';
import { trackCopy, trackDownload } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { csvToJSONContent } from '@/data/csv-to-json-seo';
import { csvToJSONHelpSections } from '@/data/csv-to-json-help';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function CSVToJSONPage() {
  const { settings: globalSettings, updateSettings } = useCSVStore();
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
  } = useTabs({ toolName: 'CSV to JSON', storageKey: 'csv-tabs' });
  
  const [inputCSV, setInputCSV] = useState('');
  const [outputJSON, setOutputJSON] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-parsing');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Each tab has its own settings - use tab's settings or fall back to global
  const settings = useMemo(() => {
    if (activeTab?.settings) {
      return { ...globalSettings, ...activeTab.settings };
    }
    return globalSettings;
  }, [activeTab?.settings, globalSettings]);
  
  // Refs to track syncing and prevent unnecessary conversions
  const isTabSyncingRef = useRef(false);
  const lastConvertedInputRef = useRef('');
  const lastConvertedSettingsRef = useRef('');
  
  // Validation state
  const validationState = useMemo(() => ({
    isValid: true,
    errorCount: 0,
    warningCount: 0,
  }), []);

  // Wrapper for addTab to initialize new tabs with current settings
  const handleAddTab = useCallback(() => {
    const newTab = addTab();
    if (newTab && activeTabId) {
      // Initialize the new tab with current settings
      updateTab(newTab.id, {
        settings: settings as unknown as Record<string, unknown>,
      });
    }
    return newTab;
  }, [addTab, activeTabId, settings, updateTab]);

  // Wrapper for duplicateTab to ensure settings are copied
  const handleDuplicateTab = useCallback((tabId: string) => {
    const newTab = duplicateTab(tabId);
    // Settings are already copied by duplicateTab since it copies all tab properties
    return newTab;
  }, [duplicateTab]);

  // Convert CSV to JSON - main conversion function with duplicate prevention
  const convertToJSON = useCallback(() => {
    try {
      // Don't convert if we're syncing tabs
      if (isTabSyncingRef.current) {
        return;
      }

      // Don't convert if input is empty
      if (!inputCSV || !inputCSV.trim()) {
        setOutputJSON('');
        lastConvertedInputRef.current = '';
        lastConvertedSettingsRef.current = '';
        return;
      }

      // Create a hash of current settings to detect changes
      const settingsHash = JSON.stringify(settings);
      const hasOutput = Boolean(outputJSON && outputJSON.trim());
      
      // Skip conversion if nothing changed
      if (
        inputCSV === lastConvertedInputRef.current &&
        settingsHash === lastConvertedSettingsRef.current &&
        hasOutput
      ) {
        return;
      }

      // Perform conversion
      const result = convertCSVToJSON(inputCSV, settings);
      setOutputJSON(result);
      
      // Update refs to track what we just converted
      lastConvertedInputRef.current = inputCSV;
      lastConvertedSettingsRef.current = settingsHash;
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(
        `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        4000
      );
      setOutputJSON('');
    }
  }, [inputCSV, outputJSON, settings, toast]);

  // Debounced conversion - 500ms as per PRD
  useEffect(() => {
    // Skip if we're syncing tabs
    if (isTabSyncingRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      convertToJSON();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputCSV, settings, convertToJSON]);

  // Load tab data when switching tabs
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      
      // Load input, output, and settings from the tab
      setInputCSV(activeTab.inputCSV || '');
      setOutputJSON(activeTab.outputJSON || '');
      
      // Load tab's settings into the store (this updates the UI)
      // Only update if settings are different to prevent unnecessary re-renders
      if (activeTab.settings) {
        const currentSettingsStr = JSON.stringify(globalSettings);
        const tabSettingsStr = JSON.stringify({ ...globalSettings, ...activeTab.settings });
        if (currentSettingsStr !== tabSettingsStr) {
          updateSettings(activeTab.settings);
        }
      }
      
      // Reset conversion tracking when switching tabs
      lastConvertedInputRef.current = activeTab.inputCSV || '';
      const tabSettings = activeTab.settings || globalSettings;
      lastConvertedSettingsRef.current = JSON.stringify(tabSettings);
      
      // Release sync lock after a brief delay
      const timer = setTimeout(() => {
        isTabSyncingRef.current = false;
        // Ensure output is computed even when tab loads with output missing/stale.
        convertToJSON();
      }, 100);
      
      return () => clearTimeout(timer);
    }
    // Only run when tab changes, not when settings change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId, activeTab]);

  // Save current tab state when input/output/settings changes
  useEffect(() => {
    if (isTabSyncingRef.current) {
      return;
    }

    if (activeTab && activeTabId) {
      const inputChanged = activeTab.inputCSV !== inputCSV;
      const outputChanged = activeTab.outputJSON !== outputJSON;
      
      // Compare settings by stringifying both the saved and current settings
      const savedSettings = activeTab.settings || {};
      const currentSettings = settings;
      const settingsChanged = JSON.stringify(savedSettings) !== JSON.stringify(currentSettings);
      
      if (inputChanged || outputChanged || settingsChanged) {
        updateTab(activeTabId, {
          inputCSV: inputCSV,
          outputJSON: outputJSON,
          settings: currentSettings as unknown as Record<string, unknown>, // Save current settings to this tab
        });
      }
    }
    // Only depend on the actual values, not the functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCSV, outputJSON, settings, activeTabId]);

  // Load from share URL on mount
  useEffect(() => {
    const csvParam = getUrlParam('csv');
    if (csvParam) {
      const decoded = safeDecodeParam(csvParam);
      if (decoded) {
        setInputCSV(decoded);
        toast.success('Loaded from share link');
        // Clean URL
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setInputCSV(text);
      toast.success(`File loaded successfully (${sizeMB} MB)`);
    } catch {
      toast.error('Failed to load file');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error('Clipboard is empty');
        return;
      }
      setInputCSV(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard. Please check browser permissions.');
    }
  };

  const handleClear = () => {
    setInputCSV('');
    toast.success('Input cleared');
  };

  // Convert sample templates to the format expected by EditorToolbar
  const sampleTemplates = useMemo(() => 
    csvSampleTemplates.map(template => ({
      name: template.name,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor,
      content: template.content,
    })),
    []
  );

  const handleLoadSample = () => {
    const defaultSample = getDefaultSample();
    setInputCSV(defaultSample.content);
    toast.success('Sample CSV loaded');
  };

  const handleLoadTemplate = (template: { name: string; description: string; content: string }) => {
    setInputCSV(template.content);
    toast.success(`Loaded: ${template.name}`);
  };

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(outputJSON);
      toast.success('Copied to clipboard');
      trackCopy('csv-json');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputJSON, toast]);

  const handleDownload = useCallback(() => {
    try {
      const filename = `converted-${getTimestamp()}.json`;
      downloadTextFile(outputJSON, filename, 'application/json');
      toast.success('Downloaded successfully');
      trackDownload('json');
    } catch {
      toast.error('Failed to download');
    }
  }, [outputJSON, toast]);

  const handleShare = async () => {
    try {
      const url = createShareUrl('/csv-to-json', 'csv', inputCSV);
      await copyToClipboard(url);
      toast.success('Share link copied to clipboard');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const handleValidate = () => {
    try {
      if (!outputJSON || !outputJSON.trim()) {
        toast.error('No JSON to validate');
        return;
      }

      JSON.parse(outputJSON);
      toast.success('Valid JSON');
    } catch (error) {
      toast.error('Invalid JSON: ' + (error instanceof Error ? error.message : 'Parse error'));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(csv|txt)$/i)) {
      toast.error('Please drop a CSV or text file');
      return;
    }

    await handleUpload(file);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to convert
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        convertToJSON();
      }
      // Ctrl/Cmd + S to download
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleDownload();
      }
      // Ctrl/Cmd + K to copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [outputJSON, inputCSV, convertToJSON, handleDownload, handleCopy]);

  // Settings Sidebar Content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-parsing' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-parsing')}
        >
          <i className="fas fa-cogs"></i> Parsing
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-format' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-format')}
        >
          <i className="fas fa-align-left"></i> Format
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-output' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-output')}
        >
          <i className="fas fa-file-export"></i> Output
        </button>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-parsing' && <SettingsPanel />}
        {settingsTabId === 'settings-format' && <FormattingPanel />}
        {settingsTabId === 'settings-output' && <OutputFormatToggle />}
      </div>
    </div>
  );

  return (
    <>
      {/* Skip to Content Link - for accessibility */}
      <a href="#seo-content" className="skip-to-content">
        Skip to Article Content
      </a>

      <main>
        <IDELayout 
          toolName="CSV to JSON Converter" 
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
            {/* Left Panel - CSV Input */}
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
                label="CSV Input"
                onUpload={handleUpload}
                onPaste={handlePaste}
                onUrl={() => {}}
                onClear={handleClear}
                sampleTemplates={sampleTemplates}
                onLoadTemplate={handleLoadTemplate}
              />
              
              <MonacoEditorPanel
                value={inputCSV}
                onChange={setInputCSV}
                language="csv"
                editorSide="left"
                placeholder="Paste your CSV data here or drag & drop a CSV file..."
                emptyStateTitle="Welcome to CSV to JSON Converter"
                emptyStateInstructions={[
                  'Pasting CSV data',
                  'Uploading a .csv file',
                  'Loading a sample template',
                ]}
                onLoadSample={handleLoadSample}
              />
              
              <StatsBar text={inputCSV} validationState={validationState} />
            </div>

            {/* Resizer */}
            <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

            {/* Right Panel - JSON Output */}
            <div 
              className="ide-pane"
              style={{
                [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
              }}
            >
              <OutputToolbar 
                label="JSON Output" 
                onValidate={handleValidate}
                onCopy={handleCopy} 
                onDownload={handleDownload} 
                onShare={handleShare}
              />
              
              <MonacoEditorPanel
                value={outputJSON}
                language="json"
                editorSide="right"
                readOnly
                placeholder="JSON output will appear here..."
                emptyStateTitle="JSON Output"
                emptyStateInstructions={[
                  'Converted JSON will appear here',
                  'Use the input panel to paste your CSV',
                ]}
              />
              
              <StatsBar text={outputJSON} />
            </div>
          </div>

          {/* Social Share Widget */}
          <ShareWidget />

          {/* Help Documentation Modal */}
          <HelpModal
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
            toolName="CSV to JSON Converter"
            sections={csvToJSONHelpSections}
          />
        </IDELayout>
      </main>

      {/* JSON-LD Structured Data */}
      <JsonLd data={generateAllSchemas(
        csvToJSONContent.faqs, 
        csvToJSONContent.howToSteps,
        {
          toolName: 'CSV to JSON Converter',
          toolUrl: 'csv-to-json',
          description: 'Convert CSV to JSON online instantly with smart type detection, multiple output formats, and 100% client-side processing. Free, secure, and no upload required.',
          featureList: [
            'Real-time CSV to JSON conversion',
            'Smart type detection (numbers, booleans, dates)',
            'Multiple output formats (Array of Objects, Keyed Objects, Column Arrays, Nested)',
            'Custom delimiter support (comma, semicolon, tab, pipe)',
            'Header row detection',
            'Client-side processing for privacy',
            'Export to JSON with formatting options',
            'Large file support (up to 10MB)',
          ],
          howToTitle: 'How to Convert CSV to JSON',
          howToDescription: 'Step-by-step guide to converting CSV files into JSON format with smart type detection and multiple output options using our free online tool.',
        }
      )} />

      {/* SEO Content Sections */}
      <article id="seo-content">
        <SEOContent 
          title={csvToJSONContent.title}
          subtitle={csvToJSONContent.subtitle}
          trustBadges={csvToJSONContent.trustBadges}
          features={csvToJSONContent.features}
          howToSteps={csvToJSONContent.howToSteps}
          educationalContent={csvToJSONContent.educational}
          useCases={csvToJSONContent.useCases}
          whyChoose={csvToJSONContent.whyChoose}
          technicalSpecs={csvToJSONContent.technicalSpecs}
          comparison={csvToJSONContent.comparison}
          faqs={csvToJSONContent.faqs}
          relatedTools={csvToJSONContent.relatedTools}
          howToSectionTitle={csvToJSONContent.howToSectionTitle}
          featuresSectionTitle={csvToJSONContent.featuresSectionTitle}
          whyChooseSectionTitle={csvToJSONContent.whyChooseSectionTitle}
          comparisonSectionTitle={csvToJSONContent.comparisonSectionTitle}
        />
      </article>

      {/* Footer */}
      <Footer />
    </>
  );
}
