'use client';

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToRubyStore } from '@/store/jsonToRuby';
import { convertJSONToRuby } from '@/lib/ruby/generator';
import { RUBY_PRESETS, applyPreset } from '@/lib/ruby/presets';
import { JSON_TO_RUBY_SAMPLES, type SampleTemplate } from '@/data/json-to-ruby-samples';
import { jsonToRubySEO } from '@/data/json-to-ruby-seo';
import { jsonToRubyHelp } from '@/data/json-to-ruby-help';
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

import { RubyOutputPanel } from '@/components/tools/json-to-ruby/RubyOutputPanel';
import { RubySyntaxPanel } from '@/components/tools/json-to-ruby/RubySyntaxPanel';
import { RubyClassPanel } from '@/components/tools/json-to-ruby/RubyClassPanel';
import { RubyPresetsPanel } from '@/components/tools/json-to-ruby/RubyPresetsPanel';

const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then((mod) => ({ default: mod.MonacoEditorPanel })),
  { ssr: false, loading: () => <div className="editor-loading-skeleton"><div className="skeleton-shimmer" /></div> }
);

type SettingsTabId = 'settings-output' | 'settings-syntax' | 'settings-class' | 'settings-presets';

export default function JsonToRubyPage() {
  const { settings, updateSettings, resetAll } = useJsonToRubyStore();

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
  } = useTabs({ toolName: 'JSON to Ruby', storageKey: 'ruby-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output, setOutput] = useState(activeTab?.outputJSON || '');
  const [errors, setErrors] = useState<Array<{ message: string; type: string }>>([]);
  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-output');
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
    const result = convertJSONToRuby(input, settings);
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
  const handleDownload = () => { if (output) downloadTextFile(output, `${settings.rootClassName.toLowerCase()}.rb`, 'text/x-ruby'); };
  const handleLoadSample = (template: SampleTemplate) => setInput(template.content);
  const handleApplyPreset = (presetId: string) => updateSettings(applyPreset(settings, presetId));

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button className={settingsTabId === 'settings-output' ? 'active' : ''} onClick={() => setSettingsTabId('settings-output')}><i className="fas fa-cube"></i> Output</button>
        <button className={settingsTabId === 'settings-syntax' ? 'active' : ''} onClick={() => setSettingsTabId('settings-syntax')}><i className="fas fa-hashtag"></i> Syntax</button>
        <button className={settingsTabId === 'settings-class' ? 'active' : ''} onClick={() => setSettingsTabId('settings-class')}><i className="fas fa-code"></i> Class</button>
        <button className={settingsTabId === 'settings-presets' ? 'active' : ''} onClick={() => setSettingsTabId('settings-presets')}><i className="fas fa-magic"></i> Presets</button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-output' && <RubyOutputPanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-syntax' && <RubySyntaxPanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-class' && <RubyClassPanel settings={settings} updateSettings={updateSettings} />}
        {settingsTabId === 'settings-presets' && <RubyPresetsPanel presets={RUBY_PRESETS} onApplyPreset={handleApplyPreset} />}
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'JSON to Ruby Converter', description: jsonToRubySEO.description, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
      <IDELayout
        toolName="JSON to Ruby"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
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
            <EditorToolbar label="JSON Input" onUpload={handleUpload} onPaste={handlePaste} onClear={handleClear} onAutoCorrect={handleAutoCorrect} sampleTemplates={JSON_TO_RUBY_SAMPLES} onLoadTemplate={handleLoadSample} />
            <MonacoEditorPanel 
              value={input} 
              onChange={setInput} 
              language="json" 
              editorSide="left" 
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to Ruby Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (JSON_TO_RUBY_SAMPLES.length > 0) {
                  setInput(JSON_TO_RUBY_SAMPLES[0].content);
                }
              }}
            />
            {errors.length > 0 && <div className="editor-errors">{errors.map((e, i) => <div key={i} className="error-item"><i className="fas fa-exclamation-circle"></i>{e.message}</div>)}</div>}
            <StatsBar text={input} validationState={validationState} />
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
            <OutputToolbar label="Ruby Output" onCopy={output ? handleCopy : undefined} onDownload={output ? handleDownload : undefined} />
            <MonacoEditorPanel 
              value={output} 
              language="ruby" 
              editorSide="right" 
              readOnly 
              placeholder="Ruby code will appear here..."
              emptyStateTitle="Ruby Output"
              emptyStateInstructions={[
                'Converted Ruby code will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={output} />
          </div>
        </div>
        <article id="seo-content"><SEOContent title={jsonToRubySEO.title} subtitle={jsonToRubySEO.subtitle} trustBadges={jsonToRubySEO.trustBadges} features={jsonToRubySEO.features} howToSteps={jsonToRubySEO.howToSteps} howToSectionTitle={jsonToRubySEO.howToSectionTitle} educationalContent={jsonToRubySEO.educationalContent} useCases={jsonToRubySEO.useCases} whyChoose={jsonToRubySEO.whyChoose} whyChooseSectionTitle={jsonToRubySEO.whyChooseSectionTitle} technicalSpecs={jsonToRubySEO.technicalSpecs} comparison={jsonToRubySEO.comparison} comparisonSectionTitle={jsonToRubySEO.comparisonSectionTitle} faqs={jsonToRubySEO.faqs} relatedTools={jsonToRubySEO.relatedTools} /></article>
      </IDELayout>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} toolName="JSON to Ruby" sections={jsonToRubyHelp} />
    </>
  );
}
