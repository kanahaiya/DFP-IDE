'use client';

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToHaskellStore } from '@/store/jsonToHaskell';
import { convertJSONToHaskell } from '@/lib/haskell/generator';
import { HASKELL_PRESETS, applyPreset } from '@/lib/haskell/presets';
import { JSON_TO_HASKELL_SAMPLES, type SampleTemplate } from '@/data/json-to-haskell-samples';
import { jsonToHaskellSEO } from '@/data/json-to-haskell-seo';
import { jsonToHaskellHelp } from '@/data/json-to-haskell-help';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';

import { HaskellInstancePanel } from '@/components/tools/json-to-haskell/HaskellInstancePanel';
import { HaskellDerivingPanel } from '@/components/tools/json-to-haskell/HaskellDerivingPanel';
import { HaskellModulePanel } from '@/components/tools/json-to-haskell/HaskellModulePanel';
import { HaskellPresetsPanel } from '@/components/tools/json-to-haskell/HaskellPresetsPanel';

const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then((mod) => ({ default: mod.MonacoEditorPanel })),
  { ssr: false, loading: () => <div className="editor-loading-skeleton"><div className="skeleton-shimmer" /></div> }
);

type SettingsTabId = 'settings-instance' | 'settings-deriving' | 'settings-module' | 'settings-presets';

