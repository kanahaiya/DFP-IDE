'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { useToast } from '@/store/toast';
import { useJsonGeneratorStore } from '@/store/jsonGenerator';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { ShareWidget } from '@/components/common/ShareWidget';
import { jsonGeneratorContent } from '@/data/json-generator-seo';
import { jsonGeneratorHelpSections } from '@/data/json-generator-help';
import { generatorTemplates, templateCategories } from '@/data/json-generator-samples';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { generateData, generatePreview, exportData, downloadFile, getFileExtension, getMimeType } from '@/lib/json-generator';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { getTimestamp } from '@/lib/fileUtils';
import { trackCopy, trackDownload } from '@/lib/analytics';

// Dynamic import for the tool component (will be created)
const JsonGeneratorTool = dynamic(
  () => import('@/components/tools/json-generator/JsonGeneratorTool').then(mod => ({ default: mod.JsonGeneratorTool })),
  { 
    ssr: false,
    loading: () => (
      <div className="tool-loading">
        <div className="tool-loading-content">
          <div className="spinner"></div>
          <p>Loading JSON Generator...</p>
        </div>
      </div>
    )
  }
);

export default function JsonGeneratorPage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('schema');
  
  // Store state
  const {
    schema,
    settings,
    exportSettings,
    output,
    isGenerating,
    previewData,
    currentTemplate,
    setSchema,
    setOutput,
    setGeneratedData,
    setIsGenerating,
    setPreviewData,
    updateSettings,
    updateExportSettings,
    loadTemplate,
    clearTemplate,
  } = useJsonGeneratorStore();

  // Generate preview when schema changes
  useEffect(() => {
    if (schema.length > 0) {
      try {
        const preview = generatePreview(schema, 3);
        setPreviewData(preview);
      } catch (error) {
        console.error('Preview generation error:', error);
        setPreviewData([]);
      }
    } else {
      setPreviewData([]);
    }
  }, [schema, setPreviewData]);

  // Handle generate
  const handleGenerate = useCallback(async () => {
    if (schema.length === 0) {
      toast.error('Please add at least one field to your schema');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use setTimeout to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const data = generateData(schema, settings);
      setGeneratedData(data);
      
      // Export to JSON for display
      const jsonOutput = exportData(data, schema, exportSettings);
      setOutput(jsonOutput);
      
      toast.success(`Generated ${data.length} records`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [schema, settings, exportSettings, setIsGenerating, setGeneratedData, setOutput, toast]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.error('No data to copy. Generate data first.');
      return;
    }
    
    try {
      await copyToClipboard(output);
      toast.success('Copied to clipboard');
      trackCopy('json-generator');
    } catch {
      toast.error('Failed to copy');
    }
  }, [output, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) {
      toast.error('No data to download. Generate data first.');
      return;
    }
    
    try {
      const extension = getFileExtension(exportSettings.format);
      const mimeType = getMimeType(exportSettings.format);
      const filename = `generated-${getTimestamp()}.${extension}`;
      
      downloadFile(output, filename, mimeType);
      toast.success('Downloaded successfully');
      trackDownload(extension);
    } catch {
      toast.error('Failed to download');
    }
  }, [output, exportSettings.format, toast]);

  // Handle template load
  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = generatorTemplates.find(t => t.id === templateId);
    if (template) {
      loadTemplate(template);
      toast.success(`Loaded template: ${template.name}`);
    }
  }, [loadTemplate, toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    clearTemplate();
    setOutput('');
    setGeneratedData([]);
    toast.success('Cleared');
  }, [clearTemplate, setOutput, setGeneratedData, toast]);

  // Settings Sidebar Content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'schema' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('schema')}
        >
          <i className="fas fa-file-code"></i> Schema
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings')}
        >
          <i className="fas fa-cog"></i> Settings
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'export' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('export')}
        >
          <i className="fas fa-download"></i> Export
        </button>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'schema' && (
          <div className="settings-section">
            <h4>Templates</h4>
            <div className="template-categories">
              {Object.entries(templateCategories).map(([catId, cat]) => (
                <div key={catId} className="template-category">
                  <h5><i className={cat.icon}></i> {cat.name}</h5>
                  <div className="template-list">
                    {generatorTemplates
                      .filter(t => t.category === catId)
                      .map(template => (
                        <button
                          key={template.id}
                          className={`template-btn ${currentTemplate?.id === template.id ? 'active' : ''}`}
                          onClick={() => handleLoadTemplate(template.id)}
                          title={template.description}
                        >
                          <i className={template.icon}></i>
                          <span>{template.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary full-width" onClick={handleClear}>
              <i className="fas fa-trash"></i> Clear Schema
            </button>
          </div>
        )}
        
        {settingsTabId === 'settings' && (
          <div className="settings-section">
            <h4>Generation Settings</h4>
            
            <div className="setting-group">
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={settings.quantity}
                onChange={(e) => updateSettings({ quantity: Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)) })}
              />
              <span className="setting-hint">1 - 10,000 records</span>
            </div>
            
            <div className="setting-group">
              <label>Seed (optional)</label>
              <input
                type="number"
                placeholder="Random"
                value={settings.seed ?? ''}
                onChange={(e) => updateSettings({ seed: e.target.value ? parseInt(e.target.value) : undefined })}
              />
              <span className="setting-hint">Same seed = same data</span>
            </div>
            
            <div className="setting-group">
              <label>Locale</label>
              <select
                value={settings.locale}
                onChange={(e) => updateSettings({ locale: e.target.value as typeof settings.locale })}
              >
                <option value="en_US">English (US)</option>
                <option value="en_GB">English (UK)</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="it">Italian</option>
                <option value="pt_BR">Portuguese (BR)</option>
                <option value="ja">Japanese</option>
                <option value="zh_CN">Chinese</option>
              </select>
            </div>
          </div>
        )}
        
        {settingsTabId === 'export' && (
          <div className="settings-section">
            <h4>Export Settings</h4>
            
            <div className="setting-group">
              <label>Format</label>
              <select
                value={exportSettings.format}
                onChange={(e) => updateExportSettings({ format: e.target.value as typeof exportSettings.format })}
              >
                <option value="json">JSON</option>
                <option value="jsonl">JSON Lines (JSONL)</option>
                <option value="csv">CSV</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Indentation</label>
              <select
                value={exportSettings.indent}
                onChange={(e) => updateExportSettings({ indent: e.target.value as typeof exportSettings.indent })}
              >
                <option value="2spaces">2 Spaces</option>
                <option value="4spaces">4 Spaces</option>
                <option value="tabs">Tabs</option>
                <option value="minified">Minified</option>
              </select>
            </div>
            
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="sortKeys"
                checked={exportSettings.sortKeys}
                onChange={(e) => updateExportSettings({ sortKeys: e.target.checked })}
              />
              <label htmlFor="sortKeys">Sort keys alphabetically</label>
            </div>
            
            {exportSettings.format === 'typescript' && (
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="includeTypes"
                  checked={exportSettings.includeTypes}
                  onChange={(e) => updateExportSettings({ includeTypes: e.target.checked })}
                />
                <label htmlFor="includeTypes">Include TypeScript interfaces</label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Skip to Content Link - for accessibility */}
      <a href="#seo-content" className="skip-to-content">
        Skip to Article Content
      </a>

      <main>
        <IDELayout 
          toolName="JSON Generator" 
          settingsSidebar={settingsSidebar}
          onHelpClick={() => setShowHelpModal(true)}
        >
          {/* Main Tool Component */}
          <JsonGeneratorTool
            schema={schema}
            setSchema={setSchema}
            previewData={previewData}
            output={output}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onCopy={handleCopy}
            onDownload={handleDownload}
            settings={settings}
            exportSettings={exportSettings}
          />

          {/* Social Share Widget */}
          <ShareWidget />

          {/* Help Documentation Modal */}
          <HelpModal
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
            toolName="JSON Generator"
            sections={jsonGeneratorHelpSections}
          />
        </IDELayout>
      </main>

      {/* JSON-LD Structured Data */}
      <JsonLd data={generateAllSchemas(
        jsonGeneratorContent.faqs, 
        jsonGeneratorContent.howToSteps,
        {
          toolName: 'JSON Generator',
          toolUrl: 'json-generator',
          description: 'Generate realistic fake JSON data for testing, prototyping, and development. Free online JSON generator with 50+ data types, custom schemas, and bulk generation.',
          featureList: [
            '50+ realistic data types',
            'Visual schema builder',
            'Bulk generation up to 10,000 records',
            'Export to JSON, JSONL, CSV, TypeScript',
            'Seed-based reproducible generation',
            'Multiple locale support',
            '100% client-side processing',
            'Pre-built templates',
          ],
          howToTitle: 'How to Generate Fake JSON Data',
          howToDescription: 'Step-by-step guide to generating realistic fake JSON test data using our free online tool with custom schemas and bulk generation.',
        }
      )} />

      {/* SEO Content Sections */}
      <article id="seo-content">
        <SEOContent 
          title={jsonGeneratorContent.title}
          subtitle={jsonGeneratorContent.subtitle}
          trustBadges={jsonGeneratorContent.trustBadges}
          features={jsonGeneratorContent.features}
          howToSteps={jsonGeneratorContent.howToSteps}
          educationalContent={jsonGeneratorContent.educational}
          useCases={jsonGeneratorContent.useCases}
          whyChoose={jsonGeneratorContent.whyChoose}
          technicalSpecs={jsonGeneratorContent.technicalSpecs}
          comparison={jsonGeneratorContent.comparison}
          faqs={jsonGeneratorContent.faqs}
          relatedTools={jsonGeneratorContent.relatedTools}
          howToSectionTitle={jsonGeneratorContent.howToSectionTitle}
          featuresSectionTitle={jsonGeneratorContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonGeneratorContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonGeneratorContent.comparisonSectionTitle}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .tool-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
          background: var(--bg);
        }
        
        .tool-loading-content {
          text-align: center;
          color: var(--text-secondary);
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Template and settings styles are in globals.css */
      `}</style>
    </>
  );
}
