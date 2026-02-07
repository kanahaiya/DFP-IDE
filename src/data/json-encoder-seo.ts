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

export const jsonEncoderContent = {
  // Hero Section
  title: 'JSON Encoder - Free Online URL, Base64, Hex Encoding Tool',
  subtitle: 'Encode JSON data to URL-encoded, Base64, hexadecimal, HTML entities, and Unicode escape formats. Real-time encoding with customizable options. 100% client-side processing, no data upload required.',
  description: 'Free online JSON encoder for URL, Base64, Hex, HTML entity, and Unicode encoding',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-lock', text: 'Multiple Formats' },
    { icon: 'fas fa-bolt', text: 'Instant Encode' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-sliders-h', text: 'Customizable' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Encode JSON Online',
  featuresSectionTitle: 'JSON Encoder Features',
  whyChooseSectionTitle: 'Why Choose This JSON Encoder?',
  comparisonSectionTitle: 'JSON Encoder Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-lock',
      title: 'URL Encoding for Query Parameters',
      description: 'Encode JSON for safe use in URL query strings and form data. Our URL encoder uses encodeURIComponent to properly escape all special characters including brackets, quotes, colons, and spaces. Choose between standard %20 encoding or form-style + encoding for spaces. Perfect for passing JSON data in GET requests, building API URLs, and form submissions.'
    },
    {
      icon: 'fas fa-key',
      title: 'Base64 Encoding with URL-Safe Variant',
      description: 'Convert JSON to Base64 for data URIs, JWT tokens, and basic authentication. Support for both standard Base64 (using +/) and URL-safe Base64 (using -_). Optional padding control lets you include or exclude trailing = characters. Handles UTF-8 characters correctly, making it perfect for internationalized JSON data.'
    },
    {
      icon: 'fas fa-hashtag',
      title: 'Hexadecimal Byte Encoding',
      description: 'Transform JSON into hexadecimal representation for debugging, binary protocols, and low-level data inspection. Customize output with uppercase or lowercase digits, optional prefixes (0x or \\x), and delimiters (space or colon). Ideal for network debugging, binary format analysis, and creating escape sequences.'
    },
    {
      icon: 'fas fa-code',
      title: 'HTML Entity & Unicode Escape',
      description: 'Safely encode JSON for HTML embedding with numeric HTML entities (&#XXX;) or convert non-ASCII characters to Unicode escape sequences (\\uXXXX). Prevents XSS attacks when embedding JSON in HTML attributes and ensures ASCII-only output for legacy systems. Essential for web security and cross-platform compatibility.'
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Encoding Presets',
      description: 'Apply common encoding configurations instantly with our preset system. Presets include URL Safe (standard query parameters), Form Data (+ for spaces), Base64 JWT (URL-safe without padding), Hex Debug (0x prefix with spaces), HTML Safe (entity encoding), and ASCII Only (Unicode escape). Save time with optimized settings for each use case.'
    },
    {
      icon: 'fas fa-compress-alt',
      title: 'Smart Preprocessing Options',
      description: 'Optimize your encoded output with built-in preprocessing. Enable "Minify First" to remove whitespace before encoding, reducing output size by 20-40%. Or use "Format First" to pretty-print JSON before encoding for readable embedded data. Preprocessing works with any encoding type for maximum flexibility.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side Privacy',
      description: 'Your JSON data never leaves your browser. All encoding happens locally using JavaScript, with no server uploads or external API calls. Perfect for encoding sensitive configuration files, API keys, credentials, or proprietary business data. Use confidently knowing your data remains completely private.'
    },
    {
      icon: 'fas fa-tachometer-alt',
      title: 'Real-Time Encoding Preview',
      description: 'See your encoded output instantly as you type or change settings. Our debounced encoder processes input in real-time with minimal delay. View size statistics showing input bytes, output bytes, and size change percentage. Handle files up to 10MB with responsive performance.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload JSON',
      description: 'Paste your JSON data directly into the editor, drag and drop a .json file, or click Upload to select a file. Use sample templates for quick testing.'
    },
    {
      number: 2,
      title: 'Select Encoding Type',
      description: 'Choose your encoding format: URL, Base64, Hex, HTML Entity, or Unicode Escape. Each type is optimized for specific use cases.'
    },
    {
      number: 3,
      title: 'Customize Options',
      description: 'Fine-tune encoding options like space handling, case, prefixes, and padding. Or use a preset for instant configuration.'
    },
    {
      number: 4,
      title: 'Preview Encoded Output',
      description: 'View the encoded result in real-time. Check the size statistics to see how encoding affects data size.'
    },
    {
      number: 5,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard for quick use, or Download to save as a text file. Use our <a href="/json-decoder">JSON Decoder</a> to reverse the process.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON encoding?',
      answer: 'JSON encoding transforms JSON data into a different format for safe transmission or storage. Common encodings include URL encoding (for query strings), Base64 (for binary-safe text), and HTML entities (for web page embedding). Each encoding serves specific purposes in web development and data transmission.'
    },
    {
      question: 'When should I use URL encoding for JSON?',
      answer: 'Use URL encoding when passing JSON as a query parameter in URLs, submitting JSON via HTML forms, or including JSON in GET requests. URL encoding converts special characters like {, }, ", and spaces into percent-encoded format (%7B, %7D, %22, %20) that is safe for URLs.'
    },
    {
      question: 'What is the difference between Base64 and URL-safe Base64?',
      answer: 'Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _ to avoid URL encoding issues. Use URL-safe Base64 for JWT tokens, URL parameters, and filenames. Use standard Base64 for data URIs and basic authentication.'
    },
    {
      question: 'Why does Base64 encoding increase file size?',
      answer: 'Base64 encoding converts every 3 bytes of input into 4 characters of output, resulting in a ~33% size increase. This is because Base64 uses only 64 safe ASCII characters to represent binary data, which is less efficient than raw bytes but ensures compatibility with text-based systems.'
    },
    {
      question: 'What is hex encoding used for?',
      answer: 'Hex encoding represents each byte as two hexadecimal characters (0-9, a-f). It is commonly used for debugging network protocols, inspecting binary data, creating escape sequences in programming, and representing hashes or checksums. Hex encoding doubles the data size.'
    },
    {
      question: 'How do HTML entities protect against XSS?',
      answer: 'HTML entity encoding converts special characters like <, >, and " into numeric entities (&#60;, &#62;, &#34;). This prevents browsers from interpreting JSON data as HTML or JavaScript, blocking cross-site scripting (XSS) attacks when embedding JSON in web pages.'
    },
    {
      question: 'What is Unicode escape encoding?',
      answer: 'Unicode escape encoding converts non-ASCII characters to \\uXXXX format where XXXX is the hexadecimal Unicode code point. For example, é becomes \\u00e9. This ensures JSON contains only ASCII characters, useful for systems that do not support UTF-8 or for debugging character encoding issues.'
    },
    {
      question: 'Should I minify JSON before encoding?',
      answer: 'Yes, minifying JSON before encoding is recommended for most use cases. Removing whitespace reduces the encoded output size significantly (20-40% smaller), which is especially important for URL parameters with length limits and network efficiency. Only skip minification if you need to preserve formatting.'
    },
    {
      question: 'Is my data secure when using this encoder?',
      answer: 'Yes, absolutely. All encoding happens 100% client-side in your browser using JavaScript. Your JSON data is never uploaded to any server, never transmitted over the network, and never stored anywhere. This makes it safe to encode sensitive data including API keys, passwords, and proprietary information.'
    },
    {
      question: 'What is the maximum file size I can encode?',
      answer: 'The encoder can handle files up to 10MB, limited only by your browser memory. For optimal performance, files under 1MB encode instantly. Larger files may take a few seconds. For very large datasets, consider splitting the data or using server-side encoding.'
    },
    {
      question: 'Can I encode non-JSON text?',
      answer: 'Yes, the encoder accepts any text input, not just JSON. While JSON-specific features like minification work best with valid JSON, the encoding functions work on any string. This is useful for encoding plain text, XML, or other formats.'
    },
    {
      question: 'What is the difference between URI and URL encoding?',
      answer: 'URL encoding (encodeURIComponent) encodes all special characters including URI delimiters like : / ? #. URI encoding (encodeURI) preserves these delimiters, only encoding characters that are not allowed in any part of a URI. Use URL encoding for query parameter values, URI encoding for complete URLs.'
    },
    {
      question: 'How do I decode encoded JSON?',
      answer: 'Use our companion JSON Decoder tool to reverse any encoding. It supports auto-detection of encoding type and can decode URL, Base64, Hex, HTML entities, and Unicode escapes. It also handles multi-layer encoding where JSON was encoded multiple times.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Encoding Types', specification: 'URL, URI, Base64, Base64 URL-Safe, Hex, HTML Entity, Unicode' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Output Formats', specification: 'Plain text, downloadable .txt file' },
    { feature: 'Character Support', specification: 'Full Unicode including emoji and CJK' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest versions)' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'API Query Parameters',
      description: 'Encode JSON for safe inclusion in URL query strings when making API requests with complex filter or search criteria.',
      icon: 'fas fa-link'
    },
    {
      title: 'JWT Token Payloads',
      description: 'Create Base64 URL-safe encoded payloads for JSON Web Tokens used in authentication and authorization.',
      icon: 'fas fa-id-badge'
    },
    {
      title: 'HTML Data Attributes',
      description: 'Safely embed JSON in HTML data attributes using HTML entity encoding to prevent XSS vulnerabilities.',
      icon: 'fas fa-code'
    },
    {
      title: 'Network Debugging',
      description: 'Convert JSON to hex for inspecting network packets, analyzing binary protocols, and debugging data transmission.',
      icon: 'fas fa-bug'
    },
    {
      title: 'Legacy System Integration',
      description: 'Use Unicode escape encoding to ensure JSON contains only ASCII characters for systems without UTF-8 support.',
      icon: 'fas fa-server'
    },
    {
      title: 'Configuration Storage',
      description: 'Encode JSON configuration for storage in environment variables, cookies, or other text-only storage mechanisms.',
      icon: 'fas fa-database'
    },
  ],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Multiple Encoding Formats in One Tool',
      description: 'Support for 7 encoding types: URL, URI, Base64, Base64 URL-Safe, Hexadecimal, HTML Entities, and Unicode Escape. Switch between formats instantly without using multiple tools.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'One-Click Presets for Common Use Cases',
      description: 'Pre-configured presets for URL Safe, Form Data, JWT tokens, Hex debugging, HTML Safe, and ASCII Only. Apply optimized settings instantly without manual configuration.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON encoder with no registration, no limits, no ads. Start encoding immediately without creating an account. Unlimited use with no hidden costs.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Complete Privacy with Client-Side Processing',
      description: 'All encoding happens in your browser—zero server uploads. Safely encode API keys, credentials, and sensitive data. Works offline after page loads.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Smart Preprocessing Options',
      description: 'Minify JSON before encoding to reduce output size by 20-40%, or format JSON for readable embedded data. Built-in preprocessing works with all encoding types.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Real-Time Preview with Statistics',
      description: 'See encoded output instantly as you type. View input/output size comparison and percentage change. Handle files up to 10MB with responsive performance.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'Base64encode.org',
    competitorBName: 'URL-Encode.net',
    rows: [
      {
        feature: 'Multiple Encoding Types',
        ourTool: '7 types',
        competitorA: '1 type',
        competitorB: '1 type',
      },
      {
        feature: 'URL & Base64 & Hex',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Encoding Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'JSON Preprocessing',
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
        feature: 'Size Statistics',
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
      title: 'JSON Decoder',
      description: 'Decode URL, Base64, Hex, and other encoded JSON formats with auto-detection',
      icon: 'fas fa-unlock',
      link: '/json-decoder'
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML with Kubernetes and Docker Compose presets',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml'
    },
    {
      title: 'JSON to XML',
      description: 'Convert JSON to XML with RSS, Sitemap, and SOAP presets',
      icon: 'fas fa-file-code',
      link: '/json-to-xml'
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
    {
      title: 'JSON to OpenAPI',
      description: 'Generate OpenAPI 3.0 specs from JSON examples',
      icon: 'fas fa-file-code',
      link: '/json-to-openapi'
    },
  ] as RelatedTool[],
};
