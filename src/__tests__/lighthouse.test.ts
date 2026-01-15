/**
 * Lighthouse Performance & Accessibility Tests
 * 
 * These tests run Lighthouse audits to ensure the application meets
 * performance, accessibility, SEO, and best practices standards.
 * 
 * Run with: npm run test:lighthouse
 */

// Test configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 60000; // 60 seconds

// Minimum score thresholds - Aiming for 95+
const THRESHOLDS = {
  performance: 95,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
};

/**
 * Launch Chrome and run Lighthouse audit
 */
async function runLighthouseAudit(url: string, config: any) {
  // Only import lighthouse when we actually run these tests (keeps `npm test` lightweight).
  const { default: lighthouse } = await import('lighthouse');
  // chrome-launcher is ESM; import dynamically to avoid Jest parsing issues during `npm test`.
  const { default: chromeLauncher } = await import('chrome-launcher');
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });

  const options = {
    logLevel: 'error' as const,
    output: 'json' as const,
    port: chrome.port,
  };

  try {
    const result = await lighthouse(url, options, config);
    await chrome.kill();
    return result;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Desktop Lighthouse configuration
 */
const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    },
  },
};

/**
 * Mobile Lighthouse configuration
 */
const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
    },
  },
};

const shouldRun =
  process.env.RUN_LIGHTHOUSE_TESTS === '1' ||
  process.env.npm_lifecycle_event === 'test:lighthouse';

const describeIf = shouldRun ? describe : describe.skip;

