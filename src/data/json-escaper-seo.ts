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

export const jsonEscaperContent = {
  // Hero Section
  title: 'JSON String Escaper - Free Online Escape Tool',
  subtitle: 'Escape JSON strings for JavaScript, HTML, URLs, and more. Properly escape quotes, backslashes, newlines, and special characters. Real-time preview with multiple escape modes. 100% client-side processing.',
  description: 'Free online JSON escaper for JavaScript, HTML, URL, and Unicode escape sequences',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Multiple Modes' },
    { icon: 'fas fa-bolt', text: 'Instant Escape' },
    { icon: 'fas fa-lock', text: 'Client-Side' },
    { icon: 'fas fa-sliders-h', text: 'Customizable' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Escape JSON Strings Online',
  featuresSectionTitle: 'JSON Escaper Features',
  whyChooseSectionTitle: 'Why Choose This JSON Escaper?',
  comparisonSectionTitle: 'JSON Escaper Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-shield-alt',
      title: 'Standard JSON Escaping (RFC 8259)',
      description: 'Properly escape all JSON special characters per RFC 8259 specification. Handles double quotes, backslashes, newlines, tabs, carriage returns, and control characters. Creates valid JSON strings that can be safely embedded in JSON documents or parsed by any JSON parser.'
    },
    {
      icon: 'fab fa-js',
      title: 'JavaScript String Escaping',
      description: 'Escape for safe embedding in JavaScript code. Handles single quotes, backticks, and dollar signs in addition to standard JSON escapes. Perfect for template literals, string concatenation, and dynamically generated JavaScript code. Prevents syntax errors and injection vulnerabilities.'
    },
    {
      icon: 'fas fa-link',
      title: 'URL-Safe Escaping',
      description: 'Encode strings for safe use in URL query parameters. Uses encodeURIComponent to properly escape all special characters including brackets, quotes, and spaces. Creates strings that can be safely passed in GET requests, API endpoints, and form submissions.'
    },
    {
      icon: 'fas fa-code',
      title: 'HTML-Safe Escaping',
      description: 'Escape for safe embedding in HTML attributes and content. Converts <, >, &, quotes, and apostrophes to HTML entities. Prevents XSS (Cross-Site Scripting) attacks when embedding JSON data in web pages. Essential for web security and sanitization.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Unicode Escape Sequences',
      description: 'Convert non-ASCII characters to \\uXXXX format for maximum compatibility. Ensures output contains only ASCII characters (0-127), useful for legacy systems, ASCII-only protocols, and debugging character encoding issues. Handles surrogate pairs for characters outside the Basic Multilingual Plane.'
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Escape Presets',
      description: 'Apply common escape configurations instantly with preset buttons. Presets include Standard JSON, Minified String, JavaScript String, URL Query, HTML Attribute, ASCII Only, Readable Format, and No Outer Quotes. Save time with optimized settings for each use case.'
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Flexible Output Options',
      description: 'Customize escape behavior with multiple options. Choose whether to wrap output in quotes, escape forward slashes, enable Unicode escaping, or preprocess JSON (minify or format). Indentation settings for formatted output. Control every aspect of the escape process.'
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Privacy',
      description: 'Your data never leaves your browser. All escaping happens locally using JavaScript, with no server uploads or external API calls. Perfect for escaping sensitive strings, API keys, credentials, or proprietary content. Use confidently knowing your data remains completely private.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Enter Your Text',
      description: 'Paste your JSON or text string into the editor, drag and drop a file, or click Upload to select a file. Use sample templates for quick testing.'
    },
    {
      number: 2,
      title: 'Select Escape Mode',
      description: 'Choose your escape mode: Standard JSON, JavaScript String, URL-Safe, or HTML-Safe. Each mode is optimized for specific use cases.'
    },
    {
      number: 3,
      title: 'Customize Options',
      description: 'Fine-tune escape options like quoting, slash escaping, Unicode handling, and preprocessing. Or use a preset for instant configuration.'
    },
    {
      number: 4,
      title: 'Preview Escaped Output',
      description: 'View the escaped result in real-time. Check the statistics showing input and output sizes and number of escaped characters.'
    },
    {
      number: 5,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard for quick use, or Download to save as a text file. Use our <a href="/json-unescaper">JSON Unescaper</a> to reverse the process.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON string escaping?',
      answer: 'JSON string escaping converts special characters into escape sequences that are safe for JSON format. Characters like quotes ("), backslashes (\\), and newlines must be escaped with backslash prefix (\", \\\\, \\n) to be valid in JSON strings. This prevents parsing errors and ensures data integrity.'
    },
    {
      question: 'Which characters must be escaped in JSON?',
      answer: 'In JSON, you must escape: double quotes (\"), backslashes (\\\\), and control characters like newline (\\n), tab (\\t), carriage return (\\r), backspace (\\b), and form feed (\\f). Forward slashes can optionally be escaped as \\/. Non-ASCII characters can be escaped as \\uXXXX.'
    },
    {
      question: 'When should I use JavaScript string escaping?',
      answer: 'Use JavaScript string escaping when embedding JSON or strings in JavaScript code. This mode escapes single quotes (\\\'), backticks (\\`), and dollar signs (\\$) in addition to standard JSON escapes. Essential for template literals, eval(), and dynamically generated JavaScript.'
    },
    {
      question: 'What is URL-safe escaping?',
      answer: 'URL-safe escaping converts strings to be safely included in URLs. Special characters like spaces, quotes, brackets, and ampersands are converted to percent-encoded format (%20, %22, %5B, %26). Use this when passing JSON or strings as URL query parameters.'
    },
    {
      question: 'How does HTML-safe escaping prevent XSS?',
      answer: 'HTML-safe escaping converts characters that have special meaning in HTML (<, >, &, \", \\\') into HTML entities (&lt;, &gt;, &amp;, &quot;, &#39;). This prevents browsers from interpreting escaped content as HTML tags or JavaScript, blocking cross-site scripting attacks.'
    },
    {
      question: 'What is Unicode escaping (\\uXXXX)?',
      answer: 'Unicode escaping converts characters to their hexadecimal code point representation (\\u followed by 4 hex digits). For example, é becomes \\u00e9. This ensures JSON contains only ASCII characters, useful for systems without UTF-8 support or for debugging encoding issues.'
    },
    {
      question: 'Should I escape forward slashes (/)?',
      answer: 'Forward slash escaping (\\/) is optional in JSON. Enable it when embedding JSON in HTML <script> tags to prevent </script> from being interpreted as a closing tag. For other uses, leaving slashes unescaped is fine and produces shorter output.'
    },
    {
      question: 'What is the difference between escape and encode?',
      answer: 'Escaping adds backslash prefixes to special characters within a string (\\n, \\\"). Encoding transforms the entire string to a different format (Base64, URL-encoding). Use escaping for JSON string literals, encoding for data transmission. They serve different purposes but are sometimes combined.'
    },
    {
      question: 'Should I wrap output in quotes?',
      answer: 'Enable "Wrap in Quotes" if you need a complete JSON string literal including the surrounding double quotes. Disable it if you only need the escaped content (for example, to paste inside existing quotes). URL-safe mode never includes outer quotes.'
    },
    {
      question: 'What is the "Minified" output format?',
      answer: 'The Minified format removes all unnecessary whitespace from JSON before escaping. This produces smaller output, which is especially useful for URL parameters with length limits. Use "Formatted" instead if you need to preserve readability of the JSON structure.'
    },
    {
      question: 'Is my data secure when using this escaper?',
      answer: 'Yes, absolutely. All escaping happens 100% client-side in your browser using JavaScript. Your data is never uploaded to any server, never transmitted over the network, and never stored anywhere. This makes it safe to escape sensitive content including API keys and passwords.'
    },
    {
      question: 'How do I reverse the escaping?',
      answer: 'Use our companion JSON Unescaper tool to reverse escape sequences. It supports auto-detection of escape level and can handle multi-layer escaping where strings were escaped multiple times. Simply paste the escaped string and it will restore the original content.'
    },
    {
      question: 'Can I escape non-JSON text?',
      answer: 'Yes, the escaper accepts any text input, not just JSON. While JSON-specific features like minification work best with valid JSON, the escape functions work on any string. This is useful for escaping plain text, code snippets, or other content for embedding.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Escape Modes', specification: 'Standard JSON, JavaScript, URL-Safe, HTML-Safe' },
    { feature: 'Unicode Support', specification: 'Full UTF-8 including emoji and surrogate pairs' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Output Formats', specification: 'Escaped string, downloadable .txt file' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest versions)' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'JSON String Literals',
      description: 'Create valid JSON strings with properly escaped quotes, backslashes, and control characters for storage and API payloads.',
      icon: 'fas fa-code'
    },
    {
      title: 'JavaScript Embedding',
      description: 'Safely embed strings in JavaScript code, template literals, and dynamically generated scripts without syntax errors.',
      icon: 'fab fa-js'
    },
    {
      title: 'URL Query Parameters',
      description: 'Encode strings for safe inclusion in URLs, API endpoints, and form submissions with proper percent-encoding.',
      icon: 'fas fa-link'
    },
    {
      title: 'HTML Data Attributes',
      description: 'Prevent XSS attacks by properly escaping JSON data before embedding in HTML attributes or content.',
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'Cross-Platform Data',
      description: 'Use Unicode escaping to ensure strings contain only ASCII characters for legacy system compatibility.',
      icon: 'fas fa-server'
    },
    {
      title: 'Log Message Formatting',
      description: 'Escape special characters in log messages to prevent log injection and ensure proper parsing.',
      icon: 'fas fa-file-alt'
    },
  ],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Multiple Escape Modes in One Tool',
      description: 'Support for 4 escape modes: Standard JSON, JavaScript String, URL-Safe, and HTML-Safe. Switch between modes instantly without using multiple tools. Each mode handles specific character sets.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'One-Click Presets for Common Use Cases',
      description: 'Pre-configured presets for Standard, Minified, JavaScript, URL Query, HTML Attribute, ASCII Only, Readable, and No Quotes. Apply optimized settings instantly without manual configuration.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON escaper with no registration, no limits, no ads. Start escaping immediately without creating an account. Unlimited use with no hidden costs.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Complete Privacy with Client-Side Processing',
      description: 'All escaping happens in your browser—zero server uploads. Safely escape API keys, credentials, and sensitive strings. Works offline after page loads.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Flexible Output Options',
      description: 'Control quote wrapping, slash escaping, Unicode handling, and preprocessing. Choose minified or formatted output. Customize indentation for readable results.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Real-Time Preview with Statistics',
      description: 'See escaped output instantly as you type. View input/output size comparison and count of escaped characters. Handle files up to 10MB with responsive performance.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'FreeFormatter.com',
    competitorBName: 'Codebeautify.org',
    rows: [
      {
        feature: 'Multiple Escape Modes',
        ourTool: '4 modes',
        competitorA: '1 mode',
        competitorB: '1 mode',
      },
      {
        feature: 'JavaScript + URL + HTML',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Escape Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Unicode Escaping',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Real-Time Preview',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Escape Statistics',
        ourTool: true,
        competitorA: false,
        competitorB: false,
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
      title: 'JSON Unescaper',
      description: 'Unescape JSON strings with auto-detection and multi-layer support',
      icon: 'fas fa-unlock',
      link: '/json-unescaper'
    },
    {
      title: 'JSON Encoder',
      description: 'Encode JSON to URL, Base64, Hex, and other formats',
      icon: 'fas fa-lock',
      link: '/json-encoder'
    },
    {
      title: 'JSON Decoder',
      description: 'Decode URL, Base64, Hex encoded JSON with auto-detection',
      icon: 'fas fa-unlock-alt',
      link: '/json-decoder'
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
