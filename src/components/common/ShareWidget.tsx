'use client';

import { useState, useEffect, useMemo } from 'react';
import { copyToClipboard } from '@/lib/clipboardUtils';

/**
 * Floating share button with social media links
 */
export function ShareWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  // Only render after mount to avoid hydration mismatch with dynamic URLs
  useEffect(() => {
      setPageUrl(window.location.href);
      setPageTitle(document.title);
    setMounted(true);
  }, []);

  // Memoize encoded values to avoid recomputation
  const encodeUrl = useMemo(() => encodeURIComponent(pageUrl), [pageUrl]);
  const encodeTitle = useMemo(() => encodeURIComponent(`Check out ${pageTitle}`), [pageTitle]);
  const encodeWhatsAppText = useMemo(() => encodeURIComponent(`${pageTitle} ${pageUrl}`), [pageTitle, pageUrl]);
  const encodeTitleOnly = useMemo(() => encodeURIComponent(pageTitle), [pageTitle]);

  // Don't render until mounted to ensure we have correct URL values
  if (!mounted) {
    return null;
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await copyToClipboard(pageUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (network: string) => {
    try {
      // Track share event in Google Analytics
      if (typeof window !== 'undefined') {
        interface WindowWithAnalytics extends Window {
          gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
        }
        const win = window as WindowWithAnalytics;
        if (typeof win.gtag === 'function') {
          win.gtag('event', 'share', { 
            event_category: 'engagement',
            event_label: network,
            network: network 
          });
        }
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  return (
    <>
      <button
        className="toggle-share dfp-share-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle share menu"
        title="Toggle Share Menu"
      >
        <i className="fas fa-share-alt"></i>
      </button>

      <div className={`floating-icon-share dfp-share-bar ${isOpen ? 'active' : ''}`}>
        <a
          aria-label="Share on Twitter"
          className="tooltip dfp-share-link"
          data-tip="Twitter"
          href={`https://twitter.com/intent/tweet?text=${encodeTitle}&url=${encodeUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('twitter')}
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          aria-label="Share on Facebook"
          className="tooltip dfp-share-link"
          data-tip="Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('facebook')}
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          aria-label="Share on LinkedIn"
          className="tooltip dfp-share-link"
          data-tip="LinkedIn"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('linkedin')}
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          aria-label="Share on WhatsApp"
          className="tooltip dfp-share-link"
          data-tip="WhatsApp"
          href={`https://api.whatsapp.com/send?text=${encodeWhatsAppText}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('whatsapp')}
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          aria-label="Share on Telegram"
          className="tooltip dfp-share-link"
          data-tip="Telegram"
          href={`https://t.me/share/url?url=${encodeUrl}&text=${encodeTitleOnly}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('telegram')}
        >
          <i className="fab fa-telegram"></i>
        </a>
        <a
          aria-label="Share on Pinterest"
          className="tooltip dfp-share-link"
          data-tip="Pinterest"
          href={`https://pinterest.com/pin/create/button/?url=${encodeUrl}&description=${encodeTitleOnly}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('pinterest')}
        >
          <i className="fab fa-pinterest"></i>
        </a>
        <a
          aria-label="Share on Quora"
          className="tooltip dfp-share-link"
          data-tip="Quora"
          href={`https://www.quora.com/share?url=${encodeUrl}&title=${encodeTitleOnly}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('quora')}
        >
          <i className="fab fa-quora"></i>
        </a>
        <a
          aria-label="Share on Reddit"
          className="tooltip dfp-share-link"
          data-tip="Reddit"
          href={`https://www.reddit.com/submit?url=${encodeUrl}&title=${encodeTitleOnly}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('reddit')}
        >
          <i className="fab fa-reddit-alien"></i>
        </a>
        <a
          aria-label="Share via email"
          className="tooltip dfp-share-link"
          data-tip="Email"
          href={`mailto:?subject=${encodeTitleOnly}&body=${encodeUrl}`}
          onClick={() => handleShare('email')}
        >
          <i className="fas fa-envelope"></i>
        </a>
        <a
          aria-label="Copy link"
          className="tooltip dfp-share-link"
          data-tip="Copy Link"
          href="#"
          onClick={handleCopyLink}
        >
          <i className="fas fa-link"></i>
        </a>
      </div>

      {showToast && (
        <div className="share-toast dfp-share-toast visible">
          Link copied to clipboard
        </div>
      )}
    </>
  );
}
