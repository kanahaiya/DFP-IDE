/**
 * JSON Unflattener SEO Content
 * Complete SEO data for the JSON Unflattener tool page
 */

export const jsonUnflattenerContent = {
  // Hero Section
  title: 'JSON Unflattener Online Free – Convert Flat JSON to Nested Structure',
  subtitle: 'Transform flattened JSON key-value pairs back into nested hierarchical structures. Auto-detect delimiters, reconstruct arrays, preserve data types. Free online tool with real-time preview – 100% client-side, no data upload required.',
  description: 'Free online JSON unflattener tool. Convert flat key-value JSON back to nested hierarchical structure with auto-detection.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fas fa-expand-alt', text: 'Flat to Nested' },
    { icon: 'fas fa-magic', text: 'Auto-Detection' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Unflatten JSON Online',
  featuresSectionTitle: 'JSON Unflattener Features',
  whyChooseSectionTitle: 'Why Choose This JSON Unflattener Tool?',
  comparisonSectionTitle: 'JSON Unflattener Comparison',
  
  // Features
  features: [
    {
      icon: 'fas fa-magic',
      title: 'Auto-Detect Delimiter',
      description: 'Automatically detects whether your input uses dot notation, underscore notation, or bracket notation. No manual configuration needed.',
    },
    {
      icon: 'fas fa-list',
      title: 'Smart Array Reconstruction',
      description: 'Intelligently recognizes array indices like [0], [1] and reconstructs proper JSON arrays. Also supports numeric keys without brackets.',
    },
    {
      icon: 'fas fa-exclamation-triangle',
      title: 'Conflict Resolution',
      description: 'Handle key conflicts with three strategies: last-write-wins, preserve-first, or strict mode that errors on any conflict.',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Type Preservation',
      description: 'Automatically convert string values back to numbers, booleans, and null. Restore original data types from stringified flat data.',
    },
    {
      icon: 'fas fa-align-left',
      title: 'Flexible Formatting',
      description: 'Choose output formatting: pretty-print with 2/4 spaces or tabs, minified single-line, or alphabetically sorted keys.',
    },
    {
      icon: 'fas fa-magic',
      title: 'One-Click Presets',
      description: 'Quick configurations for database imports, form data, config files, and more. Start with optimal settings instantly.',
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Real-Time Statistics',
      description: 'See input key count, output depth, arrays created, and conflicts resolved as you work. Monitor the transformation live.',
    },
    {
      icon: 'fas fa-sync',
      title: 'Round-Trip Support',
      description: 'Perfectly reverses our JSON Flattener output. Create nested → flat → nested workflows without data loss.',
    },
  ],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Flattened JSON',
      description: 'Paste your flattened JSON into the input editor, drag & drop a .json file, or click Upload to select a file from your computer.',
    },
    {
      number: 2,
      title: 'Configure Delimiter',
      description: 'The tool auto-detects the delimiter, but you can manually select dot, underscore, or custom delimiter if needed.',
    },
    {
      number: 3,
      title: 'Set Array Detection',
      description: 'Enable auto-detect arrays to recognize [0], [1] patterns, or force array conversion for all numeric keys.',
    },
    {
      number: 4,
      title: 'Apply Advanced Options',
      description: 'Configure conflict handling, type preservation (numbers, booleans, null), and output formatting preferences.',
    },
    {
      number: 5,
      title: 'Copy or Download Result',
      description: 'Click Copy to clipboard for quick use, or Download to save as a JSON file. Use our <a href="/json-flattener">JSON Flattener</a> to reverse the process.',
    },
  ],
  
  // Educational Content
  educational: [
    {
      title: 'What is JSON Unflattening?',
      content: 'JSON unflattening is the process of converting flat key-value pairs back into a nested hierarchical JSON structure. For example, {"user.name": "John", "user.address.city": "NYC"} becomes {"user": {"name": "John", "address": {"city": "NYC"}}}. This is essential for reconstructing data from CSV imports, form submissions, database exports, and environment variables.',
    },
    {
      title: 'When to Use JSON Unflattening',
      content: 'Unflatten JSON when you need to: reconstruct hierarchical data from CSV imports, parse form data submissions into proper objects, convert environment variables back to config objects, restore ORM/database flat exports to nested structures, or reverse any flattening operation to restore original data structure.',
    },
    {
      title: 'Understanding Array Reconstruction',
      content: 'The tool recognizes array patterns in flat keys. Keys like users[0].name, users[1].name are converted to an array of objects. Numeric keys like items.0.name, items.1.name can also be treated as array indices when force array conversion is enabled. This intelligent detection ensures proper array structures in the output.',
    },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'CSV Import',
      description: 'Convert CSV data that was flattened from JSON back to its original nested structure for API consumption.',
      icon: 'fas fa-file-csv',
    },
    {
      title: 'Form Data Parsing',
      description: 'Transform HTML form serialization (bracket notation) into proper nested JSON objects.',
      icon: 'fas fa-wpforms',
    },
    {
      title: 'Config Reconstruction',
      description: 'Convert environment variables or flat config files back into hierarchical configuration objects.',
      icon: 'fas fa-cogs',
    },
    {
      title: 'Database Import',
      description: 'Restore ORM-generated flat database exports back to nested JSON for application use.',
      icon: 'fas fa-database',
    },
    {
      title: 'API Response Formatting',
      description: 'Transform flat key-value API responses into properly nested JSON structures.',
      icon: 'fas fa-exchange-alt',
    },
  ],
  
  // Why Choose
  whyChoose: [
    {
      title: '100% Client-Side Processing',
      description: 'Your JSON never leaves your browser. All unflattening happens locally using JavaScript, ensuring complete privacy and security.',
      icon: 'fas fa-lock',
    },
    {
      title: 'Intelligent Auto-Detection',
      description: 'Automatically detects delimiter type (dot, underscore, bracket) and array patterns. Minimal configuration needed.',
      icon: 'fas fa-magic',
    },
    {
      title: 'Flexible Conflict Handling',
      description: 'Three conflict resolution strategies: last-write-wins, preserve-first, or strict mode for data integrity.',
      icon: 'fas fa-shield-alt',
    },
    {
      title: 'Type Restoration',
      description: 'Automatically convert stringified values back to proper types: numbers, booleans, and null.',
      icon: 'fas fa-exchange-alt',
    },
    {
      title: 'Real-Time Preview',
      description: 'See nested output instantly as you type or change settings. No waiting, no button clicks needed.',
      icon: 'fas fa-bolt',
    },
    {
      title: 'Round-Trip Compatibility',
      description: 'Perfectly reverses JSON Flattener output. Complete flatten → unflatten workflow support.',
      icon: 'fas fa-sync',
    },
  ],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'jsonformatter.org',
    competitorBName: 'csvjson.com',
    rows: [
      { feature: 'Auto-Detect Delimiter', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Smart Array Reconstruction', ourTool: true, competitorA: false, competitorB: true },
      { feature: 'Conflict Resolution Options', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Type Preservation', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Custom Delimiter Support', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Real-Time Preview', ourTool: true, competitorA: false, competitorB: true },
      { feature: 'Client-Side Only', ourTool: true, competitorA: true, competitorB: true },
      { feature: 'Flatten/Unflatten Pair', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'One-Click Presets', ourTool: true, competitorA: false, competitorB: false },
      { feature: 'Free to Use', ourTool: true, competitorA: true, competitorB: true },
    ],
  },
  
  // FAQs
  faqs: [
    {
      question: 'What is JSON unflattening?',
      answer: 'JSON unflattening converts flat key-value pairs back into nested hierarchical JSON. For example, {"user.name": "John"} becomes {"user": {"name": "John"}}. This reverses the flattening process to restore original data structures.',
    },
    {
      question: 'How does delimiter auto-detection work?',
      answer: 'The tool analyzes your input keys to detect patterns. It counts occurrences of dots and underscores (excluding those inside brackets) to determine the most likely delimiter. You can always override with manual selection.',
    },
    {
      question: 'How are arrays reconstructed?',
      answer: 'Keys with bracket notation like users[0].name automatically create arrays. Numeric keys like items.0.name can also become arrays when "Force Array Conversion" is enabled. The tool maintains index order and handles sparse arrays.',
    },
    {
      question: 'What happens when there are key conflicts?',
      answer: 'Conflicts occur when a key is both a value and a parent. For example, user=value and user.name=value conflict. Use "Last-Write-Wins" to let later values override, "Preserve First" to keep initial values, or "Strict" to error on conflicts.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, completely. All processing happens in your browser using JavaScript. Your JSON is never sent to any server. You can verify this by using the tool offline or checking the network tab in browser developer tools.',
    },
    {
      question: 'Can I flatten JSON back to flat format?',
      answer: 'Yes! Use our companion <a href="/json-flattener">JSON Flattener</a> tool to convert nested JSON to flat key-value pairs. Both tools are designed to work together for complete round-trip workflows.',
    },
    {
      question: 'What does type preservation do?',
      answer: 'Some flattening processes stringify all values. Type preservation converts these strings back: "123" becomes number 123, "true"/"false" become booleans, and "null" becomes actual null. This restores proper JSON data types.',
    },
    {
      question: 'Why use underscore delimiter instead of dot?',
      answer: 'Underscore delimiter is common in environment variables and database exports where dots have special meaning. If your data uses underscores to separate path segments (user_name_first), select underscore delimiter for correct unflattening.',
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'Processing', specification: '100% Client-Side JavaScript' },
    { feature: 'File Size Limit', specification: 'Up to 10MB' },
    { feature: 'Delimiters', specification: 'Dot, Underscore, Custom' },
    { feature: 'Conflict Modes', specification: 'Last-Wins, Preserve-First, Strict' },
    { feature: 'Array Detection', specification: 'Auto-detect, Force Conversion' },
    { feature: 'Output Format', specification: 'JSON (formatted/minified)' },
  ],
  
  // Related Tools
  relatedTools: [
    {
      title: 'JSON Flattener',
      description: 'Convert nested JSON to flat key-value pairs with multiple notation styles',
      icon: 'fas fa-compress-alt',
      link: '/json-flattener',
    },
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON with syntax highlighting',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'CSV to JSON',
      description: 'Convert CSV data to JSON format with nested structure support',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format for configuration files',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents and find differences',
      icon: 'fas fa-not-equal',
      link: '/json-diff',
    },
    {
      title: 'JSON Decoder',
      description: 'Decode URL, Base64, and other encoded JSON formats',
      icon: 'fas fa-unlock',
      link: '/json-decoder',
    },
  ],
};
