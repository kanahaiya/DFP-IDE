'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IDELayout } from '@/components/layout/IDELayout';
import { MonacoEditorPanel } from '@/components/common/MonacoEditorPanel';
import { EditorToolbar } from '@/components/common/EditorToolbar';
import { OutputToolbar } from '@/components/common/OutputToolbar';
import { StatsBar } from '@/components/common/StatsBar';
import { useToast } from '@/store/toast';
import TabManager from '@/components/common/TabManager';
import { EndpointManager } from '@/components/tools/json-to-openapi/EndpointManager';
import { SettingsPanel } from '@/components/tools/json-to-openapi/SettingsPanel';
import { OutputFormatToggle } from '@/components/tools/json-to-openapi/OutputFormatToggle';
import { useOpenAPIStore } from '@/store/openapi';
import { useTabs } from '@/hooks/useTabs';
import { useJSONValidation } from '@/hooks/useJSONValidation';
import { generateOpenAPISpec } from '@/lib/openapi/generator';
import { autoCorrectJSON } from '@/lib/autoCorrect';
import { readFileAsText, downloadTextFile, getTimestamp } from '@/lib/fileUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { createShareUrl, getUrlParam, safeDecodeParam } from '@/lib/urlUtils';
import { trackCopy, trackDownload, event as trackEvent } from '@/lib/analytics';
import { useLayout } from '@/hooks/useLayout';
import { useResizer } from '@/hooks/useResizer';
import { ShareWidget } from '@/components/common/ShareWidget';
import { Footer } from '@/components/layout/Footer';
import { SEOContent } from '@/components/seo/SEOContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { HelpModal } from '@/components/common/HelpModal';
import { jsonToOpenAPIContent } from '@/data/json-to-openapi-seo';
import { jsonToOpenAPIHelpSections } from '@/data/json-to-openapi-help';
import { generateAllSchemas } from '@/lib/seo/schema-generator';
import jsYaml from 'js-yaml';

