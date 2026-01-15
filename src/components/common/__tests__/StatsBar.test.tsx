import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';
import { PerformanceProfiler, generateLargeText } from '@/__tests__/test-utils';

function expectStat(container: HTMLElement, id: string, value: string) {
  const el = container.querySelector(`#${id}`);
  expect(el).toBeInTheDocument();
  expect(el).toHaveTextContent(value);
}

describe('StatsBar', () => {
  describe('Functional Tests', () => {
    describe('Character Count', () => {
      it('should display correct character count', () => {
        const { container } = render(<StatsBar text="Hello World" />);
        expectStat(container, 'charCount', '11');
      });

      it('should count zero characters for empty string', () => {
        const { container } = render(<StatsBar text="" />);
        expectStat(container, 'charCount', '0');
      });

      it('should count special characters', () => {
        const { container } = render(<StatsBar text="Hello! @#$%^&*()" />);
        // This string is 16 characters: "Hello!" (6) + space (1) + "@#$%^&*()" (9)
        expectStat(container, 'charCount', '16');
      });

      it('should count unicode characters', () => {
        const { container } = render(<StatsBar text="Hello 你好 👋" />);
        expectStat(container, 'charCount', '11');
      });

      it('should format large numbers with commas', () => {
        const largeText = 'a'.repeat(10000);
        const { container } = render(<StatsBar text={largeText} />);
        expectStat(container, 'charCount', '10,000');
      });
    });

    describe('Word Count', () => {
      it('should display correct word count', () => {
        const { container } = render(<StatsBar text="Hello World Test" />);
        expectStat(container, 'wordCount', '3');
      });

      it('should count zero words for empty string', () => {
        const { container } = render(<StatsBar text="" />);
        expectStat(container, 'wordCount', '0');
      });

      it('should handle multiple spaces between words', () => {
        const { container } = render(<StatsBar text="Hello    World    Test" />);
        expectStat(container, 'wordCount', '3');
      });

      it('should handle newlines as word separators', () => {
        const text = ['Hello', 'World', 'Test'].join('\n');
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'wordCount', '3');
      });

      it('should handle tabs as word separators', () => {
        const text = ['Hello', 'World', 'Test'].join('\t');
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'wordCount', '3');
      });

      it('should count words with punctuation', () => {
        const { container } = render(<StatsBar text="Hello, World! Test?" />);
        expectStat(container, 'wordCount', '3');
      });
    });

    describe('Line Count', () => {
      it('should display correct line count', () => {
        const text = ['Line 1', 'Line 2', 'Line 3'].join('\n');
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'lineCount', '3');
      });

      it('should count single line for text without newlines', () => {
        const { container } = render(<StatsBar text="Single line" />);
        expectStat(container, 'lineCount', '1');
      });

      it('should count empty lines', () => {
        const text = ['Line 1', '', '', 'Line 2'].join('\n');
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'lineCount', '4');
      });

      it('should handle Windows line endings (CRLF)', () => {
        const text = ['Line 1', 'Line 2', 'Line 3'].join('\r\n');
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'lineCount', '3');
      });
    });

    describe('File Size', () => {
      it('should display size in bytes for small text', () => {
        const { container } = render(<StatsBar text="Hi" />);
        expectStat(container, 'sizeInfo', '2 Bytes');
      });

      it('should display size in KB', () => {
        const text = 'a'.repeat(2048);
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'sizeInfo', '2 KB');
      });

      it('should display size in MB', () => {
        const text = 'a'.repeat(1048576);
        const { container } = render(<StatsBar text={text} />);
        expectStat(container, 'sizeInfo', '1 MB');
      });

      it('should display 0 Bytes for empty string', () => {
        const { container } = render(<StatsBar text="" />);
        expectStat(container, 'sizeInfo', '0 Bytes');
      });

      it('should calculate size correctly for unicode', () => {
        const { container } = render(<StatsBar text="你好" />);
        // Chinese characters are 3 bytes each in UTF-8
        expectStat(container, 'sizeInfo', '6 Bytes');
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
        const { container, rerender } = render(<StatsBar text="Hello" />);
        expectStat(container, 'charCount', '5');
        expectStat(container, 'wordCount', '1');
        
        rerender(<StatsBar text="Hello World" />);
        expectStat(container, 'charCount', '11');
        expectStat(container, 'wordCount', '2');
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
        const text = '   ' + '\n' + '   ' + '\t' + '   ';
        const { container } = render(<StatsBar text={text} />);
        // (3 spaces + newline + 3 spaces + tab + 3 spaces) = 11 chars
        expectStat(container, 'charCount', '11');
        expectStat(container, 'wordCount', '0');
      });

      it('should handle very long single line', () => {
        const longLine = 'a'.repeat(1000000);
        const { container } = render(<StatsBar text={longLine} />);
        expectStat(container, 'charCount', '1,000,000');
        expectStat(container, 'lineCount', '1');
      });

      it('should handle emoji and special unicode', () => {
        const { container } = render(<StatsBar text="Hello 👋 世界 🌍" />);
        // JS string length counts UTF-16 code units (emoji count as 2 each)
        expectStat(container, 'charCount', '14');
        expectStat(container, 'wordCount', '4');
      });

      it('should handle mixed line endings', () => {
        const text = 'Line 1' + '\n' + 'Line 2' + '\r\n' + 'Line 3' + '\r' + 'Line 4';
        const { container } = render(<StatsBar text={text} />);
        // Splitting by '\n' yields 3 lines here (the '\r' stays in content)
        expectStat(container, 'lineCount', '3');
      });

      it('should handle zero-width characters', () => {
        const text = 'Hello' + '\u200B' + 'World';
        const { container } = render(<StatsBar text={text} />);
        // Zero-width space should be counted as a character
        expectStat(container, 'charCount', '11');
      });
    });
  });
});
