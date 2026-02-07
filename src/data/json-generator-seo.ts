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

export const jsonGeneratorContent = {
  // Hero Section
  title: 'JSON Generator Online Free – Create Fake Test Data Instantly',
  subtitle: 'Generate realistic fake JSON data for testing, prototyping, and development. Free online JSON generator with 50+ data types, custom schemas, and bulk generation up to 10,000 records. 100% client-side, no signup required.',
  
  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Secure & Private' },
    { icon: 'fas fa-bolt', text: 'Instant Results' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
    { icon: 'fas fa-database', text: '50+ Data Types' },
    { icon: 'fas fa-layer-group', text: 'Bulk Generation' },
  ],
  
  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Generate Fake JSON Data: Step-by-Step Guide',
  featuresSectionTitle: 'JSON Generator Features',
  whyChooseSectionTitle: 'Why Choose This JSON Generator?',
  comparisonSectionTitle: 'JSON Generator vs Competitors',
  
  // Key Features - 8 features (Benefit-focused, conversational tone)
  features: [
    {
      icon: 'fas fa-database',
      title: 'Generate Fake JSON with 50+ Realistic Data Types',
      description: 'When you need to generate fake JSON data, you\'re not looking for random gibberish—you need data that looks real. Names that sound like actual names. Emails that follow proper formats. Addresses with real cities and valid zip codes. This JSON generator includes 50+ data types: personal info (names, emails, phones, addresses), business data (companies, job titles, departments), financial records (prices, credit cards, IBANs), internet stuff (URLs, IPs, user agents), and more. Each type uses Faker.js under the hood, which has been generating realistic test data for over a decade. The result? JSON that actually looks like production data. Your UI mockups look convincing. Your tests catch real edge cases. Your demos impress clients. Not just random strings—actually realistic fake data.'
    },
    {
      icon: 'fas fa-project-diagram',
      title: 'Visual Schema Builder for Custom JSON Structures',
      description: 'Forget writing JSON schemas by hand. The visual schema builder lets you construct your data structure by clicking—add fields, pick types, nest objects, create arrays. Want a user object with an address nested inside? Click "Add Object", name it "address", add street/city/zip fields inside. Need an array of 5 products? Add an array field, set the count, define what each item looks like. The tree view shows your entire structure at a glance. Drag fields to reorder them. Delete what you don\'t need. Everything updates the preview in real-time. It\'s like having a visual programming environment for data structures. No JSON syntax to remember, no missing commas, no bracket matching headaches. Just click, configure, generate.'
    },
    {
      icon: 'fas fa-copy',
      title: 'Bulk Generate Up to 10,000 JSON Records Instantly',
      description: 'Need 100 users for your user list component? 1,000 products to stress-test your search? 10,000 records to benchmark your database queries? Just set the quantity and generate. This JSON data generator handles bulk creation without breaking a sweat. We use optimized generation that keeps your browser responsive even at high volumes. 100 records? Instant. 1,000? Under a second. 10,000? A few seconds. Each record is unique—different names, emails, IDs. No duplicates unless you want them. Perfect for seeding databases, testing pagination, stress-testing APIs, or anywhere you need volume. The preview shows sample records so you can verify the structure before generating the full batch.'
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Pre-Built Templates for Common Use Cases',
      description: 'Don\'t want to build a schema from scratch? We\'ve got you covered with pre-built templates: User Profile (name, email, avatar, address, registration date), E-commerce Product (SKU, name, price, category, inventory), Blog Post (title, author, content, tags, publish date), API Response (with pagination, meta, and data arrays), Order Transaction (items, totals, shipping, payment), Employee Record (department, salary, manager, hire date). Click a template, it loads instantly. Then customize—add fields, remove what you don\'t need, tweak the types. Templates are starting points, not straightjackets. They save you 5-10 minutes of setup time and ensure you don\'t forget common fields. Most users start with a template and modify from there.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Your Data Schema Stays on Your Computer',
      description: 'Everything runs in your browser. Your schema definitions, generated data, export files—none of it touches our servers. Open DevTools, watch the network tab. Zero uploads. This matters because you might be generating mock data that resembles your actual production schema. Or your schema includes field names that reveal business logic. Or you\'re working on a stealth project. Whatever the reason, privacy is baked into the architecture. Faker.js runs client-side. JSON generation happens in browser memory. Downloads go straight to your machine. We literally cannot see what schemas you build or what data you generate. Use it on air-gapped networks. Use it for classified projects. The privacy isn\'t a policy—it\'s physics.'
    },
    {
      icon: 'fas fa-random',
      title: 'Reproducible Data with Seed Values',
      description: 'Here\'s a feature power users love: seed-based generation. Set a seed value (any number), and the "random" data becomes reproducible. Same seed = same data, every time. Why does this matter? Testing. If your test fails because of specific generated data, you can reproduce it exactly. Debugging. Share the seed with a teammate, they see the same records you do. Demos. Generate impressive-looking data once, then regenerate it identically for the actual presentation. Version control. Commit the seed, not 10,000 records. The randomness is deterministic—Faker.js uses seeded pseudo-random number generators. It looks random, tests like random, but you can replay it perfectly when needed. Toggle it off when you want true randomness.'
    },
    {
      icon: 'fas fa-download',
      title: 'Export to JSON, JSONL, CSV, and TypeScript',
      description: 'Once you generate JSON data, getting it out is painless. Download as a .json file for direct use. Export as JSONL (JSON Lines) where each record is one line—perfect for streaming and log processing. Need it in a spreadsheet? CSV export flattens your data automatically. Building a TypeScript app? Export includes auto-generated TypeScript interfaces matching your schema. Copy to clipboard for quick paste into your code. All exports preserve your data exactly—no truncation, no encoding issues. Choose formatting: pretty-printed with indentation (readable) or minified (smallest file size). The JSONL format is especially nice for loading into databases line-by-line or processing with Unix tools like jq.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Locale Support for Region-Specific Data',
      description: 'Generating data for a German app? French names look weird. Testing a Japanese product? Western addresses won\'t cut it. This JSON generator supports multiple locales: EN-US, EN-GB, DE, FR, ES, IT, PT, JA, ZH, and more. Switch locales and names, addresses, phone formats, date formats all adjust accordingly. "John Smith" becomes "Hans Schmidt" or "Jean Dupont" or "田中太郎". Addresses use country-appropriate formats—zip codes, states/provinces, postal conventions. Phone numbers follow local patterns. It\'s the difference between obviously fake data and data that actually looks like it belongs in that market. Essential for internationalization testing or demos targeting specific regions.'
    }
  ] as FeatureItem[],

  // How-To Steps - 5 detailed steps (Narrative format with pro tips)
  howToSteps: [
    {
      number: 1,
      title: 'Choose a Template or Start from Scratch',
      description: 'Ready to generate fake JSON? Start by deciding your approach. If you need common structures—user profiles, products, blog posts, API responses—grab a pre-built template from the dropdown. Click it, and the schema loads instantly with all the typical fields already configured. Want something custom? Start with an empty schema and build from scratch. You can also import an existing JSON sample (paste it in, we\'ll detect the structure) or a JSON Schema definition if you have one. Most users find templates save 5-10 minutes of setup. Pro tip: Even if a template isn\'t perfect, start with the closest one and modify it. Faster than building from zero. The schema builder remembers your last configuration too, so you can pick up where you left off.'
    },
    {
      number: 2,
      title: 'Build Your Schema Using the Visual Editor',
      description: 'Now you\'re in the schema builder—this is where you define what your JSON looks like. Click "Add Field" to create a new property. Give it a name (like "email" or "userId"), then pick its data type from the dropdown. The types are organized by category: Basic (string, number, boolean), Personal (name, email, phone), Business (company, jobTitle), Financial (price, creditCard), Internet (url, ip), Date/Time (date, timestamp), Text (lorem, sentence, paragraph). For nested structures, add an "Object" type and define its child fields. For arrays, pick "Array" and configure what each element contains. The tree view on the left shows your entire structure—drag to reorder, click to edit, delete what you don\'t need. Changes reflect in the preview immediately.'
    },
    {
      number: 3,
      title: 'Configure Data Type Options and Constraints',
      description: 'Each data type has options to fine-tune the output. Generating numbers? Set min/max ranges. Strings? Define length constraints. Dates? Pick a date range (like "past year" or "next 30 days"). The options panel appears when you select a field. For names, choose whether you want full names, first only, or last only. For emails, pick realistic domains or custom patterns. For arrays, set how many items (fixed or random range). Enable "unique" to prevent duplicate values across records—critical for IDs and emails. Set "nullable" with a probability (like 10%) to simulate real-world incomplete data. These constraints make your fake data more realistic and catch edge cases your app needs to handle. Most defaults work great, but the power\'s there when you need it.'
    },
    {
      number: 4,
      title: 'Set Quantity and Generate Your Data',
      description: 'Schema ready? Time to generate. Set how many records you need—1 for quick testing, 100 for UI components, 1,000 for performance testing, up to 10,000 for serious stress tests. The quantity input accepts direct numbers or use the preset buttons. For reproducible data, enter a seed value—same seed always generates identical records (great for testing and debugging). Pick your locale if you need region-specific data. Then hit "Generate". Small batches appear instantly. Large batches (1,000+) take a second or two but won\'t freeze your browser—we\'ve optimized for smooth performance. The preview updates showing sample records. If something looks wrong, tweak your schema and regenerate. The feedback loop is fast enough to experiment freely.'
    },
    {
      number: 5,
      title: 'Export or Copy Your Generated JSON Data',
      description: 'Got data that looks good? Export it. Click "Copy" for instant clipboard access—paste directly into your code, Postman, or database tool. Hit "Download" to save as a .json file with a timestamp. Need other formats? Choose JSONL for line-delimited output (one record per line—great for streaming or Unix tools). Pick CSV to flatten the data for spreadsheets. Select "TypeScript" to get auto-generated interfaces matching your schema. Control formatting: pretty-print with 2 or 4 spaces for readability, or minified for smallest file size. Your generated data works anywhere: REST APIs, GraphQL, MongoDB, unit tests, <a href="/json-formatter/" style="color:var(--primary);text-decoration:underline">JSON formatters</a>, you name it. Need to tweak and regenerate? Your schema stays intact until you change it.'
    }
  ] as HowToStep[],

  // Educational Content - 3 sections (Human storytelling format)
  educational: [
    {
      title: 'What is Mock Data? Understanding Fake JSON Generation',
      content: 'Mock data is fake but realistic-looking information used for testing and development. When you generate fake JSON, you\'re creating placeholder data that mimics production records without using actual user information. Why does this matter? Because you can\'t (and shouldn\'t) test with real customer data. Privacy laws prohibit it. Security best practices forbid it. And frankly, production data is messy and inconsistent—bad for testing. Mock data gives you controlled, predictable test cases. A JSON data generator creates this mock data automatically, using libraries like Faker.js to produce realistic names, emails, addresses, and hundreds of other data types. The result looks real enough to catch UI bugs, performance issues, and edge cases, without any privacy risk. It\'s the standard approach for frontend development, API testing, and database seeding across the industry.',
      type: 'info'
    },
    {
      title: 'Why Generate Fake JSON? Key Benefits for Developers',
      content: 'Real talk: waiting for backend APIs to generate test data is painful. The backend team is busy. The staging database has weird legacy records. Production data requires sanitization. Meanwhile, your feature sits unfinished. A fake JSON generator solves this by letting you create exactly the data you need, instantly. Testing a user list with 500 entries? Generate them in seconds. Need products with specific price ranges? Configure and generate. Want to test how your app handles null values or empty arrays? Add them to your schema. Mock data also enables parallel development—frontend and backend teams work simultaneously against agreed schemas. For demos, realistic fake data impresses clients without exposing sensitive information. For testing, you can create edge cases (extremely long names, special characters, boundary values) that rarely occur in production but definitely break things.',
      type: 'tip'
    },
    {
      title: 'JSON Test Data Best Practices',
      content: 'Generating mock JSON is easy. Generating useful mock JSON requires thought. First, match your production schema exactly—same field names, same nesting, same types. A mismatch means your tests pass against fake data but fail against real APIs. Second, include edge cases: empty strings, null values, maximum lengths, special characters like unicode and emojis. These catch bugs that happy-path data misses. Third, use realistic ranges—prices between $0.99 and $999.99, ages between 18 and 100, dates within logical bounds. Unrealistic data leads to unrealistic confidence. Fourth, keep your schemas version-controlled. When the API changes, update the schema and regenerate—don\'t manually edit 500 records. Fifth, use seed values for reproducible failures. When a test catches a bug, the seed lets you reproduce it exactly while debugging. Our <a href="/json-validator/" style="color:var(--primary);text-decoration:underline">JSON validator</a> can verify your generated data matches expected schemas.'
    }
  ] as EducationalSection[],

  // Use Cases - 6 real-world scenarios (Problem → Solution structure)
  useCases: [
    {
      title: 'Frontend Development & UI Testing',
      icon: 'fas fa-laptop-code',
      description: 'You\'re building a React component that displays a list of users. The backend isn\'t ready. You could hardcode 3 users and call it done, but then you miss how the component handles 50 users, or users with really long names, or users with missing profile pictures. Generate 100 realistic users with our JSON generator—varied name lengths, some with null fields, some with special characters. Now your component gets battle-tested against realistic data variety. Find that the layout breaks at 500px width when names exceed 30 characters? Better to catch that now than in production. We use this workflow constantly: define the data shape in the schema builder, generate samples, iterate on the UI, generate larger batches for stress testing.'
    },
    {
      title: 'API Development & Integration Testing',
      icon: 'fas fa-plug',
      description: 'Building a REST API? You need test data for every endpoint. GET /users needs 100 user records. GET /products needs products with all edge cases—$0 prices, out-of-stock items, really long descriptions. POST endpoints need valid payloads to test creation. This fake JSON generator creates all of it. Define schemas matching your API contracts, generate payloads for Postman collections, create bulk records for seeding your test database. For integration tests, seed consistent data using a seed value—tests are reproducible and failures are debuggable. When your API schema changes, update the generator schema once and regenerate everything. No manual JSON editing across dozens of test files.'
    },
    {
      title: 'Database Seeding & Migration Testing',
      icon: 'fas fa-database',
      description: 'Testing a database migration? You need data in the old schema to migrate. Your dev database is empty. Production has millions of records you can\'t copy. Solution: generate fake JSON that matches your production schema structure. Import it into your dev database, run the migration, verify the results. Need 10,000 records to test performance? Generate them. Need specific edge cases—null foreign keys, orphaned records, boundary dates—to test migration edge handling? Configure them in the schema. When you\'re seeding a new database for local development, this is even more useful. Define once, generate as many times as you need. Export as SQL INSERTs or JSON for MongoDB imports.'
    },
    {
      title: 'Demos & Client Presentations',
      icon: 'fas fa-presentation',
      description: 'You\'re demoing the app to a client. The staging environment has embarrassing test data like "asdf@test.com" and "Test User 123". Or worse, actual customer data that shouldn\'t be shown. Generate professional-looking fake data: realistic company names, proper email formats, convincing addresses. The app looks polished. No awkward explanations about test data. Use a seed value so you can regenerate the exact same data before the demo—consistency matters when you\'ve rehearsed with specific records. For sales demos, generate data that matches the client\'s industry: if they\'re e-commerce, generate products; if they\'re healthcare, generate patient records (obviously fake). It shows you understand their domain.'
    },
    {
      title: 'Load Testing & Performance Benchmarking',
      icon: 'fas fa-tachometer-alt',
      description: 'Is your app fast with 10 records? What about 10,000? Performance issues hide until you throw volume at them. Generate large datasets to stress-test: bulk inserts, paginated queries, search across thousands of records, rendering massive lists. Our JSON data generator handles 10,000 records smoothly—download as JSONL for line-by-line processing, import into databases, feed to load testing tools. Vary the data shape: some records with minimal fields, some with every optional field populated. This catches performance cliffs that synthetic load tools miss because they use identical records. Real-world data is varied; your test data should be too.'
    },
    {
      title: 'Documentation & API Examples',
      icon: 'fas fa-book',
      description: 'Good API docs need realistic examples. But writing example JSON by hand is tedious and the results look obviously fake. Generate JSON data that looks production-quality: proper UUIDs, realistic timestamps, varied content. Copy it into your API documentation. Need request body examples? Response examples? Error response payloads? Generate them all from schemas that match your actual API. When the API changes, regenerate examples instead of manually editing. Your <a href="/json-to-openapi/" style="color:var(--primary);text-decoration:underline">OpenAPI specifications</a> can reference these examples. Technical writers love this workflow—they define the schema once and generate fresh examples whenever docs need updating.'
    }
  ] as UseCase[],

  // FAQ - 12 questions (Natural phrasing, conversational answers)
  faqs: [
    {
      question: 'How do I generate fake JSON data?',
      answer: 'Pick a template or build a custom schema using the visual editor. Each field gets a name and a data type (name, email, price, etc.). Set how many records you need—1 to 10,000. Click generate. That\'s it. The preview shows your data instantly. Copy to clipboard or download as a file. No account needed, no limits, completely free. The visual schema builder means you never have to write JSON by hand. Just click to add fields, pick types from dropdowns, nest objects as needed. Changes preview in real-time so you see exactly what you\'ll get before generating the full batch.'
    },
    {
      question: 'What data types can this JSON generator create?',
      answer: 'Over 50 types across multiple categories. Personal: names (first, last, full), emails, phone numbers, addresses (street, city, state, zip, country), ages, birthdays, usernames. Business: company names, job titles, departments, industries. Financial: prices, credit card numbers (fake but valid format), IBANs, currency codes. Internet: URLs, domains, IP addresses (v4 and v6), user agents, MAC addresses. Identifiers: UUIDs, object IDs, sequential IDs. Date/Time: dates, timestamps, ISO strings, relative dates. Text: lorem ipsum, sentences, paragraphs, words. Boolean, numbers with ranges, arrays, nested objects. If it\'s commonly used in JSON, we probably support it.'
    },
    {
      question: 'Is this JSON generator really free?',
      answer: 'Completely free, no catches. No signup. No trial period. No "basic tier" with limits. Every feature works for everyone. Generate 10 records or 10,000—doesn\'t matter. Export in any format—all free. Use it for personal projects, client work, enterprise applications. We\'re not going to start charging or add a paywall. Why? Because mock data generation should be a solved problem, not a business model. The tool runs entirely in your browser, so we don\'t even have server costs for your data. It\'s free because there\'s no reason for it not to be.'
    },
    {
      question: 'Is my data schema safe? Does anything get uploaded?',
      answer: 'Nothing uploads. Everything runs in your browser. Your schema definitions, generated data, exports—all local. Open DevTools and watch the Network tab while you generate. Zero requests with your data. This is architecturally client-side, not a privacy policy promise. Faker.js runs in the browser. JSON generation happens in JavaScript. Downloads go directly to your machine. We literally cannot see your schemas or generated data. Use this for confidential projects, proprietary data structures, anything sensitive. The privacy comes from the architecture, not trust.'
    },
    {
      question: 'How many records can I generate at once?',
      answer: 'Up to 10,000 records in a single generation. For most use cases—UI testing, API development, demos—100-1,000 records is plenty. But if you need to stress-test with volume, 10,000 is there. Performance: 100 records is instant, 1,000 takes about a second, 10,000 takes a few seconds. The browser stays responsive throughout. For truly massive datasets (100,000+), consider generating in batches or using a backend solution. But for typical development and testing needs, 10,000 covers basically every scenario we\'ve seen.'
    },
    {
      question: 'Can I create nested JSON objects and arrays?',
      answer: 'Absolutely. Add a field with type "Object" and it becomes a container for child fields. Add "Array" and configure what each element looks like plus how many elements to generate. Nest as deep as you need—objects inside objects inside arrays. The tree view in the schema builder shows your entire structure clearly. This handles complex real-world schemas: users with addresses with multiple phone numbers each, orders with line items with product details. Click to expand/collapse levels. Drag to reorder. The visual approach makes complex nesting manageable without bracket-matching headaches.'
    },
    {
      question: 'What is seed-based generation?',
      answer: 'Seeds make "random" data reproducible. Set a seed value (any number), and the generator produces the same data every time you use that seed. Same seed = same names, same emails, same everything. Why is this useful? Testing: reproduce failures exactly. Debugging: share a seed with teammates so everyone sees identical data. Demos: generate impressive data once, regenerate it identically for the presentation. Version control: commit seeds instead of massive JSON files. The randomness is pseudo-random (deterministic based on the seed), which means it looks random but can be replayed perfectly. Toggle seeds off when you want true randomness.'
    },
    {
      question: 'What export formats are supported?',
      answer: 'JSON (pretty or minified), JSONL (JSON Lines—one record per line), CSV (flattened for spreadsheets), and TypeScript (auto-generated interfaces matching your schema). JSON is standard for APIs and databases. JSONL is perfect for streaming, log processing, and tools like jq. CSV works for importing into Excel or data analysis tools. TypeScript export gives you type definitions alongside the data—huge time saver for TypeScript projects. Copy to clipboard for quick paste, or download as files. All exports preserve your data exactly.'
    },
    {
      question: 'Can I save and reuse my schemas?',
      answer: 'Yes, schemas save to browser localStorage automatically. Come back later, your last schema is still there. Export schemas as JSON files to backup or share with teammates. Import saved schemas with one click. Use templates as starting points, customize them, save your customized version. For teams, export your schema definition and share it—everyone generates consistent data structures. This is especially useful when your API schema stabilizes and you want everyone using the same test data structure.'
    },
    {
      question: 'Does it support different locales/languages?',
      answer: 'Yes. Switch between locales and generated data adapts: names match cultural patterns, addresses use country-appropriate formats, phone numbers follow local conventions. Supported locales include EN-US, EN-GB, DE (German), FR (French), ES (Spanish), IT (Italian), PT (Portuguese), JA (Japanese), ZH (Chinese), and more. This matters for internationalization testing—make sure your UI handles German names, Japanese characters, or French addresses correctly. Also useful for demos targeting specific markets. The locale selector is in the settings panel.'
    },
    {
      question: 'How is this different from Mockaroo?',
      answer: 'Mockaroo is great but requires signup for full features and limits the free tier to 1,000 rows. Their data goes through servers. We\'re 100% free with no limits, completely client-side (your data never leaves your browser), and require no account. Mockaroo has more data types and database-specific exports, which is valuable for some use cases. But for most developers who need quick, private, unlimited mock JSON generation, we\'re faster to use and more privacy-friendly. Both tools work—we just prioritize different things.'
    },
    {
      question: 'Can I generate unique values like IDs and emails?',
      answer: 'Yes. Enable the "unique" constraint on any field. UUIDs are unique by definition. For other types like emails or usernames, the unique option ensures no duplicates across all generated records. This is critical for IDs that become primary keys, emails that must be unique in your system, and other constrained fields. The generator tracks values as it creates records and ensures uniqueness within the batch. For truly unique across multiple generation sessions, use UUIDs or include timestamps in your patterns.'
    }
  ] as FAQItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Data Types', specification: '50+ types (personal, business, financial, internet, dates, text)' },
    { feature: 'Bulk Generation', specification: 'Up to 10,000 records per generation' },
    { feature: 'Generation Speed', specification: '100 records instant, 1,000 <1s, 10,000 <5s' },
    { feature: 'Schema Definition', specification: 'Visual builder, JSON Schema import, sample detection' },
    { feature: 'Export Formats', specification: 'JSON, JSONL, CSV, TypeScript interfaces' },
    { feature: 'Security', specification: '100% client-side, zero server uploads' },
    { feature: 'Browser Support', specification: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+' },
    { feature: 'Core Library', specification: 'Faker.js 8.x (battle-tested data generation)' },
    { feature: 'Locale Support', specification: 'EN-US, EN-GB, DE, FR, ES, IT, PT, JA, ZH, more' },
    { feature: 'Reproducibility', specification: 'Seed-based generation for deterministic output' },
    { feature: 'Nesting', specification: 'Unlimited depth, objects and arrays' },
    { feature: 'Persistence', specification: 'LocalStorage for schemas and templates' }
  ] as TechnicalSpec[],

  // Why Choose This Tool - 6 benefits (Conversational tone)
  whyChoose: [
    {
      title: 'Unlimited and Actually Free',
      description: 'When we say free, we mean free. No signup wall. No "basic tier" with artificial limits. No credit card required. No "upgrade to Pro" upsells. Generate 10 records or 10,000—same experience. Export in any format—no paywall. Use it for hobby projects or Fortune 500 enterprise apps—still free. Most "free" JSON generators have catches: Mockaroo limits rows, others require accounts, some watermark exports. Not here. Every feature, for everyone, always. Why? Because mock data generation is a utility that should just work, not a SaaS opportunity. Plus, running client-side means we have no server costs anyway.',
      color: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: 'Privacy by Architecture',
      description: 'Your schemas and generated data never touch our servers. This isn\'t a privacy policy—it\'s how the tool is built. Everything runs in your browser: Faker.js generates data client-side, JSON assembly happens in JavaScript, exports download directly to your machine. Open DevTools and verify: zero network requests with your data. Why does this matter? Because your schema might reveal proprietary data structures. Your generated test data might resemble production patterns. You might be working on a stealth project. None of our business, literally—we can\'t see it even if we tried.',
      color: 'rgba(33, 150, 243, 0.1)'
    },
    {
      title: 'Visual Schema Builder (No JSON Writing)',
      description: 'Building JSON schemas by hand is error-prone and tedious. Miss a comma, forget a bracket, mistype a field name—and you\'re debugging syntax instead of building features. Our visual builder eliminates this entirely. Click to add fields. Pick types from dropdowns. Drag to reorder. Nest objects and arrays visually. The tree view shows your entire structure. Changes preview instantly. It\'s like having a visual programming environment for data structures. Developers who\'ve used it say they can\'t go back to manual JSON schema writing. It\'s just faster and less frustrating.',
      color: 'rgba(255, 193, 7, 0.1)'
    },
    {
      title: '50+ Realistic Data Types',
      description: 'Random strings don\'t cut it for real testing. You need names that look like names, emails that follow valid formats, prices in realistic ranges. Faker.js powers our generation—the same library used by thousands of production apps for over a decade. Personal data types know cultural name patterns. Addresses include valid cities and postal codes. Credit cards pass Luhn validation. The data is fake but convincing. Your UI mockups look professional. Your tests catch formatting edge cases. Your demos impress clients. Real-world-looking fake data, generated in seconds.',
      color: 'rgba(233, 30, 99, 0.1)'
    },
    {
      title: 'Seed Values for Reproducible Tests',
      description: 'Found a bug with specific generated data? Seed values let you reproduce it exactly. Share the seed with your team—everyone sees identical records. Run the same seed in CI—consistent test data across environments. Set a seed for your demo—regenerate that impressive dataset right before presenting. The randomness is pseudo-random, meaning same seed always produces same output. This transforms "random" test data from unpredictable noise into controlled, reproducible fixtures. Essential for serious testing workflows where you need to debug failures reliably.',
      color: 'rgba(156, 39, 176, 0.1)'
    },
    {
      title: 'Templates to Skip the Setup',
      description: 'Don\'t build schemas from scratch when templates exist. User profiles, e-commerce products, blog posts, API responses, order transactions, employee records—common patterns ready to use. Click a template, it loads instantly. Then customize: add fields you need, remove ones you don\'t, tweak data types. Templates save 5-10 minutes of setup and ensure you don\'t forget common fields. Most users start with the closest template and modify from there. Faster than building from zero, and you benefit from schemas refined by other developers\' needs.',
      color: 'rgba(0, 150, 136, 0.1)'
    }
  ] as WhyChooseItem[],

  // Comparison Table - vs Competitors
  comparison: [
    {
      feature: 'Free Tier',
      ourTool: 'Unlimited',
      competitorA: '1,000 rows',
      competitorB: 'Limited'
    },
    {
      feature: 'Signup Required',
      ourTool: false,
      competitorA: true,
      competitorB: true
    },
    {
      feature: 'Max Records',
      ourTool: '10,000',
      competitorA: '1,000 free',
      competitorB: '5,000'
    },
    {
      feature: 'Data Privacy',
      ourTool: 'Client-side',
      competitorA: 'Server-side',
      competitorB: 'Server-side'
    },
    {
      feature: 'Visual Builder',
      ourTool: true,
      competitorA: true,
      competitorB: false
    },
    {
      feature: 'Data Types',
      ourTool: '50+',
      competitorA: '100+',
      competitorB: '30+'
    },
    {
      feature: 'Seed Support',
      ourTool: true,
      competitorA: true,
      competitorB: false
    },
    {
      feature: 'Locale Support',
      ourTool: '10+ locales',
      competitorA: '10+ locales',
      competitorB: 'EN only'
    },
    {
      feature: 'Export Formats',
      ourTool: '4 formats',
      competitorA: '6 formats',
      competitorB: '2 formats'
    },
    {
      feature: 'TypeScript Export',
      ourTool: true,
      competitorA: false,
      competitorB: false
    },
    {
      feature: 'Offline Support',
      ourTool: true,
      competitorA: false,
      competitorB: false
    },
    {
      feature: 'Advertisements',
      ourTool: false,
      competitorA: false,
      competitorB: true
    }
  ] as ComparisonRow[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Formatter',
      description: 'Beautify and format your generated JSON with syntax highlighting. Validate structure and organize data instantly.',
      icon: 'fas fa-code',
      link: '/json-formatter'
    },
    {
      title: 'JSON Validator',
      description: 'Validate your generated JSON against schemas. Ensure data integrity and catch structural issues.',
      icon: 'fas fa-check-circle',
      link: '/json-validator'
    },
    {
      title: 'JSON to OpenAPI',
      description: 'Convert your JSON data to OpenAPI specifications. Document APIs using your generated sample data.',
      icon: 'fas fa-file-code',
      link: '/json-to-openapi'
    },
    {
      title: 'JSON Diff',
      description: 'Compare different versions of generated JSON. Track schema changes and data differences.',
      icon: 'fas fa-not-equal',
      link: '/json-diff'
    },
    {
      title: 'JSON Flattener',
      description: 'Flatten nested JSON structures for CSV export or database imports. Simplify complex hierarchies.',
      icon: 'fas fa-compress-alt',
      link: '/json-flattener'
    },
    {
      title: 'CSV to JSON',
      description: 'Import existing CSV data and convert to JSON. Combine with generated data for hybrid datasets.',
      icon: 'fas fa-table',
      link: '/csv-to-json'
    }
  ] as RelatedTool[]
};
