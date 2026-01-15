import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutputToolbar } from '../OutputToolbar';
import { PerformanceProfiler } from '@/__tests__/test-utils';

describe('OutputToolbar', () => {
  const mockCallbacks = {
    onCopy: jest.fn(),
    onDownload: jest.fn(),
    onShare: jest.fn(),
    onClear: jest.fn(),
    onValidate: jest.fn(),
    onPreview: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Functional Tests', () => {
    describe('Button Rendering', () => {
      it('should render copy button when onCopy provided', () => {
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
      });

      it('should render download button when onDownload provided', () => {
        render(<OutputToolbar onDownload={mockCallbacks.onDownload} />);
        expect(screen.getByTitle('Download file')).toBeInTheDocument();
      });

      it('should render share button when onShare provided', () => {
        render(<OutputToolbar onShare={mockCallbacks.onShare} />);
        expect(screen.getByTitle('Share link')).toBeInTheDocument();
      });

      it('should render clear button when onClear provided', () => {
        render(<OutputToolbar onClear={mockCallbacks.onClear} />);
        expect(screen.getByTitle('Clear output')).toBeInTheDocument();
      });

      it('should render validate button when onValidate provided', () => {
        render(<OutputToolbar onValidate={mockCallbacks.onValidate} />);
        expect(screen.getByTitle('Validate spec')).toBeInTheDocument();
      });

      it('should render preview button when onPreview provided', () => {
        render(<OutputToolbar onPreview={mockCallbacks.onPreview} />);
        expect(screen.getByTitle('Preview in Swagger UI')).toBeInTheDocument();
      });

      it('should not render buttons when callbacks not provided', () => {
        render(<OutputToolbar />);
        
        expect(screen.queryByTitle('Copy to clipboard')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Download file')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Share link')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Clear output')).not.toBeInTheDocument();
      });
    });

    describe('Button Callbacks', () => {
      it('should call onCopy when copy button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        
        await user.click(screen.getByTitle('Copy to clipboard'));
        expect(mockCallbacks.onCopy).toHaveBeenCalledTimes(1);
      });

      it('should call onDownload when download button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onDownload={mockCallbacks.onDownload} />);
        
        await user.click(screen.getByTitle('Download file'));
        expect(mockCallbacks.onDownload).toHaveBeenCalledTimes(1);
      });

      it('should call onShare when share button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onShare={mockCallbacks.onShare} />);
        
        await user.click(screen.getByTitle('Share link'));
        expect(mockCallbacks.onShare).toHaveBeenCalledTimes(1);
      });

      it('should call onClear when clear button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onClear={mockCallbacks.onClear} />);
        
        await user.click(screen.getByTitle('Clear output'));
        expect(mockCallbacks.onClear).toHaveBeenCalledTimes(1);
      });

      it('should call onValidate when validate button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onValidate={mockCallbacks.onValidate} />);
        
        await user.click(screen.getByTitle('Validate spec'));
        expect(mockCallbacks.onValidate).toHaveBeenCalledTimes(1);
      });

      it('should call onPreview when preview button clicked', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onPreview={mockCallbacks.onPreview} />);
        
        await user.click(screen.getByTitle('Preview in Swagger UI'));
        expect(mockCallbacks.onPreview).toHaveBeenCalledTimes(1);
      });
    });

    describe('Label Customization', () => {
      it('should render custom label', () => {
        render(<OutputToolbar label="Custom Output" />);
        expect(screen.getByText('Custom Output')).toBeInTheDocument();
      });

      it('should render default label', () => {
        render(<OutputToolbar />);
        expect(screen.getByText('Output')).toBeInTheDocument();
      });
    });

    describe('Children Rendering', () => {
      it('should render children components', () => {
        render(
          <OutputToolbar>
            <button>Custom Button</button>
          </OutputToolbar>
        );
        
        expect(screen.getByText('Custom Button')).toBeInTheDocument();
      });

      it('should render children alongside action buttons', () => {
        render(
          <OutputToolbar onCopy={mockCallbacks.onCopy}>
            <button>Extra Action</button>
          </OutputToolbar>
        );
        
        expect(screen.getByText('Extra Action')).toBeInTheDocument();
        expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
      });

      it('should render multiple children', () => {
        render(
          <OutputToolbar>
            <button>Button 1</button>
            <button>Button 2</button>
            <button>Button 3</button>
          </OutputToolbar>
        );
        
        expect(screen.getByText('Button 1')).toBeInTheDocument();
        expect(screen.getByText('Button 2')).toBeInTheDocument();
        expect(screen.getByText('Button 3')).toBeInTheDocument();
      });
    });

    describe('Separator Rendering', () => {
      it('should render separator when validate or preview buttons present', () => {
        const { container } = render(
          <OutputToolbar
            onValidate={mockCallbacks.onValidate}
            onCopy={mockCallbacks.onCopy}
          />
        );
        
        expect(container.querySelector('.toolbar-separator')).toBeInTheDocument();
      });

      it('should render separator with preview button', () => {
        const { container } = render(
          <OutputToolbar
            onPreview={mockCallbacks.onPreview}
            onCopy={mockCallbacks.onCopy}
          />
        );
        
        expect(container.querySelector('.toolbar-separator')).toBeInTheDocument();
      });

      it('should not render separator without validate/preview buttons', () => {
        const { container } = render(
          <OutputToolbar
            onCopy={mockCallbacks.onCopy}
            onDownload={mockCallbacks.onDownload}
          />
        );
        
        expect(container.querySelector('.toolbar-separator')).not.toBeInTheDocument();
      });
    });

    describe('All Buttons Together', () => {
      it('should render all buttons when all callbacks provided', () => {
        render(<OutputToolbar {...mockCallbacks} />);
        
        expect(screen.getByTitle('Validate spec')).toBeInTheDocument();
        expect(screen.getByTitle('Preview in Swagger UI')).toBeInTheDocument();
        expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
        expect(screen.getByTitle('Download file')).toBeInTheDocument();
        expect(screen.getByTitle('Share link')).toBeInTheDocument();
        expect(screen.getByTitle('Clear output')).toBeInTheDocument();
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 30ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(<OutputToolbar {...mockCallbacks} />);
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(30);
      });

      it('should handle multiple rapid clicks efficiently', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        
        const button = screen.getByTitle('Copy to clipboard');
        
        // Rapid clicks
        for (let i = 0; i < 10; i++) {
          await user.click(button);
        }
        
        expect(mockCallbacks.onCopy).toHaveBeenCalledTimes(10);
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels on all buttons', () => {
        render(<OutputToolbar {...mockCallbacks} />);
        
        expect(screen.getByLabelText('Validate spec')).toBeInTheDocument();
        expect(screen.getByLabelText('Preview in Swagger UI')).toBeInTheDocument();
        expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument();
        expect(screen.getByLabelText('Download file')).toBeInTheDocument();
        expect(screen.getByLabelText('Share link')).toBeInTheDocument();
        expect(screen.getByLabelText('Clear output')).toBeInTheDocument();
      });

      it('should be keyboard accessible', async () => {
        const user = userEvent.setup();
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        
        const button = screen.getByTitle('Copy to clipboard');
        button.focus();
        
        expect(button).toHaveFocus();
        
        await user.keyboard('{Enter}');
        expect(mockCallbacks.onCopy).toHaveBeenCalled();
      });

      it('should have proper button structure', () => {
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        
        const button = screen.getByTitle('Copy to clipboard');
        expect(button.tagName).toBe('BUTTON');
      });
    });

    describe('UI/UX', () => {
      it('should have proper button classes', () => {
        render(<OutputToolbar onCopy={mockCallbacks.onCopy} />);
        
        const button = screen.getByTitle('Copy to clipboard');
        expect(button).toHaveClass('btn', 'btn-secondary', 'btn-sm');
      });

      it('should display icons in buttons', () => {
        const { container } = render(<OutputToolbar {...mockCallbacks} />);
        
        expect(container.querySelector('.fa-check-circle')).toBeInTheDocument();
        expect(container.querySelector('.fa-eye')).toBeInTheDocument();
        expect(container.querySelector('.fa-copy')).toBeInTheDocument();
        expect(container.querySelector('.fa-download')).toBeInTheDocument();
        expect(container.querySelector('.fa-share-alt')).toBeInTheDocument();
        expect(container.querySelector('.fa-times')).toBeInTheDocument();
      });

      it('should display button text', () => {
        render(<OutputToolbar {...mockCallbacks} />);
        
        expect(screen.getByText('Validate')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();
        expect(screen.getByText('Download')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });

      it('should have proper toolbar structure', () => {
        const { container } = render(<OutputToolbar {...mockCallbacks} />);
        
        expect(container.querySelector('.editor-toolbar')).toBeInTheDocument();
        expect(container.querySelector('.editor-toolbar-label')).toBeInTheDocument();
        expect(container.querySelector('.editor-toolbar-actions')).toBeInTheDocument();
      });

      it('should display label icon', () => {
        const { container } = render(<OutputToolbar />);
        
        expect(container.querySelector('.fa-file-code')).toBeInTheDocument();
      });
    });

    describe('Button Order', () => {
      it('should render validate and preview buttons first', () => {
        const { container } = render(<OutputToolbar {...mockCallbacks} />);
        
        const actions = container.querySelector('.editor-toolbar-actions');
        const buttons = actions?.querySelectorAll('button');
        
        expect(buttons?.[0]).toHaveAttribute('title', 'Validate spec');
        expect(buttons?.[1]).toHaveAttribute('title', 'Preview in Swagger UI');
      });

      it('should render copy, download, share buttons after separator', () => {
        const { container } = render(<OutputToolbar {...mockCallbacks} />);
        
        const actions = container.querySelector('.editor-toolbar-actions');
        const separator = actions?.querySelector('.toolbar-separator');
        
        expect(separator).toBeInTheDocument();
        
        // Validate buttons come after separator
        const copyButton = screen.getByTitle('Copy to clipboard');
        const downloadButton = screen.getByTitle('Download file');
        
        expect(copyButton).toBeInTheDocument();
        expect(downloadButton).toBeInTheDocument();
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty children', () => {
        render(<OutputToolbar>{null}</OutputToolbar>);
        expect(screen.getByText('Output')).toBeInTheDocument();
      });

      it('should handle undefined children', () => {
        render(<OutputToolbar>{undefined}</OutputToolbar>);
        expect(screen.getByText('Output')).toBeInTheDocument();
      });

      it('should handle callback errors gracefully', async () => {
        const user = userEvent.setup();
        const errorCallback = jest.fn(() => {
          throw new Error('Callback error');
        });
        
        // Error should be caught and reported, component should still render
        render(<OutputToolbar onCopy={errorCallback} />);
        
        const button = screen.getByTitle('Copy to clipboard');

        await user.click(button);
        expect(errorCallback).toHaveBeenCalled();
        expect(button).toBeInTheDocument();
      });

      it('should handle special characters in label', () => {
        render(<OutputToolbar label="Output & Results <>" />);
        expect(screen.getByText('Output & Results <>')).toBeInTheDocument();
      });

      it('should handle very long label', () => {
        const longLabel = 'A'.repeat(100);
        render(<OutputToolbar label={longLabel} />);
        expect(screen.getByText(longLabel)).toBeInTheDocument();
      });
    });
  });
});
