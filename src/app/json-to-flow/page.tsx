'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { IDELayout } from '@/components/layout/IDELayout';
import TabManager from '@/components/common/TabManager';
import { useJsonToFlowStore } from '@/store/jsonToFlow';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { FLOW_PRESETS, applyFlowPreset } from '@/lib/flow-viz/presets';
import { NODE_COLORS } from '@/lib/flow-viz/types';
import type { JsonValueType } from '@/lib/flow-viz/types';
import { jsonToFlowSamples } from '@/data/json-to-flow-samples';
import { jsonToFlowSEO } from '@/data/json-to-flow-seo';
import { jsonToFlowHelp } from '@/data/json-to-flow-help';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { readFileAsText } from '@/lib/fileUtils';
import {
  FlowOptionsPanel,
  FlowPresetsPanel,
  FlowSearchPanel,
  FlowStatsPanel,
  JsonNodeComponent,
} from '@/components/tools/json-to-flow';

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

// Node types for ReactFlow
const nodeTypes = {
  'json-node': JsonNodeComponent,
};

export default function JsonToFlowPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 33,
    direction: layout,
  });

  const {
    result,
    settings,
    searchText,
    highlightedNodes,
    generate,
    updateSettings,
    resetSettings,
    formatInput,
    setSearchText,
  } = useJsonToFlowStore();

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
  } = useTabs({ toolName: 'JSON Visualizer', storageKey: 'flow-tabs' });

  const [input, setInput] = useState(activeTab?.inputJSON || '');

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate on mount
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update ReactFlow when result changes
  useEffect(() => {
    if (result?.success) {
      // Add highlighting info to nodes
      const nodesWithHighlight = result.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: highlightedNodes.includes(node.id),
          showTypes: settings.showTypes,
          showValues: settings.showValues,
          showPath: settings.showPath,
        },
      }));
      setNodes(nodesWithHighlight);
      setEdges(result.edges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [result, highlightedNodes, settings, setNodes, setEdges]);

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

  // Handle sample template
  const handleLoadSample = (template: { content: string }) => {
    setInput(template.content);
  };

  // Handle preset
  const handleApplyPreset = (presetId: string) => {
    const newSettings = applyFlowPreset(settings, presetId);
    updateSettings(newSettings);
  };

  // Minimap node color function
  const minimapNodeColor = useCallback((node: { data?: { valueType?: JsonValueType } }) => {
    const type = node.data?.valueType || 'object';
    return NODE_COLORS[type] || '#6b7280';
  }, []);

  // Memoize default edge options
  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: settings.animateEdges,
    }),
    [settings.animateEdges]
  );

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button className="active">
          <i className="fas fa-cog"></i> Options
        </button>
      </div>
      <div className="settings-content">
        <FlowSearchPanel
          searchText={searchText}
          onSearchChange={setSearchText}
          matchCount={highlightedNodes.length}
        />
        <FlowOptionsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onReset={resetSettings}
        />
        <FlowPresetsPanel
          presets={FLOW_PRESETS}
          onApplyPreset={handleApplyPreset}
        />
        {result?.stats && <FlowStatsPanel stats={result.stats} />}
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
            name: 'JSON Visualizer',
            description: jsonToFlowSEO.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Interactive flowchart visualization',
              'Color-coded nodes by type',
              'Search and highlight',
              'Multiple layout algorithms',
              'Export to PNG/SVG/JPEG',
            ],
          }),
        }}
      />

      <IDELayout
        toolName="JSON Visualizer"
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

        {/* Main Editor Content */}
        <div
          ref={containerRef}
          className={`ide-editors flow-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
        >
          {/* Input Panel */}
          <div
            className="ide-pane flow-pane"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${size}%`,
            }}
          >
            <EditorToolbar
              label="JSON Input"
              onUpload={handleUpload}
              onPaste={handlePaste}
              onClear={() => setInput('')}
              onAutoCorrect={formatInput}
              sampleTemplates={jsonToFlowSamples}
              onLoadTemplate={handleLoadSample}
            />
            <div className="editor-wrapper">
              <MonacoEditorPanel
                value={input}
                onChange={setInput}
                language="json"
                placeholder="Paste your JSON here..."
                emptyStateTitle="Welcome to JSON Visualizer"
                emptyStateInstructions={[
                  'Pasting JSON from your API',
                  'Uploading a .json file',
                  'Loading a sample template',
                ]}
                onLoadSample={() => {
                  if (jsonToFlowSamples.length > 0) {
                    setInput(jsonToFlowSamples[0].content);
                  }
                }}
              />
            </div>
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

          {/* Flow Canvas Panel */}
          <div
            className="ide-pane flow-pane flow-panel"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`,
            }}
          >
            <div className="flow-toolbar">
              <span className="flow-toolbar-title">
                <i className="fas fa-project-diagram"></i>
                Flowchart View
              </span>
            </div>
            <div className="flow-canvas">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                minZoom={0.1}
                maxZoom={2}
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap
                  nodeColor={minimapNodeColor}
                  maskColor="rgba(0, 0, 0, 0.2)"
                />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              </ReactFlow>
            </div>
          </div>
        </div>
      </IDELayout>

      {/* SEO Content Below the Tool (keeps editor + flow full-height) */}
      <article id="seo-content">
        <SEOContent
          title={jsonToFlowSEO.heroTitle}
          subtitle={jsonToFlowSEO.heroSubtitle}
          howToSteps={jsonToFlowSEO.howToSteps}
          educationalContent={jsonToFlowSEO.educationalContent}
          technicalSpecs={jsonToFlowSEO.technicalSpecs}
          faqs={jsonToFlowSEO.faq}
          useCases={jsonToFlowSEO.useCases}
        />
      </article>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        toolName="JSON Visualizer"
        sections={jsonToFlowHelp}
      />

      <style jsx>{`
        .flow-editors {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          /* Override global .ide-editors padding/gap to remove whitespace */
          gap: 0 !important;
          padding: 0 !important;
          height: 100%;
          min-height: 0;
        }

        /* Ensure EditorToolbar is a header (not pushed to bottom by global order rules) */
        .flow-pane {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
        }

        .flow-pane :global(.editor-toolbar) {
          order: 1;
          flex-shrink: 0;
        }

        .flow-pane .editor-wrapper {
          order: 2;
          flex: 1 1 0;
          min-height: 0;
        }

        .flow-panel {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .flow-toolbar {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: var(--card);
          border-bottom: 1px solid var(--border);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }

        .flow-toolbar-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--text);
        }

        .flow-toolbar-title i {
          color: var(--primary);
        }

        .flow-canvas {
          flex: 1 1 0;
          min-height: 0;
          background: var(--card);
          border-radius: 0 0 var(--radius-md) var(--radius-md);
        }

        .editor-errors {
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border-top: 1px solid var(--border);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--error);
        }

        @media (max-width: 1024px) {
          .flow-editors {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
