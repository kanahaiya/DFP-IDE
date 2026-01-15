/**
 * SEO content for JSON Diff tool
 */

import type { FeatureItem } from '@/types';

import type {
  ComparisonRow,
  EducationalSection,
  FAQItem,
  HowToStep,
  RelatedTool,
  TechnicalSpec,
  UseCase,
  WhyChooseItem,
} from '@/data/json-to-openapi-seo';

type TrustBadge = { icon: string; text: string };

// Reuse the shared types (keeps SEOContent props consistent)
export const jsonDiffContent = {
  // Meta
  title: 'JSON Diff - Compare JSON Documents Online',
  subtitle:
    'Compare two JSON documents side-by-side with precise change detection. Visual highlighting, multiple views (Split / Unified / Tree / Report), smart array matching, and export formats like JSON Patch and Unified Diff. 100% client-side.',
  description:
    'Professional JSON diff and comparison tool. Compare two JSON documents side-by-side with visual highlighting, tree view, and detailed change reports. Export results in multiple formats.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-bolt', text: 'Fast Diff' },
    { icon: 'fas fa-eye', text: 'Multiple Views' },
    { icon: 'fas fa-file-export', text: 'Export' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Compare JSON with JSON Diff (Step-by-Step)',
  featuresSectionTitle: 'JSON Diff Tool Features',
  whyChooseSectionTitle: 'Why Use This JSON Diff Tool?',
  comparisonSectionTitle: 'JSON Diff Tool Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-columns',
      title: 'Split View JSON Comparison with Line-Level Highlighting',
      description:
        'Compare JSON documents side-by-side with synchronized scrolling, line-level change highlighting, and clear added/removed/modified markers. Great for API response diffs, config changes, and data audits.',
    },
    {
      icon: 'fas fa-align-left',
      title: 'Unified Diff View for Quick Reviews',
      description:
        'Switch to Unified view to scan changes quickly in a single stream with +/- style output. Ideal when you want a fast “what changed?” read without context switching between panes.',
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Tree View & Report View for Large JSON Files',
      description:
        'Use Tree View to explore changes hierarchically, or Report View to see a structured list with stats. This makes big documents easier to review than plain text diffs.',
    },
    {
      icon: 'fas fa-magic',
      title: 'Smart Array Matching (Identifier / LCS / Index)',
      description:
        'Arrays are the hardest part of JSON diffs. Choose an array strategy that fits your data: identifier-based matching for arrays of objects, LCS for semantic sequences, or index-based for positional arrays.',
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Powerful Ignore Options (Case / Whitespace / Order)',
      description:
        'Tune comparisons for real-world data: ignore key/value case, ignore whitespace differences, ignore key order, ignore array order, and enable structure-only mode when values are noisy.',
    },
    {
      icon: 'fas fa-search',
      title: 'Change Navigation + Filtering',
      description:
        'Jump through changes efficiently with next/prev controls and filters (added/removed/modified/type-changed/moved). Great for large diffs where you need focus.',
    },
    {
      icon: 'fas fa-file-export',
      title: 'Export JSON Diff Results in Multiple Formats',
      description:
        'Export results as JSON Patch (RFC 6902), Unified Diff, HTML report, CSV summaries, and more—useful for code reviews, tickets, audit trails, and automation pipelines.',
    },
    {
      icon: 'fas fa-lock',
      title: 'Private: 100% Client-Side JSON Diff',
      description:
        'Your JSON stays in your browser. No uploads, no server processing. Use it confidently for sensitive configs and production API responses.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload the Two JSON Documents',
      description:
        'Paste JSON into the left and right editors or upload `.json`, `.yaml`, `.yml`, or `.txt` files. The tool validates as you type and shows errors with line/column pointers.',
    },
    {
      number: 2,
      title: 'Choose the Best Array Matching Strategy',
      description:
        'For arrays of objects (users, items, records), use identifier-based matching (e.g., `id`, `uuid`, `key`). For general sequences, try LCS. Use index-based if ordering is meaningful.',
    },
    {
      number: 3,
      title: 'Adjust Ignore & Advanced Options',
      description:
        'Enable ignore rules like key/value case, whitespace, key order, and array order. Use structure-only mode when values are noisy but shape changes matter.',
    },
    {
      number: 4,
      title: 'Review Changes in the Best View Mode',
      description:
        'Use Split view for side-by-side inspection, Unified view for quick scans, Tree view for hierarchical browsing, and Report view for a readable list + stats.',
    },
    {
      number: 5,
      title: 'Export or Share the Diff Output',
      description:
        'Export as JSON Patch / Unified Diff / HTML report depending on your workflow. If you also need format conversion, try <a href="/json-to-yaml" style="color:var(--primary);text-decoration:underline">JSON to YAML</a> or <a href="/json-to-openapi" style="color:var(--primary);text-decoration:underline">JSON to OpenAPI</a>.',
    },
  ] as HowToStep[],

  // Educational Content
  educationalContent: [
    {
      title: 'What is a JSON Diff?',
      content:
        'A JSON diff compares two JSON documents and reports what changed (added keys, removed keys, modified values, type changes, and moved array items). Unlike plain text diffs, a JSON-aware diff understands objects and arrays so the output is more meaningful for API responses and configuration files.',
      type: 'info',
    },
    {
      title: 'Why Array Matching Matters (and Why Diffs Often Look “Wrong”)',
      content:
        'If arrays contain objects, comparing by index often produces noisy diffs when items are inserted or reordered. Identifier-based matching reduces noise by pairing items using stable fields like `id` or `uuid`. LCS is a good general approach when no stable identifiers exist.',
      type: 'tip',
    },
    {
      title: 'When to Use Ignore Options',
      content:
        'Ignore rules are essential for real-world data where ordering and case are not meaningful. For example, ignore key order in configs, ignore whitespace in text fields, or enable structure-only mode when values are volatile (timestamps, request IDs) but shape changes are important.',
      type: 'warning',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      title: 'API Response Regression Checks',
      description:
        'Compare JSON responses before and after backend changes to ensure contract compatibility and catch breaking changes early.',
      icon: 'fas fa-exchange-alt',
    },
    {
      title: 'Config / Feature Flag Auditing',
      description:
        'Track changes across environment configs and feature flags. Ignore key order and focus on meaningful value diffs.',
      icon: 'fas fa-clipboard-check',
    },
    {
      title: 'Data Migration Validation',
      description:
        'Verify that migrations preserve records correctly by diffing representative JSON snapshots and focusing on structural differences.',
      icon: 'fas fa-database',
    },
    {
      title: 'Code Review Support',
      description:
        'Export a clean diff report for PR reviews and incident writeups, especially when the raw JSON is large and hard to scan.',
      icon: 'fas fa-code-branch',
    },
    {
      title: 'Third-Party Integration Debugging',
      description:
        'Compare vendor payloads and your expected schema to quickly spot missing fields, type changes, or unexpected nesting.',
      icon: 'fas fa-plug',
    },
    {
      title: 'Test Fixture Maintenance',
      description:
        'Diff old vs new fixtures when updating tests. Use filters to focus only on modified paths that matter to the suite.',
      icon: 'fas fa-vial',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Less Noise, More Signal',
      description:
        'Filtering, array strategies, and ignore options help you get diffs that reflect real changes instead of formatting noise.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
    {
      title: 'Multiple Views for Different Tasks',
      description:
        'Use split/unified for review, tree/report for exploration. One tool that fits many workflows.',
      color: 'rgba(63, 185, 80, 0.12)',
    },
    {
      title: 'Fast, In-Browser Processing',
      description:
        'No server round trips—instant updates and private processing.',
      color: 'rgba(163, 113, 247, 0.12)',
    },
    {
      title: 'Export Formats for Real Work',
      description:
        'Generate JSON Patch, unified diffs, and reports you can paste into tickets, PRs, or docs.',
      color: 'rgba(210, 153, 34, 0.12)',
    },
    {
      title: 'Built for Real JSON',
      description:
        'Handles nested objects, arrays, type changes, and path-level targeting with useful navigation.',
      color: 'rgba(139, 148, 158, 0.12)',
    },
    {
      title: 'No Signup, No Uploads',
      description:
        'Use it instantly—even with sensitive data.',
      color: 'rgba(248, 81, 73, 0.10)',
    },
  ] as WhyChooseItem[],

  // Technical Specs
  technicalSpecs: [
    { feature: 'Diff categories', specification: 'Added, Removed, Modified, Type Changed, Moved' },
    { feature: 'Views', specification: 'Split, Unified, Tree, Report' },
    { feature: 'Array strategies', specification: 'Identifier-based, LCS, Index-based' },
    { feature: 'Ignore options', specification: 'Case (key/value), whitespace, key order, array order' },
    { feature: 'Exports', specification: 'JSON Patch, Unified Diff, HTML report, CSV' },
    { feature: 'Processing', specification: 'Client-side only (no uploads)' },
  ] as TechnicalSpec[],

  // Comparison Table (high-level, non-competitive claims)
  comparison: [
    { feature: 'Client-side privacy', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Tree + report views', ourTool: true, competitorA: false, competitorB: true },
    { feature: 'Smart array matching', ourTool: true, competitorA: false, competitorB: false },
    { feature: 'JSON Patch export', ourTool: true, competitorA: true, competitorB: false },
    { feature: 'Unified diff export', ourTool: true, competitorA: false, competitorB: true },
  ] as ComparisonRow[],

  // Related Tools (existing routes only)
  relatedTools: [
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML for configs and Kubernetes manifests.',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON to OpenAPI',
      description: 'Generate OpenAPI specs from JSON examples.',
      icon: 'fas fa-file-invoice',
      link: '/json-to-openapi',
    },
    {
      title: 'CSV to JSON',
      description: 'Convert CSV files to JSON with formatting options.',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
  ] as RelatedTool[],

  // FAQs
  faqs: [
    {
      question: 'What is JSON diff used for?',
      answer:
        'JSON diff is used to compare two JSON documents and highlight what changed. It is commonly used for API response regression checks, configuration audits, and data migration validation.',
    },
    {
      question: 'How is JSON diff different from a normal text diff?',
      answer:
        'A text diff compares raw characters/lines. A JSON-aware diff understands objects and arrays, producing more meaningful changes (like “field added” or “type changed”) instead of noisy line edits.',
    },
    {
      question: 'How should I compare arrays of objects?',
      answer:
        'Use identifier-based matching when array items have stable keys (like `id` or `uuid`). This reduces noise when items move or when new items are inserted.',
    },
    {
      question: 'What export formats are supported?',
      answer:
        'You can export comparison results as JSON Patch (RFC 6902), Unified Diff, HTML report, CSV, and other formats depending on the view mode.',
    },
    {
      question: 'Is my data uploaded to a server?',
      answer:
        'No. Comparison happens client-side in your browser so your JSON doesn’t get uploaded.',
    },
    {
      question: 'Can I compare JSON and YAML together?',
      answer:
        'Yes—both editors accept `.json`, `.yaml`, and `.yml` content. The tool will still compute and visualize differences.',
    },
  ] as FAQItem[],

  keywords: [
    'json diff',
    'json compare',
    'compare json online',
    'json patch',
    'unified diff',
    'api response diff',
    'config diff',
    'json change report',
  ],
};
