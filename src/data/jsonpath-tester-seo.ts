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

export interface EducationalSection {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning';
}

export const jsonpathTesterContent = {
  // Hero Section
  title: 'JSONPath Tester - Free Online JSONPath Expression Tester',
  subtitle: 'Test and debug JSONPath expressions against JSON data in real-time. Build complex queries with recursive descent, filters, wildcards, and array slicing. Instant results with path highlighting, query history, and syntax reference.',
  description: 'Free online JSONPath tester to query and extract data from JSON documents',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-search', text: 'JSONPath Syntax' },
    { icon: 'fas fa-bolt', text: 'Real-Time Results' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-history', text: 'Query History' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Test JSONPath Expressions Online',
  featuresSectionTitle: 'JSONPath Tester Features',
  whyChooseSectionTitle: 'Why Choose This JSONPath Tester?',
  comparisonSectionTitle: 'JSONPath Tester Comparison',
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JSONPath?',
      content: 'JSONPath is a query language for JSON, similar to how XPath queries XML documents. It provides a simple syntax to navigate and extract data from complex JSON structures. Created by Stefan Goessner in 2007, JSONPath uses path expressions starting with <code>$</code> (the root element) to traverse objects and arrays. For example, <code>$.store.book[*].author</code> extracts all author names from a bookstore JSON. JSONPath is widely used in API testing, data extraction, configuration management, and anywhere you need to query JSON data programmatically.',
      type: 'info' as const,
    },
    {
      title: 'JSONPath vs XPath',
      content: 'While JSONPath is inspired by XPath, there are key differences. JSONPath uses <code>$</code> for root (XPath uses <code>/</code>), <code>@</code> for current element (XPath uses <code>.</code>), and <code>..</code> for recursive descent (same in XPath). JSONPath bracket notation <code>[n]</code> accesses array elements by index, while filter expressions <code>[?(@.price &lt; 10)]</code> enable conditional selection. Unlike XPath, JSONPath doesn\'t support axis navigation (parent, sibling) as JSON lacks these relationships.',
      type: 'tip' as const,
    },
  ] as EducationalSection[],
  
  // Features
  features: [
    {
      icon: 'fas fa-search',
      title: 'Full JSONPath Syntax Support',
      description: 'Execute any JSONPath expression including dot notation, bracket notation, wildcards, recursive descent, array slicing, union operators, and filter expressions. Our tester uses the jsonpath-plus library which implements the complete JSONPath specification plus extensions like parent references and custom callbacks.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Real-Time Query Execution',
      description: 'See results instantly as you type your JSONPath expression. Auto-execute mode with configurable debounce processes your query in real-time. Toggle to manual mode when working with large files or complex queries that need fine-tuning before execution.'
    },
    {
      icon: 'fas fa-route',
      title: 'Path Highlighting & Navigation',
      description: 'View the exact path to each matched element in your JSON. Path display shows both JSONPath syntax ($..book[0]) and JSON Pointer format (/store/book/0). Click any result to see its location in the original JSON structure.'
    },
    {
      icon: 'fas fa-filter',
      title: 'Advanced Filter Expressions',
      description: 'Build complex filter queries using JavaScript-style expressions. Filter by property values with comparisons (==, !=, <, >, <=, >=), check for property existence, combine conditions with && and ||, and use functions like match() for regex filtering. Example: $.products[?(@.price < 100 && @.inStock)]'
    },
    {
      icon: 'fas fa-history',
      title: 'Query History & Favorites',
      description: 'Track your recent queries with automatic history that saves your last 20 JSONPath expressions. See match counts and timestamps for each query. Quickly reload previous queries to refine your searches. History persists across browser sessions.'
    },
    {
      icon: 'fas fa-book',
      title: 'Interactive Examples & Cheat Sheet',
      description: 'Learn JSONPath with pre-loaded examples covering common patterns: basic selection, array operations, filtering, nested traversal, and real-world scenarios like API responses and e-commerce data. Built-in syntax cheat sheet provides quick reference for all operators.'
    },
    {
      icon: 'fas fa-table',
      title: 'Multiple Result Views',
      description: 'Display query results in the format that works best for your analysis. JSON view shows pretty-printed matches, Table view presents structured data in rows and columns, and Tree view provides collapsible navigation. Switch views without re-executing queries.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side Processing',
      description: 'Your JSON data never leaves your browser. All JSONPath parsing and execution happens locally using JavaScript. Safe to use with production data, API responses containing tokens, and any sensitive information. Works offline after page load.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Load Your JSON Data',
      description: 'Paste JSON directly into the left editor, drag and drop a .json file, or click Upload to select a file. Use the Examples dropdown to load sample data for learning JSONPath syntax.'
    },
    {
      number: 2,
      title: 'Enter Your JSONPath Query',
      description: 'Type your JSONPath expression in the query input. Start with $ for the root element. Use dot notation ($.store.book) or bracket notation ($["store"]["book"]) to access properties.'
    },
    {
      number: 3,
      title: 'View Matched Results',
      description: 'Results appear instantly in the right panel. See the number of matches, execution time, and the actual data extracted. Toggle path display to see where each result comes from in the original JSON.'
    },
    {
      number: 4,
      title: 'Refine Your Query',
      description: 'Use filters [?(@.price < 10)], wildcards (*), recursive descent (..), and array slicing [0:5] to narrow or expand your results. Reference the cheat sheet for syntax help.'
    },
    {
      number: 5,
      title: 'Copy or Export Results',
      description: 'Click Copy to copy matched results to clipboard, or Download to save as JSON. Your query history is saved for future reference. Try our <a href="/jmespath-tester">JMESPath Tester</a> for an alternative query syntax.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JSONPath and when should I use it?',
      answer: 'JSONPath is a query language for extracting data from JSON documents, similar to XPath for XML. Use it when you need to: filter arrays based on conditions, extract nested values without parsing the entire structure, select multiple elements matching a pattern, or test API responses in development. JSONPath is especially useful for configuration files, API testing, data transformation, and log analysis.'
    },
    {
      question: 'What does $ mean in JSONPath?',
      answer: 'The $ symbol represents the root element of the JSON document—the starting point for all queries. Every JSONPath expression begins with $ followed by accessors: $.store accesses the "store" property at root level, $[0] accesses the first element if root is an array, $.* selects all properties of the root object. Think of $ as "this document" in the JSON.'
    },
    {
      question: 'How do I filter arrays in JSONPath?',
      answer: 'Use filter expressions with ?() syntax inside brackets. The @ symbol represents the current element being evaluated. Examples: $.books[?(@.price < 10)] finds books under $10, $.users[?(@.active == true)] finds active users, $.products[?(@.category == "electronics")] filters by category. Combine conditions with && (and) and || (or).'
    },
    {
      question: 'What is the difference between .. and .?',
      answer: 'Single dot (.) accesses direct child properties: $.store.book gets books directly inside store. Double dot (..) is "recursive descent" which searches ALL nested levels: $..author finds every author property anywhere in the document, regardless of depth. Use .. when you want to find all occurrences of a property throughout the JSON tree.'
    },
    {
      question: 'How do I select multiple array elements?',
      answer: 'JSONPath offers several ways: [0,2,5] selects specific indices, [0:3] slices elements 0,1,2 (end is exclusive), [::2] takes every second element, [-1] gets the last element, [-3:] gets the last three. Combine with wildcards: $.store.book[0,1].title gets titles of first two books.'
    },
    {
      question: 'What is the wildcard (*) used for?',
      answer: 'The wildcard * matches all elements at that level. $.store.* returns all children of store (book array, bicycle). $.store.book[*] returns all book objects. $..* recursively returns every value in the document. Use wildcards when you need all items without knowing their names or when iterating over dynamic keys.'
    },
    {
      question: 'Why doesn\'t my JSONPath query return anything?',
      answer: 'Common issues: 1) Missing $ at the start (must begin with root), 2) Property name case mismatch (JSONPath is case-sensitive), 3) Accessing array as object (use [0] not .0), 4) Filter expression syntax errors (check quotes and operators), 5) Path doesn\'t exist in your specific JSON. Use our path highlighter to verify structure.'
    },
    {
      question: 'Can I use regular expressions in JSONPath?',
      answer: 'Yes, with filter expressions. Use the match() function: $.logs[?(@.message.match(/error/i))] finds logs with "error" (case-insensitive). Some implementations also support the =~ operator for regex matching. Note that regex support varies between JSONPath libraries.'
    },
    {
      question: 'Is JSONPath the same across different tools?',
      answer: 'There are variations between implementations. Our tester uses jsonpath-plus which follows the original Goessner specification plus extensions. Most tools agree on basic syntax ($, ., [], .., *, ?()), but filter expressions and functions may differ. Always test queries in your target environment.'
    },
    {
      question: 'How does JSONPath compare to jq or JMESPath?',
      answer: 'JSONPath focuses on selection and extraction with familiar syntax. jq is a full JSON processing language with transformation capabilities (Unix tool). JMESPath is an alternative query language used by AWS CLI with slightly different syntax. Our tool also offers a <a href="/jmespath-tester">JMESPath Tester</a> for comparison.'
    },
    {
      question: 'Is my JSON data secure when using this tester?',
      answer: 'Yes, completely. All JSONPath parsing and query execution happens 100% client-side in your browser using JavaScript. Your data is never uploaded to any server, never transmitted over the network, and never stored. Safe for testing production data, API responses with tokens, and sensitive business information.'
    },
    {
      question: 'What is the maximum JSON size I can test?',
      answer: 'The tester handles files up to 10MB, limited by browser memory. For optimal real-time performance, files under 1MB execute instantly. Larger files may have slight delays—consider disabling auto-execute mode for big datasets. Very large JSON should be processed server-side.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'JSONPath Library', specification: 'jsonpath-plus (latest version)' },
    { feature: 'Supported Operations', specification: '$, @, ., .., *, [], ?(), union, slice' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Result Formats', specification: 'JSON, Table, Tree view' },
    { feature: 'Query History', specification: 'Last 20 queries (persistent)' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest)' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'API Response Testing',
      description: 'Extract specific fields from API responses during development. Validate that endpoints return expected data structures and values.',
      icon: 'fas fa-plug'
    },
    {
      title: 'Data Extraction',
      description: 'Pull specific values from large JSON datasets. Find all prices, filter active users, or extract nested configuration values.',
      icon: 'fas fa-database'
    },
    {
      title: 'Log Analysis',
      description: 'Query JSON-formatted logs to find errors, filter by severity, or extract specific fields for debugging production issues.',
      icon: 'fas fa-file-alt'
    },
    {
      title: 'Configuration Validation',
      description: 'Test that JSON configuration files contain required properties and values before deploying to production environments.',
      icon: 'fas fa-cog'
    },
    {
      title: 'Learning JSONPath',
      description: 'Practice JSONPath syntax with interactive examples. Experiment with different queries and see results instantly.',
      icon: 'fas fa-graduation-cap'
    },
    {
      title: 'Documentation Examples',
      description: 'Build and test JSONPath examples for API documentation, showing users how to extract data from your endpoints.',
      icon: 'fas fa-book'
    },
  ],
  
  // Why Choose
  whyChoose: [
    {
      title: 'Complete JSONPath Specification Support',
      description: 'Full implementation of JSONPath syntax including recursive descent, filter expressions, array slicing, union operators, and more. Powered by jsonpath-plus library for maximum compatibility.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'Real-Time Interactive Testing',
      description: 'See query results instantly as you type. Auto-execute with configurable debounce makes iterating on queries fast. Toggle to manual mode for large files.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: 'Rich Learning Resources',
      description: 'Pre-loaded examples covering all JSONPath patterns from basic to advanced. Built-in syntax cheat sheet. Query history helps you learn from your own experimentation.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: 'Path Tracking & Multiple Views',
      description: 'See exactly where each match comes from in your JSON. View results as formatted JSON, structured tables, or navigable trees. Perfect for understanding complex structures.',
      color: 'rgba(210, 153, 34, 0.15)',
    },
    {
      title: '100% Free & Private',
      description: 'No signup, no limits, no ads. All processing happens client-side—your data never leaves your browser. Safe for production data and sensitive information.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Persistent Query History',
      description: 'Automatic history of your last 20 queries with match counts and timestamps. History persists across sessions so you can continue where you left off.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'jsonpath.com',
    competitorBName: 'jsonpathfinder.com',
    rows: [
      {
        feature: 'Real-Time Results',
        ourTool: true,
        competitorA: true,
        competitorB: false,
      },
      {
        feature: 'Filter Expressions',
        ourTool: true,
        competitorA: true,
        competitorB: false,
      },
      {
        feature: 'Query History',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Path Highlighting',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Multiple Result Views',
        ourTool: 'JSON/Table/Tree',
        competitorA: 'JSON only',
        competitorB: 'JSON only',
      },
      {
        feature: 'Example Library',
        ourTool: '5+ datasets',
        competitorA: '1 example',
        competitorB: 'None',
      },
      {
        feature: 'Client-Side Only',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Free & No Ads',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
    ] as ComparisonRow[],
  },
  
  // Related Tools
  relatedTools: [
    {
      title: 'JMESPath Tester',
      description: 'Test JMESPath queries against JSON with AWS CLI compatible syntax',
      icon: 'fas fa-filter',
      link: '/jmespath-tester'
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax with detailed error messages and auto-fix',
      icon: 'fas fa-check-circle',
      link: '/json-validator'
    },
    {
      title: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace and formatting',
      icon: 'fas fa-compress-arrows-alt',
      link: '/json-minifier'
    },
    {
      title: 'JSON to Schema',
      description: 'Generate JSON Schema, TypeScript, Zod and more from JSON',
      icon: 'fas fa-project-diagram',
      link: '/json-to-schema'
    },
    {
      title: 'JSON Diff',
      description: 'Compare two JSON documents with visual diff highlighting',
      icon: 'fas fa-not-equal',
      link: '/json-diff'
    },
    {
      title: 'JSON Stats',
      description: 'Analyze JSON structure, types, and data quality',
      icon: 'fas fa-chart-pie',
      link: '/json-stats'
    },
  ] as RelatedTool[],
};
