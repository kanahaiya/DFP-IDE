'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToProtobufStore } from '@/store/jsonToProtobuf';
import { PROTOBUF_PRESETS, applyProtobufPreset } from '@/lib/protobuf/presets';
import { jsonToProtobufSamples } from '@/data/json-to-protobuf-samples';
import { jsonToProtobufSEO } from '@/data/json-to-protobuf-seo';
import { jsonToProtobufHelp } from '@/data/json-to-protobuf-help';
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
  ProtobufOptionsPanel,
  ProtobufPresetsPanel,
} from '@/components/tools/json-to-protobuf';

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

export default function JsonToProtobufPage() {
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
  } = useJsonToProtobufStore();

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
  } = useTabs({ toolName: 'JSON to Protobuf', storageKey: 'protobuf-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output] = useState(activeTab?.outputJSON || result?.output || '');

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
    if (result?.output) {
      try {
        await copyToClipboard(result.output);
      } catch {
        // Error handling
      }
    }
  };

  // Handle download
  const handleDownload = () => {
    if (result?.output) {
      const filename = settings.rootMessageName.toLowerCase() || 'schema';
      downloadTextFile(result.output, `${filename}.proto`);
    }
  };

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyProtobufPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-content">
        <ProtobufOptionsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onReset={resetSettings}
        />
        <ProtobufPresetsPanel
          presets={PROTOBUF_PRESETS}
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
            name: 'JSON to Protobuf Converter',
            description: jsonToProtobufSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Proto2 and Proto3 syntax support',
              'Automatic type inference',
              'Nested message generation',
              'Download as .proto file',
              'Client-side processing',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to Protobuf"
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
              sampleTemplates={jsonToProtobufSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
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
              label="Protobuf Schema"
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            />
            <MonacoEditorPanel
              value={output}
              language="protobuf"
              editorSide="right"
              readOnly
              placeholder="Generated Protobuf schema will appear here..."
              emptyStateTitle="Protobuf Schema Output"
              emptyStateInstructions={[
                'Generated Protobuf schema will appear here',
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
            title={jsonToProtobufSEO.heroTitle}
            subtitle={jsonToProtobufSEO.heroSubtitle}
            howToSteps={jsonToProtobufSEO.howToSteps}
            educationalContent={jsonToProtobufSEO.educationalContent}
            technicalSpecs={jsonToProtobufSEO.technicalSpecs}
            faqs={jsonToProtobufSEO.faq}
            useCases={jsonToProtobufSEO.useCases}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        toolName="JSON to Protobuf"
        sections={jsonToProtobufHelp}
      />
    </>
  );
}
