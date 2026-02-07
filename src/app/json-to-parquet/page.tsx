'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToParquetStore } from '@/store/jsonToParquet';
import { PARQUET_PRESETS, applyParquetPreset } from '@/lib/parquet/presets';
import { jsonToParquetSamples } from '@/data/json-to-parquet-samples';
import { jsonToParquetSEO } from '@/data/json-to-parquet-seo';
import { jsonToParquetHelp } from '@/data/json-to-parquet-help';
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
import { readFileAsText } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import {
  ParquetOptionsPanel,
  ParquetPresetsPanel,
  ParquetStatsPanel,
} from '@/components/tools/json-to-parquet';

// Dynamic imports for heavy components
const MonacoEditorPanel = dynamic(
  () =>
    import('@/components/common/MonacoEditorPanel').then((mod) => ({
      default: mod.MonacoEditorPanel,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="editor-loading-skeleton">
        <div className="skeleton-shimmer" />
      </div>
    ),
  }
);

export default function JsonToParquetPage() {
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
  } = useJsonToParquetStore();

  // Tab management
  const {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    closeTab,
    renameTab,
    switchTab,
    duplicateTab,
    closeOtherTabs,
    closeAllTabs,
    maxTabs,
    canAddTab,
  } = useTabs({ toolName: 'JSON to Parquet', storageKey: 'parquet-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output] = useState(activeTab?.outputJSON || result?.schemaText || '');

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

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyParquetPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-content">
        <ParquetOptionsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onReset={resetSettings}
        />
        <ParquetPresetsPanel
          presets={PARQUET_PRESETS}
          onApplyPreset={handleApplyPreset}
        />
        {result?.stats && <ParquetStatsPanel stats={result.stats} />}
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
            name: 'JSON to Parquet Converter',
            description: jsonToParquetSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Apache Parquet schema generation',
              'Multiple compression algorithms',
              'Type inference from JSON',
              'Nested structure support',
              'Client-side processing',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to Parquet"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setIsHelpOpen(true)}
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
              sampleTemplates={jsonToParquetSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON array here..."
              emptyStateTitle="Welcome to JSON to Parquet Converter"
              emptyStateInstructions={[
                'Pasting JSON array data',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonToParquetSamples.length > 0) {
                  setInput(jsonToParquetSamples[0].content);
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
              label="Parquet Schema"
              onCopy={output ? handleCopy : undefined}
            />
            <MonacoEditorPanel
              value={output}
              language="plaintext"
              editorSide="right"
              readOnly
              placeholder="Generated Parquet schema will appear here..."
              emptyStateTitle="Parquet Schema Output"
              emptyStateInstructions={[
                'Converted Parquet schema will appear here',
                'Use the input panel to paste your JSON array',
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
            title={jsonToParquetSEO.heroTitle}
            subtitle={jsonToParquetSEO.heroSubtitle}
            howToSteps={jsonToParquetSEO.howToSteps}
            educationalContent={jsonToParquetSEO.educationalContent}
            technicalSpecs={jsonToParquetSEO.technicalSpecs}
            faqs={jsonToParquetSEO.faq}
            useCases={jsonToParquetSEO.useCases}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        toolName="JSON to Parquet"
        sections={jsonToParquetHelp}
      />
    </>
  );
}
