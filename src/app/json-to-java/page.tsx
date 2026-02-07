'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { JavaAnnotationsPanel } from '@/components/tools/json-to-java/JavaAnnotationsPanel';
import { JavaNamingPanel } from '@/components/tools/json-to-java/JavaNamingPanel';
import { JavaOptionsPanel } from '@/components/tools/json-to-java/JavaOptionsPanel';
import { JavaPresetsPanel } from '@/components/tools/json-to-java/JavaPresetsPanel';
import { useJsonToJavaStore } from '@/store/jsonToJava';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { convertJSONToJava } from '@/lib/java/generator';
import { parseAndValidateJSON } from '@/lib/code-gen/typeInference';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { jsonToJavaSamples } from '@/data/json-to-java-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonToJavaHelp } from '@/data/json-to-java-help';
import { jsonToJavaContent } from '@/data/json-to-java-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import type { EditorLanguage, ValidationError } from '@/types';

export default function JSONToJavaPage() {
  const { settings, updateSettings } = useJsonToJavaStore();
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
  } = useTabs({ toolName: 'JSON to Java', storageKey: 'json-to-java-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-annotations');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Sync global settings to active tab
  const isTabSyncingRef = useRef(false);
  const lastConvertedInputRef = useRef('');
  const lastConvertedSettingsRef = useRef('');
  
  useEffect(() => {
    if (activeTabId && !isTabSyncingRef.current) {
      updateTab(activeTabId, {
        settings: settings as unknown as Record<string, unknown>,
      });
    }
  }, [activeTabId, settings, updateTab]);
  
  // Fixed languages
  const inputLanguage: EditorLanguage = 'json';
  const outputLanguage: EditorLanguage = 'java';
  
  // Validation state
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validationState = useMemo(() => ({
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: 0,
  }), [errors.length]);
  
  // Wrapper for addTab
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
      if (isTabSyncingRef.current) {
        return;
      }

      if (!inputText || !inputText.trim()) {
        setOutputText('');
        setErrors([]);
        lastConvertedInputRef.current = '';
        lastConvertedSettingsRef.current = '';
        return;
      }

      const settingsHash = JSON.stringify(settings);
      
      if (
        inputText === lastConvertedInputRef.current &&
        settingsHash === lastConvertedSettingsRef.current
      ) {
        return;
      }

      // Validate JSON input
      const validation = parseAndValidateJSON(inputText);
      
      if (!validation.success) {
        setErrors([{
          line: validation.error?.line || 1,
          column: validation.error?.column || 1,
          message: validation.error?.message || 'Invalid JSON',
          severity: 'error' as const
        }]);
        setOutputText('');
        return;
      }
      
      setErrors([]);
      
      // Perform conversion
      const result = convertJSONToJava(inputText, settings);
      
      if (result.success && result.code !== undefined) {
        setOutputText(result.code);
        lastConvertedInputRef.current = inputText;
        lastConvertedSettingsRef.current = settingsHash;
        
        // Update active tab
        if (activeTabId) {
          updateTab(activeTabId, {
            inputJSON: inputText,
            outputJSON: result.code,
          });
        }
      } else {
        setErrors(result.errors?.map(e => ({
          line: e.line || 1,
          column: e.column || 1,
          message: e.message,
          severity: 'error' as const
        })) || [{ line: 1, column: 1, message: 'Conversion failed', severity: 'error' as const }]);
        setOutputText('');
      }
    } catch (error) {
      setErrors([{
        line: 1,
        column: 1,
        message: error instanceof Error ? error.message : 'Conversion failed',
        severity: 'error' as const
      }]);
      setOutputText('');
    }
  }, [inputText, settings, activeTabId, updateTab]);

  // Auto-convert on input/settings change
  useEffect(() => {
    const timer = setTimeout(performConversion, 300);
    return () => clearTimeout(timer);
  }, [performConversion]);

  // Sync with active tab
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInputText(activeTab.inputJSON || '');
      setOutputText(activeTab.outputJSON || '');
      if (activeTab.settings) {
        updateSettings(activeTab.settings as Partial<typeof settings>);
      }
      setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 0);
    }
  }, [activeTabId, activeTab, updateSettings]);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInputText(value);
    if (activeTabId) {
      updateTab(activeTabId, { inputJSON: value });
    }
  }, [activeTabId, updateTab]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      handleInputChange(content);
      toast.success('File loaded successfully');
      trackEvent('file_upload', 'json-to-java', file.name);
    } catch {
      toast.error('Failed to read file');
    }
  }, [handleInputChange, toast]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);


  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard');
      trackCopy('json-to-java');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const filename = `${settings.rootClassName}_${getTimestamp()}.java`;
    downloadTextFile(outputText, filename, 'text/plain');
    toast.success(`Downloaded: ${filename}`);
    trackDownload('java');
  }, [outputText, settings.rootClassName, toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setErrors([]);
    if (activeTabId) {
      updateTab(activeTabId, { inputJSON: '', outputJSON: '' });
    }
  }, [activeTabId, updateTab]);

  // Handle format JSON
  const handleFormat = useCallback(() => {
    if (!inputText.trim()) return;
    try {
      const formatted = JSON.stringify(JSON.parse(inputText), null, 2);
      handleInputChange(formatted);
      toast.success('JSON formatted');
    } catch {
      // Try auto-correct
      const result = autoCorrectJSON(inputText);
      if (result.success && result.output !== inputText) {
        handleInputChange(result.output);
        toast.success('JSON auto-corrected and formatted');
      } else {
        toast.error('Invalid JSON - cannot format');
      }
    }
  }, [inputText, handleInputChange, toast]);

  // JSON-LD schemas
  const schemas = useMemo(() => {
    return generateAllSchemas(
      jsonToJavaContent.faqs,
      jsonToJavaContent.howToSteps,
      {
        toolName: 'JSON to Java Converter',
        toolUrl: 'json-to-java',
        description: jsonToJavaContent.subtitle,
        featureList: jsonToJavaContent.features.map(f => f.title),
        howToTitle: jsonToJavaContent.howToSectionTitle,
        howToDescription: 'Step-by-step guide to convert JSON to Java classes online',
      }
    );
  }, []);

  // Settings tabs
  const settingsTabs = [
    { id: 'settings-annotations', label: 'Annotations', icon: 'fas fa-at' },
    { id: 'settings-naming', label: 'Naming', icon: 'fas fa-tag' },
    { id: 'settings-options', label: 'Options', icon: 'fas fa-cog' },
    { id: 'settings-presets', label: 'Presets', icon: 'fas fa-magic' },
  ];

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSettingsTabId(tab.id)}
            className={`sidebar-tab ${settingsTabId === tab.id ? 'active' : ''}`}
          >
            <i className={tab.icon} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-annotations' && (
          <JavaAnnotationsPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-naming' && (
          <JavaNamingPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-options' && (
          <JavaOptionsPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <JavaPresetsPanel onPresetSelect={(presetSettings) => updateSettings(presetSettings)} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      <IDELayout
        toolName="JSON to Java"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {/* Tab Manager */}
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
          onAddTab={handleAddTab}
          onTabRename={renameTab}
          onDuplicateTab={handleDuplicateTab}
          onCloseOtherTabs={closeOtherTabs}
          onCloseAllTabs={closeAllTabs}
          maxTabs={maxTabs}
          canAddTab={canAddTab}
        />
        
        {/* Main Content */}
        <div
          ref={containerRef}
          className={`ide-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
        >
          <div
            className={`ide-pane ${isDragging ? 'drag-over' : ''}`}
            style={{ [layout === 'vertical' ? 'height' : 'width']: `${size}%` }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <EditorToolbar
              label="JSON Input"
              onUpload={handleFileUpload}
              onClear={handleClear}
              onAutoCorrect={handleFormat}
              sampleTemplates={jsonToJavaSamples}
              onLoadTemplate={(template) => {
                handleInputChange(template.content);
                toast.success(`Loaded: ${template.name}`);
                trackEvent('load_sample', 'json-to-java', template.name);
              }}
            />
            <MonacoEditorPanel
              value={inputText}
              onChange={handleInputChange}
              language={inputLanguage}
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to Java Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonToJavaSamples.length > 0) {
                  handleInputChange(jsonToJavaSamples[0].content);
                }
              }}
              validationErrors={errors}
            />
            <StatsBar text={inputText} validationState={validationState} />
          </div>
          
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>
          
          <div
            className="ide-pane"
            style={{ [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%` }}
          >
            <OutputToolbar
              label="Java Output"
              onCopy={outputText ? handleCopy : undefined}
              onDownload={outputText ? handleDownload : undefined}
            >
              <ShareWidget />
            </OutputToolbar>
            <MonacoEditorPanel
              value={outputText}
              language={outputLanguage}
              editorSide="right"
              readOnly
              placeholder="Java code will appear here..."
              emptyStateTitle="Java Output"
              emptyStateInstructions={[
                'Converted Java code will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={outputText} />
          </div>
        </div>
        
      </IDELayout>

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonToJavaContent.title}
          subtitle={jsonToJavaContent.subtitle}
          trustBadges={jsonToJavaContent.trustBadges}
          features={jsonToJavaContent.features}
          howToSteps={jsonToJavaContent.howToSteps}
          howToSectionTitle={jsonToJavaContent.howToSectionTitle}
          featuresSectionTitle={jsonToJavaContent.featuresSectionTitle}
          educationalContent={jsonToJavaContent.educationalContent}
          useCases={jsonToJavaContent.useCases}
          technicalSpecs={jsonToJavaContent.technicalSpecs}
          comparison={jsonToJavaContent.comparison}
          comparisonSectionTitle={jsonToJavaContent.comparisonSectionTitle}
          faqs={jsonToJavaContent.faqs}
          whyChoose={jsonToJavaContent.whyChoose}
          whyChooseSectionTitle={jsonToJavaContent.whyChooseSectionTitle}
          relatedTools={jsonToJavaContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />
      
      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON to Java"
        sections={jsonToJavaHelp}
      />
    </>
  );
}
