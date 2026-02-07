'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { SqlDialectPanel } from '@/components/tools/json-to-sql/SqlDialectPanel';
import { SqlOutputPanel } from '@/components/tools/json-to-sql/SqlOutputPanel';
import { SqlOptionsPanel } from '@/components/tools/json-to-sql/SqlOptionsPanel';
import { SqlPresetsPanel } from '@/components/tools/json-to-sql/SqlPresetsPanel';
import { useJsonToSqlStore } from '@/store/jsonToSql';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { convertJSONToSQL } from '@/lib/sql/generator';
import { parseAndValidateJSON } from '@/lib/code-gen/typeInference';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { sqlSamples } from '@/data/json-to-sql-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonToSqlHelp } from '@/data/json-to-sql-help';
import { jsonToSqlContent } from '@/data/json-to-sql-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import type { EditorLanguage, ValidationError } from '@/types';

export default function JSONToSqlPage() {
  const { settings, updateSettings } = useJsonToSqlStore();
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
  } = useTabs({ toolName: 'JSON to SQL', storageKey: 'json-to-sql-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-dialect');
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
  const outputLanguage: EditorLanguage = 'sql';
  
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
      
      const result = convertJSONToSQL(inputText, settings);
      
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
      trackEvent('file_upload', 'json-to-sql', file.name);
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
      trackCopy('json-to-sql');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);

  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const filename = `${settings.tableName}_${getTimestamp()}.sql`;
    downloadTextFile(outputText, filename, 'text/plain');
    toast.success(`Downloaded: ${filename}`);
    trackDownload('sql');
  }, [outputText, settings.tableName, toast]);

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
      jsonToSqlContent.faqs,
      jsonToSqlContent.howToSteps,
      {
        toolName: 'JSON to SQL Converter',
        toolUrl: 'json-to-sql',
        description: jsonToSqlContent.subtitle,
        featureList: jsonToSqlContent.features.map(f => f.title),
        howToTitle: jsonToSqlContent.howToSectionTitle,
        howToDescription: 'Step-by-step guide to convert JSON to SQL statements online',
      }
    );
  }, []);

  const settingsTabs = [
    { id: 'settings-dialect', label: 'Dialect', icon: 'fas fa-database' },
    { id: 'settings-output', label: 'Output', icon: 'fas fa-file-code' },
    { id: 'settings-options', label: 'Options', icon: 'fas fa-cog' },
    { id: 'settings-presets', label: 'Presets', icon: 'fas fa-magic' },
  ];

  const sampleTemplates = sqlSamples.map(s => ({
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
        {settingsTabId === 'settings-dialect' && (
          <SqlDialectPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-output' && (
          <SqlOutputPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-options' && (
          <SqlOptionsPanel settings={settings} onSettingsChange={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <SqlPresetsPanel onPresetSelect={(presetSettings) => updateSettings(presetSettings)} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      <IDELayout
        toolName="JSON to SQL"
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
                trackEvent('load_sample', 'json-to-sql', template.name);
              }}
            />
            <MonacoEditorPanel
              value={inputText}
              onChange={handleInputChange}
              language={inputLanguage}
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to SQL Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (sqlSamples.length > 0) {
                  handleInputChange(sqlSamples[0].json);
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
              label="SQL Output"
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
              placeholder="SQL statements will appear here..."
              emptyStateTitle="SQL Output"
              emptyStateInstructions={[
                'Generated SQL statements will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={outputText} />
          </div>
        </div>
        
      </IDELayout>

      <article id="seo-content">
        <SEOContent
          title={jsonToSqlContent.title}
          subtitle={jsonToSqlContent.subtitle}
          trustBadges={jsonToSqlContent.trustBadges}
          features={jsonToSqlContent.features}
          howToSteps={jsonToSqlContent.howToSteps}
          howToSectionTitle={jsonToSqlContent.howToSectionTitle}
          featuresSectionTitle={jsonToSqlContent.featuresSectionTitle}
          educationalContent={jsonToSqlContent.educationalContent}
          useCases={jsonToSqlContent.useCases}
          technicalSpecs={jsonToSqlContent.technicalSpecs}
          comparison={jsonToSqlContent.comparison}
          comparisonSectionTitle={jsonToSqlContent.comparisonSectionTitle}
          faqs={jsonToSqlContent.faqs}
          whyChoose={jsonToSqlContent.whyChoose}
          whyChooseSectionTitle={jsonToSqlContent.whyChooseSectionTitle}
          relatedTools={jsonToSqlContent.relatedTools}
        />
      </article>

      <Footer />
      
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON to SQL"
        sections={jsonToSqlHelp}
      />
    </>
  );
}
