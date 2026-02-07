/**
 * Help content for JSON to SQL converter
 */

export const jsonToSqlHelp = [
  {
    title: 'Getting Started',
    content: `
## JSON to SQL Converter

Convert your JSON data to SQL CREATE TABLE and INSERT statements.

### Quick Start
1. Paste your JSON (object or array of objects)
2. Select your SQL dialect (PostgreSQL, MySQL, SQLite, etc.)
3. Choose output mode (CREATE TABLE, INSERT, or both)
4. Copy or download the generated SQL

### Supported Databases
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- Oracle
    `.trim(),
  },
  {
    title: 'Output Modes',
    content: `
## Output Mode Options

### CREATE TABLE
Generates a CREATE TABLE statement with inferred column types:

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
);
\`\`\`

### INSERT Statements
Generates INSERT statements for your data:

\`\`\`sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
\`\`\`

### Both
Generates both CREATE TABLE and INSERT statements together.
    `.trim(),
  },
  {
    title: 'Type Inference',
    content: `
## Automatic Type Detection

| JSON Value | SQL Type |
|------------|----------|
| String | VARCHAR(255) / TEXT |
| Integer | INT / BIGINT |
| Decimal | DOUBLE / DOUBLE PRECISION |
| Boolean | BOOLEAN / TINYINT(1) |
| Date string | DATE |
| Datetime string | TIMESTAMP / DATETIME |
| UUID string | UUID / VARCHAR(36) |
| Object/Array | JSON / JSONB |
    `.trim(),
  },
  {
    title: 'Keyboard Shortcuts',
    content: `
## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format JSON | Ctrl/Cmd + Shift + F |
| Copy Output | Ctrl/Cmd + Shift + C |
| Clear Input | Ctrl/Cmd + Shift + X |
    `.trim(),
  },
];
