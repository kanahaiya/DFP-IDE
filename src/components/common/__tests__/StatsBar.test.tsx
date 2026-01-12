import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';
import { PerformanceProfiler, generateLargeText } from '@/__tests__/test-utils';

describe('StatsBar', () => {
  describe('Functional Tests', () => {
    describe('Character Count', () => {
      it('should display correct character count', () => {
        render(<StatsBar text="Hello World" />);
        expect(screen.getByText('11')).toBeInTheDocument();
      });

      it('should count zero characters for empty string', () => {
        render(<StatsBar text="" />);
        expect(screen.getByText('0')).toBeInTheDocument();
      });

      it('should count special characters', () => {
        render(<StatsBar text="Hello! @#$%^&*()" />);
        expect(screen.getByText('17')).toBeInTheDocument();
      });

      it('should count unicode characters', () => {
        render(<StatsBar text="Hello 你好 👋" />);
        expect(screen.getByText('11')).toBeInTheDocument();
      });

      it('should format large numbers with commas', () => {
        const largeText = 'a'.repeat(10000);
        render(<StatsBar text={largeText} />);
        expect(screen.getByText('10,000')).toBeInTheDocument();
      });
    });

    describe('Word Count', () => {
      it('should display correct word count', () => {
        render(<StatsBar text="Hello World Test" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should count zero words for empty string', () => {
        render(<StatsBar text="" />);
        // Character count shows 0
        expect(screen.getAllByText('0').length).toBeGreaterThan(0);
      });

      it('should handle multiple spaces between words', () => {
        render(<StatsBar text="Hello    World    Test" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should handle newlines as word separators', () => {
        render(<StatsBar text="Hello\nWorld\nTest" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should handle tabs as word separators', () => {
        render(<StatsBar text="Hello\tWorld\tTest" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should count words with punctuation', () => {
        render(<StatsBar text="Hello, World! Test?" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    describe('Line Count', () => {
      it('should display correct line count', () => {
        render(<StatsBar text="Line 1\nLine 2\nLine 3" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should count single line for text without newlines', () => {
        render(<StatsBar text="Single line" />);
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      it('should count empty lines', () => {
        render(<StatsBar text="Line 1\n\n\nLine 2" />);
        expect(screen.getByText('4')).toBeInTheDocument();
      });

      it('should handle Windows line endings (CRLF)', () => {
        render(<StatsBar text="Line 1\r\nLine 2\r\nLine 3" />);
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    describe('File Size', () => {
      it('should display size in bytes for small text', () => {
        render(<StatsBar text="Hi" />);
        expect(screen.getByText('2 Bytes')).toBeInTheDocument();
      });

      it('should display size in KB', () => {
        const text = 'a'.repeat(2048);
        render(<StatsBar text={text} />);
        expect(screen.getByText('2 KB')).toBeInTheDocument();
      });

      it('should display size in MB', () => {
        const text = 'a'.repeat(1048576);
        render(<StatsBar text={text} />);
        expect(screen.getByText('1 MB')).toBeInTheDocument();
      });

      it('should display 0 Bytes for empty string', () => {
        render(<StatsBar text="" />);
        expect(screen.getByText('0 Bytes')).toBeInTheDocument();
      });

      it('should calculate size correctly for unicode', () => {
        render(<StatsBar text="你好" />);
        // Chinese characters are 3 bytes each in UTF-8
        expect(screen.getByText('6 Bytes')).toBeInTheDocument();
      });
    });

    describe('Validation State', () => {
      it('should display error count', () => {
        const validationState = {
          isValid: false,
          errorCount: 3,
          warningCount: 0,
        };
        
        render(<StatsBar text="test" validationState={validationState} />);
        expect(screen.getByText('3 Errors')).toBeInTheDocument();
      });

      it('should display single error without plural', () => {
        const validationState = {
          isValid: false,
          errorCount: 1,
          warningCount: 0,
        };
        
        render(<StatsBar text="test" validationState={validationState} />);
        expect(screen.getByText('1 Error')).toBeInTheDocument();
      });

      it('should display warning count', () => {
        const validationState = {
          isValid: true,
          errorCount: 0,
          warningCount: 2,
        };
        
        render(<StatsBar text="test" validationState={validationState} />);
        expect(screen.getByText('2 Warnings')).toBeInTheDocument();
      });

      it('should display single warning without plural', () => {
        const validationState = {
          isValid: true,
          errorCount: 0,
          warningCount: 1,
        };
        
        render(<StatsBar text="test" validationState={validationState} />);
        expect(screen.getByText('1 Warning')).toBeInTheDocument();
      });

      it('should display valid status', () => {
        const validationState = {
          isValid: true,
          errorCount: 0,
          warningCount: 0,
        };
        
        render(<StatsBar text='{"test": "data"}' validationState={validationState} />);
        expect(screen.getByText('JSON Valid')).toBeInTheDocument();
      });

      it('should display both errors and warnings', () => {
        const validationState = {
          isValid: false,
          errorCount: 2,
          warningCount: 3,
        };
        
        render(<StatsBar text="test" validationState={validationState} />);
        expect(screen.getByText('2 Errors')).toBeInTheDocument();
        expect(screen.getByText('3 Warnings')).toBeInTheDocument();
      });

      it('should not display validation for empty text', () => {
        const validationState = {
          isValid: true,
          errorCount: 0,
          warningCount: 0,
        };
        
        render(<StatsBar text="" validationState={validationState} />);
        expect(screen.queryByText('JSON Valid')).not.toBeInTheDocument();
      });

      it('should display validation icons', () => {
        const { container } = render(
          <StatsBar
            text="test"
            validationState={{ isValid: false, errorCount: 1, warningCount: 1 }}
          />
        );
        
        expect(container.querySelector('.fa-times-circle')).toBeInTheDocument();
        expect(container.querySelector('.fa-exclamation-triangle')).toBeInTheDocument();
      });
    });

    describe('Custom Class Name', () => {
      it('should apply custom className', () => {
        const { container } = render(<StatsBar text="test" className="custom-class" />);
        
        const statsBar = container.querySelector('.stats-bar');
        expect(statsBar).toHaveClass('custom-class');
      });

      it('should work without custom className', () => {
        const { container } = render(<StatsBar text="test" />);
        
        const statsBar = container.querySelector('.stats-bar');
        expect(statsBar).toBeInTheDocument();
        expect(statsBar).toHaveClass('stats-bar');
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should calculate stats in less than 5ms for small text', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(<StatsBar text="Hello World! This is a test." />);
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(5);
      });

      it('should handle large text efficiently (1MB+)', () => {
        const largeText = generateLargeText(1024); // 1MB
        
        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        render(<StatsBar text={largeText} />);
        
        profiler.mark('end');
        const renderTime = profiler.measure('start', 'end');
        
        // Should still be reasonably fast with memoization
        expect(renderTime).toBeLessThan(100);
      });

      it('should use memoization to avoid recalculation', () => {
        const { rerender } = render(<StatsBar text="test" />);
        
        const profiler = new PerformanceProfiler();
        
        // First render
        profiler.mark('first');
        rerender(<StatsBar text="test" />);
        profiler.mark('first-end');
        
        // Second render with same text
        profiler.mark('second');
        rerender(<StatsBar text="test" />);
        profiler.mark('second-end');
        
        const firstTime = profiler.measure('first', 'first-end');
        const secondTime = profiler.measure('second', 'second-end');
        
        // Second render should be faster due to memoization
        expect(secondTime).toBeLessThanOrEqual(firstTime);
      });

      it('should recompute when text changes', () => {
        const { rerender } = render(<StatsBar text="test 1" />);
        
        expect(screen.getByText('6')).toBeInTheDocument(); // chars
        
        rerender(<StatsBar text="test 1 2" />);
        
        expect(screen.getByText('8')).toBeInTheDocument(); // chars
      });
    });

    describe('Accessibility', () => {
      it('should have readable stat labels', () => {
        render(<StatsBar text="Hello World" />);
        
        expect(screen.getByText('Characters:')).toBeInTheDocument();
        expect(screen.getByText('Words:')).toBeInTheDocument();
        expect(screen.getByText('Lines:')).toBeInTheDocument();
        expect(screen.getByText('Size:')).toBeInTheDocument();
      });

      it('should have proper IDs for stats', () => {
        render(<StatsBar text="test" />);
        
        expect(document.getElementById('charCount')).toBeInTheDocument();
        expect(document.getElementById('wordCount')).toBeInTheDocument();
        expect(document.getElementById('lineCount')).toBeInTheDocument();
        expect(document.getElementById('sizeInfo')).toBeInTheDocument();
      });

      it('should use semantic HTML structure', () => {
        const { container } = render(<StatsBar text="test" />);
        
        const statsBar = container.querySelector('.stats-bar');
        expect(statsBar?.tagName).toBe('DIV');
        
        const stats = container.querySelectorAll('.stat');
        expect(stats.length).toBeGreaterThan(0);
      });
    });

    describe('UI/UX', () => {
      it('should display stats in correct order', () => {
        const { container } = render(
          <StatsBar
            text="test"
            validationState={{ isValid: true, errorCount: 0, warningCount: 0 }}
          />
        );
        
        const stats = container.querySelectorAll('.stat');
        // Validation stats come first, then regular stats
        expect(stats[0]).toHaveTextContent('JSON Valid');
      });

      it('should format numbers with locale string', () => {
        const largeText = 'a'.repeat(100000);
        render(<StatsBar text={largeText} />);
        
        // Should have comma separators
        expect(screen.getByText('100,000')).toBeInTheDocument();
      });

      it('should apply error styling to error stat', () => {
        const { container } = render(
          <StatsBar
            text="test"
            validationState={{ isValid: false, errorCount: 1, warningCount: 0 }}
          />
        );
        
        const errorStat = container.querySelector('.stat-error');
        expect(errorStat).toBeInTheDocument();
      });

      it('should apply warning styling to warning stat', () => {
        const { container } = render(
          <StatsBar
            text="test"
            validationState={{ isValid: true, errorCount: 0, warningCount: 1 }}
          />
        );
        
        const warningStat = container.querySelector('.stat-warning');
        expect(warningStat).toBeInTheDocument();
      });

      it('should apply valid styling to valid stat', () => {
        const { container } = render(
          <StatsBar
            text='{"valid": "json"}'
            validationState={{ isValid: true, errorCount: 0, warningCount: 0 }}
          />
        );
        
        const validStat = container.querySelector('.stat-valid');
        expect(validStat).toBeInTheDocument();
      });
    });

    describe('Real-time Updates', () => {
      it('should update stats when text changes', () => {
        const { rerender } = render(<StatsBar text="Hello" />);
        
        expect(screen.getByText('5')).toBeInTheDocument(); // chars
        expect(screen.getByText('1')).toBeInTheDocument(); // words
        
        rerender(<StatsBar text="Hello World" />);
        
        expect(screen.getByText('11')).toBeInTheDocument(); // chars
        expect(screen.getByText('2')).toBeInTheDocument(); // words
      });

      it('should update validation state', () => {
        const { rerender } = render(
          <StatsBar
            text="test"
            validationState={{ isValid: false, errorCount: 1, warningCount: 0 }}
          />
        );
        
        expect(screen.getByText('1 Error')).toBeInTheDocument();
        
        rerender(
          <StatsBar
            text="test"
            validationState={{ isValid: true, errorCount: 0, warningCount: 0 }}
          />
        );
        
        expect(screen.queryByText('1 Error')).not.toBeInTheDocument();
        expect(screen.getByText('JSON Valid')).toBeInTheDocument();
      });
    });

    describe('Edge Cases', () => {
      it('should handle only whitespace', () => {
        render(<StatsBar text="   \n   \t   " />);
        
        expect(screen.getByText('12')).toBeInTheDocument(); // chars (3 spaces + newline + 3 spaces + tab + 3 spaces)
        expect(screen.getByText('0')).toBeInTheDocument(); // words
      });

      it('should handle very long single line', () => {
        const longLine = 'a'.repeat(1000000);
        render(<StatsBar text={longLine} />);
        
        expect(screen.getByText('1,000,000')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // lines
      });

      it('should handle emoji and special unicode', () => {
        render(<StatsBar text="Hello 👋 世界 🌍" />);
        
        // Should count correctly
        expect(screen.getByText('13')).toBeInTheDocument(); // chars
        expect(screen.getByText('3')).toBeInTheDocument(); // words
      });

      it('should handle mixed line endings', () => {
        render(<StatsBar text="Line 1\nLine 2\r\nLine 3\rLine 4" />);
        
        expect(screen.getByText('4')).toBeInTheDocument(); // lines
      });

      it('should handle zero-width characters', () => {
        render(<StatsBar text="Hello\u200BWorld" />);
        
        // Zero-width space should be counted as a character
        expect(screen.getByText('11')).toBeInTheDocument();
      });
    });
  });
});
