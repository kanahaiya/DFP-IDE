/**
 * Google Analytics utility functions
 * Measurement ID: G-B47GC8FSFT
 */

export const GA_MEASUREMENT_ID = 'G-B47GC8FSFT';

interface WindowWithAnalytics extends Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, unknown>
  ) => void;
  dataLayer?: unknown[];
}

/**
 * Track page view
 */
export const pageview = (url: string): void => {
  if (typeof window === 'undefined') return;
  
  const win = window as WindowWithAnalytics;
  if (typeof win.gtag === 'function') {
    win.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom event
 */
export const event = (
  action: string,
  category?: string,
  label?: string,
  value?: number
): void => {
  if (typeof window === 'undefined') return;
  
  const win = window as WindowWithAnalytics;
  if (typeof win.gtag === 'function') {
    win.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track conversion/share event
 */
export const trackShare = (network: string): void => {
  event('share', 'engagement', network);
};

/**
 * Track conversion
 */
export const trackConversion = (action: string, label?: string): void => {
  event('conversion', 'tool_usage', label || action);
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, action: string): void => {
  event(action, 'tool', toolName);
};

/**
 * Track download
 */
export const trackDownload = (fileType: string): void => {
  event('download', 'file', fileType);
};

/**
 * Track copy to clipboard
 */
export const trackCopy = (contentType: string): void => {
  event('copy', 'clipboard', contentType);
};

/**
 * Track auto-correct usage
 */
export const trackAutoCorrect = (format: string, success: boolean): void => {
  event('auto_correct', 'tool_usage', success ? 'success' : 'failure');
  event('auto_correct_format', 'tool_usage', format);
};

/**
 * Track diff computation
 */
export const trackDiffComputed = (changeCount: number): void => {
  event('diff_computed', 'json_diff', 'changes', changeCount);
};

/**
 * Track view mode change
 */
export const trackViewModeChange = (mode: string): void => {
  event('view_mode_change', 'json_diff', mode);
};

/**
 * Track export format
 */
export const trackExport = (format: string): void => {
  event('export', 'json_diff', format);
};

/**
 * Track change navigation
 */
export const trackChangeNavigation = (direction: 'next' | 'previous' | 'jump'): void => {
  event('change_navigation', 'json_diff', direction);
};
