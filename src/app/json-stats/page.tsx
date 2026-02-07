'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IDELayout } from '@/components/layout/IDELayout';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import TabManager from '@/components/common/TabManager';
import { useToast } from '@/store/toast';
import { Footer } from '@/components/layout/Footer';
import { HelpModal } from '@/components/common/HelpModal';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { jsonStatsContent } from '@/data/json-stats-seo';
import { jsonStatsHelp } from '@/data/json-stats-help';
import { JSON_STATS_SAMPLES } from '@/data/json-stats-samples';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import { useJsonStatsStore } from '@/store/jsonStats';
import { analyzeJSON, downloadStats } from '@/lib/stats';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useTabs } from '@/hooks/useTabs';
import { useJSONValidation } from '@/hooks/useJSONValidation';
import { readFileAsText, formatFileSize } from '@/lib/fileUtils';
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
import { StatsDashboard } from '@/components/tools/json-stats/StatsDashboard';
import { StatsOverview } from '@/components/tools/json-stats/StatsOverview';
import { TypeDistributionChart } from '@/components/tools/json-stats/TypeDistributionChart';
import { ExportPanel } from '@/components/tools/json-stats/ExportPanel';

export default function JsonStatsPage() {
  const toast = useToast();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  const [isDragging, setIsDragging] = useState(false);

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
  } = useTabs({ toolName: 'JSON Stats', storageKey: 'json-stats-tabs' });

  const isTabSyncingRef = useRef(false);

  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    duplicateTab(tabId);
  }, [duplicateTab]);
  
  const {
    input,
    stats,
    error,
    isAnalyzing,
    activeSection,
    exportSettings,
    setInput,
    setStats,
    setIsAnalyzing,
    setActiveSection,
    updateExportSettings,
    clearInput,
  } = useJsonStatsStore();

  // JSON validation
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

  useEffect(() => {
    if (!activeTab) return;
    isTabSyncingRef.current = true;
    setInput(activeTab.inputJSON || '');
    const timer = setTimeout(() => {
      isTabSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTabId, activeTab, setInput]);

  useEffect(() => {
    if (isTabSyncingRef.current || !activeTabId) return;
    updateTab(activeTabId, {
      inputJSON: input,
    });
  }, [activeTabId, input, updateTab]);

  // Calculate header statistics
  const headerStats = useMemo(() => {
    if (!stats?.isValid) return null;
    const charCount = input.length;
    const lines = input.split('\n');
    const lineCount = lines.length;
    const wordCount = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;
    const size = formatFileSize(new TextEncoder().encode(input).length);
    
    return { charCount, wordCount, lineCount, size };
  }, [stats?.isValid, input]);

  // Analyze JSON when input changes (debounced)
  useEffect(() => {
    if (!input.trim()) {
      setStats(null);
      return;
    }

    setIsAnalyzing(true);
    
    const timer = setTimeout(() => {
      const result = analyzeJSON(input);
      setStats(result);
      setIsAnalyzing(false);
      
      if (result.isValid) {
        trackEvent('json_stats_analyze', 'json_stats', 'analyze');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [input, setStats, setIsAnalyzing]);

  // Handle file upload
  const handleUpload = useCallback(async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.txt';
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const content = await readFileAsText(file);
        setInput(content);
        toast.success(`Loaded ${file.name}`);
        trackEvent('json_stats_file_upload', 'json_stats', 'file_upload');
      } catch {
        toast.error('Failed to read file');
      }
    };
    
    fileInput.click();
  }, [setInput, toast]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to read clipboard');
    }
  }, [setInput, toast]);

  // Handle clear
  const handleClear = useCallback(() => {
    clearInput();
    toast.success('Cleared');
  }, [clearInput, toast]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!stats || !stats.isValid) {
      toast.error('No valid stats to export');
      return;
    }
    
    downloadStats(stats, exportSettings);
    toast.success(`Exported as ${exportSettings.format.toUpperCase()}`);
    trackEvent('json_stats_export', 'json_stats', exportSettings.format);
  }, [stats, exportSettings, toast]);

  // Handle load sample template
  const handleLoadSample = useCallback((sampleTemplate: { name: string; description: string; content: string }) => {
    const template = JSON_STATS_SAMPLES.find(t => t.name === sampleTemplate.name);
    if (!template) return;
    
    setInput(template.content);
    toast.success(`Loaded sample: ${template.name}`);
    trackEvent('json_stats_load_template', 'json_stats', template.id);
  }, [setInput, toast]);

  // Drag and drop handlers
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
        toast.success(`Loaded ${files[0].name}`);
      } catch {
        toast.error('Failed to read file');
      }
    }
  };

  // Generate JSON-LD schema
  const schemas = useMemo(() => generateAllSchemas(
    jsonStatsContent.faqs,
    jsonStatsContent.howToSteps,
    {
      toolName: 'JSON Stats Tool',
      toolUrl: 'json-stats',
      description: jsonStatsContent.description,
      featureList: jsonStatsContent.features.map(f => f.title),
      howToTitle: jsonStatsContent.howToSectionTitle,
      howToDescription: 'Step-by-step guide to analyze JSON data online',
    }
  ), []);

  // Sample templates for dropdown
  const sampleOptions = useMemo(() => 
    JSON_STATS_SAMPLES.map(t => ({
      name: t.name,
      description: t.description,
      content: t.content,
    })),
  []);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <i className="fas fa-tachometer-alt"></i> Overview
        </button>
        <button
          className={`sidebar-tab ${activeSection === 'types' ? 'active' : ''}`}
          onClick={() => setActiveSection('types')}
        >
          <i className="fas fa-chart-pie"></i> Types
        </button>
      </div>
      
      <div className="sidebar-content">
        {activeSection === 'overview' && stats?.isValid && (
          <StatsOverview stats={stats} />
        )}
        {activeSection === 'types' && stats?.isValid && (
          <TypeDistributionChart stats={stats} />
        )}
        {!stats?.isValid && (
          <div className="empty-sidebar">
            <i className="fas fa-chart-bar"></i>
            <p>Paste JSON to see statistics</p>
          </div>
        )}
        
        <ExportPanel
          exportSettings={exportSettings}
          onUpdateSettings={updateExportSettings}
          onExport={handleExport}
          disabled={!stats?.isValid}
        />
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />
      
      <IDELayout
        toolName="JSON Stats"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
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
              label="Input JSON"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={handleClear}
              sampleTemplates={sampleOptions}
              onLoadTemplate={handleLoadSample}
            />
            <MonacoEditorPanel
              value={input}
              onChange={(value) => setInput(value || '')}
              language="json"
              editorSide="left"
              readOnly={false}
              placeholder="Paste your JSON here to analyze..."
              emptyStateTitle="Welcome to JSON Stats Analyzer"
              emptyStateInstructions={[
                'Pasting JSON from your API',
                'Uploading a .json file',
                'Loading a sample template',
              ]}
              onLoadSample={() => {
                if (sampleOptions.length > 0) {
                  setInput(sampleOptions[0].content);
                }
              }}
              validationErrors={error ? [{ line: 1, column: 1, message: error, severity: 'error' as const }] : validationErrors}
            />
            {error && (
              <div className="editor-errors">
                <div className="error-item">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              </div>
            )}
            <StatsBar text={input} validationState={validationState} />
          </div>

          {/* Resizer */}
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

          {/* Right Panel - Stats */}
          <div 
            className="ide-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
            }}
          >
            <OutputToolbar
              label="Statistics"
              icon="fa-chart-bar"
            >
              {headerStats && (
                <div className="header-stats">
                  <span className="header-stat">
                    <span className="stat-label">Characters:</span>
                    <span className="stat-value">{headerStats.charCount.toLocaleString()}</span>
                  </span>
                  <span className="header-stat">
                    <span className="stat-label">Words:</span>
                    <span className="stat-value">{headerStats.wordCount.toLocaleString()}</span>
                  </span>
                  <span className="header-stat">
                    <span className="stat-label">Lines:</span>
                    <span className="stat-value">{headerStats.lineCount.toLocaleString()}</span>
                  </span>
                  <span className="header-stat">
                    <span className="stat-label">Size:</span>
                    <span className="stat-value">{headerStats.size}</span>
                  </span>
                </div>
              )}
            </OutputToolbar>
            <div className="stats-wrapper">
              {isAnalyzing ? (
                <div className="analyzing-overlay">
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </div>
              ) : stats?.isValid ? (
                <StatsDashboard stats={stats} />
              ) : (
                <div className="stats-placeholder">
                  <i className="fas fa-chart-bar"></i>
                  <h4>Ready to Analyze</h4>
                  <p>Paste JSON data in the input panel to see comprehensive statistics.</p>
                  <ul>
                    <li>Size & complexity metrics</li>
                    <li>Structure analysis</li>
                    <li>Type distribution</li>
                    <li>Key frequency</li>
                    <li>Data quality score</li>
                  </ul>
                </div>
              )}
            </div>
            <StatsBar text={stats?.isValid ? JSON.stringify(stats, null, 2) : ''} />
          </div>
        </div>
      </IDELayout>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON Stats"
        sections={jsonStatsHelp}
      />

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonStatsContent.title}
          subtitle={jsonStatsContent.subtitle}
          trustBadges={jsonStatsContent.trustBadges}
          features={jsonStatsContent.features}
          howToSteps={jsonStatsContent.howToSteps}
          howToSectionTitle={jsonStatsContent.howToSectionTitle}
          featuresSectionTitle={jsonStatsContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonStatsContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonStatsContent.comparisonSectionTitle}
          educationalContent={jsonStatsContent.educational}
          useCases={jsonStatsContent.useCases}
          whyChoose={jsonStatsContent.whyChoose}
          technicalSpecs={jsonStatsContent.technicalSpecs}
          comparison={jsonStatsContent.comparison}
          faqs={jsonStatsContent.faqs}
          relatedTools={jsonStatsContent.relatedTools}
        />
      </article>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        /* Ensure ide-pane fills full height and stats bar appears at bottom */
        .ide-pane {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          min-height: 0 !important;
        }
        
        /* Ensure proper flex ordering */
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
        
        .header-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
          padding: 0 0.5rem;
        }
        
        .header-stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .header-stat .stat-label {
          font-weight: 500;
        }
        
        .header-stat .stat-value {
          font-weight: 600;
          color: var(--text);
        }
        
        .stats-wrapper {
          flex: 1 1 0;
          min-height: 0;
          overflow: auto;
          position: relative;
          background: var(--bg);
          order: 2 !important;
        }
        
        .analyzing-overlay {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--text-secondary);
          min-height: 200px;
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
        
        .stats-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          min-height: 200px;
        }
        
        .stats-placeholder i {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        
        .stats-placeholder h4 {
          font-size: 1.2rem;
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .stats-placeholder p {
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
        }
        
        .stats-placeholder ul {
          text-align: left;
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding-left: 1.5rem;
          margin: 0;
        }
        
        .stats-placeholder li {
          margin-bottom: 0.5rem;
        }
        
        .empty-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }
        
        .empty-sidebar i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }
        
        .empty-sidebar p {
          margin: 0;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
}
