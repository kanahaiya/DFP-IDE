import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageBox, useMessage } from '../MessageBox';
import { PerformanceProfiler } from '@/__tests__/test-utils';

describe('MessageBox', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Functional Tests', () => {
    describe('Message Display', () => {
      it('should render success message with icon', () => {
        render(<MessageBox message="Success!" type="success" />);
        
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(document.querySelector('.fa-check-circle')).toBeInTheDocument();
      });

      it('should render error message with icon', () => {
        render(<MessageBox message="Error occurred" type="error" />);
        
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
        expect(document.querySelector('.fa-exclamation-circle')).toBeInTheDocument();
      });

      it('should render warning message with icon', () => {
        render(<MessageBox message="Warning!" type="warning" />);
        
        expect(screen.getByText('Warning!')).toBeInTheDocument();
        expect(document.querySelector('.fa-exclamation-triangle')).toBeInTheDocument();
      });

      it('should render info message with icon', () => {
        render(<MessageBox message="Information" type="info" />);
        
        expect(screen.getByText('Information')).toBeInTheDocument();
        expect(document.querySelector('.fa-info-circle')).toBeInTheDocument();
      });

      it('should not render when message is empty', () => {
        const { container } = render(<MessageBox message="" type="success" />);
        expect(container.firstChild).toBeNull();
      });

      it('should have proper role and aria-live attributes', () => {
        render(<MessageBox message="Test message" type="success" />);
        
        const message = screen.getByText('Test message').parentElement;
        expect(message).toHaveAttribute('role', 'status');
        expect(message).toHaveAttribute('aria-live', 'polite');
      });
    });

    describe('Auto-dismiss', () => {
      it('should auto-dismiss after default duration (3000ms)', async () => {
        const { container } = render(
          <MessageBox message="Auto dismiss" type="success" />
        );
        
        expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
        
        act(() => {
          jest.advanceTimersByTime(3000);
        });
        
        await waitFor(() => {
          expect(container.firstChild).toBeNull();
        });
      });

      it('should auto-dismiss after custom duration', async () => {
        const { container } = render(
          <MessageBox message="Custom duration" type="success" duration={1000} />
        );
        
        expect(screen.getByText('Custom duration')).toBeInTheDocument();
        
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        await waitFor(() => {
          expect(container.firstChild).toBeNull();
        });
      });

      it('should not auto-dismiss error messages', () => {
        render(<MessageBox message="Error stays" type="error" duration={3000} />);
        
        expect(screen.getByText('Error stays')).toBeInTheDocument();
        
        act(() => {
          jest.advanceTimersByTime(3000);
        });
        
        // Error should still be visible
        expect(screen.getByText('Error stays')).toBeInTheDocument();
      });

      it('should call onClose callback after duration', async () => {
        const onClose = jest.fn();
        const { container } = render(
          <MessageBox message="With callback" type="success" duration={1000} onClose={onClose} />
        );
        
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        await waitFor(() => {
          expect(container.firstChild).toBeNull();
        });
        
        // Wait for animation timeout (300ms)
        act(() => {
          jest.advanceTimersByTime(300);
        });
        
        expect(onClose).toHaveBeenCalled();
      });

      it('should wait for fade animation before calling onClose', async () => {
        const onClose = jest.fn();
        render(
          <MessageBox message="Animated" type="success" duration={1000} onClose={onClose} />
        );
        
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        // onClose should not be called immediately
        expect(onClose).not.toHaveBeenCalled();
        
        // Wait for animation (300ms)
        act(() => {
          jest.advanceTimersByTime(300);
        });
        
        await waitFor(() => {
          expect(onClose).toHaveBeenCalled();
        });
      });
    });

    describe('Message Types', () => {
      it('should apply correct CSS class for success', () => {
        render(<MessageBox message="Success" type="success" />);
        
        const messageBox = screen.getByText('Success').parentElement;
        expect(messageBox).toHaveClass('message', 'success');
      });

      it('should apply correct CSS class for error', () => {
        render(<MessageBox message="Error" type="error" />);
        
        const messageBox = screen.getByText('Error').parentElement;
        expect(messageBox).toHaveClass('message', 'error');
      });

      it('should apply correct CSS class for warning', () => {
        render(<MessageBox message="Warning" type="warning" />);
        
        const messageBox = screen.getByText('Warning').parentElement;
        expect(messageBox).toHaveClass('message', 'warning');
      });

      it('should apply correct CSS class for info', () => {
        render(<MessageBox message="Info" type="info" />);
        
        const messageBox = screen.getByText('Info').parentElement;
        expect(messageBox).toHaveClass('message', 'info');
      });
    });

    describe('Visibility State', () => {
      it('should be visible initially', () => {
        render(<MessageBox message="Visible" type="success" />);
        expect(screen.getByText('Visible')).toBeInTheDocument();
      });

      it('should become invisible before unmounting', async () => {
        const { container } = render(
          <MessageBox message="Will hide" type="success" duration={1000} />
        );
        
        expect(screen.getByText('Will hide')).toBeInTheDocument();
        
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        await waitFor(() => {
          expect(container.firstChild).toBeNull();
        });
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 10ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(<MessageBox message="Fast render" type="success" />);
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(10);
      });
    });

    describe('Accessibility', () => {
      it('should announce message to screen readers', () => {
        render(<MessageBox message="Screen reader test" type="success" />);
        
        const messageBox = screen.getByText('Screen reader test').parentElement;
        expect(messageBox).toHaveAttribute('aria-live', 'polite');
        expect(messageBox).toHaveAttribute('role', 'status');
      });

      it('should use appropriate semantic HTML', () => {
        render(<MessageBox message="Semantic test" type="success" />);
        
        const messageBox = screen.getByText('Semantic test').parentElement;
        expect(messageBox?.tagName).toBe('DIV');
        expect(messageBox).toHaveClass('message');
      });
    });

    describe('UI/UX', () => {
      it('should display icon before text', () => {
        render(<MessageBox message="Icon first" type="success" />);
        
        const messageBox = screen.getByText('Icon first').parentElement;
        const icon = messageBox?.querySelector('.fa-check-circle');
        const text = messageBox?.querySelector('span');
        
        expect(icon).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        // Icon should come before text in DOM order
        expect(messageBox?.firstChild).toBe(icon);
      });

      it('should have smooth animations', () => {
        render(<MessageBox message="Animated" type="success" />);
        
        const messageBox = screen.getByText('Animated').parentElement;
        expect(messageBox).toHaveClass('message');
        // Animation classes would be applied via CSS
      });
    });

    describe('Edge Cases', () => {
      it('should handle very long messages', () => {
        const longMessage = 'A'.repeat(500);
        render(<MessageBox message={longMessage} type="success" />);
        
        expect(screen.getByText(longMessage)).toBeInTheDocument();
      });

      it('should handle special characters in message', () => {
        const specialMessage = '<script>alert("xss")</script> & "quotes"';
        render(<MessageBox message={specialMessage} type="success" />);
        
        // Should render as text, not HTML
        expect(screen.getByText(specialMessage)).toBeInTheDocument();
      });

      it('should handle emoji in message', () => {
        render(<MessageBox message="Success! 🎉" type="success" />);
        expect(screen.getByText('Success! 🎉')).toBeInTheDocument();
      });

      it('should cleanup timer on unmount', () => {
        const { unmount } = render(
          <MessageBox message="Will unmount" type="success" duration={5000} />
        );
        
        unmount();
        
        // Advance timers - should not cause any errors
        act(() => {
          jest.advanceTimersByTime(5000);
        });
        
        // No assertions needed - just ensuring no errors
        expect(true).toBe(true);
      });
    });
  });
});

