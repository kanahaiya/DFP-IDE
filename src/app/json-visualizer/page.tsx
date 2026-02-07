'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useJsonVisualizerStore } from '@/store/jsonVisualizer';
import {
  InputPanel,
  VisualizerCanvas,
  ControlsPanel,
  DetailsPanel,
  StatsPanel,
  SearchPanel,
  ExportPanel,
} from '@/components/tools/json-visualizer';
import { IDELayout } from '@/components/layout/IDELayout';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { StatsBar } from '@/components/common/StatsBar';
import { jsonVisualizerSEO } from '@/data/json-visualizer-seo';
import { JSON_VISUALIZER_HELP } from '@/data/json-visualizer-help';
import { JSON_VISUALIZER_SAMPLES } from '@/data/json-visualizer-samples';

type SidebarTab = 'controls' | 'details' | 'stats';

export default function JsonVisualizerPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [inputCollapsed, setInputCollapsed] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('controls');

  const { parseAndVisualize, loadSample, settings, graph, jsonInput, parseError } = useJsonVisualizerStore();

  // Parse on initial load
  useEffect(() => {
    parseAndVisualize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle URL data parameter for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(atob(dataParam));
        useJsonVisualizerStore.getState().setJsonInput(decoded);
      } catch (e) {
        console.error('Failed to decode URL data:', e);
      }
    }
  }, []);

  const handleLoadSample = useCallback(
    (sampleId: string) => {
      const sample = JSON_VISUALIZER_SAMPLES.find((s) => s.id === sampleId);
      if (sample) {
        loadSample(sample.data);
      }
    },
    [loadSample]
  );

  // Settings sidebar content (right panel)
  const settingsSidebar = (
    <div className="settings-sidebar">
      {/* Search */}
      <SearchPanel />

      {/* Tab Navigation */}
      <div className="settings-tabs">
        <button
          className={`sidebar-tab ${sidebarTab === 'controls' ? 'active' : ''}`}
          onClick={() => setSidebarTab('controls')}
        >
          <i className="fas fa-sliders-h" />
          Controls
        </button>
        <button
          className={`sidebar-tab ${sidebarTab === 'details' ? 'active' : ''}`}
          onClick={() => setSidebarTab('details')}
        >
          <i className="fas fa-info-circle" />
          Details
        </button>
        <button
          className={`sidebar-tab ${sidebarTab === 'stats' ? 'active' : ''}`}
          onClick={() => setSidebarTab('stats')}
        >
          <i className="fas fa-chart-pie" />
          Stats
        </button>
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        {sidebarTab === 'controls' && <ControlsPanel />}
        {sidebarTab === 'details' && <DetailsPanel />}
        {sidebarTab === 'stats' && <StatsPanel />}
      </div>

      {/* Export */}
      <ExportPanel />
    </div>
  );

  return (
    <div className="visualizer-page">
      {/* Screen reader title */}
      <h1 className="sr-only">{jsonVisualizerSEO.title}</h1>

      <IDELayout
        toolName="JSON Visualizer"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setIsHelpOpen(true)}
      >
        <div className="ide-editors visualizer-layout">
          {/* Left Panel - Input */}
          <div className={`ide-pane input-section ${inputCollapsed ? 'collapsed' : ''}`}>
            <InputPanel
              isCollapsed={inputCollapsed}
              onToggleCollapse={() => setInputCollapsed(!inputCollapsed)}
            />
          </div>

          {/* Center - Visualization */}
          <div className="ide-pane visualization-section">
            {/* Top Bar */}
            <div className="viz-toolbar">
              <div className="toolbar-left">
                <span className="mode-indicator">
                  <i className={`fas ${settings.mode === '2d' ? 'fa-square' : 'fa-cube'}`} />
                  {settings.mode.toUpperCase()} Mode
                </span>
                <span className="layout-indicator">
                  <i className="fas fa-sitemap" />
                  {settings.layout.charAt(0).toUpperCase() + settings.layout.slice(1)}
                </span>
                {graph && (
                  <span className="node-count">
                    <i className="fas fa-circle" />
                    {graph.stats.totalNodes} nodes
                  </span>
                )}
              </div>
              <div className="toolbar-right">
                {/* Sample Templates Dropdown */}
                <div className="dropdown">
                  <button className="toolbar-btn dropdown-trigger">
                    <i className="fas fa-flask" />
                    <span>Samples</span>
                    <i className="fas fa-chevron-down" />
                  </button>
                  <div className="dropdown-menu">
                    {JSON_VISUALIZER_SAMPLES.map((sample) => (
                      <button
                        key={sample.id}
                        className="dropdown-item"
                        onClick={() => handleLoadSample(sample.id)}
                      >
                        <i className={sample.icon} style={{ color: sample.iconColor }} />
                        <div className="item-content">
                          <span className="item-name">{sample.name}</span>
                          <span className="item-desc">{sample.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="canvas-container">
              <VisualizerCanvas />
            </div>

            <StatsBar
              text={jsonInput}
              className="viz-stats"
              validationState={{
                isValid: !parseError,
                errorCount: parseError ? 1 : 0,
                warningCount: 0,
              }}
            />
          </div>
        </div>
      </IDELayout>

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          title={jsonVisualizerSEO.title}
          subtitle={jsonVisualizerSEO.subtitle}
          trustBadges={jsonVisualizerSEO.trustBadges}
          features={jsonVisualizerSEO.features}
          howToSteps={jsonVisualizerSEO.howToSteps}
          educationalContent={jsonVisualizerSEO.educationalContent}
          useCases={jsonVisualizerSEO.useCases}
          whyChoose={jsonVisualizerSEO.whyChoose}
          technicalSpecs={jsonVisualizerSEO.technicalSpecs}
          faqs={jsonVisualizerSEO.faqs}
          relatedTools={jsonVisualizerSEO.relatedTools}
          howToSectionTitle={jsonVisualizerSEO.howToSectionTitle}
          featuresSectionTitle={jsonVisualizerSEO.featuresSectionTitle}
          whyChooseSectionTitle={jsonVisualizerSEO.whyChooseSectionTitle}
          comparisonSectionTitle={jsonVisualizerSEO.comparisonSectionTitle}
        />
      </article>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        toolName={JSON_VISUALIZER_HELP.toolName}
        sections={JSON_VISUALIZER_HELP.sections}
      />

      <style jsx>{`
        .visualizer-page {
          min-height: 100vh;
          background: var(--bg);
        }

        /* Make IDELayout fill viewport height */
        .visualizer-page :global(.ide-layout) {
          min-height: 100vh;
          max-height: 100vh;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Override ide-main for visualizer to prevent overflow */
        :global(.visualizer-page .ide-main) {
          overflow: hidden !important;
          flex: 1 1 0 !important;
          min-height: 0 !important;
          /* Visualizer doesn't use TabManager; keep calc() valid */
          --ide-tabs-height: 0px;
        }

        :global(.visualizer-page .ide-container) {
          flex: 1 1 0 !important;
          min-height: 0 !important;
        }

        /* Make the IDE editors container fill available height */
        :global(.ide-editors.visualizer-layout) {
          display: flex !important;
          flex-direction: row !important;
          align-items: stretch !important;
          min-width: 0 !important;
          /* Match global ide-pane height contract (prevents SEO showing early) */
          flex: 0 0 auto !important;
          min-height: calc(100vh - var(--header-height) - var(--ide-tabs-height)) !important;
          height: calc(100vh - var(--header-height) - var(--ide-tabs-height)) !important;
          max-height: calc(100vh - var(--header-height) - var(--ide-tabs-height)) !important;
          overflow: hidden !important;
          gap: 0 !important;
          padding: 0 !important;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        /* Input section - full height flex */
        .input-section {
          width: 350px;
          min-width: 350px;
          flex: 0 0 350px;
          height: 100%;
          display: flex !important;
          flex-direction: column !important;
          transition: width 0.3s ease, min-width 0.3s ease, flex-basis 0.3s ease;
          background: var(--card);
          overflow: hidden;
        }

        .input-section.collapsed {
          width: 40px;
          min-width: 40px;
          flex: 0 0 40px;
        }

        /* Visualization section - full height flex */
        .visualization-section {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          background: var(--bg);
          overflow: hidden !important;
        }

        .canvas-container {
          flex: 1 1 0 !important;
          min-height: 0 !important;
          height: 100% !important;
          overflow: hidden !important;
          position: relative;
          background: var(--bg);
          order: 2 !important;
        }

        :global(.viz-stats) {
          flex-shrink: 0 !important;
          flex-grow: 0 !important;
          order: 999 !important;
          height: 22px !important;
        }

        .viz-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: var(--elevated);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0 !important;
          flex-grow: 0 !important;
          order: 1 !important;
          height: 40px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mode-indicator,
        .layout-indicator,
        .node-count {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .mode-indicator i,
        .layout-indicator i,
        .node-count i {
          color: var(--primary);
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: var(--hover);
          color: var(--text);
          border-color: var(--primary);
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          width: 280px;
          max-height: 400px;
          overflow-y: auto;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s ease;
        }

        .dropdown:hover .dropdown-menu,
        .dropdown:focus-within .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
          color: var(--text);
        }

        .dropdown-item:hover {
          background: var(--hover);
        }

        .dropdown-item i {
          font-size: 16px;
          margin-top: 2px;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }

        .item-desc {
          font-size: 11px;
          color: var(--text-secondary);
        }

        @media (max-width: 1200px) {
          .input-section {
            width: 280px;
            min-width: 280px;
          }
        }

        @media (max-width: 900px) {
          :global(.ide-editors.visualizer-layout) {
            flex-direction: column !important;
          }

          .input-section {
            width: 100%;
            min-width: 100%;
            flex: 0 0 200px;
            height: 200px;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }

          .input-section.collapsed {
            width: 100%;
            min-width: 100%;
            flex: 0 0 40px;
            height: 40px;
          }

          .visualization-section {
            flex: 1;
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
