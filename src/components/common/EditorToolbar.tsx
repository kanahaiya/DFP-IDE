'use client';

import { useRef, useState } from 'react';

interface SampleTemplate {
  name: string;
  description: string;
  content: string;
  icon?: string;
  iconColor?: string;
}

interface EditorToolbarProps {
  onUpload?: (file: File) => void;
  onPaste?: () => void;
  onUrl?: () => void;
  onClear?: () => void;
  onSample?: () => void;
  onAutoCorrect?: () => void;
  sampleTemplates?: SampleTemplate[];
  onLoadTemplate?: (template: SampleTemplate) => void;
  label?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Input editor toolbar with upload, paste, URL, clear, and sample actions
 */
export function EditorToolbar({
  onUpload,
  onPaste,
  onUrl,
  onClear,
  onSample,
  onAutoCorrect,
  sampleTemplates,
  onLoadTemplate,
  label = 'Input',
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      alert(`File too large (${sizeMB} MB). Maximum size is 10MB.`);
      e.target.value = '';
      return;
    }

    if (onUpload) {
      onUpload(file);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleUrlLoad = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    try {
      new URL(urlInput); // Validate URL format
    } catch {
      setUrlError('Invalid URL format');
      return;
    }

    try {
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      
      // Create a mock file-like object for consistency
      if (onUpload) {
        const blob = new Blob([text], { type: 'application/json' });
        const file = new File([blob], 'url-content.json', { type: 'application/json' });
        onUpload(file);
      }
      
      setShowUrlModal(false);
      setUrlInput('');
      setUrlError('');
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : 'Failed to fetch URL');
    }
  };

  return (
    <>
      <div className="editor-toolbar">
        <div className="editor-toolbar-label">
          <i className="fas fa-code"></i>
          {label}
        </div>
        <div className="editor-toolbar-actions">
          {onUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".json,.yaml,.yml,.txt,application/json,text/plain"
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleUploadClick}
                title="Upload file"
                aria-label="Upload file"
              >
                <i className="fas fa-upload"></i>
                <span className="btn-text">Upload</span>
              </button>
            </>
          )}
          {onPaste && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onPaste}
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              <i className="fas fa-paste"></i>
              <span className="btn-text">Paste</span>
            </button>
          )}
          {onUrl && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowUrlModal(true)}
              title="Load from URL"
              aria-label="Load from URL"
            >
              <i className="fas fa-link"></i>
              <span className="btn-text">URL</span>
            </button>
          )}
          {(onSample || (sampleTemplates && onLoadTemplate)) && (
            <div className="templates-dropdown">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSamplesMenu(!showSamplesMenu)}
                title="Load sample template"
                aria-label="Load sample template"
              >
                <i className="fas fa-file-code"></i>
                <span className="btn-text">Sample</span>
                <i className="fas fa-chevron-down" style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}></i>
              </button>
              {showSamplesMenu && (
                <>
                  <div 
                    className="dropdown-backdrop" 
                    onClick={() => setShowSamplesMenu(false)}
                  />
                  <div className="dropdown-menu">
                    {sampleTemplates && sampleTemplates.length > 0 ? (
                      sampleTemplates.map((template, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => {
                            onLoadTemplate?.(template);
                            setShowSamplesMenu(false);
                          }}
                        >
                          {template.icon && (
                            <i 
                              className={template.icon} 
                              style={{ color: template.iconColor || 'var(--primary)' }}
                            ></i>
                          )}
                          <div className="dropdown-item-content">
                            <div className="dropdown-item-title">{template.name}</div>
                            <div className="dropdown-item-desc">{template.description}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          onSample?.();
                          setShowSamplesMenu(false);
                        }}
                      >
                        <div className="dropdown-item-title">Basic Sample</div>
                        <div className="dropdown-item-desc">Load a simple example</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {onAutoCorrect && (
            <button
              className="btn btn-accent btn-sm"
              onClick={onAutoCorrect}
              title="Fix syntax errors & format"
              aria-label="Fix syntax errors and format"
            >
              <i className="fas fa-magic"></i>
              <span className="btn-text">Fix & Format</span>
            </button>
          )}
          {onClear && (
            <>
              <div className="toolbar-separator"></div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (confirm('Clear all input? This cannot be undone.')) {
                    onClear();
                  }
                }}
                title="Clear input"
                aria-label="Clear input"
              >
                <i className="fas fa-trash-alt"></i>
                <span className="btn-text">Empty</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="dfp-modal-overlay" onClick={() => setShowUrlModal(false)}>
          <div className="dfp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dfp-modal-header">
              <h3 className="dfp-modal-title">Load from URL</h3>
              <button
                className="dfp-modal-close"
                onClick={() => setShowUrlModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="dfp-modal-body">
              <p className="dfp-modal-help">
                Enter a URL to fetch JSON data. Note: the remote server must allow CORS for browsers to access it.
              </p>
              <input
                type="url"
                className="dfp-modal-input"
                placeholder="https://example.com/data.json"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlLoad();
                  }
                }}
                autoFocus
              />
              {urlError && (
                <div className="dfp-modal-error">{urlError}</div>
              )}
            </div>
            <div className="dfp-modal-actions">
              <button
                className="dfp-modal-btn btn-secondary"
                onClick={() => {
                  setShowUrlModal(false);
                  setUrlInput('');
                  setUrlError('');
                }}
              >
                Cancel
              </button>
              <button
                className="dfp-modal-btn btn-primary"
                onClick={handleUrlLoad}
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
