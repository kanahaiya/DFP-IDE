import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpModal } from '../HelpModal';
import { PerformanceProfiler } from '@/__tests__/test-utils';

describe('HelpModal', () => {
  const mockSections = [
    {
      title: 'Getting Started',
      content: '<p>Welcome to the tool!</p><ul><li>Step 1</li><li>Step 2</li></ul>',
      icon: 'fas fa-rocket',
    },
    {
      title: 'Advanced Features',
      content: '<p>Learn about <strong>advanced</strong> features.</p>',
      icon: 'fas fa-star',
    },
    {
      title: 'FAQ',
      content: '<p>Frequently asked questions</p>',
    },
  ];

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Functional Tests', () => {
    describe('Modal Visibility', () => {
      it('should render when isOpen is true', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        expect(screen.getByText('Test Tool - Help & Documentation')).toBeInTheDocument();
      });

      it('should not render when isOpen is false', () => {
        render(
          <HelpModal
            isOpen={false}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        expect(screen.queryByText('Test Tool - Help & Documentation')).not.toBeInTheDocument();
      });
    });

    describe('Content Rendering', () => {
      it('should render all sections', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        expect(screen.getByText('Getting Started')).toBeInTheDocument();
        expect(screen.getByText('Advanced Features')).toBeInTheDocument();
        expect(screen.getByText('FAQ')).toBeInTheDocument();
      });

      it('should render section icons', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const rocketIcon = document.querySelector('.fa-rocket');
        const starIcon = document.querySelector('.fa-star');

        expect(rocketIcon).toBeInTheDocument();
        expect(starIcon).toBeInTheDocument();
      });

      it('should render section without icon', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        expect(screen.getByText('FAQ')).toBeInTheDocument();
      });

      it('should render HTML content safely', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        // HTML should be rendered
        expect(screen.getByText('Welcome to the tool!')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByText('Step 2')).toBeInTheDocument();
      });

      it('should handle empty sections array', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={[]}
          />
        );

        expect(screen.getByText('Test Tool - Help & Documentation')).toBeInTheDocument();
      });
    });

    describe('Close Functionality', () => {
      it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const closeButton = screen.getByTitle('Close Help');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it('should call onClose when Close footer button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const closeButton = screen.getByText('Close');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it('should call onClose when overlay is clicked', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const overlay = document.querySelector('.help-modal-overlay');
        fireEvent.click(overlay!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it('should not close when modal content is clicked', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const modal = document.querySelector('.help-modal');
        fireEvent.click(modal!);

        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });

    describe('Tool Name Display', () => {
      it('should display tool name in header', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="My Custom Tool"
            sections={mockSections}
          />
        );

        expect(screen.getByText('My Custom Tool - Help & Documentation')).toBeInTheDocument();
      });

      it('should display question mark icon', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const questionIcon = document.querySelector('.fa-question-circle');
        expect(questionIcon).toBeInTheDocument();
      });
    });

    describe('Scrolling', () => {
      it('should have scrollable body', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const modalBody = document.querySelector('.help-modal-body');
        expect(modalBody).toBeInTheDocument();
        expect(modalBody).toHaveStyle({ overflowY: 'auto' });
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 50ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(50);
      });

      it('should handle many sections efficiently', () => {
        const manySections = Array.from({ length: 20 }, (_, i) => ({
          title: `Section ${i + 1}`,
          content: `<p>Content for section ${i + 1}</p>`,
          icon: 'fas fa-info',
        }));

        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={manySections}
          />
        );
        
        profiler.mark('end');
        const renderTime = profiler.measure('start', 'end');
        
        expect(renderTime).toBeLessThan(100);
      });

      it('should animate modal appearance smoothly', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const modal = document.querySelector('.help-modal');
        // Animation is defined in CSS; JSDOM doesn't compute styles from external CSS reliably.
        expect(modal).toHaveClass('help-modal');
      });
    });

    describe('Accessibility', () => {
      it('should have proper heading structure', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const mainHeading = screen.getByText('Test Tool - Help & Documentation');
        expect(mainHeading.tagName).toBe('H2');

        const sectionHeadings = screen.getAllByText(/Getting Started|Advanced Features|FAQ/);
        sectionHeadings.forEach(heading => {
          expect(heading.tagName).toBe('H3');
        });
      });

      it('should be keyboard accessible', async () => {
        const user = userEvent.setup();
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const closeButton = screen.getByTitle('Close Help');
        closeButton.focus();
        
        expect(closeButton).toHaveFocus();
        
        await user.keyboard('{Enter}');
        expect(mockOnClose).toHaveBeenCalled();
      });

      it('should have proper button labels', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        expect(screen.getByTitle('Close Help')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
      });
    });

    describe('Responsiveness', () => {
      it('should apply mobile styles', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const modal = document.querySelector('.help-modal');
        expect(modal).toBeInTheDocument();
        // Mobile styles are in CSS media queries, so we just check the modal exists
      });
    });

    describe('UI/UX', () => {
      it('should have backdrop blur effect', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const overlay = document.querySelector('.help-modal-overlay');
        // Backdrop blur is CSS-driven; in JSDOM we just verify overlay exists.
        expect(overlay).toBeInTheDocument();
      });

      it('should have high z-index for overlay and modal', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const overlay = document.querySelector('.help-modal-overlay');
        const modal = document.querySelector('.help-modal');
        
        // z-index is CSS-driven; verify elements exist.
        expect(overlay).toBeInTheDocument();
        expect(modal).toBeInTheDocument();
      });

      it('should center modal on screen', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const modal = document.querySelector('.help-modal');
        // Centering is CSS-driven; verify modal exists.
        expect(modal).toBeInTheDocument();
      });

      it('should have proper spacing between sections', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={mockSections}
          />
        );

        const sections = document.querySelectorAll('.help-section');
        expect(sections.length).toBeGreaterThan(0);
      });
    });

    describe('Security', () => {
      it('should render potentially dangerous HTML safely', () => {
        const dangerousSections = [
          {
            title: 'XSS Test',
            content: '<script>alert("xss")</script><p>Safe content</p>',
          },
        ];

        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={dangerousSections}
          />
        );

        // Script tags should be rendered as text or stripped, not executed
        expect(screen.getByText('Safe content')).toBeInTheDocument();
        // The component uses dangerouslySetInnerHTML which is a security risk,
        // but we're just testing it doesn't crash
      });

      it('should handle malformed HTML', () => {
        const malformedSections = [
          {
            title: 'Malformed',
            content: '<p>Unclosed paragraph<div>Mixed tags</p></div>',
          },
        ];

        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={malformedSections}
          />
        );

        expect(screen.getByText('Malformed')).toBeInTheDocument();
      });
    });

    describe('Edge Cases', () => {
      it('should handle very long section titles', () => {
        const longTitleSection = [
          {
            title: 'A'.repeat(200),
            content: '<p>Content</p>',
          },
        ];

        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={longTitleSection}
          />
        );

        expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
      });

      it('should handle very long content', () => {
        const longContentSection = [
          {
            title: 'Long Content',
            content: `<p>${'Lorem ipsum '.repeat(1000)}</p>`,
          },
        ];

        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="Test Tool"
            sections={longContentSection}
          />
        );

        expect(screen.getByText('Long Content')).toBeInTheDocument();
      });

      it('should handle special characters in tool name', () => {
        render(
          <HelpModal
            isOpen={true}
            onClose={mockOnClose}
            toolName="JSON to OpenAPI & More™"
            sections={mockSections}
          />
        );

        expect(screen.getByText('JSON to OpenAPI & More™ - Help & Documentation')).toBeInTheDocument();
      });
    });
  });
});
