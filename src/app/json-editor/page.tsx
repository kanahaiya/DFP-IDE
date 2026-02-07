'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useJSONEditorStore } from '@/store/jsonEditor';
import {
  TreeView,
  PathBreadcrumb,
  SearchBar,
  EditorOptionsPanel,
  EditorAdvancedPanel,
  EditorPresetsPanel,
  EditorStatsPanel,
  EditorSamplesPanel,
} from '@/components/tools/json-editor';
import { IDELayout } from '@/components/layout/IDELayout';
import { SEOContent } from '@/components/seo/SEOContent';
import { HelpModal } from '@/components/common/HelpModal';
import { copyToClipboard } from '@/lib/clipboardUtils';
import {
  JSON_EDITOR_HEADER,
  JSON_EDITOR_EDUCATIONAL,
  JSON_EDITOR_SPECS,
  JSON_EDITOR_FAQ,
  JSON_EDITOR_HOW_TO,
  JSON_EDITOR_RELATED_TOOLS,
} from '@/data/json-editor-seo';
import { JSON_EDITOR_HELP_SECTIONS } from '@/data/json-editor-help';
import type { EditorSampleTemplate } from '@/data/json-editor-samples';
import type { JsonValue } from '@/lib/json-editor/types';
import { formatJSON } from '@/lib/json-editor/validator';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-stone-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    ),
  }
);

