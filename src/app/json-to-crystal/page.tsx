'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { CrystalTypePanel } from '@/components/tools/json-to-crystal/CrystalTypePanel';
import { CrystalNamingPanel } from '@/components/tools/json-to-crystal/CrystalNamingPanel';
import { CrystalOptionsPanel } from '@/components/tools/json-to-crystal/CrystalOptionsPanel';
import { CrystalPresetsPanel } from '@/components/tools/json-to-crystal/CrystalPresetsPanel';
import { useJsonToCrystalStore } from '@/store/jsonToCrystal';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { convertJSONToCrystal } from '@/lib/crystal/generator';
import { parseAndValidateJSON } from '@/lib/code-gen/typeInference';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { crystalSamples } from '@/data/json-to-crystal-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonToCrystalHelp } from '@/data/json-to-crystal-help';
import { jsonToCrystalContent } from '@/data/json-to-crystal-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import type { EditorLanguage, ValidationError } from '@/types';

export default function JSONToCrystalPage() {
  const { settings, updateSettings } = useJsonToCrystalStore();
  const toast = useToast();
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
  } = useTabs({ toolName: 'JSON to Crystal', storageKey: 'json-to-crystal-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-type');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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
  
  const inputLanguage: EditorLanguage = 'json';
  const outputLanguage: EditorLanguage = 'crystal';
  
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validationState = useMemo(() => ({
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: 0,
  }), [errors.length]);
  

  const handleAddTab = useCallback(() => {
    const newTab = addTab();
    if (newTab && activeTabId) {
      updateTab(newTab.id, {
        settings: settings as unknown as Record<string, unknown>,
      });
    }
    return newTab;
  }, [addTab, activeTabId, settings, updateTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    return duplicateTab(tabId);
  }, [duplicateTab]);

  const performConversion = useCallback(() => {
    try {
      if (isTabSyncingRef.current) return;

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
      
      const result = convertJSONToCrystal(inputText, settings);
      
      if (result.success && result.code !== undefined) {
        setOutputText(result.code);
        lastConvertedInputRef.current = inputText;
        lastConvertedSettingsRef.current = settingsHash;
        
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

  useEffect(() => {
    const timer = setTimeout(performConversion, 300);
    return () => clearTimeout(timer);
  }, [performConversion]);

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

  const handleInputChange = useCallback((value: string) => {
    setInputText(value);
    if (activeTabId) {
      updateTab(activeTabId, { inputJSON: value });
    }
  }, [activeTabId, updateTab]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      handleInputChange(content);
      toast.success('File loaded successfully');
      trackEvent('file_upload', 'json-to-crystal', file.name);
    } catch {
      toast.error('Failed to read file');
    }
  }, [handleInputChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);


  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await copyToClipboard(outputText);
      toast.success('Copied to clipboard');
      trackCopy('json-to-crystal');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);

  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const filename = `${settings.rootClassName.toLowerCase()}_${getTimestamp()}.cr`;
    downloadTextFile(outputText, filename, 'text/plain');
    toast.success(`Downloaded: ${filename}`);
    trackDownload('crystal');
  }, [outputText, settings.rootClassName, toast]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setErrors([]);
    if (activeTabId) {
      updateTab(activeTabId, { inputJSON: '', outputJSON: '' });
    }
  }, [activeTabId, updateTab]);

  const handleFormat = useCallback(() => {
    if (!inputText.trim()) return;
    try {
      const formatted = JSON.stringify(JSON.parse(inputText), null, 2);
      handleInputChange(formatted);
      toast.success('JSON formatted');
    } catch {
      const result = autoCorrectJSON(inputText);
      if (result.success && result.output !== inputText) {
        handleInputChange(result.output);
        toast.success('JSON auto-corrected and formatted');
      } else {
        toast.error('Invalid JSON - cannot format');
      }
    }
  }, [inputText, handleInputChange, toast]);

  const schemas = useMemo(() => {
    return generateAllSchemas(
      jsonToCrystalContent.faqs,
      jsonToCrystalContent.howToSteps,
      {
        toolName: 'JSON to Crystal Converter',
        toolUrl: 'json-to-crystal',
        description: jsonToCrystalContent.subtitle,
        featureList: jsonToCrystalContent.features.map(f => f.title),
        howToTitle: jsonToCrystalContent.howToSectionTitle,
        howToDescription: 'Step-by-step guide to convert JSON to Crystal structs online',
      }
    );
  }, []);

  const settingsTabs = [
    { id: 'settings-type', label: 'Type', icon: 'fas fa-cube' },
    { id: 'settings-naming', label: 'Naming', icon: 'fas fa-tag' },
    { id: 'settings-options', label: 'Options', icon: 'fas fa-cog' },
    { id: 'settings-presets', label: 'Presets', icon: 'fas fa-magic' },
  ];

  const sampleTemplates = crystalSamples.map(s => ({
    name: s.name,
    description: s.name,
    content: s.json,
  }));

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
        {settingsTabId === 'settings-type' && (
          <CrystalTypePanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-naming' && (
          <CrystalNamingPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-options' && (
          <CrystalOptionsPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <CrystalPresetsPanel onPresetSelect={(presetSettings) => updateSettings(presetSettings)} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      <IDELayout
        toolName="JSON to Crystal"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
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
              sampleTemplates={sampleTemplates}
              onLoadTemplate={(template) => {
                handleInputChange(template.content);
                toast.success(`Loaded: ${template.name}`);
                trackEvent('load_sample', 'json-to-crystal', template.name);
              }}
            />
            <MonacoEditorPanel
              value={inputText}
              onChange={handleInputChange}
              language={inputLanguage}
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to Crystal Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (crystalSamples.length > 0) {
                  handleInputChange(crystalSamples[0].json);
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
              label="Crystal Output"
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
              placeholder="Crystal code will appear here..."
              emptyStateTitle="Crystal Output"
              emptyStateInstructions={[
                'Converted Crystal code will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={outputText} />
          </div>
        </div>
        
      </IDELayout>

      <article id="seo-content">
        <SEOContent
          title={jsonToCrystalContent.title}
          subtitle={jsonToCrystalContent.subtitle}
          trustBadges={jsonToCrystalContent.trustBadges}
          features={jsonToCrystalContent.features}
          howToSteps={jsonToCrystalContent.howToSteps}
          howToSectionTitle={jsonToCrystalContent.howToSectionTitle}
          featuresSectionTitle={jsonToCrystalContent.featuresSectionTitle}
          educationalContent={jsonToCrystalContent.educationalContent}
          useCases={jsonToCrystalContent.useCases}
          technicalSpecs={jsonToCrystalContent.technicalSpecs}
          comparison={jsonToCrystalContent.comparison}
          comparisonSectionTitle={jsonToCrystalContent.comparisonSectionTitle}
          faqs={jsonToCrystalContent.faqs}
          whyChoose={jsonToCrystalContent.whyChoose}
          whyChooseSectionTitle={jsonToCrystalContent.whyChooseSectionTitle}
          relatedTools={jsonToCrystalContent.relatedTools}
        />
      </article>

      <Footer />
      
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON to Crystal"
        sections={jsonToCrystalHelp}
      />
    </>
  );
}
