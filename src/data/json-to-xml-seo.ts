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

export interface WhyChooseItem {
  title: string;
  description: string;
  color?: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}

export interface ComparisonRow {
  feature: string;
  ourTool: string | boolean;
  competitorA: string | boolean;
  competitorB: string | boolean;
}

export interface RelatedTool {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const jsonToXMLContent = {
  // Hero Section
  title: 'JSON to XML Converter - Free Online Tool with Custom Formatting',
  subtitle: 'Convert JSON to XML online instantly with our free converter. Customize root elements, array handling, CDATA wrapping, and indentation. Smart presets for RSS feeds, XML sitemaps, SOAP messages, and Android resources. Real-time validation, 100% client-side processing. No signup or file upload required.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-code', text: 'Well-Formed XML' },
    { icon: 'fas fa-bolt', text: 'Instant Convert' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-sliders-h', text: 'Customizable' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Convert JSON to XML',
  featuresSectionTitle: 'JSON to XML Converter Features',
  whyChooseSectionTitle: 'Why Choose This JSON to XML Converter?',
  comparisonSectionTitle: 'JSON to XML Converter Comparison',
  
  // Key Features - 8 features highlighting main capabilities
  features: [
    {
      icon: 'fas fa-file-code',
      title: 'Instant JSON to XML Conversion',
      description: 'Our JSON to XML converter provides instant, reliable conversion with real-time processing. Transform JSON data to well-formed XML in seconds with automatic validation. Whether you need to convert JSON APIs to XML for legacy SOAP services, generate RSS feeds, or create XML configuration files, this converter handles any JSON structure—nested objects, arrays, and mixed data types—producing clean, properly escaped XML output instantly.'
    },
    {
      icon: 'fas fa-magic',
      title: 'Smart Presets for RSS, Sitemap, SOAP & More',
      description: 'Convert JSON to XML with one-click presets optimized for common formats. RSS Feed preset creates channel-wrapped XML for news readers. XML Sitemap preset adds proper namespaces for search engines. SOAP preset formats data for web service messages. Android Resources preset generates string resource files. Configuration preset creates sorted, readable config XML. Each preset applies industry-standard formatting conventions automatically.'
    },
    {
      icon: 'fas fa-list',
      title: 'Advanced Array Handling Options',
      description: 'Control exactly how JSON arrays convert to XML elements. Choose singular form naming (users → user), custom item names, or parent key names. Optionally wrap arrays in container elements with custom wrapper names. Add index attributes to preserve array order. These array handling options give you complete control over XML structure, essential for generating valid RSS feeds, Android resources, or any array-heavy XML format.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'CDATA & Special Character Handling',
      description: 'Handle special characters correctly with automatic CDATA wrapping or XML entity encoding. Auto mode wraps text containing <, >, or & in CDATA sections. Force mode always uses CDATA for text content. Disabled mode converts to XML entities (&lt;, &gt;, &amp;). Perfect for converting JSON with HTML content, code snippets, or mathematical expressions to valid XML without data corruption.'
    },
    {
      icon: 'fas fa-tags',
      title: 'Attribute Mode for Compact XML',
      description: 'Convert JSON properties to XML attributes instead of child elements. Smart mode automatically converts primitive values (strings, numbers, booleans) to attributes while keeping objects and arrays as nested elements. Attribute mode produces more compact XML and is ideal for configuration files, Android resources, and any format where attributes are preferred. Full control over how your JSON maps to XML structure.'
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Privacy & Security',
      description: 'Convert JSON to XML securely with complete privacy—all conversion happens client-side in your browser. No file uploads, no server processing, no data logging. Your JSON data never leaves your computer. Perfect for converting sensitive configuration files, API responses with credentials, or proprietary business data. Use this JSON to XML converter confidently knowing your data remains 100% private.'
    },
    {
      icon: 'fas fa-globe',
      title: 'XML Namespace Support',
      description: 'Add XML namespaces to your converted output for schema compliance. Enable default or prefixed namespaces with custom URIs. Essential for XML Sitemaps (sitemaps.org schema), SOAP messages, RSS feeds, and any XML format requiring namespace declarations. Configure namespace URI and optional prefix to generate standards-compliant XML that validates against XSD schemas.'
    },
    {
      icon: 'fas fa-download',
      title: 'One-Click Copy & Download',
      description: 'Export converted XML instantly with one click. Copy to clipboard for quick pasting into your IDE, XML editor, or configuration file. Download as .xml file with automatic timestamp naming. The converter generates properly formatted XML with your chosen encoding (UTF-8, UTF-16, ISO-8859-1) ready for immediate use in your applications, SOAP services, or content management systems.'
    },
  ] as FeatureItem[],
  
  // How-To Steps - 5 steps with detailed instructions
  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data into the Editor',
      description: 'Copy your JSON content and paste it into the input editor. Alternatively, drag and drop .json files directly onto the editor. You can also click "Upload File" to select files from your computer. If your JSON has syntax errors, the converter will display detailed error messages with line numbers to help you fix issues.',
    },
    {
      number: 2,
      title: 'Choose a Formatting Preset (Optional)',
      description: 'Select a preset from the Presets tab for instant industry-standard formatting. Choose RSS Feed for news feeds, XML Sitemap for search engine sitemaps, SOAP for web service messages, Android for string resources, or Configuration for settings files. Each preset automatically configures root elements, array handling, and namespaces for that format.',
    },
    {
      number: 3,
      title: 'Customize XML Settings',
      description: 'Fine-tune the output in the Format, Arrays, and Advanced tabs. Set custom root element names, choose indentation style (2 spaces, 4 spaces, tabs, or minified), configure array item naming, select CDATA mode for special characters, and enable XML namespaces if needed. Settings apply in real-time so you can see exactly how your XML will look.',
    },
    {
      number: 4,
      title: 'Conversion Happens Automatically',
      description: 'The JSON to XML converter processes your input automatically with 300ms debouncing. Watch the output panel update as you type. JSON validation runs concurrently—errors display with line and column numbers below the input. The stats bar shows character count, line count, and file size estimate for both input and output.',
    },
    {
      number: 5,
      title: 'Copy or Download the XML Output',
      description: 'Click "Copy" to copy the converted XML to your clipboard, or click "Download" to save as an .xml file with timestamp. The XML is ready to use in your SOAP services, RSS readers, CMS systems, or configuration files. Need to convert the XML to YAML? Try our <a href="/json-to-yaml">JSON to YAML Converter</a> for DevOps workflows.',
    },
  ] as HowToStep[],
  
  // Use Cases - Real-world scenarios
  useCases: [
    {
      title: 'Generate RSS Feeds from JSON Data',
      description: 'Convert JSON content data to RSS 2.0 XML format for news readers and content syndication. Use the RSS Feed preset for proper channel structure with title, link, description, and item elements. Perfect for content management systems outputting JSON that need RSS feed generation.',
      icon: 'fas fa-rss',
    },
    {
      title: 'Create XML Sitemaps for Search Engines',
      description: 'Transform JSON URL lists to XML sitemaps with proper namespace and structure. The XML Sitemap preset automatically adds the sitemaps.org namespace and formats loc, lastmod, changefreq, and priority elements. Submit the generated sitemap to Google Search Console and Bing Webmaster Tools.',
      icon: 'fas fa-sitemap',
    },
    {
      title: 'Build SOAP Messages from JSON APIs',
      description: 'Convert JSON API responses to SOAP XML format for legacy enterprise integrations. The SOAP preset structures data suitable for SOAP envelope, header, and body elements. Essential for integrating modern JSON APIs with older SOAP-based enterprise systems.',
      icon: 'fas fa-cloud',
    },
    {
      title: 'Generate Android String Resources',
      description: 'Transform JSON translation files to Android strings.xml format. The Android Resources preset creates properly formatted <resources> with <string name="key">value</string> structure. Use attribute mode for clean, compact resource files that Android Studio recognizes.',
      icon: 'fab fa-android',
    },
    {
      title: 'Create XML Configuration Files',
      description: 'Convert JSON configuration to XML config format used by many enterprise applications. The Configuration preset with sorted keys creates deterministic, git-friendly config files. Perfect for Spring XML configs, Maven pom.xml generation, or any application requiring XML settings.',
      icon: 'fas fa-cog',
    },
    {
      title: 'Legacy System Integration',
      description: 'Bridge modern JSON APIs with legacy XML-based systems. Convert JSON payloads to XML for older SOAP services, EDI systems, or enterprise applications that only accept XML input. Handle special characters with CDATA wrapping and ensure proper XML entity encoding.',
      icon: 'fas fa-server',
    },
  ] as UseCase[],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Smart Presets for Common XML Formats',
      description: 'Purpose-built presets for RSS feeds, XML sitemaps, SOAP messages, Android resources, and configuration files. One click applies correct root elements, namespaces, array handling, and formatting conventions. No manual configuration needed.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'Complete Array & CDATA Control',
      description: 'Fine-grained control over JSON array to XML conversion with singular naming, custom wrappers, and index attributes. Smart CDATA handling automatically wraps special characters. No other free tool offers this level of customization.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON to XML converter with no registration, no limits, no ads. Start converting immediately without creating an account. Unlimited conversions, unlimited file size (client-side processing).',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Client-Side Privacy & Security',
      description: 'All conversion happens in your browser—zero server uploads. Convert sensitive configuration files, API responses with credentials, or proprietary data with complete privacy. Works offline after page loads.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Real-Time Validation with Error Details',
      description: 'JSON syntax validation runs as you type, displaying errors with precise line/column numbers. Catch issues before conversion for guaranteed valid XML output. Invalid element names are automatically sanitized.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Multi-Tab Sessions with Persistence',
      description: 'Work on multiple JSON to XML conversions simultaneously with independent tab sessions. Each tab remembers its settings. Sessions persist across page reloads in browser storage.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // FAQs - 15 questions covering all aspects
  faqs: [
    {
      question: 'What is a JSON to XML converter and why do I need it?',
      answer: 'A JSON to XML converter transforms JSON (JavaScript Object Notation) data into XML (Extensible Markup Language) format. You need it when integrating with legacy SOAP web services, generating RSS feeds, creating XML sitemaps, building Android resources, or working with enterprise systems that require XML input. This converter handles the structural differences between JSON and XML automatically—converting objects to elements, arrays to repeated elements, and encoding special characters properly.',
    },
    {
      question: 'How do I convert JSON to XML online for free?',
      answer: 'To convert JSON to XML free online: (1) Paste your JSON data into the input editor, (2) Optionally select a preset or customize settings, (3) The conversion happens automatically in real-time, (4) Copy or download the resulting XML output. No signup needed, completely free, and your data never leaves your browser. The converter validates JSON syntax and generates well-formed XML instantly.',
    },
    {
      question: 'What presets are available for JSON to XML conversion?',
      answer: 'The converter includes 8 professional presets: Readable (human-friendly with 2-space indentation), Compact (minified without whitespace), Attribute Mode (converts primitives to XML attributes), SOAP/Web Services (for SOAP message structure), Configuration (sorted keys for config files), Android Resources (string resource format), RSS Feed (channel-wrapped feed structure), and XML Sitemap (with sitemaps.org namespace). Each preset applies industry-standard formatting automatically.',
    },
    {
      question: 'How does the JSON to XML converter handle arrays?',
      answer: 'Arrays in JSON convert to repeated XML elements. You control this with several options: (1) Item naming—automatically singularize ("users" → "user"), use custom names, or keep parent key name; (2) Array wrapper—optionally wrap all items in a container element; (3) Index attribute—add index="0" attributes to preserve order. For example, {"items": [1, 2]} can become <items><item>1</item><item>2</item></items> or <item>1</item><item>2</item> depending on settings.',
    },
    {
      question: 'What is CDATA and when should I use it in XML?',
      answer: 'CDATA (Character Data) sections in XML let you include text containing special characters (<, >, &) without escaping them. Use CDATA for: HTML content in XML, code snippets, mathematical expressions, or any text with XML special characters. The converter offers three modes: Auto (wraps only when needed), Force (always use CDATA), and Disabled (use entity encoding like &lt; instead). Auto mode is recommended for most use cases.',
    },
    {
      question: 'Is this JSON to XML converter secure for sensitive data?',
      answer: 'Yes, completely secure. This JSON to XML converter operates 100% client-side in your browser—all conversion happens locally. Your JSON data never uploads to any server, never gets logged, and never leaves your computer. This makes it safe for converting configuration files with API keys, enterprise data, or any sensitive information. No internet connection required after the page loads.',
    },
    {
      question: 'How do I add XML namespaces to the converted output?',
      answer: 'Enable namespaces in the Advanced settings tab: (1) Check "Enable Namespace", (2) Enter the Namespace URI (e.g., "http://www.sitemaps.org/schemas/sitemap/0.9"), (3) Optionally add a Namespace Prefix (e.g., "ns" for <ns:element>). The namespace declaration is added to the root element. Use the XML Sitemap preset for automatic sitemap namespace configuration.',
    },
    {
      question: 'Can I convert JSON to XML with attributes instead of elements?',
      answer: 'Yes, use the "Attribute Mode" setting in Advanced options. Choose: Elements only (all properties become child elements), Use attributes (primitive values become attributes), or Smart mode (primitives as attributes, objects/arrays as elements). Attribute mode creates more compact XML like <user name="John" age="30" /> instead of <user><name>John</name><age>30</age></user>.',
    },
    {
      question: 'What happens to null values when converting JSON to XML?',
      answer: 'You control null value handling with four options: Self-closing tag (<key />), Empty element (<key></key>), Omit entirely (skip null properties), or Custom text (<key>null</key> or your custom value). Choose based on your target system\'s requirements. Self-closing tags are the default and most common XML representation of null/empty values.',
    },
    {
      question: 'How do I generate an XML sitemap from JSON?',
      answer: 'Use the XML Sitemap preset which automatically: (1) Sets root element to "urlset", (2) Adds the sitemaps.org namespace, (3) Names array items as "url", (4) Uses 2-space indentation. Your JSON should have an array of objects with "loc" (URL), "lastmod" (date), "changefreq", and "priority" properties. The output is ready for submission to Google Search Console.',
    },
    {
      question: 'Can I convert large JSON files to XML?',
      answer: 'Yes, this JSON to XML converter handles large files efficiently with client-side processing. Files up to 10MB convert smoothly. For very large files (>10MB), the browser may slow down—consider splitting into smaller chunks. The converter uses optimized algorithms and displays progress for longer operations. All processing happens in your browser without upload limits.',
    },
    {
      question: 'How do I download the converted XML file?',
      answer: 'Click the "Download" button in the output toolbar. The file saves automatically with .xml extension and timestamp (e.g., converted-2026-01-15-14-30.xml). The XML includes your chosen encoding in the declaration (UTF-8 default). The downloaded file is ready for use in your applications, SOAP services, or XML editors without any modification needed.',
    },
    {
      question: 'What does "Sort Keys" option do?',
      answer: 'The "Sort Keys" option alphabetically sorts all object keys in the XML output. This creates deterministic, git-friendly output where the same JSON always produces identical XML. Benefits include: easier version control diffs, consistent configuration files, and predictable output for testing. Enable it in Advanced settings when you need reproducible conversions.',
    },
    {
      question: 'Can I use this converter offline?',
      answer: 'Yes, after the initial page load, this JSON to XML converter works completely offline. All conversion logic runs client-side in JavaScript, requiring no server connection. Once loaded, disconnect from the internet and continue converting JSON to XML. Perfect for air-gapped environments, secure networks, or working on flights.',
    },
    {
      question: 'How do I convert JSON to Android string resources XML?',
      answer: 'Use the Android Resources preset which sets: root element to "resources", 4-space indentation, smart attribute mode, and omits null values. Format your JSON as an array of objects with "name" and "value" properties. The converter generates Android-compatible strings.xml format: <resources><string name="app_name">My App</string></resources>.',
    },
  ] as FAQItem[],
  
  // Technical Specifications
  technicalSpecs: [
    {
      feature: 'Supported Input',
      specification: 'JSON files up to 10MB',
    },
    {
      feature: 'Output Format',
      specification: 'Well-formed XML 1.0',
    },
    {
      feature: 'Encodings',
      specification: 'UTF-8, UTF-16, ISO-8859-1, US-ASCII',
    },
    {
      feature: 'Processing Speed',
      specification: 'Real-time with 300ms debouncing',
    },
    {
      feature: 'Validation',
      specification: 'JSON syntax with line/column errors',
    },
    {
      feature: 'Presets',
      specification: '8 presets for common formats',
    },
    {
      feature: 'Privacy',
      specification: '100% client-side, no server uploads',
    },
    {
      feature: 'Browser Support',
      specification: 'Chrome, Firefox, Safari, Edge (modern)',
    },
  ] as TechnicalSpec[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'CodeBeautify',
    competitorBName: 'FreeFormatter',
    rows: [
      {
        feature: 'Smart Format Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'RSS/Sitemap Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Array Handling Options',
        ourTool: '5 options',
        competitorA: '1 option',
        competitorB: '2 options',
      },
      {
        feature: 'CDATA Mode Control',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'XML Namespace Support',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Multi-Tab Sessions',
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
      title: 'JSON to YAML Converter',
      description: 'Convert JSON to YAML with Kubernetes, Docker Compose, and Ansible presets. Perfect for DevOps workflows and configuration management.',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'CSV to JSON Converter',
      description: 'Transform CSV files to JSON format with smart type detection, multiple output formats, and automatic data type inference.',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
    {
      title: 'JSON to OpenAPI Converter',
      description: 'Generate OpenAPI 3.0 specifications from JSON examples with multi-endpoint support and automatic schema inference.',
      icon: 'fas fa-file-code',
      link: '/json-to-openapi',
    },
    {
      title: 'JSON Diff Tool',
      description: 'Compare two JSON documents with visual diff, tree view, and detailed reports. Find differences quickly with side-by-side comparison.',
      icon: 'fas fa-not-equal',
      link: '/json-diff',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON data with customizable indentation, syntax highlighting, and validation. Perfect for debugging API responses.',
      icon: 'fas fa-code',
      link: '/json-formatter',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax with detailed error messages, line numbers, and auto-fix suggestions. Ensure your JSON is valid before processing.',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
  ] as RelatedTool[],
};
