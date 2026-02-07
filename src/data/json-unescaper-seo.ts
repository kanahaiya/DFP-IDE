import type { FeatureItem } from '@/types';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  number: number;
  title: string;
  description: string;
}

export interface TechnicalSpec {
  feature: string;
  specification: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  color?: string;
}

export interface ComparisonRow {
  feature: string;
  ourTool: string | boolean;
  competitorA: string | boolean;
  competitorB: string | boolean;
}

export const jsonUnescaperContent = {
  // Hero Section
  title: 'JSON String Unescaper - Free Online Unescape Tool',
  subtitle: 'Unescape JSON strings with automatic detection. Convert escape sequences back to readable text. Handle multi-layer escaping with recursive unescaping. Real-time preview with format options. 100% client-side processing.',
  description: 'Free online JSON unescaper with auto-detection and multi-layer support',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-magic', text: 'Auto-Detect' },
    { icon: 'fas fa-bolt', text: 'Instant Unescape' },
    { icon: 'fas fa-lock', text: 'Client-Side' },
    { icon: 'fas fa-layer-group', text: 'Multi-Layer' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Unescape JSON Strings Online',
  featuresSectionTitle: 'JSON Unescaper Features',
  whyChooseSectionTitle: 'Why Choose This JSON Unescaper?',
  comparisonSectionTitle: 'JSON Unescaper Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-magic',
      title: 'Automatic Escape Detection',
      description: 'Automatically detect the escape level and type of your input. The unescaper analyzes escape patterns to determine if input is single-escaped, double-escaped, or multi-layer escaped. No need to manually identify the escape type—just paste and let auto-detection handle it.'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Multi-Layer Unescaping',
      description: 'Handle deeply nested escape sequences with recursive unescaping. When JSON has been escaped multiple times (double, triple, or more), the multi-layer mode recursively removes each escape layer until the original content is restored. Configure maximum depth to control recursion.'
    },
    {
      icon: 'fas fa-quote-right',
      title: 'JSON String Parsing',
      description: 'Use JSON.parse to properly unescape JSON string literals. This mode handles all standard JSON escape sequences including \\", \\\\, \\n, \\r, \\t, \\b, \\f, and \\uXXXX Unicode escapes. The safest method for unescaping valid JSON strings.'
    },
    {
      icon: 'fas fa-align-left',
      title: 'Output Formatting',
      description: 'Automatically format the unescaped output when it is valid JSON. Enable pretty-printing with configurable indentation (2 spaces, 4 spaces, or tabs). Optionally sort object keys alphabetically for consistent, readable output.'
    },
    {
      icon: 'fas fa-sitemap',
      title: 'Escape Level Indicator',
      description: 'Real-time display of detected escape level in your input. See how many layers of escaping are present and track the unescape chain showing each transformation step. Helpful for understanding complex escape scenarios and debugging.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Output Validation',
      description: 'Automatically validate whether the unescaped result is valid JSON. See a clear indicator showing if the output can be parsed as JSON. Helps verify that unescaping was successful and the result is usable.'
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Unescape Presets',
      description: 'Apply common unescape configurations instantly with preset buttons. Presets include Auto + Format, Single Layer, Deep Unescape, JSON String, Minified Output, Sorted Keys, Tab Indentation, and Keep Quotes. Save time with optimized settings for each use case.'
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Privacy',
      description: 'Your data never leaves your browser. All unescaping happens locally using JavaScript, with no server uploads or external API calls. Perfect for unescaping sensitive strings, API responses, credentials, or proprietary content. Use confidently knowing your data remains completely private.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Escaped String',
      description: 'Paste your escaped JSON string into the editor, drag and drop a file, or click Upload. Use sample templates to test with example escaped strings.'
    },
    {
      number: 2,
      title: 'Select Unescape Mode',
      description: 'Choose your mode: Auto Detect (recommended), JSON String, Single Layer, or Multi-Layer. Auto mode handles most cases automatically.'
    },
    {
      number: 3,
      title: 'Configure Options',
      description: 'Enable output formatting, choose indentation, and configure options like sort keys or max depth. Or use a preset for instant configuration.'
    },
    {
      number: 4,
      title: 'Review Unescape Results',
      description: 'View the unescaped result in real-time. Check the detected escape level, unescape chain, and whether output is valid JSON.'
    },
    {
      number: 5,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard for quick use, or Download to save as a JSON file. Use our <a href="/json-escaper">JSON Escaper</a> to reverse the process.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON string unescaping?',
      answer: 'JSON string unescaping converts escape sequences back to their original characters. For example, \\" becomes ", \\\\ becomes \\, \\n becomes a newline, and \\uXXXX becomes the corresponding Unicode character. It reverses the escaping process to restore readable content.'
    },
    {
      question: 'What escape sequences does this handle?',
      answer: 'The unescaper handles all standard JSON escape sequences: \\" (quote), \\\\ (backslash), \\/ (forward slash), \\n (newline), \\r (carriage return), \\t (tab), \\b (backspace), \\f (form feed), and \\uXXXX (Unicode code points). It also handles double and triple escaped variants.'
    },
    {
      question: 'What is multi-layer escaping?',
      answer: 'Multi-layer escaping occurs when a string is escaped multiple times. For example, a quote might become \\" after first escape, \\\\\\" after second escape, and \\\\\\\\\\" after third escape. This often happens when JSON is serialized multiple times or passes through multiple systems.'
    },
    {
      question: 'When should I use Auto mode vs Single Layer?',
      answer: 'Use Auto mode (recommended) for most cases—it detects the escape level and applies the right number of unescape operations. Use Single Layer when you specifically want to remove only one level of escaping, even if more layers exist. Single Layer gives you precise control.'
    },
    {
      question: 'What does the escape level indicator show?',
      answer: 'The escape level indicator shows how many layers of escaping were detected in your input. Level 1 means single escaped, level 2 means double escaped, etc. This helps you understand how your input was escaped and verify the unescaping result.'
    },
    {
      question: 'How does JSON String mode differ from unescape?',
      answer: 'JSON String mode uses JSON.parse() to unescape the input as a JSON string literal. It expects the input to be a valid quoted JSON string like "hello\\nworld". Regular unescape mode handles escape sequences without requiring valid JSON string wrapper format.'
    },
    {
      question: 'What is the max depth setting?',
      answer: 'Max depth limits how many layers of escaping to remove in Auto or Multi-Layer mode. Default is 10, which handles most real-world cases. Lower values give you control when you only want to remove a specific number of escape layers from deeply nested content.'
    },
    {
      question: 'Should I enable "Remove Outer Quotes"?',
      answer: 'Enable "Remove Outer Quotes" (default) to strip surrounding quotation marks from the input before unescaping. Disable it if your escaped content should keep its outer quotes—for example, if you need the output to remain a quoted string.'
    },
    {
      question: 'What does "Sort Keys" do?',
      answer: 'When "Sort Keys" is enabled and the output is valid JSON, object keys are sorted alphabetically. This produces consistent, reproducible output regardless of original key order. Useful for comparing JSON or ensuring deterministic results.'
    },
    {
      question: 'Why is my output not valid JSON?',
      answer: 'The output may not be valid JSON if: the original content was plain text (not JSON), the escaping was incomplete or malformed, or more unescape layers are needed. The tool shows a "Valid JSON" indicator so you can verify the result.'
    },
    {
      question: 'Is my data secure when using this unescaper?',
      answer: 'Yes, absolutely. All unescaping happens 100% client-side in your browser using JavaScript. Your data is never uploaded to any server, never transmitted over the network, and never stored anywhere. This makes it safe to unescape sensitive content including API keys and passwords.'
    },
    {
      question: 'How do I escape strings again?',
      answer: 'Use our companion JSON Escaper tool to escape strings. It supports Standard JSON, JavaScript, URL-Safe, and HTML-Safe escape modes. Simply paste your unescaped content and choose the escape mode appropriate for your use case.'
    },
    {
      question: 'Can I unescape URL-encoded or Base64 strings?',
      answer: 'This tool is specifically for JSON escape sequences (\\", \\n, \\uXXXX, etc.). For URL decoding or Base64 decoding, use our JSON Decoder tool which supports multiple encoding formats with auto-detection.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Unescape Modes', specification: 'Auto Detect, JSON String, Single Layer, Multi-Layer' },
    { feature: 'Max Escape Depth', specification: 'Up to 10 layers (configurable)' },
    { feature: 'Unicode Support', specification: 'Full UTF-8 including emoji and surrogate pairs' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest versions)' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'API Response Debugging',
      description: 'Unescape JSON strings from API responses that were over-escaped during serialization to view the actual content.',
      icon: 'fas fa-bug'
    },
    {
      title: 'Log File Analysis',
      description: 'Convert escaped strings in log files back to readable format for debugging and analysis.',
      icon: 'fas fa-file-alt'
    },
    {
      title: 'Database Content Recovery',
      description: 'Restore multi-escaped JSON data retrieved from databases that applied extra escape layers.',
      icon: 'fas fa-database'
    },
    {
      title: 'JSON String Parsing',
      description: 'Extract and unescape embedded JSON strings stored as escaped values within other JSON documents.',
      icon: 'fas fa-code'
    },
    {
      title: 'Webhook Payload Processing',
      description: 'Unescape JSON payloads from webhooks that may have been double-escaped during transmission.',
      icon: 'fas fa-exchange-alt'
    },
    {
      title: 'Configuration Extraction',
      description: 'Recover readable configuration from escaped strings in environment variables or config files.',
      icon: 'fas fa-cog'
    },
  ],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Automatic Escape Level Detection',
      description: 'Automatically detects single, double, or multi-layer escaping. No manual guessing required—paste your escaped string and the tool figures out how to unescape it correctly.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'Multi-Layer Recursive Unescaping',
      description: 'Handle deeply nested escape sequences with configurable max depth. Perfect for recovering content that was escaped multiple times by different systems.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON unescaper with no registration, no limits, no ads. Start unescaping immediately without creating an account. Unlimited use with no hidden costs.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Complete Privacy with Client-Side Processing',
      description: 'All unescaping happens in your browser—zero server uploads. Safely unescape API responses, credentials, and sensitive strings. Works offline after page loads.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Intelligent Output Formatting',
      description: 'Automatically format valid JSON output with configurable indentation. Sort keys alphabetically for consistent results. See clear validation of output.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Real-Time Preview with Unescape Chain',
      description: 'See unescaped output instantly as you type. Track the unescape chain showing each transformation step. View input/output statistics and escape level.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'FreeFormatter.com',
    competitorBName: 'Codebeautify.org',
    rows: [
      {
        feature: 'Auto Escape Detection',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Multi-Layer Unescape',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Escape Level Display',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Output Formatting',
        ourTool: true,
        competitorA: true,
        competitorB: true,
      },
      {
        feature: 'Unescape Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Real-Time Preview',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Client-Side Only',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Free & No Ads',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
    ] as ComparisonRow[],
  },
  
  // Related Tools
  relatedTools: [
    {
      title: 'JSON Escaper',
      description: 'Escape JSON strings for JavaScript, HTML, URLs, and more',
      icon: 'fas fa-shield-alt',
      link: '/json-escaper'
    },
    {
      title: 'JSON Decoder',
      description: 'Decode URL, Base64, Hex encoded JSON with auto-detection',
      icon: 'fas fa-unlock-alt',
      link: '/json-decoder'
    },
    {
      title: 'JSON Encoder',
      description: 'Encode JSON to URL, Base64, Hex, and other formats',
      icon: 'fas fa-lock',
      link: '/json-encoder'
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML with Kubernetes presets',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml'
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents with visual side-by-side diff',
      icon: 'fas fa-not-equal',
      link: '/json-diff'
    },
    {
      title: 'CSV to JSON',
      description: 'Transform CSV files to JSON with smart type detection',
      icon: 'fas fa-table',
      link: '/csv-to-json'
    },
  ] as RelatedTool[],
};
