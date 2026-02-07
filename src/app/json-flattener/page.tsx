'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { FlattenerModePanel } from '@/components/tools/json-flattener/FlattenerModePanel';
import { FlattenerOptionsPanel } from '@/components/tools/json-flattener/FlattenerOptionsPanel';
import { FlattenerAdvancedPanel } from '@/components/tools/json-flattener/FlattenerAdvancedPanel';
import { FlattenerPresetsPanel } from '@/components/tools/json-flattener/FlattenerPresetsPanel';
import { useFlattenerStore } from '@/store/flattener';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { flattenJSON, type FlattenerSettings } from '@/lib/flattener/converter';
import { validateInput } from '@/lib/flattener/validator';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { FLATTENER_SAMPLES } from '@/data/json-flattener-samples';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonFlattenerHelpSections } from '@/data/json-flattener-help';
import { jsonFlattenerContent } from '@/data/json-flattener-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';

export default function JSONFlattenerPage() {
  const { settings: globalSettings, updateSettings, setStats: setGlobalStats } = useFlattenerStore();
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
  } = useTabs({ toolName: 'JSON Flattener', storageKey: 'flattener-tabs' });
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-mode');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Array<{ line: number; column: number; message: string; severity: 'error' | 'warning' }>>([]);
  const [stats, setStats] = useState<{ inputKeys: number; outputKeys: number; maxDepth: number; arraysFlattened: number } | null>(null);
  
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
        updateSettings(activeTab.settings as unknown as Partial<FlattenerSettings>);
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
  
  // Perform flattening
  const performFlattening = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('');
      setErrors([]);
      setStats(null);
      setGlobalStats(null);
      return;
    }
    
    // Validate input
    const validation = validateInput(inputText);
    
    if (!validation.isValid) {
      const validationErrors = validation.errors.map(e => ({
        line: e.line,
        column: e.column,
        message: e.message,
        severity: e.severity,
      }));
      setErrors(validationErrors);
      setOutputText('');
      setStats(null);
      setGlobalStats(null);
      return;
    }
    
    const warningErrors = validation.warnings.map(w => ({
      line: w.line,
      column: w.column,
      message: w.message,
      severity: 'warning' as const,
    }));
    
    setErrors(warningErrors);
    
    // Flatten
    const result = flattenJSON(inputText, settings);
    
    if (result.success) {
      setOutputText(result.output);
      setStats(result.stats);
      setGlobalStats(result.stats);
      trackEvent('flatten', 'json_flattener', settings.notation);
    } else {
      setOutputText('');
      setErrors([{ line: 1, column: 1, message: result.error, severity: 'error' }]);
      setStats(null);
      setGlobalStats(null);
    }
  }, [inputText, settings, setGlobalStats]);
  
  // Debounced flattening
  useEffect(() => {
    const timer = setTimeout(() => {
      performFlattening();
    }, 300);
    return () => clearTimeout(timer);
  }, [performFlattening]);
  
  // Handlers
  const handleUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setInputText(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_flattener', file.type);
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
    setGlobalStats(null);
    toast.info('Input cleared');
  }, [toast, setGlobalStats]);
  
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
      trackCopy('json_flattener');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText, toast]);
  
  const handleDownload = useCallback(() => {
    if (!outputText) {
      toast.error('No output to download');
      return;
    }
    const filename = `flattened_${settings.notation}_${getTimestamp()}.json`;
    downloadTextFile(outputText, filename);
    toast.success(`Downloaded ${filename}`);
    trackDownload('json');
  }, [outputText, settings.notation, toast]);
  
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
          <i className="fas fa-compress-alt"></i> Mode
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
        {settingsTabId === 'settings-mode' && <FlattenerModePanel />}
        {settingsTabId === 'settings-options' && <FlattenerOptionsPanel />}
        {settingsTabId === 'settings-advanced' && <FlattenerAdvancedPanel />}
        {settingsTabId === 'settings-presets' && <FlattenerPresetsPanel />}
      </div>
      
      {stats && (
        <div className="settings-stats">
          <h4><i className="fas fa-chart-bar"></i> Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.inputKeys}</span>
              <span className="stat-label">Input Keys</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.outputKeys}</span>
              <span className="stat-label">Output Keys</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.maxDepth}</span>
              <span className="stat-label">Max Depth</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.arraysFlattened}</span>
              <span className="stat-label">Arrays</span>
            </div>
          </div>
        </div>
      )}
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
            label="Input (Nested JSON)"
            onUpload={handleUpload}
            onPaste={handlePaste}
            onClear={handleClear}
            onAutoCorrect={handleAutoCorrect}
            sampleTemplates={FLATTENER_SAMPLES}
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
            label={`Flattened Output (${settings.notation})`}
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
        toolName="JSON Flattener"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonFlattenerContent.title}
          subtitle={jsonFlattenerContent.subtitle}
          trustBadges={jsonFlattenerContent.trustBadges}
          features={jsonFlattenerContent.features}
          howToSteps={jsonFlattenerContent.howToSteps}
          faqs={jsonFlattenerContent.faqs}
          technicalSpecs={jsonFlattenerContent.technicalSpecs}
          useCases={jsonFlattenerContent.useCases}
          whyChoose={jsonFlattenerContent.whyChoose}
          comparison={jsonFlattenerContent.comparisonTable?.rows}
          relatedTools={jsonFlattenerContent.relatedTools}
          howToSectionTitle={jsonFlattenerContent.howToSectionTitle}
          featuresSectionTitle={jsonFlattenerContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonFlattenerContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonFlattenerContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD */}
      <JsonLd data={generateAllSchemas(
        jsonFlattenerContent.faqs || [],
        jsonFlattenerContent.howToSteps || [],
        {
          toolName: 'JSON Flattener',
          toolUrl: 'json-flattener',
          description: jsonFlattenerContent.description || 'Flatten nested JSON to key-value pairs with multiple notation styles',
          featureList: jsonFlattenerContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Flatten JSON Online',
          howToDescription: 'Learn how to flatten nested JSON objects to flat key-value pairs using our free online flattener',
        }
      )} />
      
      <Footer />
      <ShareWidget />
      
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Flattener"
        sections={jsonFlattenerHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