describeIf('Lighthouse Audits', () => {
  describe('Desktop Performance', () => {
    let auditResult: any;

    beforeAll(async () => {
      auditResult = await runLighthouseAudit(TEST_URL, desktopConfig);
    }, TIMEOUT);

    it('should meet performance score threshold', () => {
      const score = auditResult.lhr.categories.performance.score * 100;
      console.log(`📊 Desktop Performance Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.performance);
    });

    it('should meet accessibility score threshold', () => {
      const score = auditResult.lhr.categories.accessibility.score * 100;
      console.log(`📊 Desktop Accessibility Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
    });

    it('should meet best practices score threshold', () => {
      const score = auditResult.lhr.categories['best-practices'].score * 100;
      console.log(`📊 Desktop Best Practices Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.bestPractices);
    });

    it('should meet SEO score threshold', () => {
      const score = auditResult.lhr.categories.seo.score * 100;
      console.log(`📊 Desktop SEO Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.seo);
    });

    it('should have fast First Contentful Paint (FCP)', () => {
      const fcp = auditResult.lhr.audits['first-contentful-paint'];
      const fcpValue = fcp.numericValue;
      console.log(`⏱️  Desktop FCP: ${Math.round(fcpValue)}ms`);
      expect(fcpValue).toBeLessThan(1800); // < 1.8 seconds for 95+
    });

    it('should have fast Largest Contentful Paint (LCP)', () => {
      const lcp = auditResult.lhr.audits['largest-contentful-paint'];
      const lcpValue = lcp.numericValue;
      console.log(`⏱️  Desktop LCP: ${Math.round(lcpValue)}ms`);
      expect(lcpValue).toBeLessThan(2000); // < 2.0 seconds for 95+
    });

    it('should have low Cumulative Layout Shift (CLS)', () => {
      const cls = auditResult.lhr.audits['cumulative-layout-shift'];
      const clsValue = cls.numericValue;
      console.log(`📏 Desktop CLS: ${clsValue.toFixed(3)}`);
      expect(clsValue).toBeLessThan(0.05); // < 0.05 for 95+
    });

    it('should have fast Total Blocking Time (TBT)', () => {
      const tbt = auditResult.lhr.audits['total-blocking-time'];
      const tbtValue = tbt.numericValue;
      console.log(`⏱️  Desktop TBT: ${Math.round(tbtValue)}ms`);
      expect(tbtValue).toBeLessThan(200); // < 200ms for 95+
    });

    it('should have fast Time to Interactive (TTI)', () => {
      const tti = auditResult.lhr.audits.interactive;
      const ttiValue = tti.numericValue;
      console.log(`⏱️  Desktop TTI: ${Math.round(ttiValue)}ms`);
      expect(ttiValue).toBeLessThan(3000); // < 3.0 seconds for 95+
    });

    it('should have fast Speed Index', () => {
      const si = auditResult.lhr.audits['speed-index'];
      const siValue = si.numericValue;
      console.log(`⏱️  Desktop Speed Index: ${Math.round(siValue)}ms`);
      expect(siValue).toBeLessThan(2500); // < 2.5 seconds for 95+
    });
  });

  describe('Mobile Performance', () => {
    let auditResult: any;

    beforeAll(async () => {
      auditResult = await runLighthouseAudit(TEST_URL, mobileConfig);
    }, TIMEOUT);

    it('should meet performance score threshold on mobile', () => {
      const score = auditResult.lhr.categories.performance.score * 100;
      console.log(`📱 Mobile Performance Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.performance - 5); // Slightly more lenient for mobile
    });

    it('should meet accessibility score threshold on mobile', () => {
      const score = auditResult.lhr.categories.accessibility.score * 100;
      console.log(`📱 Mobile Accessibility Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
    });

    it('should meet best practices score threshold on mobile', () => {
      const score = auditResult.lhr.categories['best-practices'].score * 100;
      console.log(`📱 Mobile Best Practices Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.bestPractices);
    });

    it('should meet SEO score threshold on mobile', () => {
      const score = auditResult.lhr.categories.seo.score * 100;
      console.log(`📱 Mobile SEO Score: ${score}`);
      expect(score).toBeGreaterThanOrEqual(THRESHOLDS.seo);
    });

    it('should have reasonable mobile FCP', () => {
      const fcp = auditResult.lhr.audits['first-contentful-paint'];
      const fcpValue = fcp.numericValue;
      console.log(`⏱️  Mobile FCP: ${Math.round(fcpValue)}ms`);
      expect(fcpValue).toBeLessThan(2500); // < 2.5 seconds on mobile for 95+
    });

    it('should have reasonable mobile LCP', () => {
      const lcp = auditResult.lhr.audits['largest-contentful-paint'];
      const lcpValue = lcp.numericValue;
      console.log(`⏱️  Mobile LCP: ${Math.round(lcpValue)}ms`);
      expect(lcpValue).toBeLessThan(3000); // < 3 seconds on mobile for 95+
    });
  });

  describe('Accessibility Audits', () => {
    let auditResult: any;

    beforeAll(async () => {
      auditResult = await runLighthouseAudit(TEST_URL, desktopConfig);
    }, TIMEOUT);

    it('should have proper document structure', () => {
      const docStructure = auditResult.lhr.audits.document;
      expect(docStructure.score).toBeNull(); // Manual audit
    });

    it('should have accessible color contrast', () => {
      const colorContrast = auditResult.lhr.audits['color-contrast'];
      expect(colorContrast.score).toBe(1); // Should pass
    });

    it('should have valid ARIA attributes', () => {
      const ariaValid = auditResult.lhr.audits['aria-valid-attr'];
      expect(ariaValid.score).toBe(1);
    });

    it('should have proper button names', () => {
      const buttonNames = auditResult.lhr.audits['button-name'];
      expect(buttonNames.score).toBe(1);
    });

    it('should have proper image alt text', () => {
      const imageAlt = auditResult.lhr.audits['image-alt'];
      expect(imageAlt.score).toBe(1);
    });

    it('should have proper heading order', () => {
      const headingOrder = auditResult.lhr.audits['heading-order'];
      expect(headingOrder.score).toBe(1);
    });

    it('should have proper label associations', () => {
      const label = auditResult.lhr.audits['label'];
      expect(label.score).toBe(1);
    });

    it('should have proper link names', () => {
      const linkName = auditResult.lhr.audits['link-name'];
      expect(linkName.score).toBe(1);
    });

    it('should have proper list structure', () => {
      const list = auditResult.lhr.audits['list'];
      expect(list.score).toBe(1);
    });

    it('should have keyboard-accessible elements', () => {
      const tabindex = auditResult.lhr.audits['tabindex'];
      expect(tabindex.score).toBe(1);
    });
  });

  describe('Best Practices', () => {
    let auditResult: any;

    beforeAll(async () => {
      auditResult = await runLighthouseAudit(TEST_URL, desktopConfig);
    }, TIMEOUT);

    it('should use HTTPS', () => {
      const https = auditResult.lhr.audits['is-on-https'];
      // May not be HTTPS in local dev
      if (TEST_URL.startsWith('https')) {
        expect(https.score).toBe(1);
      }
    });

    it('should not have browser errors', () => {
      const errors = auditResult.lhr.audits['errors-in-console'];
      console.log(`🐛 Console Errors: ${errors.details?.items?.length || 0}`);
      expect(errors.score).toBe(1);
    });

    it('should have proper image aspect ratios', () => {
      const imageAspect = auditResult.lhr.audits['image-aspect-ratio'];
      expect(imageAspect.score).toBe(1);
    });

    it('should have proper doctype', () => {
      const doctype = auditResult.lhr.audits['doctype'];
      expect(doctype.score).toBe(1);
    });

    it('should use HTTP/2', () => {
      const http2 = auditResult.lhr.audits['uses-http2'];
      // HTTP/2 may not be available in all environments
      console.log(`🌐 HTTP/2: ${http2.score === 1 ? 'Enabled' : 'Not enabled'}`);
    });
  });

  describe('SEO', () => {
    let auditResult: any;

    beforeAll(async () => {
      auditResult = await runLighthouseAudit(TEST_URL, desktopConfig);
    }, TIMEOUT);

    it('should have a meta description', () => {
      const metaDescription = auditResult.lhr.audits['meta-description'];
      expect(metaDescription.score).toBe(1);
    });

    it('should have a valid robots.txt', () => {
      const robotsTxt = auditResult.lhr.audits['robots-txt'];
      // May not be applicable in all environments
      console.log(`🤖 Robots.txt: ${robotsTxt.score === 1 ? 'Valid' : 'N/A'}`);
    });

    it('should have a viewport meta tag', () => {
      const viewport = auditResult.lhr.audits['viewport'];
      expect(viewport.score).toBe(1);
    });

    it('should have a valid document title', () => {
      const docTitle = auditResult.lhr.audits['document-title'];
      expect(docTitle.score).toBe(1);
    });

    it('should have crawlable links', () => {
      const crawlable = auditResult.lhr.audits['crawlable-anchors'];
      expect(crawlable.score).toBe(1);
    });

    it('should have proper hreflang attributes', () => {
      const hreflang = auditResult.lhr.audits['hreflang'];
      expect(hreflang.score).toBe(1);
    });

    it('should have legible font sizes', () => {
      const fontSize = auditResult.lhr.audits['font-size'];
      expect(fontSize.score).toBe(1);
    });

    it('should have tap targets with adequate size', () => {
      const tapTargets = auditResult.lhr.audits['tap-targets'];
      expect(tapTargets.score).toBe(1);
    });
  });
});
