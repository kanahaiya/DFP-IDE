'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { ComparisonOptionsPanel } from '@/components/tools/json-diff/ComparisonOptionsPanel';
import { ViewModeSelector } from '@/components/tools/json-diff/ViewModeSelector';
import { ChangeNavigation } from '@/components/tools/json-diff/ChangeNavigation';
import { ExportOptions } from '@/components/tools/json-diff/ExportOptions';
import { UnifiedDiffView } from '@/components/tools/json-diff/UnifiedDiffView';
import { TreeView } from '@/components/tools/json-diff/TreeView';
import { ReportView } from '@/components/tools/json-diff/ReportView';
import { useJSONDiffStore } from '@/store/jsonDiff';
import { useTabs } from '@/hooks/useTabs';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { useDiff } from '@/hooks/useDiff';
import { useChangeNavigation } from '@/hooks/useChangeNavigation';
import { validateJSON } from '@/lib/json-diff/validator';
import { getDecorationsForChanges, MonacoDecoration, buildPathToLineMap, extractLineDiffs } from '@/lib/json-diff/diffHighlighter';
import { useEditorSnapshotsStore } from '@/store/editorSnapshots';
import { computeStats } from '@/lib/json-diff/diffEngine';
import { readFileAsText } from '@/lib/fileUtils';
import { event as trackEvent } from '@/lib/analytics';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonDiffHelpSections } from '@/data/json-diff-help';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { jsonDiffContent } from '@/data/json-diff-seo';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import type { editor } from 'monaco-editor';

