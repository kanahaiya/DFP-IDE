'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useJsonSchemaValidatorStore, EXAMPLE_SCHEMAS } from '@/store/jsonSchemaValidator';
import { SCHEMA_VALIDATOR_PRESETS, applySchemaPreset } from '@/lib/schema-validator/presets';
import { jsonSchemaValidatorSEO } from '@/data/json-schema-validator-seo';
import { jsonSchemaValidatorHelp } from '@/data/json-schema-validator-help';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
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
import { SchemaValidatorOptionsPanel } from '@/components/tools/json-schema-validator/SchemaValidatorOptionsPanel';
import { SchemaValidatorExamplesPanel } from '@/components/tools/json-schema-validator/SchemaValidatorExamplesPanel';
import { SchemaValidatorPresetsPanel } from '@/components/tools/json-schema-validator/SchemaValidatorPresetsPanel';
import { SchemaValidatorErrorsPanel } from '@/components/tools/json-schema-validator/SchemaValidatorErrorsPanel';

type SettingsTabId = 'settings-options' | 'settings-examples' | 'settings-presets' | 'settings-errors';

export default function JsonSchemaValidatorPage() {
  const {
    schema,
    data,
    result,
    schemaErrors,
    settings,
    setSchema,
    setData,
    validate,
    loadExample,
    updateSettings,
    formatData,
  } = useJsonSchemaValidatorStore();

  const [settingsTabId, setSettingsTabId] = useState<SettingsTabId>('settings-options');
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  
  // JSON validation for schema
  const schemaValidation = useJSONValidation(schema, 500);
  const schemaValidationErrors = useMemo(() => 
    schemaValidation.errors.concat(schemaValidation.warnings),
    [schemaValidation.errors, schemaValidation.warnings]
  );
  const schemaValidationState = useMemo(() => ({
    isValid: schemaValidation.isValid,
    errorCount: schemaValidation.errors.length,
    warningCount: schemaValidation.warnings.length,
  }), [schemaValidation.isValid, schemaValidation.errors.length, schemaValidation.warnings.length]);
  
  // JSON validation for data
  const dataValidation = useJSONValidation(data, 500);
  const dataValidationErrors = useMemo(() => 
    dataValidation.errors.concat(dataValidation.warnings),
    [dataValidation.errors, dataValidation.warnings]
  );
  const dataValidationState = useMemo(() => ({
    isValid: dataValidation.isValid,
    errorCount: dataValidation.errors.length,
    warningCount: dataValidation.warnings.length,
  }), [dataValidation.isValid, dataValidation.errors.length, dataValidation.warnings.length]);

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
        setSchema(content);
      } catch {
        // Error handling
      }
    }
  }, [setSchema]);

  // Initial validation
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle file upload for schema
  const handleSchemaUpload = useCallback(async (file: File) => {
    try {
      const content = await readFileAsText(file);
      setSchema(content);
    } catch {
      // Error handling
    }
  }, [setSchema]);

  // Handle paste for schema
  const handleSchemaPaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSchema(text);
    } catch {
      // Paste failed
    }
  }, [setSchema]);

  // Handle clear schema
  const handleClearSchema = useCallback(() => {
    setSchema('');
  }, [setSchema]);
  
  // Sample templates for schema
  const schemaSamples = useMemo(() => 
    EXAMPLE_SCHEMAS.map(s => ({
      name: s.name,
      description: s.description,
      content: s.schema,
    })),
  []);
  
  // Handle load sample
  const handleLoadSchemaSample = useCallback((template: { content: string }) => {
    setSchema(template.content);
  }, [setSchema]);

  const handleCopyData = async () => {
    if (!data) return;
    try {
      await copyToClipboard(data);
    } catch {
      // Copy failed
    }
  };

  const handleDownloadData = () => {
    if (!data) return;
    downloadTextFile(data, 'data.json', 'application/json');
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applySchemaPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Calculate status
  const isValid = result?.isValid ?? false;
  const errorCount = result?.errors.length ?? 0;
  const hasSchemaErrors = schemaErrors.length > 0;

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-options' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-options')}
        >
          <i className="fas fa-sliders-h"></i> Options
        </button>
        <button
          className={settingsTabId === 'settings-examples' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-examples')}
        >
          <i className="fas fa-book"></i> Examples
        </button>
        <button
          className={settingsTabId === 'settings-presets' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
        <button
          className={`${settingsTabId === 'settings-errors' ? 'active' : ''} ${errorCount > 0 ? 'has-errors' : ''}`}
          onClick={() => setSettingsTabId('settings-errors')}
        >
          <i className="fas fa-exclamation-circle"></i> Errors
          {errorCount > 0 && <span className="error-badge">{errorCount}</span>}
        </button>
      </div>
      <div className="settings-content">
        {settingsTabId === 'settings-options' && (
          <SchemaValidatorOptionsPanel settings={settings} updateSettings={updateSettings} />
        )}
        {settingsTabId === 'settings-examples' && (
          <SchemaValidatorExamplesPanel examples={EXAMPLE_SCHEMAS} onLoadExample={loadExample} />
        )}
        {settingsTabId === 'settings-presets' && (
          <SchemaValidatorPresetsPanel presets={SCHEMA_VALIDATOR_PRESETS} onApplyPreset={handleApplyPreset} />
        )}
        {settingsTabId === 'settings-errors' && (
          <SchemaValidatorErrorsPanel errors={result?.errors ?? []} schemaErrors={schemaErrors} />
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
            name: 'JSON Schema Validator',
            description: jsonSchemaValidatorSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'JSON Schema validation',
              'Draft-04 to 2020-12 support',
              'Detailed error messages',
              'Example schema library',
              'Auto draft detection',
              'Format validation',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON Schema Validator"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelp(true)}
      >
        {/* Validation Status Banner */}
        <div className={`validation-status ${hasSchemaErrors ? 'status-schema-error' : isValid ? 'status-valid' : 'status-invalid'}`}>
          {hasSchemaErrors ? (
            <>
              <i className="fas fa-exclamation-triangle"></i>
              <span>Schema has errors - fix before validating</span>
            </>
          ) : isValid ? (
            <>
              <i className="fas fa-check-circle"></i>
              <span>Data is valid against schema</span>
              {result?.validationTime && (
                <span className="validation-time">({result.validationTime.toFixed(1)}ms)</span>
              )}
            </>
          ) : (
            <>
              <i className="fas fa-times-circle"></i>
              <span>{errorCount} validation error{errorCount !== 1 ? 's' : ''}</span>
              {result?.draft && <span className="validation-draft">Draft: {result.draft}</span>}
            </>
          )}
        </div>

        {/* Dual Editor Panels */}
        <div 
          ref={containerRef}
          className={`ide-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
        >
          {/* Schema Editor */}
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
              label="JSON Schema"
              onUpload={handleSchemaUpload}
              onPaste={handleSchemaPaste}
              onClear={handleClearSchema}
              sampleTemplates={schemaSamples}
              onLoadTemplate={handleLoadSchemaSample}
            />
            <MonacoEditorPanel
              value={schema}
              onChange={setSchema}
              language="json"
              editorSide="left"
              placeholder="Paste your JSON Schema here..."
              emptyStateTitle="Welcome to JSON Schema Validator"
              emptyStateInstructions={[
                'Pasting JSON Schema',
                'Uploading a schema file',
                'Loading an example',
              ]}
              onLoadSample={() => {
                if (schemaSamples.length > 0) {
                  setSchema(schemaSamples[0].content);
                }
              }}
              validationErrors={schemaValidationErrors}
            />
            {hasSchemaErrors && (
              <div className="editor-errors">
                {schemaErrors.map((error, index) => (
                  <div key={index} className="error-item">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                ))}
              </div>
            )}
            <StatsBar text={schema} validationState={schemaValidationState} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Data Editor */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="JSON Data"
              icon="fa-file-code"
              onCopy={data ? handleCopyData : undefined}
              onDownload={data ? handleDownloadData : undefined}
            >
              <button
                className="btn btn-primary btn-sm"
                onClick={validate}
                title="Validate JSON against schema"
              >
                <i className="fas fa-check"></i>
                <span className="btn-text">Validate</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={formatData}
                title="Format JSON"
              >
                <i className="fas fa-indent"></i>
                <span className="btn-text">Format</span>
              </button>
            </OutputToolbar>
            <MonacoEditorPanel
              value={data}
              onChange={setData}
              language="json"
              editorSide="right"
              placeholder="Paste your JSON data here..."
              emptyStateTitle="JSON Data Input"
              emptyStateInstructions={[
                'Paste your JSON data',
                'Load an example',
                'Data will be validated against the schema',
              ]}
              onLoadSample={() => {
                if (schemaSamples.length > 0 && EXAMPLE_SCHEMAS[0]?.sampleData) {
                  setData(EXAMPLE_SCHEMAS[0].sampleData);
                }
              }}
              validationErrors={dataValidationErrors}
            />
            <StatsBar text={data} validationState={dataValidationState} />
          </div>
        </div>


        {/* SEO Content */}
        <article id="seo-content">
          <SEOContent
            title={jsonSchemaValidatorSEO.heroTitle}
            subtitle={jsonSchemaValidatorSEO.heroSubtitle}
            features={jsonSchemaValidatorSEO.features}
            howToSteps={jsonSchemaValidatorSEO.howToSteps}
            educationalContent={jsonSchemaValidatorSEO.educationalContent}
            useCases={jsonSchemaValidatorSEO.useCases}
            technicalSpecs={jsonSchemaValidatorSEO.technicalSpecs}
            faqs={jsonSchemaValidatorSEO.faq}
          />
        </article>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        toolName="JSON Schema Validator"
        sections={jsonSchemaValidatorHelp}
      />

      <style jsx>{`
        /* Validation Status Banner */
        .validation-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          font-weight: 500;
          background: var(--elevated);
        }
        
        .status-valid {
          color: var(--success);
        }
        
        .status-invalid {
          color: var(--danger);
        }
        
        .status-schema-error {
          color: var(--warning);
        }
        
        .validation-time,
        .validation-draft {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-left: auto;
        }
        
        /* Ensure ide-pane uses flex column layout */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          min-height: 0 !important;
        }
        
        .ide-pane :global(.editor-toolbar),
        .ide-pane :global(.output-toolbar) {
          order: 1 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.monaco-editor-wrapper) {
          order: 2 !important;
          flex: 1 1 0 !important;
          min-height: 0 !important;
        }
        
        .ide-pane :global(.editor-errors) {
          order: 998 !important;
          flex-shrink: 0 !important;
        }
        
        .ide-pane :global(.stats-bar) {
          order: 999 !important;
          flex-shrink: 0 !important;
        }

        /* Error Panels */
        :global(.editor-errors) {
          padding: 0.5rem 0.75rem;
          background: rgba(248, 81, 73, 0.1);
          border-top: 1px solid rgba(248, 81, 73, 0.3);
          max-height: 150px;
          overflow-y: auto;
        }

        :global(.error-item) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--danger);
          padding: 0.25rem 0;
        }

        :global(.error-item i) {
          flex-shrink: 0;
        }
        
        .sidebar-tab.has-errors {
          position: relative;
        }
        
        .error-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 9999px;
          min-width: 16px;
          text-align: center;
        }
      `}</style>
    </>
  );
}
