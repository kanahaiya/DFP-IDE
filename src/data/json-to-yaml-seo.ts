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

export interface EducationalSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
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

export const jsonToYAMLContent = {
  // Hero Section
  title: 'JSON to YAML Converter - Free Online Tool with Kubernetes & Docker Presets',
  subtitle: 'Convert JSON to YAML instantly with our free online converter. One-click presets for Kubernetes manifests, Docker Compose files, Ansible playbooks, and GitHub Actions workflows. Real-time validation, customizable indentation, and 100% client-side processing. No signup or file upload required.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-dharmachakra', text: 'K8s Ready' },
    { icon: 'fas fa-bolt', text: 'Instant Convert' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-sliders-h', text: 'Presets' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Convert JSON to YAML',
  featuresSectionTitle: 'JSON to YAML Converter Features',
  whyChooseSectionTitle: 'Why Choose This JSON to YAML Converter?',
  comparisonSectionTitle: 'JSON to YAML Converter Comparison',
  
  // Key Features - 8 features highlighting main capabilities
  features: [
    {
      icon: 'fas fa-arrow-right',
      title: 'Fast & Reliable JSON to YAML Conversion',
      description: 'Our JSON to YAML converter offers instant, reliable conversion with real-time processing. Transform JSON to YAML instantly with smart formatting presets for Kubernetes, Docker Compose, Ansible, and more. Whether you need to convert JSON to YAML for Kubernetes manifests, Docker configurations, or CI/CD pipelines, this converter generates production-ready YAML in seconds with customizable formatting options.'
    },
    {
      icon: 'fas fa-dharmachakra',
      title: 'Kubernetes & Docker Compose YAML Formatting Presets',
      description: 'Convert JSON to YAML with one-click presets optimized for Kubernetes, Docker Compose, Ansible, OpenAPI, and GitHub Actions. Each preset applies the correct YAML formatting conventions—Kubernetes preset uses 2-space indentation with block style, Docker Compose preset configures single-quote strings, and Ansible preset ensures playbook-compatible formatting. These JSON to YAML presets save time and eliminate manual formatting, generating production-ready Kubernetes manifests and Docker Compose files from JSON config instantly.'
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Customizable YAML Formatting & Indentation Options',
      description: 'Fine-tune your JSON to YAML conversion with extensive formatting controls. Choose between 2 spaces, 4 spaces, or tabs for indentation. Select quote styles (auto, single, double, or none) for string values. Configure flow style (block for readability, flow for compact output, or mixed). Set line width limits to control wrapping. Sort object keys alphabetically for git-friendly output. This JSON to YAML converter gives you complete control over YAML formatting to match your project\'s style guide.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Real-Time JSON and YAML Syntax Validation',
      description: 'Validate JSON and YAML syntax as you type with instant error detection. Our JSON to YAML converter checks for syntax errors, missing brackets, invalid escapes, indentation problems, and type mismatches. Errors display with precise line and column numbers for quick debugging. The validator catches issues before conversion, ensuring you get valid YAML from JSON every time. Whether converting JSON to YAML or YAML to JSON, real-time validation prevents formatting mistakes and saves debugging time.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side JSON to YAML Conversion - Secure & Private',
      description: 'Convert JSON to YAML securely with complete privacy—all conversion happens client-side in your browser. No file uploads, no server processing, no data logging. Your JSON and YAML data never leaves your computer when using this converter. Perfect for converting sensitive Kubernetes configs, Docker Compose files with secrets, or API responses with authentication tokens. Use this JSON to YAML converter confidently with proprietary data, knowing it remains 100% private and secure in your browser.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Instant JSON to YAML Conversion with Debounced Processing',
      description: 'Experience lightning-fast JSON to YAML conversion with optimized debounced processing. Changes convert automatically after 500ms of typing—no manual "Convert" button needed. The converter handles large JSON files and complex nested structures efficiently. Whether converting small JSON objects to YAML or processing multi-megabyte configuration files, the conversion is instant and smooth. This JSON YAML converter is optimized for performance, handling Kubernetes deployments, Docker Compose stacks, and OpenAPI specs without lag.'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Multi-Tab Conversion Sessions with Independent Settings',
      description: 'Work on multiple JSON to YAML conversions simultaneously with tab management. Each tab maintains its own input, output, settings, and conversion mode independently. Rename tabs for easy identification, duplicate tabs to create variations, or close tabs when done. Tabs persist in browser storage, so your JSON to YAML conversion sessions survive page reloads. Perfect for comparing different YAML formatting options or converting multiple Kubernetes manifests from JSON in parallel.'
    },
    {
      icon: 'fas fa-download',
      title: 'Export YAML and JSON with One-Click Download',
      description: 'Download converted YAML or JSON files instantly with proper file extensions. Click "Download" to save as .yaml, .yml, or .json files with timestamp. Copy output to clipboard with one click for quick pasting into IDEs or configuration files. Share converted files via generated URLs (coming soon). This JSON to YAML converter makes exporting easy—no need to manually copy-paste large Kubernetes manifests or Docker Compose configurations.'
    },
  ] as FeatureItem[],
  
  // How-To Steps - 5-7 steps with detailed instructions
  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data into the Editor',
      description: 'Copy your JSON content and paste it into the input editor. Alternatively, drag and drop .json files directly onto the editor. You can also click "Upload File" to select files from your computer. If your JSON has syntax errors, use our <a href="/json-validator">JSON Validator</a> first to identify and fix issues before conversion.',
    },
    {
      number: 2,
      title: 'Choose a Formatting Preset (Optional)',
      description: 'Select a preset from the Presets tab for instant industry-standard formatting. Choose Kubernetes for manifests, Docker Compose for container configs, Ansible for playbooks, or GitHub Actions for workflows. If you need to convert your YAML output to an API spec, try our <a href="/json-to-openapi">JSON to OpenAPI Converter</a> afterward.',
    },
    {
      number: 3,
      title: 'Customize Format Settings',
      description: 'Fine-tune the output in the Format tab: configure indentation (2/4 spaces or tabs), quote style (auto/single/double/none), and flow style (block/flow/mixed). For cleaner input before conversion, use our <a href="/json-formatter">JSON Formatter</a> to beautify and organize your JSON data first.',
    },
    {
      number: 4,
      title: 'Conversion Happens Automatically in Real-Time',
      description: 'The JSON to YAML converter processes your input automatically with 300ms debouncing. Watch the output panel update as you type. Syntax validation runs concurrently—errors display with line and column numbers below the input. The stats bar shows character count, line count, and validation status.',
    },
    {
      number: 5,
      title: 'Copy or Download the Converted YAML',
      description: 'Click "Copy" to copy the converted YAML output to your clipboard, or click "Download" to save as a .yaml file with timestamp. Paste the converted YAML directly into Kubernetes manifests, Docker Compose files, or CI/CD pipeline configurations. Need to convert data from a spreadsheet? Try our <a href="/csv-to-json">CSV to JSON Converter</a> first.',
    },
  ] as HowToStep[],
  
  // Use Cases - Real-world scenarios
  useCases: [
    {
      title: 'Convert Kubernetes JSON to YAML Manifests',
      description: 'Transform Kubernetes JSON configurations into clean, readable YAML manifests. Use the Kubernetes preset for standard 2-space indentation and block style formatting. Perfect for converting kubectl JSON output to YAML files for version control.',
      icon: 'fas fa-dharmachakra',
    },
    {
      title: 'Generate Docker Compose YAML from JSON',
      description: 'Convert Docker service definitions from JSON to docker-compose.yml format. The Docker Compose preset applies proper formatting with single quotes and clean structure. Ideal for migrating Docker configs or generating compose files from JSON templates.',
      icon: 'fab fa-docker',
    },
    {
      title: 'Create Ansible Playbooks from JSON Data',
      description: 'Transform JSON configuration data into Ansible-compatible YAML playbooks. Use the Ansible preset for playbook-standard formatting. Convert inventory data, variables, or task definitions from JSON to YAML for Ansible automation.',
      icon: 'fas fa-server',
    },
    {
      title: 'Convert OpenAPI Specs Between JSON and YAML',
      description: 'Switch between OpenAPI/Swagger JSON and YAML formats effortlessly. Use the OpenAPI preset for specification-compliant formatting with sorted keys. Perfect for converting API documentation between formats or preparing specs for different tools.',
      icon: 'fas fa-file-code',
    },
    {
      title: 'Generate GitHub Actions Workflows from JSON',
      description: 'Convert GitHub Actions workflow definitions from JSON to YAML format. The GitHub Actions preset ensures proper .github/workflows/ formatting. Useful for programmatically generating workflows or converting JSON-based CI/CD configs.',
      icon: 'fab fa-github',
    },
    {
      title: 'Transform API Responses to Config Files',
      description: 'Convert JSON API responses to YAML configuration format for use in infrastructure tools. Perfect for taking JSON output from kubectl, cloud CLIs, or REST APIs and converting to human-readable YAML configs for version control and documentation.',
      icon: 'fas fa-cogs',
    },
  ] as UseCase[],
  
  // Why Choose - Unique selling points
  whyChoose: [
    {
      title: 'Production-Ready Kubernetes & Docker Compose Presets',
      description: 'Purpose-built presets for DevOps workflows. Convert JSON to Kubernetes manifests or Docker Compose files with one click—no manual formatting needed. Includes Ansible, OpenAPI, and GitHub Actions presets.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: '100% Free & No Signup Required',
      description: 'Completely free JSON to YAML converter with no registration, no limits, no ads. Start converting immediately without creating an account.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: 'Client-Side Privacy & Security',
      description: 'All conversion happens in your browser—zero server uploads. Convert sensitive Kubernetes configs or API keys with complete privacy and security.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Real-Time Validation Catches Errors Instantly',
      description: 'Syntax validation runs as you type, displaying errors with precise line/column numbers. Fix issues before conversion for guaranteed valid YAML output.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: 'Advanced Formatting Control',
      description: 'Customize every aspect of YAML output—indentation, quotes, flow style, line width, key sorting. Match your project\'s exact style guide requirements.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Instant Conversion with Multi-Tab Sessions',
      description: 'Lightning-fast conversion with 500ms debounced processing. Work on multiple JSON to YAML conversions simultaneously with independent tab sessions that persist across page reloads.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // FAQs - 15 questions covering all aspects
  faqs: [
    {
      question: 'What is a JSON to YAML converter and why do I need it?',
      answer: 'A JSON to YAML converter transforms JSON (JavaScript Object Notation) data into YAML (YAML Ain\'t Markup Language) format. You need it when working with tools like Kubernetes, Docker Compose, Ansible, or GitHub Actions that use YAML configuration files, but your source data is in JSON format. This converter handles the syntax differences automatically—converting JSON brackets and quotes to YAML\'s cleaner indentation-based structure. It\'s essential for DevOps workflows, infrastructure as code, and configuration management.',
    },
    {
      question: 'How do I convert JSON to YAML online for free?',
      answer: 'To convert JSON to YAML free online: (1) Paste your JSON data into the input editor, (2) The conversion happens automatically in real-time, (3) Copy or download the resulting YAML output. No signup, no file upload, and completely free. The converter validates your JSON syntax and generates properly formatted YAML with your chosen indentation and quote style settings. Select from preset options like Kubernetes, Docker Compose, or Ansible for instant formatting.',
    },
    {
      question: 'What presets are available for JSON to YAML conversion?',
      answer: 'The converter includes 7 professional presets: Kubernetes (2-space, block style), Docker Compose (2-space, single quotes), Ansible (2-space playbook format), OpenAPI (spec-compliant formatting), GitHub Actions (workflow formatting), Compact (flow style, 80-char lines), and Sorted Keys (alphabetically ordered). Each preset applies industry-standard formatting conventions, saving you time and ensuring compatibility with specific tools.',
    },
    {
      question: 'What are the best settings for converting JSON to Kubernetes YAML?',
      answer: 'For Kubernetes manifests, use the "Kubernetes" preset which applies: 2-space indentation (Kubernetes standard), block style for readability, auto quote style (minimal quotes), no line width limit, and no circular references. This generates clean, kubectl-compatible YAML from JSON. The preset matches official Kubernetes documentation formatting conventions used in all official examples.',
    },
    {
      question: 'How do I format Docker Compose YAML from JSON?',
      answer: 'Select the "Docker Compose" preset to convert JSON to docker-compose.yml format. This preset uses 2-space indentation, single-quote string style (Docker Compose convention), block flow style, and no key sorting. The resulting YAML follows Docker Compose best practices and is compatible with docker-compose up commands. Perfect for generating compose files from JSON service definitions.',
    },
    {
      question: 'Is this JSON to YAML converter secure for sensitive data?',
      answer: 'Yes, completely secure. This JSON to YAML converter operates 100% client-side in your browser—all conversion happens locally. Your JSON and YAML data never uploads to any server, never gets logged, and never leaves your computer. This makes it safe for converting sensitive Kubernetes secrets, Docker Compose files with API keys, or proprietary configuration data. No internet connection is required after the page loads.',
    },
    {
      question: 'What\'s the difference between YAML flow style and block style?',
      answer: 'Block style uses indentation and newlines for structure (readable, multi-line format—recommended for Kubernetes/Docker). Flow style uses inline brackets and braces similar to JSON (compact, single-line format—good for small configs). Mixed style uses block for top-level and flow for nested objects. For most use cases, block style produces the cleanest, most maintainable YAML. Our converter defaults to block style for Kubernetes and Docker presets.',
    },
    {
      question: 'Can I convert large JSON files to YAML?',
      answer: 'Yes, this JSON to YAML converter handles large files efficiently with optimized debounced processing. It can convert multi-megabyte JSON files containing thousands of lines—common in Kubernetes deployments with many resources or complex OpenAPI specifications. The converter processes large files without freezing your browser. However, for files over 10MB, consider splitting them into smaller chunks for best performance.',
    },
    {
      question: 'How do I download the converted YAML file?',
      answer: 'Click the "Download" button in the output toolbar. The file saves automatically with a .yaml extension and timestamp (e.g., converted-2026-01-13-14-30.yaml). For JSON output when converting YAML to JSON, the extension changes to .json automatically. No manual file naming needed—just click Download and the file appears in your browser\'s download folder with the correct extension.',
    },
    {
      question: 'What does "Sort Keys" option do when converting JSON to YAML?',
      answer: 'The "Sort Keys" option alphabetically sorts all object keys in the output YAML. This creates deterministic, git-friendly output where the same JSON input always produces identical YAML output. It\'s useful for version control (fewer merge conflicts), comparing YAML files, and maintaining consistent configuration file ordering. Enable it in the Advanced settings tab. Kubernetes and OpenAPI specs often benefit from sorted keys.',
    },
    {
      question: 'Can I use this converter without internet?',
      answer: 'Yes, after the initial page load, this JSON to YAML converter works completely offline. All conversion logic runs client-side in JavaScript, requiring no server connection. Once loaded, you can disconnect from the internet and continue converting JSON to YAML and YAML to JSON. This makes it perfect for air-gapped environments, secure networks, or situations with unreliable internet connectivity.',
    },
    {
      question: 'How does real-time validation work in this JSON to YAML converter?',
      answer: 'As you type, the converter validates your JSON input syntax every 300ms (debounced). It checks for missing brackets, invalid escapes, trailing commas, and malformed strings. Errors display below the input with exact line and column numbers. The stats bar shows validation status with error count. This catches JSON syntax issues before conversion, ensuring you get valid YAML output every time.',
    },
    {
      question: 'What are the presets and how do I use them?',
      answer: 'Presets are one-click formatting configurations for popular use cases: Kubernetes (2-space, block style), Docker Compose (single quotes), Ansible (playbook-friendly), OpenAPI (sorted keys), GitHub Actions (workflow-compatible), Compact (flow style), and Sorted Keys (alphabetical). Click a preset card in the Presets tab to instantly apply its settings. Presets save time by eliminating manual configuration and ensure your YAML matches tool-specific conventions.',
    },
    {
      question: 'Can I convert multiple JSON files to YAML at once?',
      answer: 'Currently, the converter processes one file at a time, but you can use multiple tabs to convert several files in parallel. Click "+" to add a new tab, paste different JSON in each tab, and apply different settings if needed. Each tab maintains independent conversion state. For true batch processing of dozens of files, consider using command-line tools like yq or jq, but for 5-10 files, the multi-tab approach works well.',
    },
    {
      question: 'How do I customize indentation when converting JSON to YAML?',
      answer: 'Go to the "Format" tab in the settings sidebar. Click the Indentation dropdown and select "2 spaces" (Kubernetes/Docker standard), "4 spaces" (more readable), or "Tab" (some editors prefer tabs). The converter applies your choice immediately. Most YAML-based tools (Kubernetes, Docker Compose, Ansible, GitHub Actions) expect 2-space indentation, so that\'s the recommended default. Avoid mixing spaces and tabs as YAML parsers reject inconsistent indentation.',
    },
  ] as FAQItem[],
  
  // Technical Specifications
  technicalSpecs: [
    {
      feature: 'Supported Formats',
      specification: 'JSON input, YAML 1.2 / YML output',
    },
    {
      feature: 'Max File Size',
      specification: 'No hard limit, optimized for up to 10MB',
    },
    {
      feature: 'Processing Speed',
      specification: 'Real-time with 500ms debouncing',
    },
    {
      feature: 'Validation',
      specification: 'Syntax validation with line/column errors',
    },
    {
      feature: 'Output Options',
      specification: '7 presets + custom formatting',
    },
    {
      feature: 'Privacy',
      specification: '100% client-side, no server uploads',
    },
    {
      feature: 'Browser Support',
      specification: 'Chrome, Firefox, Safari, Edge (modern)',
    },
    {
      feature: 'Offline Capability',
      specification: 'Works offline after initial load',
    },
  ] as TechnicalSpec[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'CodeBeautify',
    competitorBName: 'OnlineYAML',
    rows: [
      {
        feature: 'Smart Presets (K8s, Docker, Ansible)',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Kubernetes Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Docker Compose Presets',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Real-Time Validation',
        ourTool: true,
        competitorA: false,
        competitorB: true,
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
        competitorA: true,
        competitorB: true,
      },
      {
        feature: 'Custom Formatting',
        ourTool: '8 options',
        competitorA: '3 options',
        competitorB: '2 options',
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
      title: 'CSV to JSON Converter',
      description: 'Convert CSV files to JSON format with smart type detection, multiple output formats, and automatic data type inference for clean JSON output.',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
    {
      title: 'JSON to OpenAPI Converter',
      description: 'Generate OpenAPI 3.0 specifications from JSON examples with multi-endpoint support, automatic schema inference, and YAML/JSON output.',
      icon: 'fas fa-file-code',
      link: '/json-to-openapi',
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
    {
      title: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace and formatting. Reduce file size for faster API responses and optimized data transfer.',
      icon: 'fas fa-compress-alt',
      link: '/json-minifier',
    },
    {
      title: 'JSON to XML Converter',
      description: 'Convert JSON data to XML format with customizable root elements, attribute handling, and proper XML escaping for legacy system integration.',
      icon: 'fas fa-file-code',
      link: '/json-to-xml',
    },
  ] as RelatedTool[],
};