export default function JsonEditorPage() {
  // Store state
  const {
    rawInput,
    tree,
    mode,
    selectedNodeId,
    validation,
    clipboard,
    searchOptions,
    searchResults,
    currentSearchIndex,
    settings,
    stats,
    setRawInput,
    parseAndLoad,
    setMode,
    toggleExpansion,
    expandAll,
    collapseAll,
    selectNode,
    startEditing,
    setValue,
    setKey,
    addProperty,
    deleteProperty,
    duplicateProperty,
    moveUp,
    moveDown,
    changeType,
    copy,
    cut,
    paste,
    setSearchOptions,
    search,
    nextResult,
    prevResult,
    clearSearch,
    undoAction,
    redoAction,
    canUndo,
    canRedo,
    updateSettings,
    applyPreset,
    formatData,
    minifyData,
    reset,
  } = useJSONEditorStore();

  // UI state
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    options: false,
    advanced: false,
    presets: false,
    stats: true,
    samples: true,
  });

  // Get selected node
  const selectedNode = selectedNodeId ? tree.nodes.get(selectedNodeId) : null;

  // Toggle panel expansion
  const togglePanel = useCallback((panel: keyof typeof expandedPanels) => {
    setExpandedPanels((prev) => ({ ...prev, [panel]: !prev[panel] }));
  }, []);

  // Handle sample load
  const handleLoadSample = useCallback((sample: EditorSampleTemplate) => {
    const json = formatJSON(sample.data as JsonValue, settings.indentSize);
    parseAndLoad(json);
  }, [parseAndLoad, settings.indentSize]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    await copyToClipboard(rawInput);
  }, [rawInput]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoAction();
      }
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoAction();
      }
      // Ctrl/Cmd + F: Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Ctrl/Cmd + D: Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedNodeId) {
        e.preventDefault();
        duplicateProperty(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoAction, redoAction, selectedNodeId, duplicateProperty]);

  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-content">
        <EditorStatsPanel
          stats={stats}
          isExpanded={expandedPanels.stats}
          onToggle={() => togglePanel('stats')}
        />

        <EditorSamplesPanel
          onLoadSample={handleLoadSample}
          isExpanded={expandedPanels.samples}
          onToggle={() => togglePanel('samples')}
        />

        <EditorPresetsPanel
          onApplyPreset={applyPreset}
          isExpanded={expandedPanels.presets}
          onToggle={() => togglePanel('presets')}
        />

        <EditorOptionsPanel
          settings={settings}
          onSettingsChange={updateSettings}
          isExpanded={expandedPanels.options}
          onToggle={() => togglePanel('options')}
        />

        <EditorAdvancedPanel
          settings={settings}
          onSettingsChange={updateSettings}
          isExpanded={expandedPanels.advanced}
          onToggle={() => togglePanel('advanced')}
        />
      </div>
    </div>
  );

  return (
    <>
      <IDELayout
        toolName="JSON Editor"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setHelpOpen(true)}
      >
        {/* Main Editor Area */}
        <div className="ide-editors">
          <div className="ide-pane editor-panel json-editor-panel">
            {/* Toolbar */}
            <div className="json-editor-toolbar">
              <div className="json-editor-toolbar-left">
                {/* Mode Toggle */}
                <div className="json-editor-mode-toggle">
                  <button
                    onClick={() => setMode('tree')}
                    className={`json-editor-mode-btn ${mode === 'tree' ? 'active' : ''}`}
                  >
                    <i className="fas fa-sitemap"></i>
                    Tree
                  </button>
                  <button
                    onClick={() => setMode('code')}
                    className={`json-editor-mode-btn ${mode === 'code' ? 'active' : ''}`}
                  >
                    <i className="fas fa-code"></i>
                    Code
                  </button>
                </div>

                <div className="json-editor-separator"></div>

                {/* Expand/Collapse */}
                {mode === 'tree' && (
                  <>
                    <button
                      onClick={expandAll}
                      className="json-editor-toolbar-btn"
                      title="Expand All"
                    >
                      <i className="fas fa-expand" />
                    </button>
                    <button
                      onClick={collapseAll}
                      className="json-editor-toolbar-btn"
                      title="Collapse All"
                    >
                      <i className="fas fa-compress" />
                    </button>
                    <div className="json-editor-separator"></div>
                  </>
                )}

                {/* Undo/Redo */}
                <button
                  onClick={undoAction}
                  disabled={!canUndo()}
                  className="json-editor-toolbar-btn"
                  title="Undo (Ctrl+Z)"
                >
                  <i className="fas fa-undo" />
                </button>
                <button
                  onClick={redoAction}
                  disabled={!canRedo()}
                  className="json-editor-toolbar-btn"
                  title="Redo (Ctrl+Y)"
                >
                  <i className="fas fa-redo" />
                </button>

                <div className="json-editor-separator"></div>

                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`json-editor-toolbar-btn ${searchOpen ? 'active' : ''}`}
                  title="Search (Ctrl+F)"
                >
                  <i className="fas fa-search" />
                </button>
              </div>

              <div className="json-editor-toolbar-right">
                {/* Format/Minify (Code mode) */}
                {mode === 'code' && (
                  <>
                    <button
                      onClick={formatData}
                      className="json-editor-toolbar-btn"
                      title="Format JSON"
                    >
                      <i className="fas fa-indent"></i>
                      Format
                    </button>
                    <button
                      onClick={minifyData}
                      className="json-editor-toolbar-btn"
                      title="Minify JSON"
                    >
                      <i className="fas fa-compress-alt"></i>
                      Minify
                    </button>
                    <div className="json-editor-separator"></div>
                  </>
                )}

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="json-editor-toolbar-btn"
                  title="Copy JSON"
                >
                  <i className="fas fa-copy"></i>
                  Copy
                </button>

                {/* Reset */}
                <button
                  onClick={reset}
                  className="json-editor-toolbar-btn json-editor-btn-danger"
                  title="Reset to default"
                >
                  <i className="fas fa-trash-restore"></i>
                  Reset
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              searchOptions={searchOptions}
              searchResults={searchResults}
              currentIndex={currentSearchIndex}
              onOptionsChange={setSearchOptions}
              onSearch={search}
              onNext={nextResult}
              onPrev={prevResult}
              onClear={clearSearch}
            />

            {/* Path Breadcrumb */}
            {mode === 'tree' && settings.showPath && (
              <PathBreadcrumb
                tree={tree}
                selectedNode={selectedNode ?? null}
                onNavigate={(nodeId) => {
                  selectNode(nodeId);
                  // Expand to show the node
                  const node = tree.nodes.get(nodeId);
                  if (node && !node.isExpanded) {
                    toggleExpansion(nodeId);
                  }
                }}
              />
            )}

            {/* Editor */}
            <div className="json-editor-content">
              {/* Validation error banner */}
              {!validation.isValid && (
                <div className="json-editor-validation-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>
                    {validation.errors[0]?.message}
                    {validation.errors[0]?.line && ` (line ${validation.errors[0].line})`}
                  </span>
                </div>
              )}

              <div className="json-editor-view-container">
                {mode === 'tree' ? (
                  <TreeView
                    tree={tree}
                    showTypes={settings.showTypes}
                    indentSize={settings.indentSize}
                    searchResults={searchResults}
                    currentSearchIndex={currentSearchIndex}
                    onToggleExpand={toggleExpansion}
                    onSelect={selectNode}
                    onStartEdit={startEditing}
                    onValueChange={(nodeId, value) => setValue(nodeId, value)}
                    onKeyChange={setKey}
                    onAddProperty={(nodeId, key, type) => addProperty(nodeId, key, type)}
                    onDeleteProperty={deleteProperty}
                    onDuplicateProperty={duplicateProperty}
                    onMoveUp={moveUp}
                    onMoveDown={moveDown}
                    onChangeType={changeType}
                    onCopy={copy}
                    onCut={cut}
                    onPaste={paste}
                    canPaste={clipboard !== null}
                    onExpandAll={expandAll}
                    onCollapseAll={collapseAll}
                  />
                ) : (
                  <MonacoEditor
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    value={rawInput}
                    onChange={(value) => setRawInput(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: settings.showLineNumbers ? 'on' : 'off',
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      tabSize: settings.indentSize,
                      automaticLayout: true,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </IDELayout>

      {/* SEO Content */}
      <article id="seo-content">
        <SEOContent
          subtitle={JSON_EDITOR_HEADER.description}
          educationalContent={JSON_EDITOR_EDUCATIONAL}
          technicalSpecs={JSON_EDITOR_SPECS}
          faqs={JSON_EDITOR_FAQ}
          howToSteps={JSON_EDITOR_HOW_TO}
          relatedTools={JSON_EDITOR_RELATED_TOOLS}
        />
      </article>

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        toolName="JSON Editor"
        sections={JSON_EDITOR_HELP_SECTIONS.map(section => ({
          title: section.title,
          content: section.content + (section.subsections ? section.subsections.map(s => `<h4>${s.title}</h4><p>${s.content}</p>`).join('') : ''),
          icon: 'fas fa-info-circle',
        }))}
      />

      <style jsx>{`
        :global(.ide-editors:has(.json-editor-panel)) {
          display: flex;
          min-width: 0;
        }

        :global(.json-editor-panel) {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          min-width: 0;
        }

        :global(.json-editor-content) {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        :global(.json-editor-view-container) {
          flex: 1;
          min-height: 0;
        }

        :global(.settings-content) {
          display: flex;
          flex-direction: column;
          gap: 0 !important;
        }

        :global(.settings-content > div) {
          border-radius: 0 !important;
        }
      `}</style>
    </>
  );
}
