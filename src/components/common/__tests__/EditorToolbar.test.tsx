import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorToolbar } from '../EditorToolbar';
import { createMockFile, mockFetch, PerformanceProfiler } from '@/__tests__/test-utils';

describe('EditorToolbar', () => {
  const mockCallbacks = {
    onUpload: jest.fn(),
    onPaste: jest.fn(),
    onUrl: jest.fn(),
    onClear: jest.fn(),
    onSample: jest.fn(),
    onLoadTemplate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
  });

  describe('Functional Tests', () => {
    describe('Upload Functionality', () => {
      it('should render upload button when onUpload prop is provided', () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        expect(screen.getByTitle('Upload file')).toBeInTheDocument();
      });

      it('should trigger file input click when upload button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const uploadButton = screen.getByTitle('Upload file');
        await user.click(uploadButton);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();
      });

      it('should call onUpload with valid file', async () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createMockFile('test.json', 1024, 'application/json');
        
        fireEvent.change(fileInput, { target: { files: [file] } });
        
        await waitFor(() => {
          expect(mockCallbacks.onUpload).toHaveBeenCalledWith(file);
        });
      });

      it('should reject file larger than 10MB', async () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const largeFile = createMockFile('large.json', 11 * 1024 * 1024, 'application/json');
        
        fireEvent.change(fileInput, { target: { files: [largeFile] } });
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('File too large'));
          expect(mockCallbacks.onUpload).not.toHaveBeenCalled();
        });
      });

      it('should reset file input after upload', async () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createMockFile('test.json', 1024, 'application/json');
        
        fireEvent.change(fileInput, { target: { files: [file] } });
        
        await waitFor(() => {
          expect(fileInput.value).toBe('');
        });
      });

      it('should accept multiple file types', () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput.accept).toContain('.json');
        expect(fileInput.accept).toContain('.yaml');
        expect(fileInput.accept).toContain('.yml');
      });
    });

    describe('URL Functionality', () => {
      it('should open URL modal when URL button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        const urlButton = screen.getByTitle('Load from URL');
        await user.click(urlButton);
        
        expect(screen.getByText('Load from URL')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/https:\/\/example.com/)).toBeInTheDocument();
      });

      it('should close URL modal when Cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        const urlButton = screen.getByTitle('Load from URL');
        await user.click(urlButton);
        
        const cancelButton = screen.getByText('Cancel');
        await user.click(cancelButton);
        
        expect(screen.queryByText('Load from URL')).not.toBeInTheDocument();
      });

      it('should validate empty URL', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        await user.click(screen.getByText('Load'));
        
        expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
      });

      it('should validate invalid URL format', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'not-a-valid-url');
        await user.click(screen.getByText('Load'));
        
        expect(screen.getByText('Invalid URL format')).toBeInTheDocument();
      });

      it('should fetch and upload content from valid URL', async () => {
        const user = userEvent.setup();
        const mockData = { test: 'data' };
        mockFetch(JSON.stringify(mockData));
        
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'https://example.com/data.json');
        await user.click(screen.getByText('Load'));
        
        await waitFor(() => {
          expect(mockCallbacks.onUpload).toHaveBeenCalled();
          expect(screen.queryByText('Load from URL')).not.toBeInTheDocument();
        });
      });

      it('should handle fetch errors gracefully', async () => {
        const user = userEvent.setup();
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'https://example.com/data.json');
        await user.click(screen.getByText('Load'));
        
        await waitFor(() => {
          expect(screen.getByText(/Network error/)).toBeInTheDocument();
        });
      });

      it('should handle HTTP errors', async () => {
        const user = userEvent.setup();
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
        
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'https://example.com/notfound.json');
        await user.click(screen.getByText('Load'));
        
        await waitFor(() => {
          expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
        });
      });

      it('should submit on Enter key press', async () => {
        const user = userEvent.setup();
        mockFetch('{}');
        
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'https://example.com/data.json{Enter}');
        
        await waitFor(() => {
          expect(mockCallbacks.onUpload).toHaveBeenCalled();
        });
      });
    });

    describe('Sample Templates', () => {
      const mockTemplates = [
        {
          name: 'Basic Sample',
          description: 'A basic example',
          content: '{"test": "data"}',
          icon: 'fas fa-file',
          iconColor: '#3b82f6',
        },
        {
          name: 'Advanced Sample',
          description: 'An advanced example',
          content: '{"complex": "data"}',
          icon: 'fas fa-code',
          iconColor: '#10b981',
        },
      ];

      it('should render sample button with dropdown', async () => {
        const user = userEvent.setup();
        render(
          <EditorToolbar
            sampleTemplates={mockTemplates}
            onLoadTemplate={mockCallbacks.onLoadTemplate}
          />
        );
        
        const sampleButton = screen.getByTitle('Load sample template');
        expect(sampleButton).toBeInTheDocument();
        
        await user.click(sampleButton);
        expect(screen.getByText('Basic Sample')).toBeInTheDocument();
        expect(screen.getByText('Advanced Sample')).toBeInTheDocument();
      });

      it('should load template when clicked', async () => {
        const user = userEvent.setup();
        render(
          <EditorToolbar
            sampleTemplates={mockTemplates}
            onLoadTemplate={mockCallbacks.onLoadTemplate}
          />
        );
        
        await user.click(screen.getByTitle('Load sample template'));
        await user.click(screen.getByText('Basic Sample'));
        
        expect(mockCallbacks.onLoadTemplate).toHaveBeenCalledWith(mockTemplates[0]);
      });

      it('should close dropdown after selection', async () => {
        const user = userEvent.setup();
        render(
          <EditorToolbar
            sampleTemplates={mockTemplates}
            onLoadTemplate={mockCallbacks.onLoadTemplate}
          />
        );
        
        await user.click(screen.getByTitle('Load sample template'));
        await user.click(screen.getByText('Basic Sample'));
        
        expect(screen.queryByText('Advanced Sample')).not.toBeInTheDocument();
      });

      it('should close dropdown when clicking backdrop', async () => {
        const user = userEvent.setup();
        render(
          <EditorToolbar
            sampleTemplates={mockTemplates}
            onLoadTemplate={mockCallbacks.onLoadTemplate}
          />
        );
        
        await user.click(screen.getByTitle('Load sample template'));
        const backdrop = document.querySelector('.dropdown-backdrop');
        expect(backdrop).toBeInTheDocument();
        
        fireEvent.click(backdrop!);
        expect(screen.queryByText('Basic Sample')).not.toBeInTheDocument();
      });
    });

    describe('Clear Functionality', () => {
      it('should render clear button with separator', () => {
        render(<EditorToolbar onClear={mockCallbacks.onClear} />);
        
        expect(screen.getByTitle('Clear input')).toBeInTheDocument();
        expect(document.querySelector('.toolbar-separator')).toBeInTheDocument();
      });

      it('should show confirmation dialog before clearing', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onClear={mockCallbacks.onClear} />);
        
        await user.click(screen.getByTitle('Clear input'));
        
        expect(global.confirm).toHaveBeenCalledWith(
          'Clear all input? This cannot be undone.'
        );
      });

      it('should call onClear when confirmed', async () => {
        const user = userEvent.setup();
        global.confirm = jest.fn(() => true);
        render(<EditorToolbar onClear={mockCallbacks.onClear} />);
        
        await user.click(screen.getByTitle('Clear input'));
        
        expect(mockCallbacks.onClear).toHaveBeenCalledTimes(1);
      });

      it('should not call onClear when cancelled', async () => {
        const user = userEvent.setup();
        global.confirm = jest.fn(() => false);
        render(<EditorToolbar onClear={mockCallbacks.onClear} />);
        
        await user.click(screen.getByTitle('Clear input'));
        
        expect(mockCallbacks.onClear).not.toHaveBeenCalled();
      });
    });

    describe('Label Customization', () => {
      it('should render custom label', () => {
        render(<EditorToolbar label="Custom Input" />);
        expect(screen.getByText('Custom Input')).toBeInTheDocument();
      });

      it('should render default label', () => {
        render(<EditorToolbar />);
        expect(screen.getByText('Input')).toBeInTheDocument();
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 50ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(
          <EditorToolbar
            onUpload={mockCallbacks.onUpload}
            onUrl={mockCallbacks.onUrl}
            onClear={mockCallbacks.onClear}
            onSample={mockCallbacks.onSample}
          />
        );
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(50);
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels on all buttons', () => {
        render(
          <EditorToolbar
            onUpload={mockCallbacks.onUpload}
            onUrl={mockCallbacks.onUrl}
            onClear={mockCallbacks.onClear}
          />
        );
        
        expect(screen.getByLabelText('Upload file')).toBeInTheDocument();
        expect(screen.getByLabelText('Load from URL')).toBeInTheDocument();
        expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
      });
    });

    describe('Error Handling', () => {
      it('should handle missing file gracefully', async () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [] } });
        
        expect(mockCallbacks.onUpload).not.toHaveBeenCalled();
      });

      it('should handle network timeout', async () => {
        const user = userEvent.setup();
        global.fetch = jest.fn().mockImplementation(
          () => new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
        );
        
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        const input = screen.getByPlaceholderText(/https:\/\/example.com/);
        await user.type(input, 'https://slow.example.com/data.json');
        await user.click(screen.getByText('Load'));
        
        await waitFor(() => {
          expect(screen.getByText(/Timeout/)).toBeInTheDocument();
        }, { timeout: 3000 });
      });
    });

    describe('UI/UX', () => {
      it('should have proper button styling classes', () => {
        render(<EditorToolbar onUpload={mockCallbacks.onUpload} />);
        
        const uploadButton = screen.getByTitle('Upload file');
        expect(uploadButton).toHaveClass('btn', 'btn-secondary', 'btn-sm');
      });

      it('should display icons in buttons', () => {
        render(
          <EditorToolbar
            onUpload={mockCallbacks.onUpload}
          />
        );
        
        expect(document.querySelector('.fa-upload')).toBeInTheDocument();
      });

      it('should close modal on overlay click', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        
        const overlay = document.querySelector('.dfp-modal-overlay');
        fireEvent.click(overlay!);
        
        expect(screen.queryByText('Load from URL')).not.toBeInTheDocument();
      });

      it('should not close modal when clicking inside modal', async () => {
        const user = userEvent.setup();
        render(<EditorToolbar onUrl={mockCallbacks.onUrl} onUpload={mockCallbacks.onUpload} />);
        
        await user.click(screen.getByTitle('Load from URL'));
        
        const modal = document.querySelector('.dfp-modal');
        fireEvent.click(modal!);
        
        expect(screen.getByText('Load from URL')).toBeInTheDocument();
      });
    });
  });
});