export default function JSONDiffPage() {
  const { settings, updateSettings } = useJSONDiffStore();
  const toast = useToast();
  const { layout } = useLayout();
  const { size, resizerRef, containerRef } = useResizer({
    defaultSize: 50,
    direction: layout,
  });
  
  // Tab management
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
  } = useTabs({ toolName: 'JSON Diff', storageKey: 'json-diff-tabs' });
  
  const [leftJSON, setLeftJSON] = useState('');
  const [rightJSON, setRightJSON] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [settingsTabId, setSettingsTabId] = useState('settings-comparison');
  const [leftDecorations, setLeftDecorations] = useState<MonacoDecoration[]>([]);
  const [rightDecorations, setRightDecorations] = useState<MonacoDecoration[]>([]);
  
  // Editor references for scroll navigation
  const leftEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const rightEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Validation errors
  const [leftErrors, setLeftErrors] = useState<Array<{ line: number; column: number; message: string }>>([]);
  const [rightErrors, setRightErrors] = useState<Array<{ line: number; column: number; message: string }>>([]);
  
  // Compute diff
  const { changes, stats, error: diffError } = useDiff(leftJSON, rightJSON, settings);
  
  // Change navigation with filtering
  const {
    currentChangeIndex,
    filteredChanges,
    hasNext,
    hasPrevious,
    nextChange,
    prevChange,
    jumpToChange,
    setFilter,
  } = useChangeNavigation(changes);
  
  // Get current filter from store
  const { changeFilter } = useJSONDiffStore();

  // Current change (if navigating) - used to adjust per-editor current-line highlighting
  const currentChange = useMemo(
    () => (currentChangeIndex >= 0 ? filteredChanges[currentChangeIndex] : null),
    [currentChangeIndex, filteredChanges]
  );
  
  // Stats should reflect the active filter selection (not always "all changes")
  const filteredStats = useMemo(() => computeStats(filteredChanges), [filteredChanges]);

  // Validation state
  const validationState = useMemo(() => ({
    isValid: leftErrors.length === 0 && rightErrors.length === 0,
    errorCount: leftErrors.length + rightErrors.length,
    warningCount: 0,
  }), [leftErrors, rightErrors]);
  
  // Wrapper for addTab to return void
  const handleAddTab = useCallback(() => {
    addTab();
  }, [addTab]);
  
  // Scroll to the current change when navigation changes
  const scrollToChange = useCallback((changeIndex: number) => {
    if (changeIndex < 0 || changeIndex >= changes.length) return;
    
    const change = changes[changeIndex];
    if (!change) return;
    
    // Determine which editor to scroll based on change type
    const shouldScrollLeft = change.type === 'REMOVED' || change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED' || change.type === 'MOVED';
    const shouldScrollRight = change.type === 'ADDED' || change.type === 'MODIFIED' || change.type === 'TYPE_CHANGED' || change.type === 'MOVED';
    
    // Get the appropriate path for each side
    let leftPath = change.jsonPath;
    let rightPath = change.jsonPath;
    
    if (change.type === 'MOVED') {
      if (change.oldPath) leftPath = change.oldPath;
      if (change.newPath) rightPath = change.newPath;
    }
    
    // Build path-to-line maps
    const leftPathMap = buildPathToLineMap(leftJSON);
    const rightPathMap = buildPathToLineMap(rightJSON);
    
    // Scroll left editor
    if (shouldScrollLeft && leftEditorRef.current && leftPath) {
      const lineNumber = leftPathMap.get(leftPath);
      if (lineNumber) {
        leftEditorRef.current.revealLineInCenter(lineNumber);
        leftEditorRef.current.setPosition({ lineNumber, column: 1 });
        leftEditorRef.current.focus();
      }
    }
    
    // Scroll right editor
    if (shouldScrollRight && rightEditorRef.current && rightPath) {
      const lineNumber = rightPathMap.get(rightPath);
      if (lineNumber) {
        rightEditorRef.current.revealLineInCenter(lineNumber);
        rightEditorRef.current.setPosition({ lineNumber, column: 1 });
        // Only focus right if not scrolling left
        if (!shouldScrollLeft) {
          rightEditorRef.current.focus();
        }
      }
    }
  }, [changes, leftJSON, rightJSON]);
  
  // Watch for change navigation and scroll accordingly
  useEffect(() => {
    if (currentChangeIndex >= 0) {
      scrollToChange(currentChangeIndex);
    }
  }, [currentChangeIndex, scrollToChange]);
  
  // Load sample data on first mount
  useEffect(() => {
    if (!leftJSON && !rightJSON && leftSamples.length > 0 && rightSamples.length > 0) {
      setLeftJSON(leftSamples[0].content);
      setRightJSON(rightSamples[0].content);
      toast.info('Sample data loaded. Edit or upload your own JSON to compare.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get setDiffs for storing diff info for PNG export
  const setDiffs = useEditorSnapshotsStore((s) => s.setDiffs);

  // Apply diff decorations to Monaco editors
  useEffect(() => {
    // Use filteredChanges so highlighting matches the active filter selection
    if (filteredChanges.length > 0 && leftJSON && rightJSON) {
      try {
        const formattedLeft = JSON.stringify(JSON.parse(leftJSON), null, 2);
        const formattedRight = JSON.stringify(JSON.parse(rightJSON), null, 2);
        
        const decorationOptions = { showGlyphMargin: settings.showGlyphMargin };
        const leftDecs = getDecorationsForChanges(formattedLeft, filteredChanges, 'left', decorationOptions);
        const rightDecs = getDecorationsForChanges(formattedRight, filteredChanges, 'right', decorationOptions);
        
        setLeftDecorations(leftDecs);
        setRightDecorations(rightDecs);
        
        // Store line diffs for PNG export
        const leftLineDiffs = extractLineDiffs(leftDecs);
        const rightLineDiffs = extractLineDiffs(rightDecs);
        setDiffs('/json-diff', 'left', leftLineDiffs);
        setDiffs('/json-diff', 'right', rightLineDiffs);
      } catch (error) {
        console.error('Failed to apply decorations:', error);
      }
    } else {
      setLeftDecorations([]);
      setRightDecorations([]);
      // Clear diffs when no changes
      setDiffs('/json-diff', 'left', []);
      setDiffs('/json-diff', 'right', []);
    }
  }, [filteredChanges, leftJSON, rightJSON, settings.showGlyphMargin, setDiffs]);
  
  // Keyboard shortcuts for change navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in input fields or Monaco editor
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Don't handle shortcuts when focused in Monaco editor
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) {
        return;
      }
      
      // Shift+J or ] for next change
      if ((e.shiftKey && e.key === 'J') || e.key === ']') {
        e.preventDefault();
        if (hasNext) {
          nextChange();
        }
      }
      
      // Shift+K or [ for previous change
      if ((e.shiftKey && e.key === 'K') || e.key === '[') {
        e.preventDefault();
        if (hasPrevious) {
          prevChange();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrevious, nextChange, prevChange]);
  
  // Load tab content
  useEffect(() => {
    if (activeTab) {
      setLeftJSON(activeTab.inputJSON || '');
      setRightJSON(activeTab.outputJSON || '');
    }
  }, [activeTabId, activeTab]);
  
  // Save tab content
  useEffect(() => {
    if (activeTabId && (leftJSON || rightJSON)) {
      const timer = setTimeout(() => {
        updateTab(activeTabId, {
          inputJSON: leftJSON,
          outputJSON: rightJSON,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, leftJSON, rightJSON, updateTab]);
  
  // Validate JSONs
  useEffect(() => {
    if (leftJSON.trim()) {
      const errors = validateJSON(leftJSON);
      setLeftErrors(errors);
    } else {
      setLeftErrors([]);
    }
  }, [leftJSON]);
  
  useEffect(() => {
    if (rightJSON.trim()) {
      const errors = validateJSON(rightJSON);
      setRightErrors(errors);
    } else {
      setRightErrors([]);
    }
  }, [rightJSON]);
  
  // Handle file upload (left)
  const handleLeftUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setLeftJSON(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_diff', 'left');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to load file: ${errorMessage}`);
    }
  }, [toast]);
  
  // Handle file upload (right)
  const handleRightUpload = useCallback(async (file: File) => {
    try {
      const text = await readFileAsText(file);
      setRightJSON(text);
      toast.success(`Loaded ${file.name}`);
      trackEvent('file_upload', 'json_diff', 'right');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to load file: ${errorMessage}`);
    }
  }, [toast]);
  
  // Handle paste (left)
  const handleLeftPaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLeftJSON(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  }, [toast]);
  
  // Handle paste (right)
  const handleRightPaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRightJSON(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  }, [toast]);
  
  // Handle clear (left)
  const handleLeftClear = useCallback(() => {
    setLeftJSON('');
    toast.info('Left JSON cleared');
  }, [toast]);
  
  // Handle clear (right)
  const handleRightClear = useCallback(() => {
    setRightJSON('');
    toast.info('Right JSON cleared');
  }, [toast]);
  
  // Sample templates
  const leftSamples = useMemo(() => [
    {
      id: 'user-v1',
      name: 'User Profile v1',
      description: 'Original user profile data',
      content: JSON.stringify({
        id: 101,
        name: 'Alice',
        age: 30,
        email: 'alice@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001'
        },
        tags: ['premium', 'verified']
      }, null, 2),
    },
    {
      id: 'config-old',
      name: 'Config (Old)',
      description: 'Application config version 1.0',
      content: JSON.stringify({
        version: '1.0',
        features: {
          auth: true,
          notifications: false,
          darkMode: true
        },
        limits: {
          maxUsers: 100,
          maxStorage: '10GB'
        }
      }, null, 2),
    },
    {
      id: 'complex-api-v1',
      name: 'Complex API v1',
      description: 'Complex API response with all data types',
      content: JSON.stringify({
        apiVersion: "2.1.0",
        requestId: "req_abc123",
        timestamp: "2024-01-15T10:30:00Z",
        success: true,
        data: {
          user: {
            id: 12345,
            userName: "john_doe",
            DisplayName: "John Doe",
            email: "john@example.com",
            isActive: true,
            role: "admin",
            permissions: ["read", "write", "delete"],
            profile: {
              avatar_url: "https://example.com/avatar.jpg",
              bio: "Software developer",
              socialLinks: {
                twitter: "@johndoe",
                github: "johndoe",
                linkedin: null
              },
              preferences: {
                theme: "dark",
                language: "en-US",
                notifications: {
                  email: true,
                  push: false,
                  sms: false
                }
              }
            },
            createdAt: "2023-06-15T08:00:00Z",
            lastLogin: "2024-01-14T22:45:00Z"
          },
          orders: [
            {
              orderId: "ORD-001",
              status: "completed",
              total: 299.99,
              currency: "USD",
              items: [
                { sku: "ITEM-A", name: "Widget Pro", quantity: 2, price: 99.99 },
                { sku: "ITEM-B", name: "Gadget Plus", quantity: 1, price: 100.01 }
              ],
              shipping: {
                method: "express",
                tracking_number: "1Z999AA10123456784",
                estimated_delivery: "2024-01-20"
              }
            },
            {
              orderId: "ORD-002",
              status: "pending",
              total: 49.99,
              currency: "USD",
              items: [
                { sku: "ITEM-C", name: "Basic Tool", quantity: 1, price: 49.99 }
              ],
              shipping: null
            }
          ],
          stats: {
            totalOrders: 15,
            totalSpent: 1542.50,
            averageOrderValue: 102.83,
            memberSince: 2023
          }
        },
        meta: {
          page: 1,
          limit: 10,
          totalRecords: 1,
          hasMore: false
        },
        errors: [],
        warnings: ["API v2.1 will be deprecated on 2025-01-01"]
      }, null, 2),
    },
  ], []);
  
  const rightSamples = useMemo(() => [
    {
      id: 'user-v2',
      name: 'User Profile v2',
      description: 'Updated user profile with changes',
      content: JSON.stringify({
        id: 101,
        name: 'Alicia',
        age: 31,
        email: 'alicia@example.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '10001'
        },
        tags: ['premium', 'verified', 'beta']
      }, null, 2),
    },
    {
      id: 'config-new',
      name: 'Config (New)',
      description: 'Application config version 2.0',
      content: JSON.stringify({
        version: '2.0',
        features: {
          auth: true,
          notifications: true,
          darkMode: true,
          analytics: true
        },
        limits: {
          maxUsers: 500,
          maxStorage: '50GB',
          maxBandwidth: '1TB'
        }
      }, null, 2),
    },
    {
      id: 'complex-api-v2',
      name: 'Complex API v2',
      description: 'Updated API response with many changes',
      content: JSON.stringify({
        apiVersion: "3.0.0",
        requestId: "req_xyz789",
        timestamp: "2024-01-15T14:45:00Z",
        success: true,
        data: {
          user: {
            id: 12345,
            userName: "john_doe",
            DisplayName: "Jonathan Doe",
            email: "jonathan@newdomain.com",
            isActive: true,
            role: "superadmin",
            permissions: ["read", "write", "delete", "admin", "audit"],
            profile: {
              avatar_url: "https://cdn.example.com/avatars/john_new.png",
              bio: "Senior Software Engineer & Tech Lead",
              location: "San Francisco, CA",
              socialLinks: {
                twitter: "@jonathan_doe",
                github: "jonathan-doe",
                linkedin: "in/jonathandoe",
                website: "https://johndoe.dev"
              },
              preferences: {
                theme: "auto",
                language: "en-US",
                timezone: "America/Los_Angeles",
                notifications: {
                  email: true,
                  push: true,
                  sms: true,
                  slack: true
                }
              }
            },
            verified: true,
            createdAt: "2023-06-15T08:00:00Z",
            lastLogin: "2024-01-15T14:30:00Z",
            sessionCount: 847
          },
          orders: [
            {
              orderId: "ORD-001",
              status: "delivered",
              total: 299.99,
              currency: "USD",
              items: [
                { sku: "ITEM-A", name: "Widget Pro Max", quantity: 2, price: 99.99, discount: 0 },
                { sku: "ITEM-B", name: "Gadget Plus", quantity: 1, price: 100.01, discount: 10 }
              ],
              shipping: {
                method: "express",
                tracking_number: "1Z999AA10123456784",
                estimated_delivery: "2024-01-20",
                delivered_at: "2024-01-18T16:30:00Z"
              },
              review: {
                rating: 5,
                comment: "Excellent products!"
              }
            },
            {
              orderId: "ORD-003",
              status: "processing",
              total: 599.99,
              currency: "USD",
              items: [
                { sku: "ITEM-D", name: "Premium Suite", quantity: 1, price: 599.99, discount: 50 }
              ],
              shipping: {
                method: "standard",
                tracking_number: null,
                estimated_delivery: "2024-01-25"
              }
            }
          ],
          stats: {
            totalOrders: 18,
            totalSpent: 2142.48,
            averageOrderValue: 119.03,
            memberSince: 2023,
            loyaltyTier: "gold",
            rewardsPoints: 2150
          },
          recommendations: [
            { productId: "REC-001", name: "Smart Device X", score: 0.95 },
            { productId: "REC-002", name: "Accessory Pack", score: 0.87 }
          ]
        },
        meta: {
          page: 1,
          limit: 20,
          totalRecords: 1,
          hasMore: false,
          processingTime: "45ms",
          cacheHit: true
        },
        errors: [],
        warnings: [],
        deprecationNotice: null
      }, null, 2),
    },
  ], []);
  
  // Settings sidebar content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="settings-tabs">
        <button
          className={settingsTabId === 'settings-comparison' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-comparison')}
        >
          <i className="fas fa-sliders-h"></i> Comparison
        </button>
        <button
          className={settingsTabId === 'settings-view' ? 'active' : ''}
          onClick={() => setSettingsTabId('settings-view')}
        >
          <i className="fas fa-eye"></i> View
        </button>
      </div>
      
      <div className="settings-content">
        {settingsTabId === 'settings-comparison' && (
          <ComparisonOptionsPanel />
        )}
        {settingsTabId === 'settings-view' && (
          <div className="settings-panel">
            <div className="panel-section">
              <h3 className="section-title">View Mode</h3>
              <ViewModeSelector />
            </div>
            
            <div className="panel-section">
              <h3 className="section-title">Display Options</h3>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers}
                    onChange={(e) => updateSettings({ showLineNumbers: e.target.checked })}
                  />
                  <span>Show Line Numbers</span>
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.highlightSyntax}
                    onChange={(e) => updateSettings({ highlightSyntax: e.target.checked })}
                  />
                  <span>Syntax Highlighting</span>
                </label>
              </div>
            </div>
            
            <div className="panel-section">
              <h3 className="section-title">Export</h3>
              <ExportOptions
                changes={changes}
                stats={stats}
                leftJSON={leftJSON}
                rightJSON={rightJSON}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Main content
  const mainContent = (
    <div className="json-diff-container">
      <TabManager
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={switchTab}
        onTabClose={closeTab}
        onTabRename={renameTab}
        onAddTab={handleAddTab}
        onDuplicateTab={duplicateTab}
        onCloseOtherTabs={closeOtherTabs}
        onCloseAllTabs={closeAllTabs}
        canAddTab={canAddTab}
        maxTabs={maxTabs}
      />
      
      {diffError && (
        <div className="message-box error">
          <i className="fas fa-exclamation-triangle"></i>
          {diffError}
        </div>
      )}
      
      {/* Change Navigation - Only show when there are changes or when comparing */}
      {(leftJSON || rightJSON) && (
        <ChangeNavigation
          currentIndex={currentChangeIndex}
          totalChanges={filteredChanges.length}
          changes={filteredChanges}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onNext={nextChange}
          onPrevious={prevChange}
          onJumpTo={jumpToChange}
          onFilterChange={setFilter}
          selectedFilters={changeFilter}
        />
      )}
      
      {settings.viewMode === 'split' && (
        <div
          ref={containerRef}
          className={`ide-editors json-diff-editors ${layout === 'vertical' ? 'vertical' : 'horizontal'}`}
        >
          <div
            className="ide-pane editor-panel left-panel"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${size}%`,
            }}
          >
            <EditorToolbar
              label="Left JSON"
              onUpload={handleLeftUpload}
              onPaste={handleLeftPaste}
              onClear={handleLeftClear}
              sampleTemplates={leftSamples}
              onLoadTemplate={(template) => setLeftJSON(template.content)}
            />
            <MonacoEditorPanel
              value={leftJSON}
              onChange={setLeftJSON}
              language="json"
              readOnly={false}
              editorSide="left"
              decorations={leftDecorations}
              showGlyphMargin={settings.showGlyphMargin}
              wordWrap={settings.wordWrap}
              showMinimap={settings.showMinimap}
              highlightCurrentLine={
                // If current change is ADDED, only right side should show current-line box
                settings.highlightCurrentLine &&
                !(currentChangeIndex >= 0 && currentChange?.type === 'ADDED')
              }
              onMount={(editor) => { leftEditorRef.current = editor; }}
            />
          </div>
          
          <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>
          
          <div
            className="ide-pane editor-panel right-panel"
            style={{
              [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`,
            }}
          >
            <EditorToolbar
              label="Right JSON"
              onUpload={handleRightUpload}
              onPaste={handleRightPaste}
              onClear={handleRightClear}
              sampleTemplates={rightSamples}
              onLoadTemplate={(template) => setRightJSON(template.content)}
            />
            <MonacoEditorPanel
              value={rightJSON}
              onChange={setRightJSON}
              language="json"
              readOnly={false}
              editorSide="right"
              decorations={rightDecorations}
              showGlyphMargin={settings.showGlyphMargin}
              wordWrap={settings.wordWrap}
              showMinimap={settings.showMinimap}
              highlightCurrentLine={
                // If current change is REMOVED, only left side should show current-line box
                settings.highlightCurrentLine &&
                !(currentChangeIndex >= 0 && currentChange?.type === 'REMOVED')
              }
              onMount={(editor) => { rightEditorRef.current = editor; }}
            />
          </div>
        </div>
      )}
      
      {settings.viewMode === 'unified' && (
        <UnifiedDiffView changes={filteredChanges} />
      )}
      
      {settings.viewMode === 'tree' && (
        <TreeView 
          changes={filteredChanges} 
          onSelectChange={(change) => {
            // Jump to this change in the list
            const index = filteredChanges.findIndex(c => c.jsonPath === change.jsonPath);
            if (index !== -1) {
              jumpToChange(index);
            }
          }} 
        />
      )}
      
      {settings.viewMode === 'report' && (
        <ReportView changes={filteredChanges} stats={filteredStats} />
      )}
      
      {settings.showStatusBar && (
        <StatsBar 
          text={leftJSON + rightJSON} 
          validationState={validationState}
          diffStats={filteredStats}
        />
      )}
    </div>
  );
  
  return (
    <>
      <IDELayout
        toolName="JSON Diff"
        settingsSidebar={settingsSidebar}
        onHelpClick={() => setShowHelpModal(true)}
      >
        {mainContent}
      </IDELayout>
      
      {/* SEO Content Below the Tool */}
      <article id="seo-content">
        <SEOContent
          title={jsonDiffContent.title}
          subtitle={jsonDiffContent.subtitle}
          trustBadges={jsonDiffContent.trustBadges}
          features={jsonDiffContent.features}
          howToSteps={jsonDiffContent.howToSteps}
          educationalContent={jsonDiffContent.educationalContent}
          useCases={jsonDiffContent.useCases}
          whyChoose={jsonDiffContent.whyChoose}
          technicalSpecs={jsonDiffContent.technicalSpecs}
          comparison={jsonDiffContent.comparison}
          faqs={jsonDiffContent.faqs}
          relatedTools={jsonDiffContent.relatedTools}
          howToSectionTitle={jsonDiffContent.howToSectionTitle}
          featuresSectionTitle={jsonDiffContent.featuresSectionTitle}
          whyChooseSectionTitle={jsonDiffContent.whyChooseSectionTitle}
          comparisonSectionTitle={jsonDiffContent.comparisonSectionTitle}
        />
      </article>
      
      {/* JSON-LD Structured Data */}
      <JsonLd data={generateAllSchemas(
        jsonDiffContent.faqs || [],
        jsonDiffContent.howToSteps || [],
        {
          toolName: 'JSON Diff',
          toolUrl: 'json-diff',
          description: jsonDiffContent.description || 'Compare JSON documents with visual diff highlighting',
          featureList: jsonDiffContent.features?.map(f => f.title) || [],
          howToTitle: 'How to Compare JSON Documents Online',
          howToDescription: 'Learn how to compare JSON documents using our free online JSON diff tool with side-by-side comparison, smart array matching, and multiple export formats',
        }
      )} />
      
      {/* Footer */}
      <Footer />
      
      {/* Share Widget */}
      <ShareWidget />
      
      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        toolName="JSON Diff"
        sections={jsonDiffHelpSections}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
