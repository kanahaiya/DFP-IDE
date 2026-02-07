'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useJsonToSchemaStore, SCHEMA_FORMATS } from '@/store/jsonToSchema';
import { SCHEMA_GENERATOR_PRESETS, applySchemaGeneratorPreset } from '@/lib/schema-generator/presets';
import { jsonToSchemaSamples } from '@/data/json-to-schema-samples';
import { jsonToSchemaSEO } from '@/data/json-to-schema-seo';
import { jsonToSchemaHelp } from '@/data/json-to-schema-help';
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
import { SchemaFormatPanel } from '@/components/tools/json-to-schema/SchemaFormatPanel';
import { SchemaOptionsPanel } from '@/components/tools/json-to-schema/SchemaOptionsPanel';
import { SchemaPresetsPanel } from '@/components/tools/json-to-schema/SchemaPresetsPanel';

type SettingsTabId = 'settings-format' | 'settings-options' | 'settings-presets';

export default function JsonToSchemaPage() {
  const {
    result,
    settings,
    generate,
    setFormat,
    updateSettings,
    clear,
    formatInput,
  } = useJsonToSchemaStore();

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
  } = useTabs({ toolName: 'JSON to Schema', storageKey: 'schema-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');
  const [output, setOutput] = useState(activeTab?.outputJSON || result?.output || '');
  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-format');
  const [showHelp, setShowHelp] = useState(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Initial generation
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync local input with store and trigger generation
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        const { input: storeInput, setInput: storeSetInput } = useJsonToSchemaStore.getState();
        if (storeInput !== input) {
          storeSetInput(input);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [input]);

  // Sync store result with local output
  useEffect(() => {
    if (result?.output) {
      setOutput(result.output);
    }
  }, [result]);

  // Get current format info
  const currentFormat = SCHEMA_FORMATS.find(f => f.id === settings.format);
  const outputLanguage = currentFormat?.language || 'json';

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
      // Paste failed
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
    if (!output || !currentFormat) return;
    const filename = `${settings.rootName.toLowerCase()}.${currentFormat.fileExtension}`;
    downloadTextFile(output, filename, 'text/plain');
  };

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applySchemaGeneratorPreset(settings, presetId);
    updateSettings(newSettings);
  };

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-format' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-format')}
        >
          <i className="fas fa-file-code"></i> Format
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-options' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-format' && (
          <SchemaFormatPanel
            formats={SCHEMA_FORMATS}
            selectedFormat={settings.format}
            onSelectFormat={setFormat}
          />
        )}
        {settingsTabId === 'settings-options' && (
          <SchemaOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-presets' && (
          <SchemaPresetsPanel presets={SCHEMA_GENERATOR_PRESETS} onApplyPreset={handleApplyPreset} />
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
            name: 'JSON to Schema Generator',
            description: jsonToSchemaSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              '10+ output formats',
              'JSON Schema Draft 2020-12',
              'TypeScript interfaces',
              'Zod validation schemas',
              'GraphQL type definitions',
              'Smart type inference',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON to Schema"
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

        {/* Format Quick Select */}
        <div className="format-quick-select">
          {SCHEMA_FORMATS.slice(0, 6).map((format) => (
            <button
              key={format.id}
              className={`format-chip ${settings.format === format.id ? 'active' : ''}`}
              onClick={() => setFormat(format.id)}
            >
              <i className={`fas ${format.icon}`}></i>
              {format.name.split(' ')[0]}
            </button>
          ))}
          <button
            className="format-chip more"
            onClick={() => setSettingsTabId('settings-format')}
          >
            <i className="fas fa-ellipsis-h"></i>
            More
          </button>
        </div>

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
              onClear={clear}
              onAutoCorrect={formatInput}
              sampleTemplates={jsonToSchemaSamples}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={setInput}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON here..."
              emptyStateTitle="Welcome to JSON Schema Generator"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (jsonToSchemaSamples.length > 0) {
                  setInput(jsonToSchemaSamples[0].content);
                }
              }}
            />
            {result?.errors && result.errors.length > 0 && (
              <div className="editor-errors">
                {result.errors.map((error, index) => (
                  <div key={index} className="error-item">
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
              label={`${currentFormat?.name || 'Schema'} Output`}
              onCopy={output ? handleCopy : undefined}
              onDownload={output ? handleDownload : undefined}
            />
            <MonacoEditorPanel
              value={output}
              language={outputLanguage}
              editorSide="right"
              readOnly
              placeholder="Generated schema will appear here..."
              emptyStateTitle="Schema Output"
              emptyStateInstructions={[
                'Generated schema will appear here',
                'Use the input panel to paste your JSON',
              ]}
            />
            <StatsBar text={output} />
          </div>
        </div>

        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonToSchemaSEO.heroTitle}
            subtitle={jsonToSchemaSEO.heroSubtitle}
            features={jsonToSchemaSEO.features}
            howToSteps={jsonToSchemaSEO.howToSteps}
            educationalContent={jsonToSchemaSEO.educationalContent}
            useCases={jsonToSchemaSEO.useCases}
            technicalSpecs={jsonToSchemaSEO.technicalSpecs}
            faqs={jsonToSchemaSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON to Schema Generator"
        sections={jsonToSchemaHelp}
      />

      <style jsx>{`
        .format-quick-select {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }
        
        .format-chip {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--text-secondary);
        }
        
        .format-chip:hover {
          background: var(--hover);
          border-color: var(--primary);
          color: var(--text);
        }
        
        .format-chip.active {
          background: var(--primary-subtle);
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .format-chip.more {
          background: transparent;
          border-style: dashed;
        }
        
        .format-chip i {
          font-size: 0.75rem;
        }
        
        .editor-errors {
          padding: 0.5rem 0.75rem;
          background: rgba(248, 81, 73, 0.1);
          border-top: 1px solid rgba(248, 81, 73, 0.3);
        }
        
        .error-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--danger);
          padding: 0.25rem 0;
        }
      `}</style>
    </>
  );
}
