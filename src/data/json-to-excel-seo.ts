/**
 * SEO content for JSON to Excel tool
 */

import type { FeatureItem } from '@/types';

import type {
  ComparisonRow,
  FAQItem,
  HowToStep,
  RelatedTool,
  TechnicalSpec,
  UseCase,
  WhyChooseItem,
} from '@/data/json-to-openapi-seo';

type TrustBadge = { icon: string; text: string };
type EducationalSection = { title: string; content: string };

export const jsonToExcelContent = {
  // Meta
  title: 'JSON to Excel Converter - Free Online JSON to XLSX Tool',
  subtitle:
    'Convert JSON to Excel (XLSX) online instantly. Handle nested objects, customize columns, preview data before download. Free, private, client-side conversion - your data never leaves your browser.',
  description:
    'Free online JSON to Excel converter. Convert JSON to XLSX with nested object flattening, column customization, and live preview. 100% client-side - your data stays private.',

  // Trust Badges
  trustBadges: [
    { icon: 'fas fa-gift', text: '100% Free' },
    { icon: 'fas fa-shield-alt', text: 'Client-Side' },
    { icon: 'fas fa-file-excel', text: 'XLSX/XLS/CSV' },
    { icon: 'fas fa-layer-group', text: 'Nested Support' },
    { icon: 'fas fa-eye', text: 'Live Preview' },
    { icon: 'fas fa-user-slash', text: 'No Signup' },
  ] as TrustBadge[],

  // Section Titles (H2 headings)
  howToSectionTitle: 'How to Convert JSON to Excel (Step-by-Step)',
  featuresSectionTitle: 'JSON to Excel Converter Features',
  whyChooseSectionTitle: 'Why Use This JSON to Excel Converter?',
  comparisonSectionTitle: 'JSON to Excel Converter Comparison',

  // Key Features
  features: [
    {
      icon: 'fas fa-file-excel',
      title: 'One-Click Excel Download',
      description:
        'Convert JSON to Excel with a single click. Download as XLSX (Excel 2007+), XLS (legacy), or CSV for maximum compatibility. No signup, no limits, completely free.',
    },
    {
      icon: 'fas fa-layer-group',
      title: 'Nested Object Flattening',
      description:
        'Automatically flatten nested JSON objects to tabular format using dot notation (e.g., user.address.city). Configure flattening depth to control how deep to go.',
    },
    {
      icon: 'fas fa-columns',
      title: 'Column Customization',
      description:
        'Select which columns to include, rename headers for clarity, and reorder columns by drag-and-drop. Full control over your Excel output.',
    },
    {
      icon: 'fas fa-eye',
      title: 'Live Data Preview',
      description:
        'See exactly how your data will look before downloading. Preview updates in real-time as you adjust settings. No surprises in your exported file.',
    },
    {
      icon: 'fas fa-table',
      title: 'Smart Array Handling',
      description:
        'Arrays of objects become multiple rows automatically. Primitive arrays are handled intelligently. Mixed data types are detected and converted properly.',
    },
    {
      icon: 'fas fa-cog',
      title: 'Excel Formatting Options',
      description:
        'Auto-fit column widths, bold headers, freeze header row, and enable auto-filter. Create professional spreadsheets ready for analysis.',
    },
    {
      icon: 'fas fa-tachometer-alt',
      title: 'Handle Large Files',
      description:
        'Process JSON files up to 10MB. Our optimized converter handles thousands of rows without breaking a sweat. See row and column counts before export.',
    },
    {
      icon: 'fas fa-lock',
      title: '100% Client-Side Processing',
      description:
        'Your JSON data never leaves your browser. All conversion happens locally using JavaScript. Perfect for sensitive data and confidential information.',
    },
  ] as FeatureItem[],

  // How-To Steps
  howToSteps: [
    {
      number: 1,
      title: 'Paste or Upload Your JSON',
      description:
        'Copy your JSON data from any source - API response, file, or code - and paste it into the input panel. You can also drag-and-drop a .json file or click to upload.',
    },
    {
      number: 2,
      title: 'Preview the Converted Data',
      description:
        'As soon as you paste, the preview table shows how your data will look in Excel. See the detected structure, row count, and column types instantly.',
    },
    {
      number: 3,
      title: 'Customize Export Settings',
      description:
        'Choose your file format (XLSX, XLS, CSV). Set the filename and sheet name. Enable nested flattening if your JSON has objects within objects.',
    },
    {
      number: 4,
      title: 'Select and Rename Columns',
      description:
        'In the Columns tab, check/uncheck columns to include. Click on column names to rename them. Drag columns to reorder them in your output.',
    },
    {
      number: 5,
      title: 'Download Your Excel File',
      description:
        'Click "Download Excel" to save your file. The conversion happens instantly in your browser. Use the file in Excel, Google Sheets, or any spreadsheet app.',
    },
  ] as HowToStep[],

  // Educational Content
  educational: [
    {
      title: 'When to Convert JSON to Excel',
      content:
        'Convert JSON to Excel when you need to analyze API data in a spreadsheet, share data with non-technical colleagues, create reports from JSON exports, or import data into systems that only accept Excel. Excel makes JSON data sortable, filterable, and easier to visualize.',
    },
    {
      title: 'Understanding Nested JSON Flattening',
      content:
        'Nested JSON objects (objects inside objects) must be flattened for tabular formats like Excel. Flattening converts nested keys like {user: {name: "John"}} into flat columns like "user.name". This preserves all data while making it spreadsheet-compatible.',
    },
    {
      title: 'Choosing the Right Format',
      content:
        'XLSX is the modern Excel format with better features and smaller file sizes. XLS is for compatibility with older Excel versions (2003 and earlier). CSV is a simple text format that works everywhere but loses some Excel features like multiple sheets.',
    },
  ] as EducationalSection[],

  // Use Cases
  useCases: [
    {
      icon: 'fas fa-chart-bar',
      title: 'Data Analysis',
      description:
        'Convert API responses or JSON exports to Excel for analysis with pivot tables, charts, and formulas. Excel\'s data analysis tools work best with tabular data.',
    },
    {
      icon: 'fas fa-users',
      title: 'Share with Team',
      description:
        'Need to share JSON data with colleagues who prefer spreadsheets? Convert to Excel for a familiar format that anyone can open and understand.',
    },
    {
      icon: 'fas fa-file-import',
      title: 'Database Import',
      description:
        'Many databases and CRM systems accept Excel imports. Convert your JSON data to Excel as an intermediate format for importing into other systems.',
    },
    {
      icon: 'fas fa-print',
      title: 'Reports & Documentation',
      description:
        'Create printable reports from JSON data. Excel\'s formatting makes it easy to prepare data for presentations, documentation, or printing.',
    },
  ] as UseCase[],

  // Why Choose
  whyChoose: [
    {
      title: 'Handles Complex JSON',
      description:
        'Deep nesting, arrays of objects, mixed types - our converter handles them all. Automatic structure detection with configurable flattening depth.',
    },
    {
      title: 'Real Preview Before Export',
      description:
        'See exactly what your Excel file will contain. Preview updates as you change settings. No more trial-and-error exports.',
    },
    {
      title: 'Complete Privacy',
      description:
        'Your data never touches our servers. Everything runs in your browser using client-side JavaScript. Safe for sensitive and confidential data.',
    },
    {
      title: 'Column Control',
      description:
        'Choose columns, rename headers, reorder fields. Export exactly what you need, how you need it. No unnecessary data in your spreadsheet.',
    },
    {
      title: 'Multiple Formats',
      description:
        'Export as XLSX for modern Excel, XLS for legacy support, or CSV for universal compatibility. One tool, multiple outputs.',
    },
    {
      title: 'Professional Formatting',
      description:
        'Auto-fit columns, bold headers, frozen rows, auto-filter. Create polished spreadsheets ready for business use.',
    },
  ] as WhyChooseItem[],

  // Technical Specifications
  technicalSpecs: [
    { feature: 'Max File Size', specification: '10 MB JSON input' },
    { feature: 'Max Rows', specification: '1,048,576 (Excel limit)' },
    { feature: 'Max Columns', specification: '16,384 (Excel limit)' },
    { feature: 'Output Formats', specification: 'XLSX, XLS, CSV' },
    { feature: 'Nesting Depth', specification: 'Up to 10 levels' },
    { feature: 'Browser Support', specification: 'Chrome, Firefox, Safari, Edge' },
    { feature: 'Data Privacy', specification: '100% client-side processing' },
    { feature: 'Unicode Support', specification: 'Full UTF-8 support' },
  ] as TechnicalSpec[],

  // Comparison Table
  comparison: [
    {
      feature: 'Price',
      ourTool: '100% Free',
      competitorA: 'Free with limits',
      competitorB: 'Paid only',
    },
    {
      feature: 'Privacy',
      ourTool: 'Client-side only',
      competitorA: 'Server upload',
      competitorB: 'Server upload',
    },
    {
      feature: 'Nested Objects',
      ourTool: 'Full flattening',
      competitorA: 'Basic only',
      competitorB: 'Manual config',
    },
    {
      feature: 'Live Preview',
      ourTool: 'Yes, real-time',
      competitorA: 'No',
      competitorB: 'After conversion',
    },
    {
      feature: 'Column Control',
      ourTool: 'Select, rename, reorder',
      competitorA: 'Select only',
      competitorB: 'No',
    },
    {
      feature: 'Output Formats',
      ourTool: 'XLSX, XLS, CSV',
      competitorA: 'XLSX only',
      competitorB: 'XLSX, CSV',
    },
    {
      feature: 'File Size Limit',
      ourTool: '10 MB',
      competitorA: '1 MB',
      competitorB: '5 MB',
    },
    {
      feature: 'Signup Required',
      ourTool: 'No',
      competitorA: 'Yes',
      competitorB: 'Yes',
    },
  ] as ComparisonRow[],

  // FAQs
  faqs: [
    {
      question: 'How do I convert JSON to Excel?',
      answer:
        'Paste your JSON into the input area or upload a JSON file. The converter automatically detects the structure and creates a preview. Customize columns if needed, then click "Download Excel" to get your XLSX file.',
    },
    {
      question: 'Is my JSON data secure?',
      answer:
        'Yes, completely. All processing happens in your browser using JavaScript. Your JSON data never leaves your computer and is never sent to our servers. This makes it safe for sensitive and confidential data.',
    },
    {
      question: 'How are nested objects handled?',
      answer:
        'Nested objects are flattened using dot notation. For example, {user: {name: "John"}} becomes a column called "user.name" with value "John". You can configure the flattening depth in settings.',
    },
    {
      question: 'What JSON structures are supported?',
      answer:
        'Arrays of objects (most common), single objects, arrays of primitives, and deeply nested structures. The converter analyzes your data and chooses the best conversion strategy automatically.',
    },
    {
      question: 'Can I choose which columns to export?',
      answer:
        'Yes! In the Columns tab, you can select/deselect columns, rename headers, and reorder columns by drag-and-drop. Only selected columns appear in your Excel file.',
    },
    {
      question: 'What is the maximum file size?',
      answer:
        'The converter handles JSON files up to 10MB. The output Excel file is limited by Excel\'s constraints: 1,048,576 rows and 16,384 columns maximum.',
    },
    {
      question: 'Which Excel format should I choose?',
      answer:
        'XLSX is recommended for modern Excel (2007+). Use XLS for older Excel versions. Choose CSV for maximum compatibility with other programs, but note that CSV loses some Excel features.',
    },
    {
      question: 'Can I convert JSON from an API?',
      answer:
        'Yes, copy the JSON response from your API (visible in browser DevTools or API testing tools) and paste it directly into the converter. Works with any valid JSON data.',
    },
    {
      question: 'Does it preserve data types?',
      answer:
        'Yes, numbers stay as numbers, dates are formatted properly, and booleans are converted to TRUE/FALSE. Text strings remain as text. The converter detects types automatically.',
    },
    {
      question: 'Is there a row limit?',
      answer:
        'Excel has a limit of 1,048,576 rows. If your JSON has more rows, the export will be truncated. The preview shows the total row count so you know before exporting.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON data',
      icon: 'fas fa-indent',
      link: '/json-formatter',
    },
    {
      title: 'CSV to JSON',
      description: 'Convert CSV files to JSON',
      icon: 'fas fa-table',
      link: '/csv-to-json',
    },
    {
      title: 'JSON Validator',
      description: 'Validate JSON syntax',
      icon: 'fas fa-check-circle',
      link: '/json-validator',
    },
    {
      title: 'JSON to YAML',
      description: 'Convert JSON to YAML format',
      icon: 'fas fa-arrow-right',
      link: '/json-to-yaml',
    },
    {
      title: 'JSON Flattener',
      description: 'Flatten nested JSON objects',
      icon: 'fas fa-compress-alt',
      link: '/json-flattener',
    },
    {
      title: 'JSON Editor',
      description: 'Visual JSON editor',
      icon: 'fas fa-edit',
      link: '/json-editor',
    },
  ] as RelatedTool[],
};