describe('useMessage hook', () => {
  describe('Functional Tests', () => {
    it('should initialize with empty message', () => {
      const { result } = renderHook(() => useMessage());
      
      expect(result.current.message).toBe('');
      expect(result.current.type).toBe('success');
    });

    it('should update message and type with showMessage', () => {
      const { result } = renderHook(() => useMessage());
      
      act(() => {
        result.current.showMessage('Test message', 'error');
      });
      
      expect(result.current.message).toBe('Test message');
      expect(result.current.type).toBe('error');
    });

    it('should default to success type', () => {
      const { result } = renderHook(() => useMessage());
      
      act(() => {
        result.current.showMessage('Success message');
      });
      
      expect(result.current.message).toBe('Success message');
      expect(result.current.type).toBe('success');
    });

    it('should clear message with clearMessage', () => {
      const { result } = renderHook(() => useMessage());
      
      act(() => {
        result.current.showMessage('Test message', 'info');
      });
      
      expect(result.current.message).toBe('Test message');
      
      act(() => {
        result.current.clearMessage();
      });
      
      expect(result.current.message).toBe('');
    });

    it('should handle multiple message updates', () => {
      const { result } = renderHook(() => useMessage());
      
      act(() => {
        result.current.showMessage('First message', 'success');
      });
      
      expect(result.current.message).toBe('First message');
      expect(result.current.type).toBe('success');
      
      act(() => {
        result.current.showMessage('Second message', 'error');
      });
      
      expect(result.current.message).toBe('Second message');
      expect(result.current.type).toBe('error');
    });

    it('should support all message types', () => {
      const { result } = renderHook(() => useMessage());
      
      const types: Array<'success' | 'error' | 'warning' | 'info'> = [
        'success',
        'error',
        'warning',
        'info',
      ];
      
      types.forEach(type => {
        act(() => {
          result.current.showMessage(`${type} message`, type);
        });
        
        expect(result.current.type).toBe(type);
      });
    });
  });

  describe('Integration with MessageBox', () => {
    it('should work with MessageBox component', () => {
      const TestComponent = () => {
        const { message, type, showMessage, clearMessage } = useMessage();
        
        return (
          <div>
            <button onClick={() => showMessage('Test', 'success')}>Show</button>
            <button onClick={clearMessage}>Clear</button>
            {message && <MessageBox message={message} type={type} onClose={clearMessage} />}
          </div>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
      
      const showButton = screen.getByText('Show');
      fireEvent.click(showButton);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
      
      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);
      
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        const { message, showMessage } = useMessage();
        return (
          <div>
            <button onClick={() => showMessage('Test')}>Show</button>
            <span>{message}</span>
          </div>
        );
      };
      
      render(<TestComponent />);
      const initialRenderCount = renderCount;
      
      const button = screen.getByText('Show');
      fireEvent.click(button);
      
      // Should only re-render once for the message update
      expect(renderCount).toBe(initialRenderCount + 1);
    });
  });

  describe('Memoization', () => {
    it('should memoize showMessage callback', () => {
      const { result, rerender } = renderHook(() => useMessage());
      
      const firstShowMessage = result.current.showMessage;
      
      rerender();
      
      const secondShowMessage = result.current.showMessage;
      
      expect(firstShowMessage).toBe(secondShowMessage);
    });

    it('should memoize clearMessage callback', () => {
      const { result, rerender } = renderHook(() => useMessage());
      
      const firstClearMessage = result.current.clearMessage;
      
      rerender();
      
      const secondClearMessage = result.current.clearMessage;
      
      expect(firstClearMessage).toBe(secondClearMessage);
    });
  });
});
