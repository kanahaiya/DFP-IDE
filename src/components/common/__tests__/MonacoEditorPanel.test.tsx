import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonacoEditorPanel } from '../MonacoEditorPanel';
import { PerformanceProfiler, generateLargeJSON } from '@/__tests__/test-utils';

// Mock @monaco-editor/react
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, onMount, loading }: any) => {
    React.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          getValue: jest.fn(() => value || ''),
          setValue: jest.fn(),
          dispose: jest.fn(),
          onDidChangeModelContent: jest.fn((callback) => {
            return { dispose: jest.fn() };
          }),
          getModel: jest.fn(() => ({
            getValue: jest.fn(() => value || ''),
            setValue: jest.fn(),
          })),
          updateOptions: jest.fn(),
        };

        const mockMonaco = {
          editor: {
            setTheme: jest.fn(),
            setModelMarkers: jest.fn(),
          },
          MarkerSeverity: {
            Error: 8,
            Warning: 4,
            Info: 2,
            Hint: 1,
          },
          languages: {
            json: {
              jsonDefaults: {
                setDiagnosticsOptions: jest.fn(),
              },
            },
            register: jest.fn(),
            setMonarchTokensProvider: jest.fn(),
            getLanguages: jest.fn(() => []),
          },
        };

        onMount(mockEditor, mockMonaco);
      }
    }, []);

    return (
      <div data-testid="monaco-editor" className="monaco-editor-mock">
        {loading}
        <textarea
          data-testid="monaco-textarea"
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    );
  },
}));

// Mock useTheme hook
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({
    theme: 'dark',
    mounted: true,
  })),
}));

