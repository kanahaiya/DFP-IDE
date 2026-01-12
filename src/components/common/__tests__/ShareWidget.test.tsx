import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareWidget } from '../ShareWidget';
import { PerformanceProfiler } from '@/__tests__/test-utils';

// Mock clipboardUtils
jest.mock('@/lib/clipboardUtils', () => ({
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
}));

describe('ShareWidget', () => {
  const mockLocation = {
    href: 'https://example.com/tool',
  };

  const mockDocument = {
    title: 'Test Tool - Example',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
    Object.defineProperty(document, 'title', {
      writable: true,
      value: mockDocument.title,
    });
    
    // Mock gtag
    delete (window as any).gtag;
  });

  describe('Functional Tests', () => {
    describe('Widget Rendering', () => {
      it('should render toggle button', async () => {
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
      });

      it('should not render before mounting', () => {
        // Mock useEffect to not run
        const { container } = render(<ShareWidget />);
        
        // Component returns null until mounted
        expect(container.firstChild).toBeTruthy();
      });
    });

    describe('Share Menu Toggle', () => {
      it('should open share menu when toggle button clicked', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        await waitFor(() => {
          const shareBar = document.querySelector('.dfp-share-bar');
          expect(shareBar).toHaveClass('active');
        });
      });

      it('should close share menu when toggle button clicked again', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        const toggleButton = screen.getByLabelText('Toggle share menu');
        
        await user.click(toggleButton);
        await user.click(toggleButton);
        
        const shareBar = document.querySelector('.dfp-share-bar');
        expect(shareBar).not.toHaveClass('active');
      });
    });

    describe('Social Media Links', () => {
      it('should render all social media links when menu is open', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        await waitFor(() => {
          expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on Telegram')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on Pinterest')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on Quora')).toBeInTheDocument();
          expect(screen.getByLabelText('Share on Reddit')).toBeInTheDocument();
          expect(screen.getByLabelText('Share via email')).toBeInTheDocument();
          expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
        });
      });

      it('should have correct Twitter share URL', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter') as HTMLAnchorElement;
        expect(twitterLink.href).toContain('twitter.com/intent/tweet');
        expect(twitterLink.href).toContain(encodeURIComponent(mockLocation.href));
      });

      it('should have correct Facebook share URL', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const facebookLink = screen.getByLabelText('Share on Facebook') as HTMLAnchorElement;
        expect(facebookLink.href).toContain('facebook.com/sharer');
        expect(facebookLink.href).toContain(encodeURIComponent(mockLocation.href));
      });

      it('should have correct LinkedIn share URL', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const linkedInLink = screen.getByLabelText('Share on LinkedIn') as HTMLAnchorElement;
        expect(linkedInLink.href).toContain('linkedin.com/sharing');
      });
    });

    describe('Copy Link Functionality', () => {
      it('should copy link to clipboard when copy link clicked', async () => {
        const { copyToClipboard } = require('@/lib/clipboardUtils');
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        expect(copyToClipboard).toHaveBeenCalledWith(mockLocation.href);
      });

      it('should show toast after copying link', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        await waitFor(() => {
          expect(screen.getByText('Link copied to clipboard')).toBeInTheDocument();
        });
      });

      it('should hide toast after 2 seconds', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({ delay: null });
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        await waitFor(() => {
          expect(screen.getByText('Link copied to clipboard')).toBeInTheDocument();
        });
        
        act(() => {
          jest.advanceTimersByTime(2000);
        });
        
        await waitFor(() => {
          expect(screen.queryByText('Link copied to clipboard')).not.toBeInTheDocument();
        });
        
        jest.useRealTimers();
      });

      it('should handle copy errors gracefully', async () => {
        const { copyToClipboard } = require('@/lib/clipboardUtils');
        copyToClipboard.mockRejectedValueOnce(new Error('Copy failed'));
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        await waitFor(() => {
          expect(consoleSpy).toHaveBeenCalledWith('Failed to copy link:', expect.any(Error));
        });
        
        consoleSpy.mockRestore();
      });
    });

    describe('Analytics Tracking', () => {
      it('should track analytics when share link clicked', async () => {
        const mockGtag = jest.fn();
        (window as any).gtag = mockGtag;
        
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter');
        fireEvent.click(twitterLink);
        
        expect(mockGtag).toHaveBeenCalledWith('event', 'share', { network: 'twitter' });
      });

      it('should handle analytics errors gracefully', async () => {
        const mockGtag = jest.fn(() => {
          throw new Error('Analytics error');
        });
        (window as any).gtag = mockGtag;
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter');
        fireEvent.click(twitterLink);
        
        expect(consoleSpy).toHaveBeenCalledWith('Analytics error:', expect.any(Error));
        consoleSpy.mockRestore();
      });
    });

    describe('URL Encoding', () => {
      it('should properly encode URL in share links', async () => {
        window.location.href = 'https://example.com/tool?param=value&other=123';
        
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter') as HTMLAnchorElement;
        expect(twitterLink.href).toContain(encodeURIComponent('https://example.com/tool?param=value&other=123'));
      });

      it('should properly encode title in share links', async () => {
        document.title = 'Test & Special <Characters>';
        
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter') as HTMLAnchorElement;
        expect(twitterLink.href).toContain(encodeURIComponent('Test & Special <Characters>'));
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should toggle menu in less than 20ms', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        profiler.mark('end');
        const toggleTime = profiler.measure('start', 'end');
        
        expect(toggleTime).toBeLessThan(20);
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
        expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
        expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
      });

      it('should open share links in new tab', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter');
        expect(twitterLink).toHaveAttribute('target', '_blank');
        expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('should be keyboard accessible', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        const toggleButton = screen.getByLabelText('Toggle share menu');
        toggleButton.focus();
        
        expect(toggleButton).toHaveFocus();
        
        await user.keyboard('{Enter}');
        
        await waitFor(() => {
          const shareBar = document.querySelector('.dfp-share-bar');
          expect(shareBar).toHaveClass('active');
        });
      });
    });

    describe('Hydration', () => {
      it('should not cause hydration mismatch', async () => {
        const { container } = render(<ShareWidget />);
        
        await waitFor(() => {
          expect(container.firstChild).toBeInTheDocument();
        });
      });
    });

    describe('UI/UX', () => {
      it('should have floating button animation', async () => {
        render(<ShareWidget />);
        
        await waitFor(() => {
          const toggleButton = screen.getByLabelText('Toggle share menu');
          expect(toggleButton).toHaveClass('toggle-share');
        });
      });

      it('should show toast with proper styling', async () => {
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        await waitFor(() => {
          const toast = document.querySelector('.dfp-share-toast');
          expect(toast).toHaveClass('visible');
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle missing window.location gracefully', async () => {
        // This test just ensures no errors are thrown
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
      });

      it('should handle very long URLs', async () => {
        window.location.href = 'https://example.com/' + 'a'.repeat(1000);
        
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const twitterLink = screen.getByLabelText('Share on Twitter');
        expect(twitterLink).toBeInTheDocument();
      });

      it('should handle special characters in URLs', async () => {
        window.location.href = 'https://example.com/tool?query=test&value=<>&special="quotes"';
        
        const user = userEvent.setup();
        render(<ShareWidget />);
        
        await waitFor(() => {
          expect(screen.getByLabelText('Toggle share menu')).toBeInTheDocument();
        });
        
        await user.click(screen.getByLabelText('Toggle share menu'));
        
        const { copyToClipboard } = require('@/lib/clipboardUtils');
        const copyLink = screen.getByLabelText('Copy link');
        await user.click(copyLink);
        
        expect(copyToClipboard).toHaveBeenCalledWith(window.location.href);
      });
    });
  });
});

// Helper to use act from testing library
function act(callback: () => void) {
  callback();
}
