'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToAvroStore } from '@/store/jsonToAvro';
import { AVRO_PRESETS, applyAvroPreset } from '@/lib/avro/presets';
import { jsonToAvroSamples } from '@/data/json-to-avro-samples';
import { jsonToAvroSEO } from '@/data/json-to-avro-seo';
import { jsonToAvroHelp } from '@/data/json-to-avro-help';
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
import {
  AvroOptionsPanel,
  AvroPresetsPanel,
} from '@/components/tools/json-to-avro';

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

export default function JsonToAvroPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    result,
    settings,
    generate,
    updateSettings,
    resetSettings,
    formatInput,
  } = useJsonToAvroStore();

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
  } = useTabs({ toolName: 'JSON to Avro', storageKey: 'avro-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output, setOutput] = useState(activeTab?.outputJSON || result?.schema || '');
  const isTabSyncingRef = useRef(false);

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
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
  };

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

  // Update output when result changes
  useEffect(() => {
    if (result?.schema && !isTabSyncingRef.current) {
      setOutput(result.schema);
    }
  }, [result?.schema]);

  // Generate on mount
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setInput(content);
    } catch {
      // Error handling
    }
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Error handling
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (output) {
      try {
        await copyToClipboard(output);
      } catch {
        // Error handling
      }
    }
  };

  // Handle download
  const handleDownload = () => {
    if (output) {
      const filename = settings.rootRecordName.toLowerCase() || 'schema';
      downloadTextFile(output, `${filename}.avsc`);
    }
  };

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyAvroPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-content">
        <AvroOptionsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onReset={resetSettings}
        />
        <AvroPresetsPanel
          presets={AVRO_PRESETS}
          onApplyPreset={handleApplyPreset}
        />
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
            name: 'JSON to Avro Converter',
            description: jsonToAvroSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Apache Avro schema generation',
              'Logical type inference',
              'Nested record support',
              'Download as .avsc file',
              'Client-side processing',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to Avro"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setIsHelpOpen(true)}
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
          {/* Input Panel */}
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
              onClear={() => setInput('')}
              onAutoCorrect={formatInput}
              sampleTemplates={jsonToAvroSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON to Avro Converter"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonToAvroSamples.length > 0) {
                  setInput(jsonToAvroSamples[0].content);
                }
              }}
            />
            {result && !result.success && result.errors.length > 0 && (
              <div className="editor-errors">
                {result.errors.map((error, i) => (
                  <div key={i} className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                ))}
              </div>
            )}
            <StatsBar text={input} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Output Panel */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="Avro Schema (.avsc)"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            />
            <MonacoEditorPanel
              value={output}
              language="json"
              editorSide="right"
              readOnly
              placeholder="Generated Avro schema will appear here..."
              emptyStateTitle="Avro Schema Output"
              emptyStateInstructions={[
                'Generated Avro schema will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            {result && result.warnings.length > 0 && (
              <div className="editor-warnings">
                {result.warnings.map((warning, i) => (
                  <div key={i} className="warning-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    {warning}
                  </div>
                ))}
              </div>
            )}
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonToAvroSEO.heroTitle}
            subtitle={jsonToAvroSEO.heroSubtitle}
            howToSteps={jsonToAvroSEO.howToSteps}
            educationalContent={jsonToAvroSEO.educationalContent}
            technicalSpecs={jsonToAvroSEO.technicalSpecs}
            faqs={jsonToAvroSEO.faq}
            useCases={jsonToAvroSEO.useCases}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        toolName="JSON to Avro"
        sections={jsonToAvroHelp}
      />

    </>
  );
}
