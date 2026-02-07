export const jsonGeneratorHelpSections = [
  {
    title: 'Getting Started',
    icon: 'fas fa-rocket',
    content: `
      <p>Welcome to the JSON Generator! This tool helps you create realistic fake JSON data for testing, prototyping, and development—all in your browser.</p>
      <p><strong>Quick Start:</strong></p>
      <ol>
        <li>Choose a template or start with an empty schema</li>
        <li>Define your data structure using the visual schema builder</li>
        <li>Configure data types and options for each field</li>
        <li>Set the number of records to generate (1-10,000)</li>
        <li>Click Generate and export your data</li>
      </ol>
    `
  },
  {
    title: 'Schema Builder',
    icon: 'fas fa-project-diagram',
    content: `
      <p>Build your JSON structure visually without writing code:</p>
      <ul>
        <li><strong>Add Field:</strong> Click "+" to add a new field to your schema</li>
        <li><strong>Field Name:</strong> Enter the property name (e.g., "email", "userId")</li>
        <li><strong>Data Type:</strong> Select from 50+ types (name, email, number, etc.)</li>
        <li><strong>Nested Objects:</strong> Add "Object" type to create nested structures</li>
        <li><strong>Arrays:</strong> Add "Array" type and configure element type and count</li>
        <li><strong>Reorder:</strong> Drag fields to change their order</li>
        <li><strong>Delete:</strong> Click the trash icon to remove a field</li>
      </ul>
      <p><strong>Tip:</strong> Start with a template and modify it—faster than building from scratch.</p>
    `
  },
  {
    title: 'Data Types - Personal',
    icon: 'fas fa-user',
    content: `
      <p>Generate realistic personal information:</p>
      <ul>
        <li><strong>firstName:</strong> Random first names (locale-aware)</li>
        <li><strong>lastName:</strong> Random last names (locale-aware)</li>
        <li><strong>fullName:</strong> Complete names with first and last</li>
        <li><strong>email:</strong> Valid email format (e.g., john.doe@example.com)</li>
        <li><strong>phone:</strong> Phone numbers in various formats</li>
        <li><strong>username:</strong> Internet usernames</li>
        <li><strong>avatar:</strong> Profile image URLs</li>
        <li><strong>age:</strong> Random ages (configurable range)</li>
        <li><strong>birthday:</strong> Birth dates in ISO format</li>
        <li><strong>gender:</strong> Gender values</li>
      </ul>
      <p>All personal data respects the selected locale for cultural accuracy.</p>
    `
  },
  {
    title: 'Data Types - Address',
    icon: 'fas fa-map-marker-alt',
    content: `
      <p>Generate location and address data:</p>
      <ul>
        <li><strong>streetAddress:</strong> Full street addresses</li>
        <li><strong>city:</strong> City names</li>
        <li><strong>state:</strong> State/province names</li>
        <li><strong>zipCode:</strong> Postal/ZIP codes</li>
        <li><strong>country:</strong> Country names</li>
        <li><strong>countryCode:</strong> ISO country codes (US, GB, etc.)</li>
        <li><strong>latitude:</strong> Geographic latitude coordinates</li>
        <li><strong>longitude:</strong> Geographic longitude coordinates</li>
        <li><strong>timezone:</strong> Timezone identifiers</li>
      </ul>
      <p>Address components are locale-aware and follow regional formats.</p>
    `
  },
  {
    title: 'Data Types - Business',
    icon: 'fas fa-building',
    content: `
      <p>Generate business and professional data:</p>
      <ul>
        <li><strong>company:</strong> Company names</li>
        <li><strong>jobTitle:</strong> Professional job titles</li>
        <li><strong>department:</strong> Department names</li>
        <li><strong>industry:</strong> Industry categories</li>
        <li><strong>catchPhrase:</strong> Business catch phrases</li>
        <li><strong>bs:</strong> Business buzzwords</li>
      </ul>
      <p>Perfect for generating employee records, company directories, and B2B test data.</p>
    `
  },
  {
    title: 'Data Types - Financial',
    icon: 'fas fa-dollar-sign',
    content: `
      <p>Generate financial and monetary data:</p>
      <ul>
        <li><strong>price:</strong> Currency amounts (configurable min/max)</li>
        <li><strong>creditCard:</strong> Credit card numbers (fake but valid format)</li>
        <li><strong>creditCardCVV:</strong> 3-4 digit CVV codes</li>
        <li><strong>iban:</strong> International Bank Account Numbers</li>
        <li><strong>bic:</strong> Bank Identifier Codes (SWIFT)</li>
        <li><strong>currencyCode:</strong> ISO currency codes (USD, EUR, etc.)</li>
        <li><strong>currencyName:</strong> Currency names</li>
        <li><strong>transactionId:</strong> Unique transaction identifiers</li>
      </ul>
      <p><strong>Note:</strong> Credit card numbers pass Luhn validation but are not real cards.</p>
    `
  },
  {
    title: 'Data Types - Internet',
    icon: 'fas fa-globe',
    content: `
      <p>Generate internet and technology data:</p>
      <ul>
        <li><strong>url:</strong> Valid URLs with protocols</li>
        <li><strong>domain:</strong> Domain names</li>
        <li><strong>ipv4:</strong> IPv4 addresses</li>
        <li><strong>ipv6:</strong> IPv6 addresses</li>
        <li><strong>mac:</strong> MAC addresses</li>
        <li><strong>userAgent:</strong> Browser user agent strings</li>
        <li><strong>color:</strong> Hex color codes</li>
        <li><strong>rgb:</strong> RGB color values</li>
        <li><strong>mimeType:</strong> MIME type strings</li>
        <li><strong>fileExtension:</strong> File extensions</li>
      </ul>
    `
  },
  {
    title: 'Data Types - Identifiers',
    icon: 'fas fa-fingerprint',
    content: `
      <p>Generate unique identifiers:</p>
      <ul>
        <li><strong>uuid:</strong> UUID v4 (universally unique identifiers)</li>
        <li><strong>objectId:</strong> MongoDB-style ObjectIDs</li>
        <li><strong>sequentialId:</strong> Auto-incrementing numbers</li>
        <li><strong>alphanumeric:</strong> Random alphanumeric strings</li>
        <li><strong>slug:</strong> URL-friendly slugs</li>
      </ul>
      <p><strong>Unique constraint:</strong> Enable "unique" to ensure no duplicate values across all generated records.</p>
    `
  },
  {
    title: 'Data Types - Date & Time',
    icon: 'fas fa-calendar',
    content: `
      <p>Generate temporal data:</p>
      <ul>
        <li><strong>date:</strong> Dates in ISO format (YYYY-MM-DD)</li>
        <li><strong>datetime:</strong> Full ISO 8601 datetime strings</li>
        <li><strong>timestamp:</strong> Unix timestamps (seconds since epoch)</li>
        <li><strong>past:</strong> Dates in the past (configurable range)</li>
        <li><strong>future:</strong> Dates in the future (configurable range)</li>
        <li><strong>recent:</strong> Recent dates (within last few days)</li>
        <li><strong>month:</strong> Month names</li>
        <li><strong>weekday:</strong> Day of week names</li>
      </ul>
      <p>Configure date ranges in field options for realistic temporal data.</p>
    `
  },
  {
    title: 'Data Types - Text',
    icon: 'fas fa-align-left',
    content: `
      <p>Generate text content:</p>
      <ul>
        <li><strong>word:</strong> Single random words</li>
        <li><strong>words:</strong> Multiple words (configurable count)</li>
        <li><strong>sentence:</strong> Complete sentences</li>
        <li><strong>sentences:</strong> Multiple sentences</li>
        <li><strong>paragraph:</strong> Full paragraphs</li>
        <li><strong>paragraphs:</strong> Multiple paragraphs</li>
        <li><strong>lorem:</strong> Lorem ipsum text (configurable length)</li>
      </ul>
      <p>Text types are great for blog posts, descriptions, comments, and content fields.</p>
    `
  },
  {
    title: 'Data Types - Basic',
    icon: 'fas fa-cubes',
    content: `
      <p>Generate primitive data types:</p>
      <ul>
        <li><strong>string:</strong> Random strings (configurable length)</li>
        <li><strong>number:</strong> Numbers (integer or float, configurable min/max)</li>
        <li><strong>boolean:</strong> true/false values</li>
        <li><strong>null:</strong> Explicit null values</li>
        <li><strong>enum:</strong> Random selection from custom list</li>
        <li><strong>constant:</strong> Fixed value for all records</li>
      </ul>
      <p><strong>Enum example:</strong> Define ["pending", "active", "completed"] and each record gets one randomly.</p>
    `
  },
  {
    title: 'Field Options',
    icon: 'fas fa-cog',
    content: `
      <p>Configure individual field behavior:</p>
      <ul>
        <li><strong>Unique:</strong> No duplicate values across records (for IDs, emails)</li>
        <li><strong>Nullable:</strong> Percentage chance of null value (0-100%)</li>
        <li><strong>Min/Max:</strong> Range constraints for numbers and dates</li>
        <li><strong>Length:</strong> String length constraints</li>
        <li><strong>Pattern:</strong> Regex pattern for custom formats</li>
        <li><strong>Array Count:</strong> Number of elements in array fields</li>
      </ul>
      <p>Options vary by data type—select a field to see available configurations.</p>
    `
  },
  {
    title: 'Templates',
    icon: 'fas fa-file-alt',
    content: `
      <p>Pre-built schemas for common use cases:</p>
      <ul>
        <li><strong>User Profile:</strong> Name, email, avatar, address, registration date</li>
        <li><strong>E-commerce Product:</strong> SKU, name, price, category, inventory</li>
        <li><strong>Blog Post:</strong> Title, author, content, tags, publish date</li>
        <li><strong>API Response:</strong> Pagination, meta, data array structure</li>
        <li><strong>Order Transaction:</strong> Items, totals, shipping, payment</li>
        <li><strong>Employee Record:</strong> Department, salary, manager, hire date</li>
      </ul>
      <p>Click a template to load it instantly. Customize by adding/removing fields.</p>
    `
  },
  {
    title: 'Generation Settings',
    icon: 'fas fa-sliders-h',
    content: `
      <p>Control the generation process:</p>
      <ul>
        <li><strong>Quantity:</strong> Number of records (1 to 10,000)</li>
        <li><strong>Seed:</strong> Number for reproducible "random" data</li>
        <li><strong>Locale:</strong> Region for culturally appropriate data</li>
      </ul>
      <p><strong>Seed values:</strong> Same seed always produces identical data. Great for:</p>
      <ul>
        <li>Reproducible tests and debugging</li>
        <li>Sharing exact data with teammates</li>
        <li>Consistent demo data</li>
      </ul>
      <p>Leave seed empty for true randomness each generation.</p>
    `
  },
  {
    title: 'Locale Support',
    icon: 'fas fa-language',
    content: `
      <p>Generate region-specific data:</p>
      <ul>
        <li><strong>EN-US:</strong> American English (default)</li>
        <li><strong>EN-GB:</strong> British English</li>
        <li><strong>DE:</strong> German</li>
        <li><strong>FR:</strong> French</li>
        <li><strong>ES:</strong> Spanish</li>
        <li><strong>IT:</strong> Italian</li>
        <li><strong>PT:</strong> Portuguese</li>
        <li><strong>JA:</strong> Japanese</li>
        <li><strong>ZH:</strong> Chinese</li>
      </ul>
      <p>Locale affects names, addresses, phone formats, and date conventions. Essential for internationalization testing.</p>
    `
  },
  {
    title: 'Export Formats',
    icon: 'fas fa-download',
    content: `
      <p>Export your generated data:</p>
      <ul>
        <li><strong>JSON:</strong> Standard JSON format (pretty or minified)</li>
        <li><strong>JSONL:</strong> JSON Lines (one record per line)</li>
        <li><strong>CSV:</strong> Flattened data for spreadsheets</li>
        <li><strong>TypeScript:</strong> Auto-generated interfaces + data</li>
      </ul>
      <p><strong>Export options:</strong></p>
      <ul>
        <li><strong>Copy:</strong> Copy to clipboard for quick paste</li>
        <li><strong>Download:</strong> Save as file with timestamp</li>
        <li><strong>Formatting:</strong> 2 spaces, 4 spaces, tabs, or minified</li>
      </ul>
    `
  },
  {
    title: 'Privacy & Security',
    icon: 'fas fa-shield-alt',
    content: `
      <p><strong>100% Client-Side Processing</strong></p>
      <p>Your schemas and generated data never leave your browser:</p>
      <ul>
        <li>No uploads to servers</li>
        <li>No data storage or logging</li>
        <li>No tracking or analytics on your data</li>
        <li>Works completely offline after page load</li>
        <li>GDPR compliant by design</li>
      </ul>
      <p>Perfect for confidential schemas, proprietary data structures, or stealth projects. The tool uses Faker.js library for local generation.</p>
    `
  },
  {
    title: 'Nested Objects & Arrays',
    icon: 'fas fa-sitemap',
    content: `
      <p>Create complex hierarchical structures:</p>
      <p><strong>Nested Object Example:</strong></p>
      <pre>{
  "user": {
    "name": "John Doe",
    "address": {
      "city": "New York",
      "zip": "10001"
    }
  }
}</pre>
      <p><strong>Array Example:</strong></p>
      <pre>{
  "tags": ["tech", "news", "featured"],
  "items": [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
  ]
}</pre>
      <p>Add Object or Array type fields, then define their child structure.</p>
    `
  },
  {
    title: 'Performance Tips',
    icon: 'fas fa-tachometer-alt',
    content: `
      <p><strong>Generation speed by quantity:</strong></p>
      <ul>
        <li><strong>1-100 records:</strong> Instant (&lt;100ms)</li>
        <li><strong>100-1,000 records:</strong> ~1 second</li>
        <li><strong>1,000-5,000 records:</strong> 2-3 seconds</li>
        <li><strong>5,000-10,000 records:</strong> 3-5 seconds</li>
      </ul>
      <p><strong>Tips for large datasets:</strong></p>
      <ul>
        <li>Use modern browsers (Chrome, Firefox, Edge)</li>
        <li>Simpler schemas generate faster</li>
        <li>Disable unique constraints if not needed</li>
        <li>Consider generating in batches for 10,000+ records</li>
      </ul>
    `
  },
  {
    title: 'Troubleshooting',
    icon: 'fas fa-question-circle',
    content: `
      <p><strong>Common issues and solutions:</strong></p>
      <ul>
        <li><strong>Duplicate values:</strong> Enable "unique" constraint on the field</li>
        <li><strong>Wrong locale data:</strong> Check locale setting in generation options</li>
        <li><strong>Missing fields:</strong> Ensure all fields have valid data types selected</li>
        <li><strong>Slow generation:</strong> Reduce quantity or simplify schema</li>
        <li><strong>Browser freezing:</strong> Try smaller batches for 10,000+ records</li>
        <li><strong>Export not working:</strong> Check browser popup blocker settings</li>
      </ul>
      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Start with templates and customize</li>
        <li>Test with small quantities before bulk generation</li>
        <li>Use seeds for reproducible test data</li>
        <li>Match schema to your actual API/database structure</li>
      </ul>
    `
  }
];
