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

export const jsonToOpenAPIContent = {
  // Key Features - 8 features highlighting main capabilities
  features: [
    {
      icon: 'fas fa-bolt',
      title: 'Real-Time Conversion',
      description: 'Experience instant JSON to OpenAPI transformation as you type. Our converter processes your JSON data in real-time, generating valid OpenAPI 3.0 or Swagger 2.0 specifications without any delays. Convert JSON to Swagger specs or OpenAPI YAML instantly—no waiting, no processing queues—just immediate results that help you work faster and more efficiently.'
    },
    {
      icon: 'fas fa-brain',
      title: 'Smart Schema Inference',
      description: 'Let our intelligent engine do the heavy lifting. Automatically detects data types, generates accurate API schemas, and identifies nested structures in your JSON. The schema inference algorithm analyzes your data patterns to create precise OpenAPI definitions and Swagger specs, saving you hours of manual specification writing and ensuring your REST API documentation is always accurate.'
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Multi-Endpoint Support',
      description: 'Build complete API specifications with unlimited endpoints. Add multiple API routes, configure different HTTP methods, set unique response codes, and organize endpoints with tags—all in a single OpenAPI spec. Perfect for generating comprehensive Swagger documentation for complex REST APIs with dozens of endpoints and maintaining consistency across your entire API surface.'
    },
    {
      icon: 'fas fa-search',
      title: 'Format Detection',
      description: 'Advanced pattern recognition automatically identifies special formats in your JSON data. Detects email addresses, UUIDs, date-time stamps, URLs, and more—then applies the appropriate OpenAPI format constraints. This ensures your generated specification accurately represents your data validation requirements without manual intervention.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Client-Side Security',
      description: 'Your data never leaves your browser. All conversion happens entirely client-side using JavaScript, ensuring complete privacy and security. No server uploads, no data storage, no tracking—just pure client-side processing. Use it confidently with sensitive API data, knowing your information stays private and secure.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Validation & Preview',
      description: 'Built-in Swagger UI integration lets you preview and validate your generated specifications instantly. Test your API documentation in real-time, explore endpoints interactively, and ensure your OpenAPI spec renders correctly before sharing it with your team or publishing to production systems.'
    },
    {
      icon: 'fas fa-download',
      title: 'Flexible Export Options',
      description: 'Export your OpenAPI specifications in multiple formats to suit your workflow. Download as JSON or YAML files, copy to clipboard for quick sharing, or use our shareable links feature. Switch between OpenAPI 3.0 and Swagger 2.0 formats with a single click to maintain compatibility with different API documentation tools and platforms.'
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Full Customization',
      description: 'Fine-tune every aspect of your API specification. Configure security schemes (API keys, OAuth2, Bearer tokens), add custom metadata (contact info, licenses, descriptions), include request examples, mark required fields, and control schema generation options. Create specifications that match your exact documentation standards.'
    }
  ] as FeatureItem[],

  // How-To Steps - 5 detailed steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Your JSON',
      description: 'Start by adding your JSON data to the input editor. You have multiple options: paste directly from your clipboard, drag and drop a JSON file, upload from your computer, or load from a URL. The editor supports files of any size and provides syntax highlighting for easy readability. You can also try one of our sample JSON templates to see how the OpenAPI generator works. If your JSON has syntax errors, use our <a href="/json-validator/" style="color:var(--primary);text-decoration:underline">JSON validator</a> first to identify and fix issues before converting JSON to Swagger specs. The real-time validation will immediately flag any problems, helping you ensure clean data before conversion.'
    },
    {
      number: 2,
      title: 'Configure Endpoint Details',
      description: 'Define your API endpoint by setting the path (like /users or /products/{id}), selecting the HTTP method (GET, POST, PUT, DELETE, etc.), and specifying the response status code. Add descriptive tags to organize endpoints and write a clear summary that explains what the endpoint does. You can create multiple endpoints in a single specification—just click "Add Endpoint" and configure each one individually. This step ensures your API documentation accurately reflects your actual API structure.'
    },
    {
      number: 3,
      title: 'Customize OpenAPI Settings',
      description: 'Personalize your API specification with metadata and configuration options. Set your API title, version number, and description. Add contact information for API support and specify licensing details if needed. Configure security schemes based on your authentication method—choose from API Key, OAuth2, Bearer Token, or Basic Auth. Enable advanced features like automatic example generation, required field marking, component extraction, and format detection to create comprehensive, production-ready specifications.'
    },
    {
      number: 4,
      title: 'Generate Specification',
      description: 'Watch as your OpenAPI specification generates automatically in the output panel. The conversion happens instantly as you type, using intelligent schema inference to analyze your JSON structure and create accurate type definitions. Our spec generator detects arrays, nested objects, enums, and format patterns, then produces a fully compliant OpenAPI 3.0 or Swagger 2.0 specification from your JSON example. Any validation errors are highlighted immediately, allowing you to make corrections on the fly and generate perfect API documentation from JSON responses.'
    },
    {
      number: 5,
      title: 'Export Your Spec',
      description: 'Once you\'re satisfied with the generated specification, export it in your preferred format. Download as a <a href="/json-formatter/" style="color:var(--primary);text-decoration:underline">JSON file</a> for use with code generation tools, or switch to <a href="/json-to-yaml/" style="color:var(--primary);text-decoration:underline">YAML format</a> for better readability and Git-friendly diffs. Copy the entire specification to your clipboard for quick pasting into documentation systems. Use the preview feature to see how your spec renders in Swagger UI, or create a shareable link to collaborate with team members. All export options maintain full specification integrity.'
    }
  ] as HowToStep[],

  // Educational Content - 3 sections explaining key concepts
  educational: [
    {
      title: 'What is OpenAPI Specification?',
      content: 'OpenAPI Specification (formerly known as Swagger) is a standardized, language-agnostic format for describing RESTful APIs. It uses <a href="/json-formatter/" style="color:var(--primary);text-decoration:underline">JSON</a> or <a href="/json-to-yaml/" style="color:var(--primary);text-decoration:underline">YAML</a> to document your API\'s endpoints, request parameters, response schemas, authentication methods, and more. The specification enables automatic generation of interactive API documentation, client SDKs, server stubs, and testing tools. OpenAPI 3.0 is the current industry standard, while Swagger 2.0 remains widely supported for legacy systems. By providing a machine-readable API contract, OpenAPI facilitates better collaboration between frontend and backend teams, enables automated testing, and ensures consistent REST API documentation across your organization. When you generate OpenAPI specs from JSON examples, you create a formal contract that guides your entire API development process.',
      type: 'info'
    },
    {
      title: 'Why Use OpenAPI for API Documentation?',
      content: 'OpenAPI specifications provide numerous benefits for modern API development and documentation generation. First, they create a single source of truth for your REST API, ensuring documentation stays synchronized with implementation. Second, they enable powerful tooling—generate client libraries in multiple languages, create mock servers for testing, and produce interactive Swagger documentation automatically from your API specs. Third, they improve team collaboration by establishing clear API contracts before development begins. Fourth, they support API-first development workflows, allowing you to design and validate APIs before writing code. Finally, OpenAPI specs integrate seamlessly with popular tools like Swagger UI, Postman, and API Gateway platforms. Converting JSON responses to OpenAPI schemas streamlines this entire process, making API documentation generation faster and more accurate.',
      type: 'tip'
    },
    {
      title: 'JSON vs OpenAPI: Understanding the Difference',
      content: '<a href="/json-formatter/" style="color:var(--primary);text-decoration:underline">JSON</a> (JavaScript Object Notation) is a lightweight data format for representing actual data—the values, structures, and content your API returns. OpenAPI, on the other hand, describes the shape and rules of that data—what fields exist, their types, whether they\'re required, and what formats they follow. Think of JSON as an example response, while OpenAPI is the blueprint. When you convert JSON to OpenAPI, you\'re transforming sample data into a formal specification that documents all possible responses, parameters, and schemas your API can handle. This specification becomes your API\'s contract, guiding development and testing. You can use our <a href="/json-validator/" style="color:var(--primary);text-decoration:underline">JSON validator</a> to ensure your input data is valid before conversion.'
    }
  ] as EducationalSection[],

  // Use Cases - 6 real-world scenarios
  useCases: [
    {
      title: 'API Documentation Generation',
      description: 'Transform your JSON responses into comprehensive, interactive API documentation instantly. Generate Swagger specs and OpenAPI documentation that let developers explore endpoints, test requests, and understand response structures without writing a single line of documentation manually. Perfect for creating developer portals, REST API references, and public-facing documentation that stays synchronized with your actual API implementation. Generate API documentation from JSON examples in seconds.',
      icon: 'fas fa-book'
    },
    {
      title: 'Client SDK Generation',
      description: 'Use your OpenAPI specification to automatically generate client libraries in Python, JavaScript, Java, Go, Ruby, and dozens of other languages. Tools like OpenAPI Generator and Swagger Codegen consume your generated Swagger spec to create fully-typed SDK code, complete with models, API clients, and error handling. This eliminates manual SDK development and ensures consistency across all client implementations. Convert JSON to OpenAPI once, then generate SDKs for every platform.',
      icon: 'fas fa-code'
    },
    {
      title: 'API Testing Automation',
      description: 'Feed your OpenAPI specification into testing frameworks to enable automated API validation. Tools like Dredd, Schemathesis, and Postman can generate test cases from your spec, validating that your actual API responses match the documented schemas. This catches breaking changes early, ensures backward compatibility, and maintains API contract compliance throughout your development lifecycle.',
      icon: 'fas fa-flask'
    },
    {
      title: 'Team Collaboration',
      description: 'Establish clear API contracts before development begins with OpenAPI specifications. Frontend teams can mock API responses and build UIs in parallel while backend teams implement endpoints. The spec serves as the agreed-upon contract, reducing miscommunication and integration issues. Share specifications via version control, ensuring everyone works from the same API definition.',
      icon: 'fas fa-users'
    },
    {
      title: 'API Versioning & Evolution',
      description: 'Maintain multiple versions of your API specification as your API evolves. Document deprecated endpoints, track breaking changes, and communicate version differences clearly to consumers. OpenAPI specs make it easy to compare versions, generate changelogs, and ensure smooth migrations. Use semantic versioning in your spec metadata to communicate the impact of updates.',
      icon: 'fas fa-code-branch'
    },
    {
      title: 'Third-Party Integration',
      description: 'Simplify integrations by providing partners and third-party developers with machine-readable API specifications. They can import your OpenAPI spec into tools like Postman, Insomnia, or Paw for immediate API exploration. Many API gateways and integration platforms accept OpenAPI specs directly, enabling rapid setup of webhooks, triggers, and automated workflows without manual configuration.',
      icon: 'fas fa-plug'
    }
  ] as UseCase[],

  // FAQ - 12 questions optimized for featured snippets
  faqs: [
    {
      question: 'Is this JSON to OpenAPI converter completely free?',
      answer: 'Yes, absolutely. Our JSON to OpenAPI converter is 100% free with no hidden costs, premium tiers, or usage limits. You can convert unlimited JSON files, create specifications with as many endpoints as you need, and export in any format without paying anything. There\'s no signup required, no credit card needed, and no trial period—it\'s free forever. We believe developer tools should be accessible to everyone, whether you\'re a solo developer, startup, or enterprise team.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Your data is completely secure because all conversion happens directly in your browser—nothing is uploaded to our servers. The tool runs entirely client-side using JavaScript, meaning your JSON data, API specifications, and any sensitive information never leave your device. We don\'t collect, store, or transmit your data. There\'s no server-side processing, no database storage, and no third-party data sharing. You can even use this tool offline once the page loads, ensuring complete privacy for sensitive API documentation.'
    },
    {
      question: 'What OpenAPI versions are supported?',
      answer: 'We support both OpenAPI 3.0 (the current standard) and Swagger 2.0 (for legacy compatibility). You can switch between versions with a simple toggle in the settings panel. OpenAPI 3.0 offers more features like multiple servers, improved security definitions, and better schema composition. Swagger 2.0 remains widely supported by older tools and platforms. The converter automatically adjusts the specification format based on your selected version, ensuring full compliance with the chosen standard.'
    },
    {
      question: 'Can I convert large JSON files?',
      answer: 'Yes, there are no strict file size limits. The tool handles large JSON files efficiently since processing happens in your browser using optimized JavaScript. We\'ve successfully tested with JSON files containing thousands of lines and deeply nested structures. However, extremely large files (over 10MB) may take slightly longer to process depending on your device\'s processing power. For best performance with very large files, we recommend using a modern browser like Chrome, Firefox, or Edge on a desktop computer. You can also use our <a href="/json-minifier/" style="color:var(--primary);text-decoration:underline">JSON minifier</a> to reduce file size before conversion if needed.'
    },
    {
      question: 'Do you save or store my data?',
      answer: 'No, we never save or store your data. All processing is client-side—your JSON input and generated specifications exist only in your browser\'s memory and local storage (if you use the browser\'s cache feature). When you close the tab, everything is cleared. We don\'t have servers collecting data, no databases storing specifications, and no logs recording your usage. Your API documentation remains completely private and under your control at all times.'
    },
    {
      question: 'Does it work offline?',
      answer: 'Yes, once the page loads, the converter works offline. Since all processing happens in your browser without server communication, you can use it without an internet connection. This makes it perfect for working in secure environments, during flights, or in locations with unreliable connectivity. Just load the page once while online, and it\'ll remain functional offline. Note that features requiring external resources (like loading JSON from URLs) obviously need internet connectivity.'
    },
    {
      question: 'What output formats are supported?',
      answer: 'The tool outputs OpenAPI specifications in both <a href="/json-formatter/" style="color:var(--primary);text-decoration:underline">JSON</a> and <a href="/json-to-yaml/" style="color:var(--primary);text-decoration:underline">YAML</a> formats. JSON format is ideal for programmatic use with code generators and API tools. YAML format offers better readability for humans and produces cleaner Git diffs for version control. You can toggle between formats instantly without re-converting—the same specification is simply serialized differently. Both formats are fully compliant with OpenAPI standards and work with all major tools like Swagger UI, Postman, and code generators.'
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Absolutely! You can use this tool freely for commercial projects, client work, enterprise applications, or any business purpose without restrictions or licensing fees. The generated OpenAPI specifications are yours to use however you need—publish them, include them in products, share with clients, or integrate into commercial services. There\'s no attribution required, no usage reporting, and no limitations on commercial use. We encourage businesses of all sizes to leverage this tool for professional API documentation.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account creation required. Simply open the tool and start converting immediately. We designed this tool to be friction-free—no signups, no passwords to remember, no email verification, and no profile setup. This approach respects your privacy, saves you time, and lets you focus on creating API documentation rather than managing accounts. If you want to save your work, simply download the generated specification or copy it to your preferred storage location.'
    },
    {
      question: 'How does schema inference work?',
      answer: 'Our schema inference engine analyzes your JSON structure to automatically generate accurate OpenAPI schemas. It examines each field to determine data types (string, number, boolean, array, object), detects special formats (email, UUID, date-time, URL), identifies required vs optional fields, recognizes enum patterns from consistent values, and maps nested objects to component schemas. The algorithm uses pattern recognition and heuristics to create specifications that accurately represent your data structure while remaining flexible enough to handle variations in actual API responses.'
    },
    {
      question: 'Can I add multiple endpoints to one specification?',
      answer: 'Yes, you can add unlimited endpoints to a single OpenAPI specification. Click the "Add Endpoint" button to create additional API routes, configure each with its own path, HTTP method, response code, and JSON schema. All endpoints share the same global settings (API title, version, security schemes) but have independent configurations for paths, parameters, and responses. This lets you document complete APIs with dozens or hundreds of endpoints in one comprehensive specification file.'
    },
    {
      question: 'What security schemes are supported?',
      answer: 'The tool supports all major OpenAPI security schemes: API Key authentication (in header, query, or cookie), OAuth 2.0 flows (authorization code, implicit, password, client credentials), Bearer Token authentication (JWT), HTTP Basic authentication, and OpenID Connect. You can configure security requirements globally for all endpoints or override them per endpoint. The generated specification includes complete security definitions that document how clients should authenticate, making it easy for developers to implement authentication correctly.'
    },
    {
      question: 'What is the difference between OpenAPI and Swagger?',
      answer: 'OpenAPI and Swagger refer to the same specification, but at different points in time. Swagger was the original name created by SmartBear in 2011. In 2015, SmartBear donated the specification to the OpenAPI Initiative under the Linux Foundation, and it was renamed to "OpenAPI Specification." Swagger 2.0 was the last version under the old name. OpenAPI 3.0 and later versions use the new name. Today, "Swagger" typically refers to the tooling ecosystem (Swagger UI, Swagger Editor, Swagger Codegen), while "OpenAPI" refers to the specification itself. Our converter supports both Swagger 2.0 and OpenAPI 3.0 formats for maximum compatibility.'
    },
    {
      question: 'How do I convert JSON schema to OpenAPI?',
      answer: 'JSON Schema and OpenAPI schemas are similar but not identical. OpenAPI 3.0 uses a subset of JSON Schema with some extensions. To convert JSON Schema to OpenAPI using our tool, paste your JSON example (not the schema itself) into the input editor, and we\'ll generate a compliant OpenAPI schema automatically. If you already have a JSON Schema definition, you may need to make minor adjustments since OpenAPI doesn\'t support all JSON Schema keywords (like $schema, $id). Our converter handles the most common scenarios automatically, creating schemas that work with standard OpenAPI tooling.'
    },
    {
      question: 'Can I use this for Swagger 2.0 specifications?',
      answer: 'Yes, absolutely. Our converter supports both OpenAPI 3.0 (the latest version) and Swagger 2.0 (the legacy version). Use the settings panel to toggle between output formats. Swagger 2.0 is still widely used in legacy systems, enterprise software, and older API gateways. The tool automatically adjusts the generated specification to match the chosen version—including differences in security definitions, parameter locations, and schema structures. You can also convert your JSON to Swagger 2.0 and then upgrade to OpenAPI 3.0 later when your systems support it.'
    },
    {
      question: 'Is this tool better than manually writing OpenAPI specs?',
      answer: 'For creating initial specifications from existing APIs, yes—it\'s dramatically faster. Manually writing OpenAPI specifications requires deep knowledge of the spec format, careful attention to syntax, and significant time investment. Our tool generates a complete, valid specification in seconds from JSON examples. However, manual editing still has value for fine-tuning descriptions, adding detailed parameter documentation, or creating specs before implementing APIs (API-first design). The ideal workflow combines both: use our tool to generate the initial structure and schemas quickly, then manually enhance descriptions, examples, and documentation to create a polished final specification.'
    },
    {
      question: 'How do I test the generated OpenAPI spec?',
      answer: 'Use the built-in preview feature to test your specification immediately. Click the "Preview" button to open an interactive Swagger UI view where you can see how your API documentation renders, explore endpoints, and verify that schemas display correctly. For more thorough testing, download the generated specification and import it into tools like Postman (for API testing), Swagger Editor (for validation), or API Gateway platforms (for deployment). You can also use online validators to check OpenAPI compliance. The preview feature catches most issues instantly, saving you from discovering problems later in your development workflow.'
    },
    {
      question: 'Does this work with REST API responses?',
      answer: 'Yes, this tool is specifically designed for RESTful APIs. Paste any JSON response from your REST API endpoints—whether it\'s from GET, POST, PUT, DELETE, or PATCH requests—and the converter will generate appropriate OpenAPI schema definitions. The tool handles typical REST patterns like resource collections (arrays of objects), single resource responses, paginated results, error responses, and nested relationships. For complete API documentation, convert multiple endpoint responses and combine them in a single specification. This approach ensures your OpenAPI spec accurately reflects your actual REST API structure and data formats.'
    }
  ] as FAQItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Supported Input Formats', specification: 'JSON (any valid JSON structure)' },
    { feature: 'Supported Output Formats', specification: 'OpenAPI 3.0 (JSON/YAML), Swagger 2.0 (JSON/YAML)' },
    { feature: 'Processing Speed', specification: 'Real-time (< 100ms for typical files)' },
    { feature: 'File Size Limit', specification: 'No hard limit (browser memory dependent)' },
    { feature: 'Security', specification: 'Complete client-side processing, no server uploads' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge (latest versions)' },
    { feature: 'Endpoint Limit', specification: 'Unlimited endpoints per specification' },
    { feature: 'Schema Features', specification: 'Type inference, format detection, nested objects, arrays' },
    { feature: 'Authentication Support', specification: 'API Key, OAuth2, Bearer, Basic, OpenID Connect' },
    { feature: 'Export Options', specification: 'Download (JSON/YAML), Copy to clipboard, Share link' },
    { feature: 'Preview', specification: 'Built-in Swagger UI integration' },
    { feature: 'Customization', specification: 'Full control over metadata, schemas, examples, security' }
  ] as TechnicalSpec[],

  // Why Choose This Tool - 6 benefits
  whyChoose: [
    {
      title: '100% Free Forever',
      description: 'No hidden costs, no premium features locked behind paywalls, and no surprise charges. This tool is completely free for everyone—individuals, startups, and enterprises alike. We don\'t believe in artificial limitations or freemium models. Every feature is available to every user, from basic conversion to advanced schema customization. Use it as much as you need, convert as many APIs as you want, and export unlimited specifications without ever opening your wallet.',
      color: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: 'Advanced Schema Inference',
      description: 'Our schema inference algorithm represents years of development and real-world testing. It doesn\'t just guess types—it intelligently analyzes patterns, detects special formats, identifies nested relationships, and generates production-quality schemas that accurately model your data. The engine handles edge cases like mixed-type arrays, optional fields, null values, and complex nested structures that simpler converters often mishandle. This results in specifications that actually work with code generators and validation tools.',
      color: 'rgba(33, 150, 243, 0.1)'
    },
    {
      title: 'Privacy-First Design',
      description: 'In an era of data breaches and privacy concerns, we built this tool with security as the foundation. Zero server communication means zero risk of data exposure. Your API documentation—which often contains sensitive business logic, data structures, and implementation details—never enters any database or log file. This client-side architecture isn\'t just a feature, it\'s our core principle. Companies with strict security policies, government contractors, and enterprises handling sensitive data can use this tool confidently.',
      color: 'rgba(255, 193, 7, 0.1)'
    },
    {
      title: 'Multi-Endpoint Excellence',
      description: 'Most JSON-to-OpenAPI converters focus on single-endpoint conversion, forcing you to manually merge specifications or use external tools. We built first-class support for multi-endpoint APIs from the ground up. Add unlimited endpoints with independent configurations, organize them with tags, document different HTTP methods and response codes, and generate one cohesive specification file. This saves hours of manual editing and produces cleaner, more maintainable API documentation.',
      color: 'rgba(233, 30, 99, 0.1)'
    },
    {
      title: 'Real-Time Validation',
      description: 'See errors as they happen, not after you\'ve finished your work. Our real-time validation catches JSON syntax errors, OpenAPI compliance issues, and schema problems instantly. The built-in Swagger UI preview lets you verify your specification renders correctly before sharing it with your team. This immediate feedback loop dramatically reduces iteration time—you\'ll spot and fix issues in seconds rather than discovering them when trying to use the spec in other tools.',
      color: 'rgba(156, 39, 176, 0.1)'
    },
    {
      title: 'Developer-Friendly Interface',
      description: 'We designed this tool for developers, by developers. The VS Code-style interface feels immediately familiar, with syntax highlighting, keyboard shortcuts, and a clean layout that maximizes screen space. Customization options are powerful yet accessible—you don\'t need to be an OpenAPI expert to generate professional specifications. The tool strikes the perfect balance: simple enough for beginners to use immediately, yet powerful enough for experts to fine-tune every detail.',
      color: 'rgba(0, 150, 136, 0.1)'
    }
  ] as WhyChooseItem[],

  // Comparison Table - vs Competitors
  comparison: [
    {
      feature: 'Free Tier',
      ourTool: 'Full Access',
      competitorA: 'Limited',
      competitorB: 'None'
    },
    {
      feature: 'File Size Limit',
      ourTool: 'Unlimited',
      competitorA: '5MB',
      competitorB: '10MB'
    },
    {
      feature: 'Advertisements',
      ourTool: false,
      competitorA: true,
      competitorB: true
    },
    {
      feature: 'Processing Speed',
      ourTool: 'Instant',
      competitorA: '2-3 sec',
      competitorB: '5+ sec'
    },
    {
      feature: 'Privacy',
      ourTool: 'Client-side',
      competitorA: 'Server-side',
      competitorB: 'Server-side'
    },
    {
      feature: 'Multi-Endpoint Support',
      ourTool: true,
      competitorA: false,
      competitorB: 'Limited'
    },
    {
      feature: 'Export Formats',
      ourTool: 'JSON & YAML',
      competitorA: 'JSON only',
      competitorB: 'JSON & YAML'
    },
    {
      feature: 'Schema Inference',
      ourTool: 'Advanced',
      competitorA: 'Basic',
      competitorB: 'Basic'
    },
    {
      feature: 'Format Detection',
      ourTool: true,
      competitorA: false,
      competitorB: 'Limited'
    },
    {
      feature: 'Swagger UI Preview',
      ourTool: true,
      competitorA: false,
      competitorB: true
    },
    {
      feature: 'OpenAPI Versions',
      ourTool: '3.0 & 2.0',
      competitorA: '3.0 only',
      competitorB: '3.0 & 2.0'
    },
    {
      feature: 'Support',
      ourTool: '24/7 Docs',
      competitorA: 'Email only',
      competitorB: 'Email only'
    }
  ] as ComparisonRow[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Formatter',
      description: 'Beautify and format JSON with syntax highlighting. Validate, minify, and organize your JSON data instantly with our free online formatter.',
      icon: 'fas fa-code',
      link: '/json-formatter'
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax and structure in real-time. Detect errors, check formatting, and ensure your JSON is valid before using it in your applications.',
      icon: 'fas fa-check-circle',
      link: '/json-validator'
    },
    {
      title: 'JSON to YAML Converter',
      description: 'Convert JSON to YAML format instantly. Perfect for configuration files, Kubernetes manifests, and creating human-readable data structures.',
      icon: 'fas fa-exchange-alt',
      link: '/json-to-yaml'
    },
    {
      title: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace and formatting. Reduce file size for faster transmission and optimized storage without losing data.',
      icon: 'fas fa-compress',
      link: '/json-minifier'
    },
    {
      title: 'JSON Schema Generator',
      description: 'Generate JSON Schema from your JSON data automatically. Create validation schemas for data validation and API contract testing.',
      icon: 'fas fa-sitemap',
      link: '/json-schema-generator'
    },
    {
      title: 'API Documentation Generator',
      description: 'Create beautiful, interactive API documentation from OpenAPI specifications. Generate developer portals with try-it-out functionality.',
      icon: 'fas fa-book',
      link: '/api-documentation-generator'
    }
  ] as RelatedTool[]
};
