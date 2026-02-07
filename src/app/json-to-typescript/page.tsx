'use client';

import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToTypeScriptStore } from '@/store/jsonToTypeScript';
import { convertJSONToTypeScript } from '@/lib/typescript/generator';
import { TYPESCRIPT_PRESETS, applyPreset } from '@/lib/typescript/presets';
import { JSON_TO_TYPESCRIPT_SAMPLES, type SampleTemplate } from '@/data/json-to-typescript-samples';
import { jsonToTypeScriptSEO } from '@/data/json-to-typescript-seo';
import { jsonToTypeScriptHelp } from '@/data/json-to-typescript-help';
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
import { useJSONValidation } from '@/hooks/useJSONValidation';
import { downloadTextFile, readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';

// Dynamic imports for heavy components
const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then((mod) => ({ default: mod.MonacoEditorPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="editor-loading-skeleton">
        <div className="skeleton-shimmer" />
      </div>
    ),
  }
);

// Settings panels
import { TypeScriptFormatPanel } from '@/components/tools/json-to-typescript/TypeScriptFormatPanel';
import { TypeScriptTypePanel } from '@/components/tools/json-to-typescript/TypeScriptTypePanel';
import { TypeScriptAdvancedPanel } from '@/components/tools/json-to-typescript/TypeScriptAdvancedPanel';
import { TypeScriptPresetsPanel } from '@/components/tools/json-to-typescript/TypeScriptPresetsPanel';

type SettingsTabId = 'settings-format' | 'settings-types' | 'settings-advanced' | 'settings-presets';

export default function JsonToTypeScriptPage() {
  const {
    settings,
    updateSettings,
    resetAll,
  } = useJsonToTypeScriptStore();

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
  } = useTabs({ toolName: 'JSON to TypeScript', storageKey: 'typescript-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output, setOutput] = useState(activeTab?.outputJSON || '');
  const [, setErrors] = useState<Array<{ message: string; type: string }>>([]);
  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-format');
  const [showHelp, setShowHelp] = useState(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);
  const isTabSyncingRef = useRef(false);

  // Load tab data when switching to a different tab
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInput(activeTab.inputJSON || '');
      setOutput(activeTab.outputJSON || '');
      // Reset sync flag after state update completes
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

  // JSON validation with debouncing
  const inputValidation = useJSONValidation(input, 500);
  const validationErrors = useMemo(() => 
    inputValidation.errors.concat(inputValidation.warnings),
    [inputValidation.errors, inputValidation.warnings]
  );
  const validationState = useMemo(() => ({
    isValid: inputValidation.isValid,
    errorCount: inputValidation.errors.length,
    warningCount: inputValidation.warnings.length,
  }), [inputValidation.isValid, inputValidation.errors.length, inputValidation.warnings.length]);

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

  // Perform conversion
  const performConversion = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setErrors([]);
      return;
    }

    const result = convertJSONToTypeScript(input, settings);

    if (result.success && result.code) {
      setOutput(result.code);
      setErrors([]);
    } else {
      setOutput('');
      setErrors(result.errors || []);
    }
  }, [input, settings, setOutput, setErrors]);

  // Debounced conversion
  useEffect(() => {
    const timer = setTimeout(() => {
      performConversion();
    }, 300);
    return () => clearTimeout(timer);
  }, [performConversion]);

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
    } catch {
      setErrors([{ message: 'Failed to read file', type: 'syntax' }]);
    }
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      setErrors([{ message: 'Failed to paste from clipboard', type: 'syntax' }]);
    }
  };

  // Handle clear
  const handleClear = () => {
    resetAll();
  };

  // Handle auto-correct (format JSON)
  const handleAutoCorrect = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch {
      // Already has errors
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (!output) return;
    try {
      await copyToClipboard(output);
    } catch {
      // Copy failed
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!output) return;
    const filename = `${settings.rootTypeName.toLowerCase()}.ts`;
    downloadTextFile(output, filename, 'text/typescript');
  };

  // Handle sample template
  const handleLoadSample = (template: SampleTemplate) => {
    setInput(template.content);
  };

  // Handle load sample for MonacoEditorPanel onLoadSample prop
  const handleLoadSampleForEditor = useCallback(() => {
    if (JSON_TO_TYPESCRIPT_SAMPLES.length > 0) {
      setInput(JSON_TO_TYPESCRIPT_SAMPLES[0].content);
    }
  }, [setInput]);

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-format' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-format')}
        >
          <i className="fas fa-sliders-h"></i> Format
        </button>
        <button
          className={settingsTabId === 'settings-types' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-types')}
        >
          <i className="fas fa-code"></i> Types
        </button>
        <button
          className={settingsTabId === 'settings-advanced' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-advanced')}
        >
          <i className="fas fa-cog"></i> Advanced
        </button>
        <button
          className={settingsTabId === 'settings-presets' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-format' && (
          <TypeScriptFormatPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-types' && (
          <TypeScriptTypePanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-advanced' && (
          <TypeScriptAdvancedPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <TypeScriptPresetsPanel
            presets={TYPESCRIPT_PRESETS}
            onApplyPreset={handleApplyPreset}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JSON to TypeScript Converter',
            description: jsonToTypeScriptSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'TypeScript interface generation',
              'Type alias support',
              'Optional property detection',
              'Union types for mixed arrays',
              'JSDoc comment generation',
              'Multiple naming conventions',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to TypeScript"
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

        {/* Editor Panels */}
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
              label="JSON Input"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={handleClear}
              onAutoCorrect={handleAutoCorrect}
              sampleTemplates={JSON_TO_TYPESCRIPT_SAMPLES}
              onLoadTemplate={handleLoadSample}
            />
            
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to TypeScript Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={handleLoadSampleForEditor}
              validationErrors={validationErrors}
            />
            
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
            <OutputToolbar
              label="TypeScript Output"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            />
            
            <MonacoEditorPanel
              value={output}
              language="typescript"
              editorSide="right"
              readOnly
              placeholder="TypeScript interfaces will appear here..."
              emptyStateTitle="TypeScript Output"
              emptyStateInstructions={[
                'Converted TypeScript interfaces will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonToTypeScriptSEO.title}
            subtitle={jsonToTypeScriptSEO.subtitle}
            trustBadges={jsonToTypeScriptSEO.trustBadges}
            features={jsonToTypeScriptSEO.features}
            howToSteps={jsonToTypeScriptSEO.howToSteps}
            howToSectionTitle={jsonToTypeScriptSEO.howToSectionTitle}
            educationalContent={jsonToTypeScriptSEO.educationalContent}
            useCases={jsonToTypeScriptSEO.useCases}
            whyChoose={jsonToTypeScriptSEO.whyChoose}
            whyChooseSectionTitle={jsonToTypeScriptSEO.whyChooseSectionTitle}
            technicalSpecs={jsonToTypeScriptSEO.technicalSpecs}
            comparison={jsonToTypeScriptSEO.comparison}
            comparisonSectionTitle={jsonToTypeScriptSEO.comparisonSectionTitle}
            faqs={jsonToTypeScriptSEO.faqs}
            relatedTools={jsonToTypeScriptSEO.relatedTools}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON to TypeScript"
        sections={jsonToTypeScriptHelp}
      />
    </>
  );
}
