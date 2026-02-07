/**
 * JSON to Parquet SEO Data
 * SEO content for the Parquet converter tool page
 */

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

export interface FAQItem {
  question: string;
  answer: string;
}

export const jsonToParquetSEO = {
  title: 'JSON to Parquet Converter Online Free - Generate Parquet Schemas',
  description:
    'Convert JSON to Apache Parquet format instantly in your browser. Free online JSON to Parquet converter with compression options. No upload required, 100% client-side.',
  keywords: [
    'json to parquet',
    'parquet converter online',
    'json to parquet free',
    'parquet schema generator',
    'convert json to parquet',
    'parquet file converter',
    'jsonl to parquet',
    'columnar format converter',
  ],

  heroTitle: 'JSON to Parquet Converter',
  heroSubtitle: 'Generate Apache Parquet schemas from JSON data with compression options',

  howToSteps: [
    {
      number: 1,
      title: 'Paste JSON Data',
      description:
        'Enter or paste your JSON array into the input editor. The tool accepts arrays of objects for row-based conversion.',
    },
    {
      number: 2,
      title: 'Configure Options',
      description:
        'Select compression algorithm (SNAPPY, GZIP, LZ4, ZSTD), row group size, and encoding options.',
    },
    {
      number: 3,
      title: 'Generate Schema',
      description:
        'Click generate to create your Parquet schema with properly inferred types and nested structures.',
    },
    {
      number: 4,
      title: 'View Stats',
      description:
        'Review the schema, column count, and estimated file size with your chosen compression.',
    },
  ] as HowToStep[],

  educationalContent: [
    {
      title: 'What is Apache Parquet?',
      content:
        'Apache Parquet is a columnar storage file format optimized for analytics workloads. It provides efficient data compression and encoding schemes, making it ideal for big data processing in tools like Spark, Hive, and Presto.',
      type: 'info',
    },
    {
      title: 'Compression Options',
      content:
        'SNAPPY: Fast compression/decompression, good for streaming. GZIP: Higher compression ratio, better for storage. LZ4: Fastest, good balance. ZSTD: Best compression ratio, good for cold storage.',
      type: 'tip',
    },
    {
      title: 'Why Columnar Format?',
      content:
        'Columnar formats like Parquet store data by columns rather than rows. This enables better compression (similar values together) and faster analytical queries that only read required columns.',
      type: 'info',
    },
  ] as EducationalSection[],

  technicalSpecs: [
    { feature: 'Format', specification: 'Apache Parquet compatible' },
    { feature: 'Compression', specification: 'SNAPPY, GZIP, LZ4, ZSTD' },
    { feature: 'Type Inference', specification: 'Automatic from JSON' },
    { feature: 'Nested Support', specification: 'Groups and lists' },
    { feature: 'Processing', specification: '100% client-side' },
    { feature: 'Output', specification: 'Schema definition' },
  ] as TechnicalSpec[],

  faq: [
    {
      question: 'Is this JSON to Parquet converter free?',
      answer:
        'Yes, completely free with no limitations. All processing happens in your browser.',
    },
    {
      question: 'Is my JSON data secure?',
      answer:
        'Absolutely. All conversion happens locally in your browser. No data is sent to any server.',
    },
    {
      question: 'Which compression should I use?',
      answer:
        'SNAPPY for streaming/real-time, GZIP for storage efficiency, LZ4 for balanced performance, ZSTD for maximum compression.',
    },
    {
      question: 'What are row groups?',
      answer:
        'Row groups are horizontal partitions of data. Smaller row groups allow better parallelism but more metadata overhead.',
    },
    {
      question: 'Does it support nested data?',
      answer:
        'Yes, nested JSON objects are converted to Parquet groups, and arrays are converted to LIST logical types.',
    },
    {
      question: 'Can I use this schema with Spark?',
      answer:
        'Yes, the generated schema is compatible with Apache Spark, Hive, Presto, and other Parquet-compatible tools.',
    },
  ] as FAQItem[],

  useCases: [
    {
      title: 'Data Lakes',
      description: 'Generate schemas for data lake storage with optimal compression.',
      icon: 'fa-database',
    },
    {
      title: 'ETL Pipelines',
      description: 'Create schema definitions for ETL transformation pipelines.',
      icon: 'fa-project-diagram',
    },
    {
      title: 'Analytics',
      description: 'Optimize data for analytical queries with columnar format.',
      icon: 'fa-chart-bar',
    },
    {
      title: 'Data Archival',
      description: 'Compress and store historical data efficiently.',
      icon: 'fa-archive',
    },
  ],
};
