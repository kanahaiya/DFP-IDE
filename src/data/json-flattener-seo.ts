/**
 * JSON Flattener SEO Content
 * Complete SEO data for the JSON Flattener tool page
 */

export const jsonFlattenerContent = {
  // Hero Section
  title: 'JSON Flattener Online Free – Convert Nested JSON to Flat Key-Value Pairs',
  subtitle: 'Transform complex nested JSON structures into simple flat key-value pairs. Support for dot, bracket, underscore, and slash notation. Free online tool with real-time preview – 100% client-side, no data upload required.',
  description: 'Free online JSON flattener tool. Convert nested JSON to flat key-value pairs with multiple notation styles.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fas fa-compress-alt', text: 'Nested to Flat' },
    { icon: 'fas fa-code', text: 'Multiple Notations' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Flatten JSON Online',
  featuresSectionTitle: 'JSON Flattener Features',
  whyChooseSectionTitle: 'Why Choose This JSON Flattener?',
  comparisonSectionTitle: 'JSON Flattener Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-compress-alt',
      title: 'Multiple Notation Styles',
      description: 'Choose from dot (user.name), bracket (user[name]), underscore (user_name), or slash (user/name) notation for your flattened keys.',
    },
    {
      icon: 'fas fa-list',
      title: 'Smart Array Handling',
      description: 'Index-based flattening, concatenation with custom delimiters, full expansion, or preserve arrays as-is – you control how arrays are processed.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Depth Control',
      description: 'Set maximum flattening depth to partially flatten complex structures. Keep deeply nested objects intact while flattening the surface.',
    },
    {
      icon: 'fas fa-filter',
      title: 'Value Filtering',
      description: 'Optionally ignore null values and empty strings, arrays, or objects to create cleaner, more compact output.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Safe Mode',
      description: 'Automatically escape special characters in keys (periods, brackets, slashes) to prevent conflicts with your chosen notation.',
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Presets',
      description: 'Quick configurations for CSV export, environment variables, path-style keys, and more. Start with the right settings instantly.',
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Real-Time Statistics',
      description: 'See input/output key counts, maximum depth reached, and arrays processed as you work. Monitor the transformation live.',
    },
    {
      icon: 'fas fa-sync',
      title: 'Reversible Operation',
      description: 'Easily convert back to nested JSON using our companion JSON Unflatten tool. Round-trip your data without loss.',
    },
  ],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Nested JSON',
      description: 'Paste your nested JSON into the input editor, drag & drop a .json file, or click Upload to select a file from your computer.',
    },
    {
      number: 2,
      title: 'Choose Notation Style',
      description: 'Select your preferred key notation: dot notation (default), bracket notation, underscore, or slash (path style).',
    },
    {
      number: 3,
      title: 'Configure Array Handling',
      description: 'Decide how arrays should be processed: use indices, concatenate values, expand all elements, or preserve arrays intact.',
    },
    {
      number: 4,
      title: 'Apply Advanced Options',
      description: 'Set max depth, enable safe mode for special characters, or filter out null and empty values based on your needs.',
    },
    {
      number: 5,
      title: 'Copy or Download Result',
      description: 'Click Copy to clipboard for quick use, or Download to save as a JSON file. Use our <a href="/json-unflattener">JSON Unflattener</a> tool to reverse the process.',
    },
  ],
  
  // Educational Content
  educational: [
    {
      title: 'What is JSON Flattening?',
      content: 'JSON flattening is the process of converting a nested, hierarchical JSON structure into a flat key-value format where each value is accessible through a single composite key. For example, {"user": {"name": "John"}} becomes {"user.name": "John"}. This transformation is essential for data analysis, CSV export, database storage, and creating environment variables from configuration files.',
    },
    {
      title: 'When to Use JSON Flattening',
      content: 'Flatten JSON when you need to: export data to spreadsheets or CSV, create environment variables from config files, store data in flat key-value databases, simplify complex API responses for analysis, generate database column names, or prepare data for machine learning pipelines that require flat features.',
    },
    {
      title: 'Notation Styles Explained',
      content: 'Dot notation (user.address.city) is the most common and works well with JavaScript object access. Bracket notation (user[address][city]) is standard for form data and query parameters. Underscore notation (user_address_city) is perfect for environment variables and CSV headers. Slash notation (user/address/city) resembles file paths and is useful for hierarchical key storage systems.',
    },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'CSV Export',
      description: 'Convert nested API responses to flat structures for easy import into Excel, Google Sheets, or databases.',
      icon: 'fas fa-file-csv',
    },
    {
      title: 'Environment Variables',
      description: 'Transform JSON config files into flat key-value pairs suitable for .env files and deployment configurations.',
      icon: 'fas fa-terminal',
    },
    {
      title: 'Data Analysis',
      description: 'Simplify complex nested data for analysis tools, pandas DataFrames, or business intelligence platforms.',
      icon: 'fas fa-chart-line',
    },
    {
      title: 'API Documentation',
      description: 'Generate flat lists of all available fields in an API response for documentation and testing.',
      icon: 'fas fa-book',
    },
    {
      title: 'Database Migration',
      description: 'Prepare nested JSON for storage in flat key-value stores like Redis or column-based databases.',
      icon: 'fas fa-database',
    },
  ],
  
  // Why Choose
  whyChoose: [
    {
      title: '100% Client-Side Processing',
      description: 'Your JSON never leaves your browser. All flattening happens locally using JavaScript, ensuring complete privacy and security.',
      icon: 'fas fa-lock',
    },
    {
      title: 'Four Notation Styles',
      description: 'Choose dot, bracket, underscore, or slash notation to match your target system requirements perfectly.',
      icon: 'fas fa-code',
    },
    {
      title: 'Flexible Array Handling',
      description: 'Full control over how arrays are processed – index, expand, concatenate, or preserve based on your needs.',
      icon: 'fas fa-list',
    },
    {
      title: 'Real-Time Preview',
      description: 'See flattened output instantly as you type or change settings. No waiting, no button clicks needed.',
      icon: 'fas fa-bolt',
    },
    {
      title: 'Reversible Operation',
      description: 'Easily unflatten back to nested structure using our companion tool. Complete round-trip support.',
      icon: 'fas fa-sync',
    },
    {
      title: 'No Size Limits',
      description: 'Handle large JSON files up to 10MB. Optimized performance for complex, deeply nested structures.',
      icon: 'fas fa-expand-arrows-alt',
    },
  ],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'jsonformatter.org',
    competitorBName: 'csvjson.com',
    rows: [
      { feature: 'Multiple Notation Styles', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Array Concatenation', ourTool: true, competitorA: true, competitorB: false },
      { feature: 'Depth Control', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Safe Mode (Escape Keys)', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Real-Time Preview', ourTool: true, competitorA: false, competitorB: true },
      { feature: 'Client-Side Only', ourTool: true, competitorA: true, competitorB: true },
      { feature: 'Unflatten Support', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'One-Click Presets', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Statistics Display', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Free to Use', ourTool: true, competitorA: true, competitorB: true },
    ],
  },
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON flattening?',
      answer: 'JSON flattening converts nested JSON structures into flat key-value pairs. For example, {"user": {"name": "John"}} becomes {"user.name": "John"}. This makes complex data easier to work with in spreadsheets, databases, and analysis tools.',
    },
    {
      question: 'Which notation style should I use?',
      answer: 'It depends on your use case. Dot notation is best for general programming. Underscore notation is ideal for environment variables and CSV headers. Bracket notation works well for form data. Slash notation is useful for path-like key structures.',
    },
    {
      question: 'How are arrays handled during flattening?',
      answer: 'You can choose from four strategies: Index-based (items.0, items.1), Concatenate (join values with delimiter), Expand All (separate keys for each element), or Preserve (keep arrays intact). Each serves different data transformation needs.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, completely. All processing happens in your browser using JavaScript. Your JSON is never sent to any server. You can verify this by using the tool offline or checking the network tab in browser developer tools.',
    },
    {
      question: 'Can I unflatten JSON back to nested structure?',
      answer: 'Yes! Use our companion <a href="/json-unflattener">JSON Unflattener</a> tool to convert flattened JSON back to nested structure. It auto-detects the delimiter and reconstructs arrays intelligently.',
    },
    {
      question: 'What\'s the maximum file size supported?',
      answer: 'The tool handles JSON files up to approximately 10MB, limited by browser memory. For most use cases, this is more than sufficient. Very deeply nested structures (>20 levels) may experience slower processing.',
    },
    {
      question: 'What does Safe Mode do?',
      answer: 'Safe Mode escapes special characters in keys (periods, brackets, slashes, backslashes) by replacing them with underscores. This prevents conflicts when your original keys contain characters used in the notation style.',
    },
    {
      question: 'How is max depth useful?',
      answer: 'Max depth limits how deep the flattening goes. Objects beyond the specified depth are kept as-is (or stringified). This is useful when you want to flatten only the top levels of a complex structure while preserving nested objects at lower levels.',
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Processing', specification: '100% Client-Side JavaScript' },
    { feature: 'File Size Limit', specification: 'Up to 10MB' },
    { feature: 'Notation Styles', specification: 'Dot, Bracket, Underscore, Slash' },
    { feature: 'Array Strategies', specification: 'Index, Concatenate, Expand, Preserve' },
    { feature: 'Max Depth', specification: 'Unlimited (configurable)' },
    { feature: 'Output Format', specification: 'JSON' },
  ],
  
  // Related Tools
  relatedTools: [
    {
      title: 'JSON Unflattener',
      description: 'Convert flattened JSON back to nested hierarchical structure',
      icon: 'fas fa-expand-alt',
      link: '/json-unflattener',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON with syntax highlighting',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format for configuration files',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'CSV to JSON',
      description: 'Convert CSV data to JSON format',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents and find differences',
      icon: 'fas fa-not-equal',
      link: '/json-diff',
    },
    {
      title: 'JSON Encoder',
      description: 'Encode JSON for URLs, Base64, and other formats',
      icon: 'fas fa-lock',
      link: '/json-encoder',
    },
  ],
};
