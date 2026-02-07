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

export const jmespathTesterContent = {
  // Hero Section
  title: 'JMESPath Tester - Free Online JMESPath Query Tester',
  subtitle: 'Test and debug JMESPath queries against JSON data in real-time. Perfect for AWS CLI output parsing, API response filtering, and data transformation. Instant results with syntax reference and query history.',
  description: 'Free online JMESPath tester to query and transform JSON data with AWS CLI compatible syntax',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fab fa-aws', text: 'AWS CLI Compatible' },
    { icon: 'fas fa-bolt', text: 'Real-Time Results' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-history', text: 'Query History' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ],
  
  // Section Titles
  howToSectionTitle: 'How to Test JMESPath Queries Online',
  featuresSectionTitle: 'JMESPath Tester Features',
  whyChooseSectionTitle: 'Why Choose This JMESPath Tester?',
  comparisonSectionTitle: 'JMESPath Tester Comparison',
  
  // Educational Content
  educationalContent: [
    {
      title: 'What is JMESPath?',
      content: 'JMESPath (JSON Matching Expression Path) is a query language for JSON created by James Saryerwinnie. It provides a powerful way to search, filter, and transform JSON data. JMESPath is the query language used by AWS CLI with the <code>--query</code> flag, making it essential for cloud developers. Unlike JSONPath, JMESPath has a formal specification and supports advanced features like projections, flattening, and built-in functions for data manipulation.',
      type: 'info' as const,
    },
    {
      title: 'JMESPath vs JSONPath',
      content: 'JMESPath and JSONPath are both JSON query languages but have key differences. JMESPath doesn\'t require a root symbol (no <code>$</code> prefix), uses backticks for literals (<code>`value`</code> vs <code>\'value\'</code>), and has built-in functions like <code>sort_by()</code>, <code>length()</code>, and <code>avg()</code>. JMESPath also supports multiselect to create custom objects/arrays from results. Choose JMESPath for AWS CLI integration and data transformation; choose JSONPath for XPath-like syntax familiarity.',
      type: 'tip' as const,
    },
  ] as EducationalSection[],
  
  // Features
  features: [
    {
      icon: 'fab fa-aws',
      title: 'AWS CLI Compatible',
      description: 'Test queries exactly as they work with AWS CLI --query flag. Parse EC2 describe-instances, S3 list-buckets, Lambda list-functions and any AWS API output. Pre-loaded examples include common AWS CLI response structures.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Real-Time Query Execution',
      description: 'See results instantly as you type your JMESPath expression. Auto-execute mode with configurable debounce processes your query in real-time. Toggle to manual mode when working with large JSON files.'
    },
    {
      icon: 'fas fa-filter',
      title: 'Powerful Filter Expressions',
      description: 'Build complex filters using comparison operators (==, !=, <, >, <=, >=) and logical operators (&& ||). Filter arrays by property values, check existence, and combine conditions. Example: [?State.Name == `running` && InstanceType == `t2.micro`]'
    },
    {
      icon: 'fas fa-calculator',
      title: 'Built-in Functions',
      description: 'Access all JMESPath built-in functions: sort(), sort_by(), length(), keys(), values(), contains(), starts_with(), ends_with(), sum(), avg(), min(), max(), join(), and more. Transform data directly in your queries.'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Projections & Flattening',
      description: 'Use list projections [*], object projections *, and flatten operators [] to navigate nested structures. Transform array-of-arrays into flat lists, project specific fields, and reshape JSON data.'
    },
    {
      icon: 'fas fa-cubes',
      title: 'Multiselect Hash & List',
      description: 'Create custom result structures using multiselect hash {key: expr} and multiselect list [expr1, expr2]. Build new JSON objects with computed properties directly from your queries.'
    },
    {
      icon: 'fas fa-history',
      title: 'Query History',
      description: 'Track your recent queries with automatic history that saves your last 20 JMESPath expressions. Quickly reload previous queries to refine your searches. History persists across browser sessions.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '100% Client-Side Processing',
      description: 'Your JSON data never leaves your browser. All JMESPath parsing and execution happens locally using JavaScript. Safe to use with production AWS output, API responses, and sensitive data.'
    },
  ] as FeatureItem[],
  
  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Load Your JSON Data',
      description: 'Paste JSON directly into the left editor, drag and drop a .json file, or click Upload. Use AWS CLI example templates to practice with common response structures.'
    },
    {
      number: 2,
      title: 'Enter Your JMESPath Query',
      description: 'Type your JMESPath expression in the query input. No $ prefix needed—start directly with property names or array access. Use the syntax reference for operators and functions.'
    },
    {
      number: 3,
      title: 'View Query Results',
      description: 'Results appear instantly in the right panel. See execution time and result type. Switch between JSON, Table, and Tree views for different analysis needs.'
    },
    {
      number: 4,
      title: 'Use Functions & Projections',
      description: 'Apply built-in functions like sort_by(@, &price), use projections [*].name, or create custom objects {id: InstanceId, state: State.Name}. Chain expressions with | pipe operator.'
    },
    {
      number: 5,
      title: 'Copy or Export Results',
      description: 'Click Copy to copy results to clipboard, or Download to save as JSON. Your query history is saved for future reference. Try our <a href="/jsonpath-tester">JSONPath Tester</a> for alternative syntax.'
    },
  ] as HowToStep[],
  
  // FAQs
  faqs: [
    {
      question: 'What is JMESPath and when should I use it?',
      answer: 'JMESPath is a query language for JSON with a formal specification and built-in functions. Use it when: working with AWS CLI (--query flag), transforming JSON data structure, filtering and sorting arrays, creating computed results, or when you need functions like length(), sort(), or avg(). It\'s especially powerful for AWS resource management and API response processing.'
    },
    {
      question: 'How do I use JMESPath with AWS CLI?',
      answer: 'AWS CLI uses JMESPath with the --query flag. Example: aws ec2 describe-instances --query "Reservations[].Instances[].{ID: InstanceId, Type: InstanceType, State: State.Name}". Test your queries in our tester first, then copy directly to your AWS CLI commands. Our tool includes AWS-specific examples.'
    },
    {
      question: 'Why doesn\'t JMESPath use $ like JSONPath?',
      answer: 'JMESPath was designed with a cleaner syntax that doesn\'t require a root symbol. You access properties directly: "store.book" instead of "$.store.book". This makes queries shorter and the language more intuitive. The current node @ is only used in filter expressions and function references.'
    },
    {
      question: 'How do I filter arrays in JMESPath?',
      answer: 'Use filter expressions with [?condition] syntax. Examples: [?price < `100`] finds items under 100, [?status == `active`] filters by string value (note backticks for literals), [?contains(tags, `important`)] uses functions in filters. Combine with && (and) and || (or) for complex conditions.'
    },
    {
      question: 'What are backticks used for in JMESPath?',
      answer: 'Backticks ` define literal values in JMESPath expressions. Use them for: numbers `100`, strings `"active"`, booleans `true`, and null `null`. Without backticks, values are interpreted as field names. Example: [?status == `active`] compares status field to the string "active".'
    },
    {
      question: 'How do projections work in JMESPath?',
      answer: 'Projections let you apply expressions to each element. List projection [*] maps over arrays: items[*].name extracts name from each item. Object projection * maps over object values: data.*.count gets count from all data properties. The flatten operator [] unwraps nested arrays.'
    },
    {
      question: 'How do I sort results in JMESPath?',
      answer: 'Use sort() for arrays of numbers/strings: sort(prices). Use sort_by() with expression reference (&) for objects: sort_by(items, &price) sorts by price ascending. Combine with reverse() for descending: reverse(sort_by(items, &price)). Note the & prefix for the sort key expression.'
    },
    {
      question: 'What is multiselect in JMESPath?',
      answer: 'Multiselect creates new JSON structures from query results. Hash multiselect {key: expr} creates objects: {id: InstanceId, type: InstanceType}. List multiselect [expr1, expr2] creates arrays: [name, price]. Use to extract and reshape data in a single query.'
    },
    {
      question: 'How does the pipe operator | work?',
      answer: 'The pipe | chains expressions, passing the result of the left side to the right. Example: items[*].price | [0] gets all prices then returns first one. items[?active] | sort_by(@, &name) filters then sorts. Each pipe step operates on the previous result.'
    },
    {
      question: 'Is my data secure when using this tester?',
      answer: 'Yes, completely. All JMESPath parsing and query execution happens 100% client-side in your browser using JavaScript. Your data is never uploaded to any server. Safe for testing AWS output with account IDs, API responses with tokens, and any sensitive business data.'
    },
    {
      question: 'What built-in functions are available?',
      answer: 'JMESPath includes: type(), length(), keys(), values(), sort(), sort_by(), reverse(), contains(), starts_with(), ends_with(), type(), to_string(), to_number(), join(), min(), max(), sum(), avg(), not_null(), merge(), map(), and more. Check our syntax reference for complete list.'
    },
    {
      question: 'What is the maximum JSON size I can test?',
      answer: 'The tester handles files up to 10MB, limited by browser memory. For optimal real-time performance, files under 1MB execute instantly. Larger files may have slight delays—consider disabling auto-execute mode. AWS CLI output is typically well within limits.'
    },
  ],
  
  // Technical Specs
  technicalSpecs: [
    { feature: 'JMESPath Library', specification: 'jmespath (official JavaScript implementation)' },
    { feature: 'Supported Operations', specification: 'All JMESPath specification features' },
    { feature: 'Built-in Functions', specification: '20+ functions (sort, filter, aggregate, etc.)' },
    { feature: 'Max Input Size', specification: '10MB (browser memory dependent)' },
    { feature: 'Processing', specification: '100% client-side JavaScript' },
    { feature: 'Result Formats', specification: 'JSON, Table, Tree view' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest)' },
  ],
  
  // Use Cases
  useCases: [
    {
      title: 'AWS CLI Output Parsing',
      description: 'Test --query expressions for AWS CLI commands. Parse EC2, S3, Lambda, and other service outputs before using in scripts.',
      icon: 'fab fa-aws'
    },
    {
      title: 'API Response Filtering',
      description: 'Extract specific fields from REST API responses. Filter results by conditions and transform data structure for frontend use.',
      icon: 'fas fa-plug'
    },
    {
      title: 'Data Transformation',
      description: 'Reshape JSON structures using multiselect. Create computed fields, flatten nested arrays, and aggregate data in queries.',
      icon: 'fas fa-exchange-alt'
    },
    {
      title: 'Configuration Extraction',
      description: 'Query JSON configuration files to extract specific settings. Filter environment-specific values and validate structure.',
      icon: 'fas fa-cog'
    },
    {
      title: 'Learning JMESPath',
      description: 'Practice JMESPath syntax with interactive examples. Experiment with projections, functions, and filters with instant feedback.',
      icon: 'fas fa-graduation-cap'
    },
    {
      title: 'DevOps Automation',
      description: 'Build queries for CI/CD pipelines that process JSON. Test infrastructure-as-code outputs and monitoring API responses.',
      icon: 'fas fa-robot'
    },
  ],
  
  // Why Choose
  whyChoose: [
    {
      title: 'Full JMESPath Specification Support',
      description: 'Complete implementation of JMESPath including projections, multiselect, pipe expressions, and all built-in functions. Uses the official JavaScript library.',
      color: 'rgba(88, 166, 255, 0.15)',
    },
    {
      title: 'AWS CLI Ready Examples',
      description: 'Pre-loaded examples with real AWS CLI response structures—EC2 instances, S3 buckets, and more. Test your --query expressions before running CLI commands.',
      color: 'rgba(255, 153, 0, 0.15)',
    },
    {
      title: 'Real-Time Interactive Testing',
      description: 'See query results instantly as you type. Auto-execute with configurable debounce makes iterating on queries fast. Toggle to manual mode for large files.',
      color: 'rgba(63, 185, 80, 0.15)',
    },
    {
      title: 'Function & Syntax Reference',
      description: 'Built-in reference for all JMESPath operators and 20+ functions. Click examples to insert into your query. Learn while you build.',
      color: 'rgba(163, 113, 247, 0.15)',
    },
    {
      title: '100% Free & Private',
      description: 'No signup, no limits, no ads. All processing happens client-side—your data never leaves your browser. Safe for production AWS data.',
      color: 'rgba(139, 148, 158, 0.15)',
    },
    {
      title: 'Persistent Query History',
      description: 'Automatic history of your last 20 queries. History persists across sessions so you can continue where you left off or reuse successful queries.',
      color: 'rgba(88, 166, 255, 0.12)',
    },
  ] as WhyChooseItem[],
  
  // Comparison Table
  comparisonTable: {
    competitorAName: 'jmespath.org',
    competitorBName: 'JSON Query Tools',
    rows: [
      {
        feature: 'Real-Time Results',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'AWS CLI Examples',
        ourTool: '5+ datasets',
        competitorA: '1 example',
        competitorB: 'None',
      },
      {
        feature: 'Query History',
        ourTool: true,
        competitorA: false,
        competitorB: false,
      },
      {
        feature: 'Function Reference',
        ourTool: true,
        competitorA: true,
        competitorB: false,
      },
      {
        feature: 'Multiple Result Views',
        ourTool: 'JSON/Table/Tree',
        competitorA: 'JSON only',
        competitorB: 'JSON only',
      },
      {
        feature: 'File Upload',
        ourTool: true,
        competitorA: false,
        competitorB: true,
      },
      {
        feature: 'Client-Side Only',
        ourTool: true,
        competitorA: true,
        competitorB: false,
      },
      {
        feature: 'Free & No Ads',
        ourTool: true,
        competitorA: true,
        competitorB: false,
      },
    ] as ComparisonRow[],
  },
  
  // Related Tools
  relatedTools: [
    {
      title: 'JSONPath Tester',
      description: 'Test JSONPath expressions against JSON with XPath-like syntax',
      icon: 'fas fa-search',
      link: '/jsonpath-tester'
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
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML with Kubernetes and Docker presets',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml'
    },
  ] as RelatedTool[],
};
