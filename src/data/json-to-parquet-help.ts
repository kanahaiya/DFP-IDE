/**
 * JSON to Parquet Help Documentation
 * Help content for the Parquet converter tool
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
}

export const jsonToParquetHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `The JSON to Parquet converter generates Apache Parquet schema definitions from JSON data.

**Key Features:**
- Automatic type inference from JSON values
- Multiple compression algorithm support
- Nested structure handling (groups, lists)
- Statistics and size estimation
- Spark/Hive/Presto compatible output`,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `**Step 1:** Paste your JSON array into the input editor.

**Step 2:** Select compression algorithm and row group size.

**Step 3:** Enable logical type inference if needed.

**Step 4:** Review the generated schema and statistics.

**Step 5:** Copy the schema for use in your data pipeline.`,
  },
  {
    id: 'type-mapping',
    title: 'Type Mapping',
    content: `JSON types are mapped to Parquet types as follows:

| JSON Type | Parquet Type |
|-----------|--------------|
| string | BYTE_ARRAY (STRING) |
| integer (small) | INT32 |
| integer (large) | INT64 |
| float | DOUBLE |
| boolean | BOOLEAN |
| null | OPTIONAL field |
| array | LIST |
| object | group |

**Logical Types:**
- ISO dates → DATE
- ISO timestamps → TIMESTAMP
- UUID strings → UUID`,
  },
  {
    id: 'compression',
    title: 'Compression Options',
    content: `**SNAPPY:**
- Fast compression and decompression
- Moderate compression ratio
- Best for: Real-time streaming, Spark jobs

**GZIP:**
- High compression ratio
- Slower compression/decompression
- Best for: Cold storage, archival

**LZ4:**
- Very fast compression
- Lower compression ratio than GZIP
- Best for: High-throughput workloads

**ZSTD:**
- Excellent compression ratio
- Good speed
- Best for: Data lakes, long-term storage

**UNCOMPRESSED:**
- No compression overhead
- Fastest writes
- Best for: Testing, small files`,
  },
  {
    id: 'row-groups',
    title: 'Row Groups',
    content: `Row groups are horizontal partitions of data in Parquet files.

**Smaller Row Groups (10K-100K rows):**
- Better parallelism for reading
- More metadata overhead
- Better for selective queries

**Larger Row Groups (1M+ rows):**
- Less metadata overhead
- Better compression
- Better for full scans

**Spark Default:** 128 MB (~1M rows for typical data)`,
  },
  {
    id: 'nested-data',
    title: 'Nested Data',
    content: `**Nested Objects:**
\`\`\`json
{ "address": { "city": "NYC", "zip": "10001" } }
\`\`\`
Becomes a Parquet group:
\`\`\`
required group address {
  required binary city (STRING);
  required binary zip (STRING);
}
\`\`\`

**Arrays:**
\`\`\`json
{ "tags": ["a", "b", "c"] }
\`\`\`
Becomes a Parquet LIST:
\`\`\`
optional group tags (LIST) {
  optional binary element (STRING);
}
\`\`\``,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    content: `**Editor Shortcuts:**
- \`Ctrl/Cmd + Enter\`: Generate schema
- \`Ctrl/Cmd + K\`: Clear input

**Output Shortcuts:**
- \`Ctrl/Cmd + C\`: Copy output (when focused)`,
  },
];
