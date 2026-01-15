'use client';

interface OutputToolbarProps {
  onCopy?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onClear?: () => void;
  onValidate?: () => void;
  onPreview?: () => void;
  label?: string;
  children?: React.ReactNode;
}

/**
 * Output editor toolbar with copy, download, share, and clear actions
 */
export function OutputToolbar({
  onCopy,
  onDownload,
  onShare,
  onClear,
  onValidate,
  onPreview,
  label = 'Output',
  children,
}: OutputToolbarProps) {
  const safe =
    (fn?: () => void) =>
    () => {
      try {
        fn?.();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-label">
        <i className="fas fa-file-code"></i>
        {label}
      </div>
      <div className="editor-toolbar-actions">
        {children}
        {onValidate && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onValidate)}
            title="Validate spec"
            aria-label="Validate spec"
          >
            <i className="fas fa-check-circle"></i>
            <span className="btn-text">Validate</span>
          </button>
        )}
        {onPreview && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onPreview)}
            title="Preview in Swagger UI"
            aria-label="Preview in Swagger UI"
          >
            <i className="fas fa-eye"></i>
            <span className="btn-text">Preview</span>
          </button>
        )}
        {(onValidate || onPreview) && <div className="toolbar-separator"></div>}
        {onCopy && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onCopy)}
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            <i className="fas fa-copy"></i>
            <span className="btn-text">Copy</span>
          </button>
        )}
        {onDownload && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onDownload)}
            title="Download file"
            aria-label="Download file"
          >
            <i className="fas fa-download"></i>
            <span className="btn-text">Download</span>
          </button>
        )}
        {onShare && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onShare)}
            title="Share link"
            aria-label="Share link"
          >
            <i className="fas fa-share-alt"></i>
            <span className="btn-text">Share</span>
          </button>
        )}
        {onClear && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={safe(onClear)}
            title="Clear output"
            aria-label="Clear output"
          >
            <i className="fas fa-times"></i>
            <span className="btn-text">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
