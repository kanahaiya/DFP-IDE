import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
            Data Formatter Pro
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Fast, privacy-first JSON & data utilities for developers
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/json-to-openapi" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
              <i className="fas fa-file-code"></i>
              JSON to OpenAPI
            </Link>
            <Link href="/csv-to-json" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
              <i className="fas fa-table"></i>
              CSV to JSON
            </Link>
            <Link href="/tools" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
              <i className="fas fa-tools"></i>
              Browse All Tools
            </Link>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
