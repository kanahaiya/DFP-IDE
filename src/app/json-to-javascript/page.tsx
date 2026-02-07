'use client';

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToJavaScriptStore } from '@/store/jsonToJavaScript';
import { convertJSONToJavaScript } from '@/lib/javascript/generator';
import { JAVASCRIPT_PRESETS, applyPreset } from '@/lib/javascript/presets';
import { JSON_TO_JAVASCRIPT_SAMPLES, type SampleTemplate } from '@/data/json-to-javascript-samples';
import { jsonToJavaScriptSEO } from '@/data/json-to-javascript-seo';
import { jsonToJavaScriptHelp } from '@/data/json-to-javascript-help';
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
import { JavaScriptOutputPanel } from '@/components/tools/json-to-javascript/JavaScriptOutputPanel';
import { JavaScriptFormatPanel } from '@/components/tools/json-to-javascript/JavaScriptFormatPanel';
import { JavaScriptAdvancedPanel } from '@/components/tools/json-to-javascript/JavaScriptAdvancedPanel';
import { JavaScriptPresetsPanel } from '@/components/tools/json-to-javascript/JavaScriptPresetsPanel';

type SettingsTabId = 'settings-output' | 'settings-format' | 'settings-advanced' | 'settings-presets';

export default function JsonToJavaScriptPage() {
  const {
    settings,
    updateSettings,
    resetAll,
  } = useJsonToJavaScriptStore();

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
  } = useTabs({ toolName: 'JSON to JavaScript', storageKey: 'javascript-tabs' });

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

  // Perform conversion
  const performConversion = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setErrors([]);
      return;
    }

    const result = convertJSONToJavaScript(input, settings);

    if (result.success && result.code) {
      setOutput(result.code);
      setErrors([]);
    } else {
      setOutput('');
      setErrors(result.errors?.map(e => ({ message: e.message, type: e.type as 'syntax' | 'type' | 'naming' })) || []);
    }
  }, [input, settings, setOutput, setErrors]);

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
    const filename = `${settings.variableName || 'data'}.js`;
    downloadTextFile(output, filename, 'text/javascript');
  };

  // Handle sample template
  const handleLoadSample = (template: SampleTemplate) => {
    setInput(template.content);
  };

  // Handle preset
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
        <button
          className={settingsTabId === 'settings-output' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-output')}
        >
          <i className="fas fa-file-export"></i> Output
        </button>
        <button
          className={settingsTabId === 'settings-format' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-format')}
        >
          <i className="fas fa-sliders-h"></i> Format
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
        {settingsTabId === 'settings-output' && (
          <JavaScriptOutputPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-format' && (
          <JavaScriptFormatPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-advanced' && (
          <JavaScriptAdvancedPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <JavaScriptPresetsPanel
            presets={JAVASCRIPT_PRESETS}
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
            name: 'JSON to JavaScript Converter',
            description: jsonToJavaScriptSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'JavaScript object literal generation',
              'ES6 module export',
              'CommonJS export',
              'UMD module support',
              'Object.freeze option',
              'Multiple quote styles',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to JavaScript"
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
              sampleTemplates={JSON_TO_JAVASCRIPT_SAMPLES}
              onLoadTemplate={handleLoadSample}
            />
            
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to JavaScript Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (JSON_TO_JAVASCRIPT_SAMPLES.length > 0) {
                  setInput(JSON_TO_JAVASCRIPT_SAMPLES[0].content);
                }
              }}
            />
            
            {errors.length > 0 && (
              <div className="editor-errors">
                {errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <i className="fas fa-exclamation-circle"></i>
                    {error.message}
                  </div>
                ))}
              </div>
            )}
            
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
              label="JavaScript Output"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            />
            
            <MonacoEditorPanel
              value={output}
              language="javascript"
              editorSide="right"
              readOnly
              placeholder="JavaScript code will appear here..."
              emptyStateTitle="JavaScript Output"
              emptyStateInstructions={[
                'Converted JavaScript code will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonToJavaScriptSEO.title}
            subtitle={jsonToJavaScriptSEO.subtitle}
            trustBadges={jsonToJavaScriptSEO.trustBadges}
            features={jsonToJavaScriptSEO.features}
            howToSteps={jsonToJavaScriptSEO.howToSteps}
            howToSectionTitle={jsonToJavaScriptSEO.howToSectionTitle}
            educationalContent={jsonToJavaScriptSEO.educationalContent}
            useCases={jsonToJavaScriptSEO.useCases}
            whyChoose={jsonToJavaScriptSEO.whyChoose}
            whyChooseSectionTitle={jsonToJavaScriptSEO.whyChooseSectionTitle}
            technicalSpecs={jsonToJavaScriptSEO.technicalSpecs}
            comparison={jsonToJavaScriptSEO.comparison}
            comparisonSectionTitle={jsonToJavaScriptSEO.comparisonSectionTitle}
            faqs={jsonToJavaScriptSEO.faqs}
            relatedTools={jsonToJavaScriptSEO.relatedTools}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON to JavaScript"
        sections={jsonToJavaScriptHelp}
      />
    </>
  );
}
