'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { useToast } from '@/store/toast';
import { Footer } from '@/components/layout/Footer';
import { HelpModal } from '@/components/common/HelpModal';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { jsonMergeContent } from '@/data/json-merge-seo';
import { jsonMergeHelpSections } from '@/data/json-merge-help';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { useJsonMergeStore } from '@/store/jsonMerge';
import { mergeJSON, copyToClipboard, exportToFile } from '@/lib/merge';
import { mergeSampleTemplates } from '@/data/json-merge-samples';
import { readFileAsText } from '@/lib/fileUtils';
import { event as trackEvent } from '@/lib/analytics';

// Dynamic imports for heavy components
const MonacoEditorPanel = dynamic(
  () => import('@/components/common/MonacoEditorPanel').then(mod => ({ default: mod.MonacoEditorPanel })),
  { 
    ssr: false,
    loading: () => <div className="editor-loading-skeleton"><div className="skeleton-shimmer" /></div>
  }
);

// Import UI components
import { MergeSettingsPanel } from '@/components/tools/json-merge/MergeSettingsPanel';
import { OutputOptionsPanel } from '@/components/tools/json-merge/OutputOptionsPanel';
import { PresetsPanel } from '@/components/tools/json-merge/PresetsPanel';

export default function JsonMergePage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('settings-strategy');
  
  const {
    inputs,
    output,
    settings,
    exportSettings,
    mergeResult,
    errors,
    isMerging,
    addInput,
    removeInput,
    updateInput,
    setInputValid,
    updateSettings,
    updateExportSettings,
    applyPreset,
    setMergeResult,
    setIsMerging,
    setErrors,
    clearInputs,
  } = useJsonMergeStore();

  // Perform merge when inputs or settings change (debounced)
  const performMerge = useCallback(() => {
    const nonEmptyInputs = inputs.filter(i => i.content.trim() !== '');
    if (nonEmptyInputs.length < 2) {
      setMergeResult(null);
      return;
    }

    setIsMerging(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = mergeJSON(nonEmptyInputs, settings);
      setMergeResult(result);
      setErrors(result.errors);
      
      // Update input validation states
      for (const input of inputs) {
        const inputError = result.errors.find(e => e.inputId === input.id);
        setInputValid(input.id, !inputError, inputError?.message);
      }
      
      setIsMerging(false);
      
      if (result.success) {
        trackEvent('json_merge_success', 'json_merge', settings.strategy);
      }
    }, 50);
  }, [inputs, settings, setMergeResult, setIsMerging, setErrors, setInputValid]);

  // Debounced merge effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performMerge();
    }, 300);
    return () => clearTimeout(timer);
  }, [performMerge]);

  // Handle file upload for a specific input
  const handleUpload = useCallback(async (inputId: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.txt';
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const content = await readFileAsText(file);
        updateInput(inputId, content);
        toast.success(`Loaded ${file.name}`);
        trackEvent('json_merge_file_upload', 'json_merge', 'file_upload');
      } catch {
        toast.error('Failed to read file');
      }
    };
    
    fileInput.click();
  }, [updateInput, toast]);

  // Handle paste for a specific input
  const handlePaste = useCallback(async (inputId: string) => {
    try {
      const text = await navigator.clipboard.readText();
      updateInput(inputId, text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to read clipboard');
    }
  }, [updateInput, toast]);

  // Handle copy output
  const handleCopy = useCallback(async () => {
    if (!mergeResult?.output) {
      toast.error('Nothing to copy');
      return;
    }
    
    const success = await copyToClipboard(mergeResult.output, settings);
    if (success) {
      toast.success('Copied to clipboard');
      trackEvent('json_merge_copy', 'json_merge', 'copy');
    } else {
      toast.error('Failed to copy');
    }
  }, [mergeResult, settings, toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!mergeResult?.output) {
      toast.error('Nothing to download');
      return;
    }
    
    exportToFile(mergeResult.output, exportSettings);
    toast.success('Downloaded merged JSON');
    trackEvent('json_merge_download', 'json_merge', 'download');
  }, [mergeResult, exportSettings, toast]);

  // Handle clear
  const handleClear = useCallback((inputId: string) => {
    updateInput(inputId, '');
  }, [updateInput]);

  // Handle load sample template
  const handleLoadSample = useCallback((sampleTemplate: { name: string; description: string; content: string }) => {
    // Find the full template by name
    const template = mergeSampleTemplates.find(t => t.name === sampleTemplate.name);
    if (!template) return;
    
    // Clear existing inputs and load template inputs
    clearInputs();
    
    // Add inputs as needed
    while (inputs.length < template.inputs.length) {
      addInput();
    }
    
    // Update inputs with template content
    setTimeout(() => {
      const currentInputs = useJsonMergeStore.getState().inputs;
      template.inputs.forEach((templateInput, idx) => {
        if (currentInputs[idx]) {
          updateInput(currentInputs[idx].id, templateInput.content);
        }
      });
      
      // Apply recommended strategy
      updateSettings({ strategy: template.recommendedStrategy });
      toast.success(`Loaded template: ${template.name}`);
      trackEvent('json_merge_load_template', 'json_merge', template.id);
    }, 100);
  }, [inputs, addInput, clearInputs, updateInput, updateSettings, toast]);

  // Generate JSON-LD schema
  const schemas = useMemo(() => generateAllSchemas(
    jsonMergeContent.faqs,
    jsonMergeContent.howToSteps,
    {
      toolName: 'JSON Merge Tool',
      toolUrl: 'json-merge',
      description: jsonMergeContent.description,
      featureList: jsonMergeContent.features.map(f => f.title),
      howToTitle: jsonMergeContent.howToSectionTitle,
      howToDescription: 'Step-by-step guide to merge JSON documents online',
    }
  ), []);

  // Stats for output
  const outputStats = useMemo(() => {
    if (!mergeResult?.success || !output) {
      return [
        { label: 'Status', value: mergeResult ? 'Error' : 'Ready' },
      ];
    }
    
    return [
      { label: 'Keys', value: String(mergeResult.stats.outputKeys) },
      { label: 'Lines', value: String(output.split('\n').length) },
      { label: 'Conflicts', value: String(mergeResult.stats.conflictsResolved) },
      { label: 'Time', value: `${mergeResult.stats.processingTime.toFixed(0)}ms` },
    ];
  }, [mergeResult, output]);

  // Sample templates for dropdown (EditorToolbar expects name, description, content)
  const sampleOptions = useMemo(() => 
    mergeSampleTemplates.map(t => ({
      name: t.name,
      description: t.description,
      content: t.inputs[0]?.content || '', // Use first input as preview content
    })),
  []);

  // Check if we can add more inputs
  const canAddInput = inputs.length < 5;
  const canRemoveInput = inputs.length > 2;

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-panel">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-strategy' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-strategy')}
        >
          <i className="fas fa-code-branch"></i> Strategy
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-output' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-output')}
        >
          <i className="fas fa-sliders-h"></i> Output
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-presets' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-presets')}
        >
          <i className="fas fa-magic"></i> Presets
        </button>
      </div>
      
      <div className="sidebar-content">
        {settingsTabId === 'settings-strategy' && (
          <MergeSettingsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}
        {settingsTabId === 'settings-output' && (
          <OutputOptionsPanel
            settings={settings}
            exportSettings={exportSettings}
            onUpdateSettings={updateSettings}
            onUpdateExportSettings={updateExportSettings}
          />
        )}
        {settingsTabId === 'settings-presets' && (
          <PresetsPanel
            onApplyPreset={applyPreset}
            currentStrategy={settings.strategy}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      
      <IDELayout
        toolName="JSON Merge"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {/* Main Content Area */}
        <div className="ide-main-content merge-layout">
          {/* Input Panes Section */}
          <div className="merge-inputs-section">
            <div className="merge-inputs-header">
              <h3>
                <i className="fas fa-layer-group"></i> JSON Inputs ({inputs.length})
              </h3>
              <button
                className="add-input-button"
                onClick={addInput}
                disabled={!canAddInput}
                title={canAddInput ? 'Add another input' : 'Maximum 5 inputs'}
              >
                <i className="fas fa-plus"></i> Add Input
              </button>
            </div>
            
            <div className="merge-inputs-container">
              {inputs.map((input, index) => (
                <div key={input.id} className={`merge-input-pane ${!input.isValid ? 'has-error' : ''}`}>
                  <div className="input-pane-header">
                    <EditorToolbar
                      label={input.name}
                      onUpload={() => handleUpload(input.id)}
                      onPaste={() => handlePaste(input.id)}
                      onClear={() => handleClear(input.id)}
                      sampleTemplates={index === 0 ? sampleOptions : undefined}
                      onLoadTemplate={index === 0 ? handleLoadSample : undefined}
                    />
                    {canRemoveInput && index >= 2 && (
                      <button
                        className="remove-input-btn"
                        onClick={() => removeInput(input.id)}
                        title="Remove this input"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  <MonacoEditorPanel
                    value={input.content}
                    onChange={(value) => updateInput(input.id, value || '')}
                    language="json"
                    readOnly={false}
                    placeholder={`Paste JSON here or upload a file...`}
                    emptyStateTitle={index === 0 ? "Welcome to JSON Merger" : undefined}
                    emptyStateInstructions={index === 0 ? [
                      'Pasting JSON from your API',
                      'Uploading a .json file',
                      'Loading a sample template',
                    ] : undefined}
                    onLoadSample={index === 0 ? () => {
                      const firstInput = inputs[0];
                      if (firstInput && sampleOptions.length > 0) {
                        updateInput(firstInput.id, sampleOptions[0].content);
                      }
                    } : undefined}
                  />
                  {input.error && (
                    <div className="input-error-message">
                      <i className="fas fa-exclamation-triangle"></i>
                      {input.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Output Section */}
          <div className="merge-output-section">
            <div className="output-header">
              <div className="output-label">
                <i className="fas fa-code"></i>
                Merged Output
              </div>
              {mergeResult?.success && (
                <div className="output-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <i className="fas fa-copy"></i>
                    <span className="btn-text">Copy</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleDownload}
                    title="Download JSON"
                  >
                    <i className="fas fa-download"></i>
                    <span className="btn-text">Download</span>
                  </button>
                </div>
              )}
            </div>
            
            {isMerging ? (
              <div className="merge-loading">
                <div className="spinner"></div>
                <span>Merging...</span>
              </div>
            ) : mergeResult?.success ? (
              <MonacoEditorPanel
                value={output}
                language="json"
                readOnly={true}
                placeholder="Merged JSON will appear here..."
                emptyStateTitle="Merged JSON Output"
                emptyStateInstructions={[
                  'Merged JSON will appear here',
                  'Add JSON inputs above to merge',
                ]}
              />
            ) : (
              <div className="merge-placeholder">
                {errors.length > 0 ? (
                  <div className="merge-errors">
                    <i className="fas fa-exclamation-circle"></i>
                    <h4>Merge Errors</h4>
                    <ul>
                      {errors.map((error, idx) => (
                        <li key={idx}>
                          <strong>{error.inputId}:</strong> {error.message}
                          {error.line > 0 && ` (line ${error.line})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="merge-instructions">
                    <i className="fas fa-code-branch"></i>
                    <h4>Ready to Merge</h4>
                    <p>Add JSON to at least 2 input panes to begin merging.</p>
                    <ul>
                      <li>Paste JSON directly or upload .json files</li>
                      <li>Choose a merge strategy from the sidebar</li>
                      <li>Results appear automatically as you type</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="output-stats-bar">
              {outputStats.map((stat, idx) => (
                <div key={idx} className="output-stat">
                  <span className="stat-label">{stat.label}:</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON Merge"
        sections={jsonMergeHelpSections}
      />

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonMergeContent.title}
          subtitle={jsonMergeContent.subtitle}
          trustBadges={jsonMergeContent.trustBadges}
          features={jsonMergeContent.features}
          howToSteps={jsonMergeContent.howToSteps}
          howToSectionTitle={jsonMergeContent.howToSectionTitle}
          featuresSectionTitle={jsonMergeContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonMergeContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonMergeContent.comparisonSectionTitle}
          educationalContent={jsonMergeContent.educational}
          useCases={jsonMergeContent.useCases}
          whyChoose={jsonMergeContent.whyChoose}
          technicalSpecs={jsonMergeContent.technicalSpecs}
          comparison={jsonMergeContent.comparison}
          faqs={jsonMergeContent.faqs}
          relatedTools={jsonMergeContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .merge-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 0;
        }
        
        .merge-inputs-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        
        .merge-inputs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: var(--card);
          border-radius: 0;
          margin-bottom: 0;
        }
        
        .merge-inputs-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }
        
        .add-input-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 0;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .add-input-button:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        
        .add-input-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .merge-inputs-container {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 0;
          min-height: 0;
          overflow: auto;
        }
        
        .merge-input-pane {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 0;
          overflow: hidden;
          min-height: 200px;
        }
        
        .merge-input-pane.has-error {
          border-color: var(--error);
        }
        
        .input-error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(244, 67, 54, 0.1);
          color: var(--error);
          font-size: 0.8rem;
        }
        
        .merge-output-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 0;
          overflow: hidden;
          min-height: 250px;
        }
        
        .merge-loading {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-secondary);
        }
        
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .merge-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .merge-instructions,
        .merge-errors {
          text-align: center;
          max-width: 400px;
        }
        
        .merge-instructions i,
        .merge-errors i {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        
        .merge-errors i {
          color: var(--error);
        }
        
        .merge-instructions h4,
        .merge-errors h4 {
          font-size: 1.2rem;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .merge-instructions p {
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
        }
        
        .merge-instructions ul {
          text-align: left;
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding-left: 1.5rem;
          margin: 0;
        }
        
        .merge-instructions li {
          margin-bottom: 0.5rem;
        }
        
        .merge-errors ul {
          text-align: left;
          list-style: none;
          padding: 0;
          margin: 1rem 0 0 0;
        }
        
        .merge-errors li {
          padding: 0.5rem;
          background: rgba(244, 67, 54, 0.1);
          border-radius: 0;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text);
        }
        
        .input-pane-header {
          display: flex;
          align-items: center;
        }
        
        .input-pane-header :global(.editor-toolbar) {
          flex: 1;
        }
        
        .remove-input-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          margin-right: 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 0;
          color: var(--error);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .remove-input-btn:hover {
          background: rgba(244, 67, 54, 0.1);
          border-color: var(--error);
        }
        
        .output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
        }
        
        .output-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
        }
        
        .output-label i {
          color: var(--primary);
        }
        
        .output-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .output-stats-bar {
          display: flex;
          gap: 1.5rem;
          padding: 0.5rem 1rem;
          background: var(--elevated);
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
        }
        
        .output-stat {
          display: flex;
          gap: 0.25rem;
        }
        
        .stat-label {
          color: var(--text-secondary);
        }
        
        .stat-value {
          color: var(--text);
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .merge-layout {
            gap: 0.5rem;
          }
          
          .merge-inputs-container {
            grid-template-columns: 1fr;
          }
          
          .merge-input-pane {
            min-height: 150px;
          }
        }
      `}</style>
    </>
  );
}
