/**
 * Lighthouse CI Configuration
 * 
 * This configuration file is used by Lighthouse CI to run automated
 * performance audits in CI/CD pipelines.
 * 
 * Documentation: https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/json-to-openapi',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Core Web Vitals - Stricter targets for 95+ scores
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Additional metrics
        'interactive': ['warn', { maxNumericValue: 3000 }],
        'speed-index': ['warn', { maxNumericValue: 2500 }],
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'uses-text-compression': 'warn',
        'uses-rel-preconnect': 'warn',
        'font-display': 'warn',
        'uses-long-cache-ttl': 'warn',
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'heading-order': 'warn',
        'tabindex': 'warn',
        
        // Best Practices
        'errors-in-console': 'warn',
        'no-vulnerable-libraries': 'error',
        'valid-source-maps': 'warn',
        'inspector-issues': 'warn',
        
        // SEO
        'meta-description': 'error',
        'viewport': 'error',
        'document-title': 'error',
        'crawlable-anchors': 'error',
        'font-size': 'error',
        'tap-targets': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