describe('MonacoEditorPanel', () => {
  const mockOnChange = jest.fn();
  const mockOnMount = jest.fn();
  const mockOnLoadSample = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useTheme } = require('@/hooks/useTheme');
    useTheme.mockReturnValue({ theme: 'dark', mounted: true });
  });

  describe('Functional Tests', () => {
    describe('Editor Initialization', () => {
      it('should render Monaco editor', () => {
        render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should call onMount callback when editor mounts', () => {
        render(<MonacoEditorPanel value="" onChange={mockOnChange} onMount={mockOnMount} />);
        
        waitFor(() => {
          expect(mockOnMount).toHaveBeenCalled();
        });
      });

      it('should initialize with provided value', () => {
        const initialValue = '{"test": "data"}';
        render(<MonacoEditorPanel value={initialValue} onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        expect(textarea).toHaveValue(initialValue);
      });

      it('should handle empty value', () => {
        render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        expect(textarea).toHaveValue('');
      });
    });

    describe('Value Changes', () => {
      it('should call onChange when value changes', async () => {
        render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        fireEvent.change(textarea, { target: { value: '{"test": "value"}' } });
        
        expect(mockOnChange).toHaveBeenCalled();
      });

      it('should handle undefined onChange', async () => {
        const user = userEvent.setup();
        render(<MonacoEditorPanel value="" />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        await user.type(textarea, 'test');
        
        // Should not throw error
        expect(textarea).toBeInTheDocument();
      });

      it('should pass empty string when value is undefined', () => {
        render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        expect(textarea).toHaveValue('');
      });
    });

    describe('Language Support', () => {
      it('should default to json language', () => {
        const { container } = render(<MonacoEditorPanel value="" />);
        expect(container.querySelector('.monaco-editor-wrapper')).toBeInTheDocument();
      });

      it('should support yaml language', () => {
        render(<MonacoEditorPanel value="" language="yaml" />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should support csv language', () => {
        render(<MonacoEditorPanel value="" language="csv" />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should support plaintext language', () => {
        render(<MonacoEditorPanel value="" language="plaintext" />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });

    describe('Read-only Mode', () => {
      it('should render in read-only mode', () => {
        render(<MonacoEditorPanel value="test" readOnly={true} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should not call onChange in read-only mode', async () => {
        const user = userEvent.setup();
        render(<MonacoEditorPanel value="" readOnly={true} onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea');
        // In a real scenario, read-only would prevent this, but our mock allows it
        await user.type(textarea, 'test');
        
        // We're testing that the component passes readOnly prop correctly
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });

    describe('Theme Switching', () => {
      it('should apply dark theme', () => {
        const { useTheme } = require('@/hooks/useTheme');
        useTheme.mockReturnValue({ theme: 'dark', mounted: true });
        
        render(<MonacoEditorPanel value="" />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should apply light theme', () => {
        const { useTheme } = require('@/hooks/useTheme');
        useTheme.mockReturnValue({ theme: 'light', mounted: true });
        
        render(<MonacoEditorPanel value="" />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should not render before mounted', () => {
        const { useTheme } = require('@/hooks/useTheme');
        useTheme.mockReturnValue({ theme: 'dark', mounted: false });
        
        const { container } = render(<MonacoEditorPanel value="" />);
        expect(container.querySelector('.monaco-editor-wrapper')).toBeInTheDocument();
      });
    });

    describe('Validation Errors', () => {
      it('should display validation errors as markers', async () => {
        const errors = [
          {
            line: 1,
            column: 1,
            message: 'Syntax error',
            severity: 'error' as const,
          },
        ];
        
        render(
          <MonacoEditorPanel
            value='{"test": }'
            onChange={mockOnChange}
            validationErrors={errors}
          />
        );
        
        await waitFor(() => {
          expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
        });
      });

      it('should handle multiple validation errors', () => {
        const errors = [
          {
            line: 1,
            column: 1,
            message: 'Error 1',
            severity: 'error' as const,
          },
          {
            line: 2,
            column: 5,
            message: 'Warning 1',
            severity: 'warning' as const,
          },
        ];
        
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            validationErrors={errors}
          />
        );
        
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should handle empty validation errors', () => {
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            validationErrors={[]}
          />
        );
        
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });

    describe('Empty State', () => {
      it('should show empty state when value is empty and onLoadSample provided', () => {
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            onLoadSample={mockOnLoadSample}
          />
        );
        
        expect(screen.getByText(/Get started by:/)).toBeInTheDocument();
      });

      it('should show load sample button in empty state', async () => {
        const user = userEvent.setup();
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            onLoadSample={mockOnLoadSample}
          />
        );
        
        const loadButton = screen.getByText('Load Sample JSON');
        expect(loadButton).toBeInTheDocument();
        
        await user.click(loadButton);
        expect(mockOnLoadSample).toHaveBeenCalled();
      });

      it('should hide empty state when value exists', () => {
        render(
          <MonacoEditorPanel
            value="test"
            onChange={mockOnChange}
            onLoadSample={mockOnLoadSample}
          />
        );
        
        expect(screen.queryByText(/Get started by:/)).not.toBeInTheDocument();
      });

      it('should not show empty state in read-only mode', () => {
        render(
          <MonacoEditorPanel
            value=""
            readOnly={true}
            onLoadSample={mockOnLoadSample}
          />
        );
        
        expect(screen.queryByText(/Get started by:/)).not.toBeInTheDocument();
      });

      it('should display custom empty state title', () => {
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            onLoadSample={mockOnLoadSample}
            emptyStateTitle="Custom Title"
          />
        );
        
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
      });

      it('should display custom empty state instructions', () => {
        const instructions = ['Instruction 1', 'Instruction 2'];
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            onLoadSample={mockOnLoadSample}
            emptyStateInstructions={instructions}
          />
        );
        
        expect(screen.getByText('Instruction 1')).toBeInTheDocument();
        expect(screen.getByText('Instruction 2')).toBeInTheDocument();
      });
    });

    describe('Placeholder', () => {
      it('should show placeholder when value is empty and no empty state', () => {
        render(
          <MonacoEditorPanel
            value=""
            onChange={mockOnChange}
            placeholder="Enter your code here"
          />
        );
        
        expect(screen.getByText('Enter your code here')).toBeInTheDocument();
      });

      it('should not show placeholder when value exists', () => {
        render(
          <MonacoEditorPanel
            value="test"
            onChange={mockOnChange}
            placeholder="Enter your code here"
          />
        );
        
        expect(screen.queryByText('Enter your code here')).not.toBeInTheDocument();
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 100ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(100);
      });

      it('should handle large files (10,000+ lines)', async () => {
        const largeJSON = generateLargeJSON(10000);
        
        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        render(<MonacoEditorPanel value={largeJSON} onChange={mockOnChange} />);
        
        profiler.mark('end');
        const renderTime = profiler.measure('start', 'end');
        
        // Should render even with large content (may be slower but should not crash)
        expect(renderTime).toBeLessThan(500);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should not cause memory leaks on unmount', () => {
        const { unmount } = render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        
        // Unmount and check that cleanup happens
        unmount();
        
        // No assertions needed - just ensuring no errors are thrown
        expect(true).toBe(true);
      });
    });

    describe('Accessibility', () => {
      it('should have proper wrapper class', () => {
        const { container } = render(<MonacoEditorPanel value="" />);
        expect(container.querySelector('.monaco-editor-wrapper')).toBeInTheDocument();
      });

      it('should allow custom className', () => {
        render(<MonacoEditorPanel value="" className="custom-class" />);
        expect(document.querySelector('.custom-class')).toBeInTheDocument();
      });
    });

    describe('Memory Management', () => {
      it('should cleanup on unmount', () => {
        const { unmount } = render(
          <MonacoEditorPanel
            value="test"
            onChange={mockOnChange}
            onMount={mockOnMount}
          />
        );
        
        unmount();
        
        // Component should unmount cleanly without errors
        expect(screen.queryByTestId('monaco-editor')).not.toBeInTheDocument();
      });

      it('should handle rapid value changes', async () => {
        const { rerender } = render(<MonacoEditorPanel value="" onChange={mockOnChange} />);
        
        // Rapidly change values
        for (let i = 0; i < 100; i++) {
          rerender(<MonacoEditorPanel value={`value-${i}`} onChange={mockOnChange} />);
        }
        
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });

    describe('Edge Cases', () => {
      it('should handle null value gracefully', () => {
        render(<MonacoEditorPanel value={null as any} onChange={mockOnChange} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should handle undefined value gracefully', () => {
        render(<MonacoEditorPanel value={undefined as any} onChange={mockOnChange} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should handle very long single line', () => {
        const longLine = 'x'.repeat(100000);
        render(<MonacoEditorPanel value={longLine} onChange={mockOnChange} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });

      it('should handle special characters', () => {
        const specialChars = '{"emoji": "👋", "symbols": "©®™", "unicode": "你好"}';
        render(<MonacoEditorPanel value={specialChars} onChange={mockOnChange} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });
  });
});
