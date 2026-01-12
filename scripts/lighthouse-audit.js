#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

/**
 * Lighthouse Performance Audit Script
 * 
 * Runs Lighthouse audits on the application and generates reports
 * 
 * Usage:
 *   node scripts/lighthouse-audit.js [url]
 *   
 * Default URL: http://localhost:3000
 */

// Configuration
const DEFAULT_URL = 'http://localhost:3000';
const THRESHOLDS = {
  performance: 95,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
  pwa: 80,
};

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

const MOBILE_CONFIG = {
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

/**
 * Launch Chrome and run Lighthouse
 */
async function runLighthouse(url, config) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Extract scores from Lighthouse result
 */
function extractScores(result) {
  const { categories } = result.lhr;
  
  return {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    bestPractices: Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100),
    pwa: categories.pwa ? Math.round(categories.pwa.score * 100) : 0,
  };
}

/**
 * Check if scores meet thresholds
 */
function checkThresholds(scores) {
  const failures = [];
  
  Object.keys(THRESHOLDS).forEach((category) => {
    if (scores[category] < THRESHOLDS[category]) {
      failures.push({
        category,
        score: scores[category],
        threshold: THRESHOLDS[category],
        diff: scores[category] - THRESHOLDS[category],
      });
    }
  });
  
  return failures;
}

/**
 * Format score with color
 */
function formatScore(score, threshold) {
  const diff = score - threshold;
  let color = '\x1b[32m'; // Green
  
  if (score < threshold) {
    color = '\x1b[31m'; // Red
  } else if (diff < 5) {
    color = '\x1b[33m'; // Yellow
  }
  
  return `${color}${score}\x1b[0m`;
}

/**
 * Print results
 */
function printResults(scores, formFactor) {
  console.log(`\n📊 Lighthouse Audit Results (${formFactor})\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Performance:     ${formatScore(scores.performance, THRESHOLDS.performance)} / ${THRESHOLDS.performance}`);
  console.log(`Accessibility:   ${formatScore(scores.accessibility, THRESHOLDS.accessibility)} / ${THRESHOLDS.accessibility}`);
  console.log(`Best Practices:  ${formatScore(scores.bestPractices, THRESHOLDS.bestPractices)} / ${THRESHOLDS.bestPractices}`);
  console.log(`SEO:             ${formatScore(scores.seo, THRESHOLDS.seo)} / ${THRESHOLDS.seo}`);
  
  if (formFactor === 'Desktop') {
    console.log(`PWA:             ${formatScore(scores.pwa, THRESHOLDS.pwa)} / ${THRESHOLDS.pwa}`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Save HTML report
 */
function saveReport(result, formFactor) {
  const reportsDir = path.join(__dirname, '../lighthouse-reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `lighthouse-${formFactor.toLowerCase()}-${timestamp}.html`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, result.report);
  
  console.log(`📄 Report saved: ${filepath}\n`);
  
  return filepath;
}

/**
 * Save JSON results for CI/CD
 */
function saveJSON(scores, formFactor) {
  const resultsDir = path.join(__dirname, '../lighthouse-reports');
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const filename = `lighthouse-${formFactor.toLowerCase()}-latest.json`;
  const filepath = path.join(resultsDir, filename);
  
  const data = {
    timestamp: new Date().toISOString(),
    formFactor,
    scores,
    thresholds: THRESHOLDS,
    passed: checkThresholds(scores).length === 0,
  };
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  
  return filepath;
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  
  console.log(`\n🚀 Starting Lighthouse Audit for ${url}\n`);
  
  try {
    // Desktop audit
    console.log('Running desktop audit...');
    const desktopResult = await runLighthouse(url, LIGHTHOUSE_CONFIG);
    const desktopScores = extractScores(desktopResult);
    
    printResults(desktopScores, 'Desktop');
    saveReport(desktopResult, 'desktop');
    saveJSON(desktopScores, 'desktop');
    
    const desktopFailures = checkThresholds(desktopScores);
    
    // Mobile audit
    console.log('Running mobile audit...');
    const mobileResult = await runLighthouse(url, MOBILE_CONFIG);
    const mobileScores = extractScores(mobileResult);
    
    printResults(mobileScores, 'Mobile');
    saveReport(mobileResult, 'mobile');
    saveJSON(mobileScores, 'mobile');
    
    const mobileFailures = checkThresholds(mobileScores);
    
    // Summary
    console.log('\n📈 Summary\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (desktopFailures.length === 0 && mobileFailures.length === 0) {
      console.log('✅ All audits passed!\n');
      process.exit(0);
    } else {
      console.log('❌ Some audits failed:\n');
      
      if (desktopFailures.length > 0) {
        console.log('Desktop Failures:');
        desktopFailures.forEach((failure) => {
          console.log(`  • ${failure.category}: ${failure.score} (expected: ${failure.threshold}, diff: ${failure.diff})`);
        });
        console.log('');
      }
      
      if (mobileFailures.length > 0) {
        console.log('Mobile Failures:');
        mobileFailures.forEach((failure) => {
          console.log(`  • ${failure.category}: ${failure.score} (expected: ${failure.threshold}, diff: ${failure.diff})`);
        });
        console.log('');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Exit with error code in CI
      if (process.env.CI) {
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runLighthouse, extractScores, checkThresholds };