export default function JSONToOpenAPIPage() {
  const { endpoints, activeEndpointIndex, settings, outputFormat, loadEndpointJSON } = useOpenAPIStore();
  const toast = useToast();
  const activeEndpoint = endpoints[activeEndpointIndex];
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
  } = useTabs({ toolName: 'JSON to OpenAPI', storageKey: 'openapi-tabs' });
  
  const [inputJSON, setInputJSON] = useState(activeEndpoint.json);
  const [outputSpec, setOutputSpec] = useState('');
  const [settingsTabId, setSettingsTabId] = useState('settings-general');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastAutoErrorRef = useRef<string>('');
  
  // Ref to track if we're currently syncing from endpoint switch (prevents saving during sync)
  const isSyncingRef = useRef(false);
  
  // Ref to track if we're currently syncing from tab switch (prevents saving during sync)
  const isTabSyncingRef = useRef(false);
  
  // JSON validation with debouncing
  const inputValidation = useJSONValidation(inputJSON, 500);
  const validationErrors = useMemo(() => 
    inputValidation.errors.concat(inputValidation.warnings),
    [inputValidation.errors, inputValidation.warnings]
  );
  const validationState = useMemo(() => ({
    isValid: inputValidation.isValid,
    errorCount: inputValidation.errors.length,
    warningCount: inputValidation.warnings.length,
  }), [inputValidation.isValid, inputValidation.errors.length, inputValidation.warnings.length]);

  // Convert to OpenAPI spec - callable function that always uses current values
  const convertToOpenAPI = useCallback(() => {
    try {
      // Check if any endpoint has JSON
      const endpointsWithJson = endpoints.filter(ep => ep.json && ep.json.trim().length > 0);
      
      if (endpointsWithJson.length === 0) {
        setOutputSpec('');
        lastAutoErrorRef.current = '';
        return;
      }

      // Check for JSON validation errors in input
      if (!inputValidation.isValid && inputJSON.trim().length > 0) {
        setOutputSpec('');
        // Avoid spamming toasts while user is typing; validation markers + error count show in UI.
        lastAutoErrorRef.current = `json-errors:${inputValidation.errors.length}`;
        return;
      }

      // Generate OpenAPI spec
      const output = generateOpenAPISpec({
        endpoints,
        settings,
        outputFormat,
      });
      
      setOutputSpec(output);
      lastAutoErrorRef.current = '';
    } catch (error) {
      console.error('Conversion error:', error);
      const msg = `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      if (lastAutoErrorRef.current !== msg) {
        toast.error(msg, 4000);
        lastAutoErrorRef.current = msg;
      }
      setOutputSpec('');
    }
  }, [endpoints, settings, outputFormat, inputJSON, inputValidation.isValid, inputValidation.errors.length, toast]);

  // Debounced conversion - batches rapid changes with 150ms delay
  // Note: convertToOpenAPI is NOT in deps to avoid circular dependency
  // All actual data dependencies are listed directly, ensuring proper timer resets
  useEffect(() => {
    const timer = setTimeout(() => {
      convertToOpenAPI();
    }, 150);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints, settings, outputFormat, inputJSON, inputValidation.isValid, inputValidation.errors.length]);

  // Sync input with active endpoint
  useEffect(() => {
    isSyncingRef.current = true;
    setInputJSON(activeEndpoint.json);
    // Reset sync flag after state update completes
    const timer = setTimeout(() => {
      isSyncingRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [activeEndpointIndex, activeEndpoint.json]);

  // Save input to store when user types (skip during endpoint sync to prevent race conditions)
  useEffect(() => {
    // Don't save if we're currently syncing from an endpoint switch
    if (isSyncingRef.current) {
      return;
    }
    
    // Only save if content actually differs
    if (inputJSON !== activeEndpoint.json) {
      loadEndpointJSON(activeEndpointIndex, inputJSON);
    }
  }, [inputJSON, activeEndpoint.json, activeEndpointIndex, loadEndpointJSON]);

  // Load from share URL on mount
  useEffect(() => {
    const jsonParam = getUrlParam('json');
    if (jsonParam) {
      const decoded = safeDecodeParam(jsonParam);
      if (decoded) {
        setInputJSON(decoded);
        toast.success('Loaded from share link');
        // Clean URL
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load tab data when switching to a different tab
  useEffect(() => {
    if (activeTab) {
      isTabSyncingRef.current = true;
      setInputJSON(activeTab.inputJSON || '');
      // Reset sync flag after state update completes
      const timer = setTimeout(() => {
        isTabSyncingRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, activeTab]);

  // Save current tab state when input changes (skip during tab sync to prevent race conditions)
  useEffect(() => {
    // Don't save if we're currently syncing from a tab switch
    if (isTabSyncingRef.current) {
        return;
      }

    // Only save if the input actually differs from what's stored in the tab
    if (activeTab && activeTabId && activeTab.inputJSON !== inputJSON) {
      updateTab(activeTabId, {
        inputJSON,
      });
    }
  }, [inputJSON, activeTabId, activeTab, updateTab]);

  const handleUpload = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setInputJSON(text);
      toast.success(`File loaded successfully (${sizeMB} MB)`);
    } catch {
      toast.error('Failed to load file');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        toast.error('Clipboard is empty');
        return;
      }
      setInputJSON(text);
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard. Please check browser permissions.');
    }
  };

  const handleAutoCorrect = () => {
    if (!inputJSON.trim()) {
      toast.warning('No input to fix');
      return;
    }

    const result = autoCorrectJSON(inputJSON);
    if (result.success) {
      setInputJSON(result.output);
      toast.success('Input fixed and formatted!');
      trackEvent('auto_correct', 'tool_usage', 'openapi_success');
    } else {
      toast.error(`Could not auto-correct: ${result.error}`);
      trackEvent('auto_correct', 'tool_usage', 'openapi_failure');
    }
  };

  const handleClear = () => {
    setInputJSON('');
    toast.success('Input cleared');
  };

  const sampleTemplates = useMemo(() => [
    {
      name: 'User Profile',
      description: 'Simple user profile with common fields',
      icon: 'fas fa-user',
      iconColor: '#58A6FF',
      content: JSON.stringify({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: "2024-01-15T10:30:00Z",
        isActive: true,
        profile: {
          age: 30,
          website: "https://example.com",
          userId: "123e4567-e89b-12d3-a456-426614174000"
        }
      }, null, 2)
    },
    {
      name: 'E-commerce Product',
      description: 'Product listing with pricing and inventory',
      icon: 'fas fa-shopping-bag',
      iconColor: '#3FB950',
      content: JSON.stringify({
        productId: "PROD-12345",
        name: "Wireless Headphones",
        description: "Premium noise-cancelling headphones",
        price: 299.99,
        currency: "USD",
        inStock: true,
        quantity: 150,
        category: "Electronics",
        tags: ["audio", "wireless", "bluetooth"],
        rating: 4.5,
        reviews: 342,
        images: [
          "https://example.com/images/product1.jpg",
          "https://example.com/images/product2.jpg"
        ],
        specifications: {
          color: "Black",
          weight: "250g",
          batteryLife: "30 hours"
        }
      }, null, 2)
    },
    {
      name: 'Blog Post',
      description: 'Blog article with metadata and content',
      icon: 'fas fa-file-alt',
      iconColor: '#58A6FF',
      content: JSON.stringify({
        id: 101,
        title: "Getting Started with OpenAPI",
        slug: "getting-started-openapi",
        author: {
          id: 5,
          name: "Jane Smith",
          email: "jane@example.com"
        },
        content: "OpenAPI is a powerful specification for describing RESTful APIs...",
        excerpt: "Learn how to create OpenAPI specifications",
        publishedAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-16T14:30:00Z",
        status: "published",
        tags: ["api", "openapi", "rest"],
        views: 1542,
        likes: 89,
        featured: true
      }, null, 2)
    },
    {
      name: 'API Response (List)',
      description: 'Paginated list response with metadata',
      icon: 'fas fa-code',
      iconColor: '#A371F7',
      content: JSON.stringify({
        success: true,
        data: [
          {
            id: 1,
            name: "Item 1",
            status: "active"
          },
          {
            id: 2,
            name: "Item 2",
            status: "inactive"
          }
        ],
        pagination: {
          page: 1,
          perPage: 10,
          total: 50,
          totalPages: 5
        },
        meta: {
          timestamp: "2024-01-15T10:30:00Z",
          version: "1.0.0"
        }
      }, null, 2)
    },
    {
      name: 'Paginated List',
      description: 'List with pagination controls',
      icon: 'fas fa-list',
      iconColor: '#D29922',
      content: JSON.stringify({
        items: [
          { id: 1, title: "First Item", category: "A" },
          { id: 2, title: "Second Item", category: "B" },
          { id: 3, title: "Third Item", category: "A" }
        ],
        page: 1,
        pageSize: 10,
        totalItems: 100,
        totalPages: 10,
        hasNext: true,
        hasPrevious: false
      }, null, 2)
    },
    {
      name: 'Order with Items',
      description: 'Shopping order with line items',
      icon: 'fas fa-shopping-cart',
      iconColor: '#58A6FF',
      content: JSON.stringify({
        orderId: "ORD-2024-001",
        customerId: "CUST-12345",
        orderDate: "2024-01-15T10:30:00Z",
        status: "processing",
        items: [
          {
            productId: "PROD-001",
            name: "Wireless Mouse",
            quantity: 2,
            price: 29.99,
            subtotal: 59.98
          },
          {
            productId: "PROD-002",
            name: "USB Cable",
            quantity: 3,
            price: 9.99,
            subtotal: 29.97
          }
        ],
        subtotal: 89.95,
        tax: 8.10,
        shipping: 5.00,
        total: 103.05,
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        }
      }, null, 2)
    },
    {
      name: 'Error Response',
      description: 'Standard error response format',
      icon: 'fas fa-exclamation-triangle',
      iconColor: '#F85149',
      content: JSON.stringify({
        error: true,
        code: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: [
          {
            field: "email",
            message: "Email format is invalid"
          },
          {
            field: "age",
            message: "Age must be a positive number"
          }
        ],
        timestamp: "2024-01-15T10:30:00Z",
        requestId: "req_123456789"
      }, null, 2)
    }
  ], []);

  const handleLoadSample = () => {
    // Load the first template by default
    if (sampleTemplates.length > 0) {
      setInputJSON(sampleTemplates[0].content);
      toast.success('Sample JSON loaded');
      // Note: Conversion will be triggered automatically by the debounced effect
      // when inputJSON updates, ensuring the save effect runs first
    }
  };

  const handleLoadTemplate = (template: { name: string; description: string; content: string }) => {
    setInputJSON(template.content);
    toast.success(`Loaded: ${template.name}`);
    // Note: Conversion will be triggered automatically by the debounced effect
    // when inputJSON updates, ensuring the save effect runs first
  };

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(outputSpec);
      toast.success('Copied to clipboard');
      // Track copy action
      trackCopy('openapi-spec');
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputSpec, toast]);

  const handleDownload = useCallback(() => {
    try {
      const ext = outputFormat === 'yaml' ? 'yaml' : 'json';
      const filename = `openapi-spec-${getTimestamp()}.${ext}`;
      const mimeType = outputFormat === 'yaml' ? 'text/yaml' : 'application/json';
      downloadTextFile(outputSpec, filename, mimeType);
      toast.success('Downloaded successfully');
      // Track download action
      trackDownload(`openapi-${ext}`);
    } catch {
      toast.error('Failed to download');
    }
  }, [outputSpec, outputFormat, toast]);

  const handleShare = async () => {
    try {
      const url = createShareUrl('/json-to-openapi', 'json', inputJSON);
      await copyToClipboard(url);
      toast.success('Share link copied to clipboard');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const handleValidate = () => {
    try {
      if (!outputSpec || !outputSpec.trim()) {
        toast.error('No spec to validate');
        return;
      }

      // Try to parse the spec
      if (outputFormat === 'json') {
        JSON.parse(outputSpec);
      }

      // Basic OpenAPI validation
      const specObj = outputFormat === 'json' ? JSON.parse(outputSpec) : null;
      if (specObj) {
        if (!specObj.openapi && !specObj.swagger) {
          toast.error('Invalid spec: missing openapi/swagger version');
          return;
        }
        if (!specObj.info) {
          toast.error('Invalid spec: missing info object');
          return;
        }
        if (!specObj.paths) {
          toast.error('Invalid spec: missing paths object');
          return;
        }
      }

      toast.success('Spec is valid');
    } catch (error) {
      toast.error('Invalid spec: ' + (error instanceof Error ? error.message : 'Parse error'));
    }
  };

  const handlePreview = () => {
    if (!outputSpec || !outputSpec.trim()) {
      toast.error('No spec to preview');
      return;
    }
    
    // Validate the spec can be parsed
    try {
      if (outputFormat === 'json') {
        JSON.parse(outputSpec);
      } else {
        // Validate YAML can be parsed
        jsYaml.load(outputSpec);
      }
      setShowPreviewModal(true);
    } catch {
      toast.error('Cannot preview: Invalid spec format');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(json|txt)$/i)) {
      toast.error('Please drop a JSON or text file');
      return;
    }

    await handleUpload(file);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        convertToOpenAPI();
        // Success indicated by output presence - no message needed
      }
      // Ctrl/Cmd + S to download
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleDownload();
      }
      // Ctrl/Cmd + K to copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [outputSpec, inputJSON, convertToOpenAPI, handleDownload, handleCopy]);

  // Settings Sidebar Content
  const settingsSidebar = (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-general' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-general')}
        >
          <i className="fas fa-cog"></i> General
        </button>
        <button
          className={`sidebar-tab ${settingsTabId === 'settings-endpoints' ? 'active' : ''}`}
          onClick={() => setSettingsTabId('settings-endpoints')}
        >
          <i className="fas fa-route"></i> Endpoints
        </button>
      </div>
      <div className="sidebar-content">
        {settingsTabId === 'settings-general' && <SettingsPanel />}
        {settingsTabId === 'settings-endpoints' && <EndpointManager />}
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
      toolName="JSON to OpenAPI Generator" 
      settingsSidebar={settingsSidebar}
      onHelpClick={() => setShowHelpModal(true)}
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
                  label="JSON Input"
                  onUpload={handleUpload}
                  onPaste={handlePaste}
                  onUrl={() => {}}
                  onClear={handleClear}
                  onAutoCorrect={handleAutoCorrect}
                  sampleTemplates={sampleTemplates}
                  onLoadTemplate={handleLoadTemplate}
                />
          
          <MonacoEditorPanel
            value={inputJSON}
            onChange={setInputJSON}
            language="json"
            editorSide="left"
            placeholder="Paste your JSON example here..."
            emptyStateTitle="Welcome to JSON to OpenAPI Generator"
            emptyStateInstructions={[
              'Pasting JSON from your API',
              'Uploading a .json file',
              'Loading a sample template',
            ]}
            onLoadSample={handleLoadSample}
            validationErrors={validationErrors}
          />
          
          <StatsBar text={inputJSON} validationState={validationState} />
        </div>

        {/* Resizer */}
        <div ref={resizerRef} className="ide-resizer" id="mainResizer"></div>

        {/* Right Panel - Output */}
        <div 
          className="ide-pane"
          style={{
            [layout === 'vertical' ? 'height' : 'width']: `${100 - size}%`
          }}
        >
          <OutputToolbar 
            label="OpenAPI Spec" 
            onValidate={handleValidate}
            onPreview={handlePreview}
            onCopy={handleCopy} 
            onDownload={handleDownload} 
            onShare={handleShare}
          >
            <OutputFormatToggle />
          </OutputToolbar>
          
          <MonacoEditorPanel
            value={outputSpec}
            language={outputFormat === 'yaml' ? 'yaml' : 'json'}
            editorSide="right"
            readOnly
            placeholder="OpenAPI spec will appear here"
            emptyStateTitle="OpenAPI Spec Output"
            emptyStateInstructions={[
              'Generated OpenAPI specification will appear here',
              'Use the input panel to paste your JSON',
            ]}
          />
          
          <StatsBar text={outputSpec} />
        </div>
      </div>

      {/* Swagger UI Preview Modal */}
      {showPreviewModal && (() => {
        // Convert spec to JSON object for Swagger UI
        let specObj;
        try {
          if (outputFormat === 'json') {
            specObj = JSON.parse(outputSpec);
          } else {
            // Convert YAML to JSON object
            specObj = jsYaml.load(outputSpec);
          }
        } catch {
          specObj = null;
        }

        return (
          <div className="dfp-modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="dfp-modal dfp-modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="dfp-modal-header">
                <h3 className="dfp-modal-title">
                  <i className="fas fa-eye"></i> Swagger UI Preview
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.6 }}>
                    ({outputFormat.toUpperCase()})
                  </span>
                </h3>
                <button
                  className="dfp-modal-close"
                  onClick={() => setShowPreviewModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="dfp-modal-body" style={{ padding: 0, height: '75vh', overflow: 'hidden' }}>
                {specObj ? (
                  <iframe
                    srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .swagger-ui .topbar {
      display: none;
    }
    .swagger-ui .information-container {
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      try {
        const spec = ${JSON.stringify(specObj)};
        
        window.ui = SwaggerUIBundle({
          spec: spec,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "BaseLayout",
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 1,
          docExpansion: "list",
          filter: true,
          showRequestHeaders: true,
          tryItOutEnabled: true
        });
      } catch(e) {
        console.error('Swagger UI Error:', e);
        document.getElementById('swagger-ui').innerHTML = 
          '<div style="padding:40px;text-align:center;font-family:sans-serif;">' +
          '<h2 style="color:#f44336;">⚠️ Error Loading Specification</h2>' +
          '<p style="color:#666;margin-top:20px;">' + e.message + '</p>' +
          '<p style="color:#999;font-size:14px;margin-top:10px;">Please check if the generated spec is valid.</p>' +
          '</div>';
      }
    }
  </script>
</body>
</html>`}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                    title="Swagger UI Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: 'var(--warning)', marginBottom: '1.5rem' }}></i>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text)' }}>Preview Error</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Unable to parse the specification.</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Please check if the generated spec is valid.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* Social Share Widget */}
      <ShareWidget />

      {/* Help Documentation Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        toolName="JSON to OpenAPI Converter"
        sections={jsonToOpenAPIHelpSections}
      />
    </IDELayout>
    </main>

    {/* JSON-LD Structured Data */}
    <JsonLd data={generateAllSchemas(
      jsonToOpenAPIContent.faqs, 
      jsonToOpenAPIContent.howToSteps,
      {
        toolName: 'JSON to OpenAPI Converter',
        toolUrl: 'json-to-openapi',
        description: 'Free online JSON to OpenAPI 3.0 and Swagger 2.0 converter with automatic schema inference, multi-endpoint support, and real-time validation.',
        featureList: [
          'Real-time JSON to OpenAPI conversion',
          'Automatic schema inference',
          'Multi-endpoint support',
          'OpenAPI 3.0 and Swagger 2.0 support',
          'Format detection (email, UUID, date-time)',
          'Client-side processing for privacy',
          'Export to JSON and YAML',
          'Built-in Swagger UI preview',
        ],
        howToTitle: 'How to Convert JSON to OpenAPI Specification',
        howToDescription: 'Step-by-step guide to converting JSON responses into OpenAPI 3.0 or Swagger 2.0 specifications using our free online tool.',
      }
    )} />

    {/* SEO Content Sections */}
    <article id="seo-content">
      <SEOContent 
        title={jsonToOpenAPIContent.title}
        subtitle={jsonToOpenAPIContent.subtitle}
        trustBadges={jsonToOpenAPIContent.trustBadges}
        features={jsonToOpenAPIContent.features}
        howToSteps={jsonToOpenAPIContent.howToSteps}
        educationalContent={jsonToOpenAPIContent.educational}
        useCases={jsonToOpenAPIContent.useCases}
        whyChoose={jsonToOpenAPIContent.whyChoose}
        technicalSpecs={jsonToOpenAPIContent.technicalSpecs}
        comparison={jsonToOpenAPIContent.comparison}
        faqs={jsonToOpenAPIContent.faqs}
        relatedTools={jsonToOpenAPIContent.relatedTools}
        howToSectionTitle={jsonToOpenAPIContent.howToSectionTitle}
        featuresSectionTitle={jsonToOpenAPIContent.featuresSectionTitle}
        whyChooseSectionTitle={jsonToOpenAPIContent.whyChooseSectionTitle}
        comparisonSectionTitle={jsonToOpenAPIContent.comparisonSectionTitle}
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
    `}</style>
    </>
  );
}
