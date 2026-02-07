import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to SQL Converter - Generate SQL from JSON Data | DevFormatPro',
  description:
    'Free online JSON to SQL converter. Generate CREATE TABLE and INSERT statements from JSON data for PostgreSQL, MySQL, SQLite, SQL Server, and Oracle.',
  keywords: [
    'json to sql',
    'json to sql converter',
    'json to create table',
    'json to insert statement',
    'json to postgresql',
    'json to mysql',
    'json to sqlite',
    'sql generator',
  ],
  openGraph: {
    title: 'JSON to SQL Converter - Generate SQL from JSON Data',
    description:
      'Free online tool to convert JSON data to SQL CREATE TABLE and INSERT statements.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to SQL Converter',
    description:
      'Generate SQL statements from JSON data for multiple database platforms.',
  },
  alternates: {
    canonical: '/json-to-sql',
  },
};

export default function JsonToSqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
