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

export const jsonDecoderContent = {
  // Hero Section
  title: 'JSON Decoder - Free Online URL, Base64, Hex Decoding Tool',
  subtitle: 'Decode URL-encoded, Base64, hexadecimal, HTML entities, and escaped JSON strings with automatic encoding detection. Multi-layer recursive decoding with JSON formatting. 100% client-side processing, no data upload required.',
  description: 'Free online JSON decoder for URL, Base64, Hex, HTML entity, and escape sequence decoding',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-unlock', text: 'Auto-Detect' },
    { icon: 'fas fa-bolt', text: 'Instant Decode' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-layer-group', text: 'Multi-Layer' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Decode JSON Online',
  featuresSectionTitle: 'JSON Decoder Features',
  whyChooseSectionTitle: 'Why Choose This JSON Decoder?',
  comparisonSectionTitle: 'JSON Decoder Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-magic',
      title: 'Automatic Encoding Detection',
      description: 'Our JSON decoder automatically identifies the encoding type of your input. It analyzes patterns to detect URL encoding (percent sequences), Base64 (character set and padding), hexadecimal (byte patterns), HTML entities (numeric and named), and Unicode escapes. No need to guess the encoding - just paste your data and let the decoder figure it out.'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Multi-Layer Recursive Decoding',
      description: 'Handle complex multi-layer encoded data automatically. When JSON is encoded multiple times (e.g., URL encoded then Base64 encoded), our recursive decoder strips away each layer until valid JSON is found. View the complete decoding chain to understand exactly how your data was transformed. Set iteration limits to prevent infinite loops with malformed data.'
    },
    {
      icon: 'fas fa-link',
      title: 'URL & Percent Decoding',
      description: 'Decode URL-encoded JSON from query strings, form data, and API responses. Handles both standard %XX encoding and + for spaces. Supports double and triple URL encoding commonly found in redirects and nested API calls. Perfect for debugging webhook payloads, analyzing query parameters, and extracting JSON from URLs.'
    },
    {
      icon: 'fas fa-key',
      title: 'Base64 & JWT Payload Decoding',
      description: 'Decode standard Base64 and URL-safe Base64 (JWT style) encoded JSON. Automatically handles missing padding characters and converts URL-safe characters (- and _) to standard Base64. Ideal for decoding JWT token payloads, data URIs, basic authentication credentials, and Base64-wrapped API responses.'
    },
    {
      icon: 'fas fa-hashtag',
      title: 'Hexadecimal Byte Decoding',
      description: 'Convert hexadecimal byte strings back to readable JSON. Supports multiple formats: plain hex (7b22...), prefixed hex (0x7b 0x22...), escape sequences (\\x7b\\x22...), and colon-delimited (7b:22:...). Essential for debugging network protocols, analyzing packet captures, and recovering data from hex dumps.'
    },
    {
      icon: 'fas fa-code',
      title: 'HTML Entity & Unicode Decoding',
      description: 'Decode HTML numeric entities (&#123;), hex entities (&#x7B;), and named entities (&lt; &gt; &amp;) back to characters. Also handles Unicode escape sequences (\\uXXXX) found in JSON strings. Useful for extracting JSON from HTML pages, cleaning up web scraping results, and processing internationalized data.'
    },
    {
      icon: 'fas fa-compress-alt',
      title: 'JSON String Unescaping',
      description: 'Remove extra escape characters from double or triple-escaped JSON strings. Common when JSON is stored inside JSON, extracted from log files, or copied from code. Handles patterns like {\\"name\\":\\"value\\"} and converts them to proper {"name":"value"}. View the nesting levels to understand the escape structure.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side Privacy',
      description: 'All decoding happens locally in your browser using JavaScript. Your encoded data is never uploaded to any server, never transmitted over the network, and never logged anywhere. Safely decode sensitive JWT tokens, encrypted payloads, authentication data, and proprietary API responses knowing your data stays completely private.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste Encoded Data',
      description: 'Paste your encoded JSON string into the input editor, drag and drop a file, or use one of the sample templates to test the decoder.'
    },
    {
      number: 2,
      title: 'Auto-Detect or Select Type',
      description: 'The decoder automatically detects the encoding type. Or manually select URL, Base64, Hex, HTML Entity, or Unicode from the dropdown.'
    },
    {
      number: 3,
      title: 'Configure Options',
      description: 'Enable recursive decoding for multi-layer data, set max iterations, and choose output formatting preferences.'
    },
    {
      number: 4,
      title: 'View Decoded Output',
      description: 'See the decoded JSON instantly with syntax highlighting. Check the decoding chain to see which transformations were applied.'
    },
    {
      number: 5,
      title: 'Copy or Download',
      description: 'Click Copy to clipboard for immediate use, or Download to save as a .json file. Need to encode? Use our <a href="/json-encoder">JSON Encoder</a>.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON decoding?',
      answer: 'JSON decoding is the process of converting encoded JSON strings back to their original readable format. Encoding is often used to safely transmit JSON in URLs, embed it in HTML, or store it in text-only systems. Decoding reverses this process to reveal the original JSON data.'
    },
    {
      question: 'How does auto-detection work?',
      answer: 'The decoder analyzes your input for characteristic patterns. URL encoding has %XX sequences, Base64 uses specific character sets, hex consists of 0-9/A-F pairs, HTML entities contain & and ; delimiters, and Unicode escapes have \\u prefixes. The detector assigns confidence scores and tries the most likely encoding first.'
    },
    {
      question: 'What is recursive decoding?',
      answer: 'Recursive decoding handles data that has been encoded multiple times. For example, JSON might be URL encoded, then that result Base64 encoded. Recursive mode automatically detects and decodes each layer until valid JSON is found or the iteration limit is reached. The decoding chain shows each step taken.'
    },
    {
      question: 'How do I decode a JWT token?',
      answer: 'JWT tokens have three parts separated by dots: header.payload.signature. To decode, copy just the middle payload section and paste it into the decoder. Select Base64 decoding mode or let auto-detect handle it. The payload is Base64 URL-safe encoded JSON containing claims like user ID, expiration, etc.'
    },
    {
      question: 'Why is my Base64 decoding failing?',
      answer: 'Common Base64 issues include: missing padding (= characters at the end), invalid characters from copy-paste errors, URL-safe encoding mixed with standard Base64, or the input simply is not Base64. Try adding = padding characters or check if the input matches the Base64 character set.'
    },
    {
      question: 'What is the difference between URL and URI decoding?',
      answer: 'URL decoding (decodeURIComponent) decodes all percent-encoded characters. URI decoding (decodeURI) preserves URI delimiters like : / ? # because they have special meaning in URLs. For JSON in query parameters, URL decoding is usually correct.'
    },
    {
      question: 'Can I decode hex strings with prefixes?',
      answer: 'Yes, the decoder handles multiple hex formats: plain (7b22), 0x prefixed (0x7b 0x22), backslash-x (\\x7b\\x22), and colon/space delimited (7b:22 or 7b 22). Prefixes and delimiters are automatically stripped before decoding.'
    },
    {
      question: 'How do I handle double-escaped JSON?',
      answer: 'Double-escaped JSON looks like {\\"name\\":\\"value\\"}. Select "String Unescape" mode or use auto-detect with recursive decoding enabled. The decoder removes escape sequences layer by layer until valid JSON is achieved. Check the decoding chain to see how many layers were removed.'
    },
    {
      question: 'What does the iteration limit do?',
      answer: 'The iteration limit (default 10) prevents infinite loops when decoding malformed data that could match encoding patterns indefinitely. Each decoding step counts as one iteration. Increase the limit if you have legitimately deeply-nested encodings, or decrease it for faster failure on bad input.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All decoding happens 100% client-side in your browser. Your encoded data is never sent to any server, never stored anywhere, and never logged. This makes it safe to decode sensitive information like JWT tokens, API credentials, encrypted payloads, and proprietary data.'
    },
    {
      question: 'Why is the output not valid JSON?',
      answer: 'The decoded result might not be JSON if: the original data was not JSON before encoding, the encoding was corrupted, multiple encoding types were mixed incorrectly, or the wrong decoding type was selected. The decoder shows whether the output is valid JSON and you can try different decoding options.'
    },
    {
      question: 'How do I decode HTML entities?',
      answer: 'HTML entity decoding converts patterns like &#123; (numeric), &#x7B; (hex), and &lt; (named) back to characters. The decoder handles all three formats. This is useful when JSON was embedded in HTML attributes or escaped for web page display.'
    },
    {
      question: 'What is the maximum input size?',
      answer: 'The decoder can handle inputs up to 10MB, limited by browser memory. Files under 1MB decode instantly. Larger files may take a few seconds. For very large encoded datasets, consider processing in chunks or using server-side tools.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Decoding Types', specification: 'URL, Base64, Base64 URL-Safe, Hex, HTML Entity, Unicode, Unescape' },
    { feature: 'Auto-Detection', specification: 'Pattern-based with confidence scoring' },
    { feature: 'Recursive Depth', specification: 'Configurable, default 10 iterations' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Output Formatting', specification: 'Configurable indentation (2/4 spaces, tabs), key sorting' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'Debug API Responses',
      description: 'Decode URL-encoded JSON from API query parameters, webhook payloads, and redirect URLs to inspect the actual data.',
      icon: 'fas fa-bug'
    },
    {
      title: 'Analyze JWT Tokens',
      description: 'Decode JWT token payloads to inspect claims, expiration times, user IDs, and permissions without external tools.',
      icon: 'fas fa-id-badge'
    },
    {
      title: 'Process Log Files',
      description: 'Extract and decode escaped JSON strings from application logs, debug output, and error messages.',
      icon: 'fas fa-file-alt'
    },
    {
      title: 'Web Scraping Cleanup',
      description: 'Decode HTML entities and escaped characters from JSON embedded in web pages during scraping.',
      icon: 'fas fa-spider'
    },
    {
      title: 'Network Analysis',
      description: 'Convert hex dumps from packet captures and network tools back to readable JSON payloads.',
      icon: 'fas fa-network-wired'
    },
    {
      title: 'Data Migration',
      description: 'Decode encoded JSON from legacy systems, databases, and file exports during migration projects.',
      icon: 'fas fa-exchange-alt'
    },
  ],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Automatic Encoding Detection',
      description: 'No need to guess the encoding type—our detector analyzes patterns and automatically identifies URL, Base64, Hex, HTML entities, and Unicode escapes with confidence scoring.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'Multi-Layer Recursive Decoding',
      description: 'Handle complex nested encodings automatically. When data is encoded multiple times, the decoder strips each layer until valid JSON is found, showing the complete decoding chain.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON decoder with no registration, no limits, no ads. Start decoding immediately without creating an account. Unlimited use with no hidden costs.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Complete Privacy with Client-Side Processing',
      description: 'All decoding happens in your browser—zero server uploads. Safely decode JWT tokens, API credentials, and sensitive data. Works offline after page loads.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Smart JSON Formatting',
      description: 'Automatically format decoded JSON with configurable indentation (2 spaces, 4 spaces, or tabs) and optional key sorting. Validate JSON structure instantly.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Decoding Chain Visibility',
      description: 'See exactly how your data was transformed with the decoding chain display. Understand multi-layer encoding structure and verify each step of the decoding process.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'Base64decode.org',
    competitorBName: 'URL-Decode.net',
    rows: [
      {
        feature: 'Auto Encoding Detection',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Multiple Decoding Types',
        ourTool: '7 types',
        competitorA: '1 type',
        competitorB: '1 type',
      },
      {
        feature: 'Recursive Decoding',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Decoding Chain Display',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'JSON Validation',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Output Formatting',
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
      title: 'JSON Encoder',
      description: 'Encode JSON to URL, Base64, Hex, and 7 other formats with presets',
      icon: 'fas fa-lock',
      link: '/json-encoder'
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