export default function JsonToHaskellPage() {
  const { settings, updateSettings, resetAll } = useJsonToHaskellStore();

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
  } = useTabs({ toolName: 'JSON to Haskell', storageKey: 'haskell-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output, setOutput] = useState(activeTab?.outputJSON || '');
  const [errors, setErrors] = useState<Array<{ message: string; type: string }>>([]);
  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-instance');
  const [showHelp, setShowHelp] = useState(false);
  
  const validationState = useMemo(() => ({
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: 0,
  }), [errors.length]);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);
  const isTabSyncingRef = useRef(false);

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
    if (files && files.length > 0) {
      try {
        const content = await readFileAsText(files[0]);
        setInput(content);
      } catch {
        // Error handling
      }
    }
  }, [setInput]);

  const performConversion = useCallback(() => {
    if (!input.trim()) { setOutput(''); setErrors([]); return; }
    const result = convertJSONToHaskell(input, settings);
    if (result.success && result.code) { setOutput(result.code); setErrors([]); }
    else { setOutput(''); setErrors(result.errors?.map(e => ({ message: e.message, type: e.type as 'syntax' | 'type' | 'naming' })) || []); }
  }, [input, settings, setOutput, setErrors]);

  // Load tab data when switching to a different tab
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInput(activeTab.inputJSON || '');
      setOutput(activeTab.outputJSON || '');
      const timer = setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, activeTab]);

  // Save current tab state when input/output changes (skip during tab sync)
  useEffect(() => {
    if (isTabSyncingRef.current) {
      return;
    }
    if (activeTab && activeTabId) {
      const hasChanges = 
        activeTab.inputJSON !== input || 
        activeTab.outputJSON !== output;
      if (hasChanges) {
        updateTab(activeTabId, {
          inputJSON: input,
          outputJSON: output,
        });
      }
    }
  }, [input, output, activeTabId, activeTab, updateTab]);

  useEffect(() => { const timer = setTimeout(() => performConversion(), 300); return () => clearTimeout(timer); }, [performConversion]);

  const handleUpload = async (file: File) => { try { setInput(await readFileAsText(file)); } catch { setErrors([{ message: 'Failed to read file', type: 'syntax' }]); } };
  const handlePaste = async () => { try { setInput(await navigator.clipboard.readText()); } catch { setErrors([{ message: 'Failed to paste', type: 'syntax' }]); } };
  const handleClear = () => resetAll();
  const handleAutoCorrect = () => { try { setInput(JSON.stringify(JSON.parse(input), null, 2)); } catch {} };
  const handleCopy = async () => { if (output) try { await copyToClipboard(output); } catch {} };
  const handleDownload = () => { if (output) downloadTextFile(output, `${settings.rootClassName}.hs`, 'text/x-haskell'); };
  const handleLoadSample = (template: SampleTemplate) => setInput(template.content);
  const handleApplyPreset = (presetId: string) => updateSettings(applyPreset(settings, presetId));

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button className={settingsTabId === 'settings-instance' ? 'active' : ''} onClick={() => setSettingsTabId('settings-instance')}><i className="fas fa-cogs"></i> Instance</button>
        <button className={settingsTabId === 'settings-deriving' ? 'active' : ''} onClick={() => setSettingsTabId('settings-deriving')}><i className="fas fa-list"></i> Deriving</button>
        <button className={settingsTabId === 'settings-module' ? 'active' : ''} onClick={() => setSettingsTabId('settings-module')}><i className="fas fa-folder"></i> Module</button>
        <button className={settingsTabId === 'settings-presets' ? 'active' : ''} onClick={() => setSettingsTabId('settings-presets')}><i className="fas fa-magic"></i> Presets</button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-instance' && <HaskellInstancePanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-deriving' && <HaskellDerivingPanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-module' && <HaskellModulePanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-presets' && <HaskellPresetsPanel presets={HASKELL_PRESETS} onApplyPreset={handleApplyPreset} />}
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'JSON to Haskell Converter', description: jsonToHaskellSEO.description, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
      <IDELayout
        toolName="JSON to Haskell"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
        {/* Conversion Session Tabs */}
        <TabManager
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={switchTab}
          onTabClose={closeTab}
          onTabRename={renameTab}
          onAddTab={addTab}
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
              [layout === 'vertical' ? 'height' : 'width']: `${size}%`
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <EditorToolbar label="JSON Input" onUpload={handleUpload} onPaste={handlePaste} onClear={handleClear} onAutoCorrect={handleAutoCorrect} sampleTemplates={JSON_TO_HASKELL_SAMPLES} onLoadTemplate={handleLoadSample} />
            <MonacoEditorPanel 
              value={input} 
              onChange={setInput} 
              language="json" 
              editorSide="left" 
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to Haskell Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (JSON_TO_HASKELL_SAMPLES.length > 0) {
                  setInput(JSON_TO_HASKELL_SAMPLES[0].content);
                }
              }}
            />
            {errors.length > 0 && <div className="editor-errors">{errors.map((e, i) => <div key={i} className="error-item"><i className="fas fa-exclamation-circle"></i>{e.message}</div>)}</div>}
            <StatsBar text={input} validationState={validationState} />
          </div>
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar label="Haskell Output" onCopy={output ? handleCopy : undefined} onDownload={output ? handleDownload : undefined} />
            <MonacoEditorPanel 
              value={output} 
              language="haskell" 
              editorSide="right" 
              readOnly 
              placeholder="Haskell code will appear here..."
              emptyStateTitle="Haskell Output"
              emptyStateInstructions={[
                'Converted Haskell code will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={output} />
          </div>
        </div>
        <article id="seo-content"><SEOContent title={jsonToHaskellSEO.title} subtitle={jsonToHaskellSEO.subtitle} trustBadges={jsonToHaskellSEO.trustBadges} features={jsonToHaskellSEO.features} howToSteps={jsonToHaskellSEO.howToSteps} howToSectionTitle={jsonToHaskellSEO.howToSectionTitle} educationalContent={jsonToHaskellSEO.educationalContent} useCases={jsonToHaskellSEO.useCases} whyChoose={jsonToHaskellSEO.whyChoose} whyChooseSectionTitle={jsonToHaskellSEO.whyChooseSectionTitle} technicalSpecs={jsonToHaskellSEO.technicalSpecs} comparison={jsonToHaskellSEO.comparison} comparisonSectionTitle={jsonToHaskellSEO.comparisonSectionTitle} faqs={jsonToHaskellSEO.faqs} relatedTools={jsonToHaskellSEO.relatedTools} /></article>
      </IDELayout>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} toolName="JSON to Haskell" sections={jsonToHaskellHelp} />
    </>
  );
}
