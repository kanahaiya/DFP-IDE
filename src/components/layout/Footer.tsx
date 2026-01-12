import Link from 'next/link';

/**
 * Global site footer with links and branding
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Link href="/" className="footer-brand" aria-label="DataFormatterPro home">
            <div className="footer-logo">DataFormatterPro</div>
            <p className="footer-description">
              Fast, privacy-first JSON &amp; data utilities for developers.
            </p>
          </Link>
        </div>

        <div className="footer-divider" role="presentation"></div>

        <div className="footer-grid" aria-label="Footer links">
          <div className="footer-column">
            <h4 className="footer-heading">Popular JSON Tools</h4>
            <ul className="footer-links">
              <li><Link href="/json-formatter/" className="footer-link">JSON Formatter</Link></li>
              <li><Link href="/json-to-csv/" className="footer-link">JSON to CSV</Link></li>
              <li><Link href="/json-schema-generator/" className="footer-link">JSON Schema Generator</Link></li>
              <li><Link href="/json-minifier/" className="footer-link">JSON Minifier</Link></li>
            </ul>
            <Link href="/tools/" className="footer-cta">→ View all tools</Link>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Converters</h4>
            <ul className="footer-links">
              <li><Link href="/json-to-csv/" className="footer-link">JSON to CSV</Link></li>
              <li><Link href="/json-to-xml/" className="footer-link">JSON to XML</Link></li>
              <li><Link href="/json-to-excel/" className="footer-link">JSON to Excel</Link></li>
              <li><Link href="/json-to-openapi/" className="footer-link">JSON to OpenAPI</Link></li>
              <li><Link href="/csv-to-json/" className="footer-link">CSV to JSON</Link></li>
              <li><Link href="/yaml-to-json/" className="footer-link">YAML to JSON</Link></li>
              <li><Link href="/excel-to-json/" className="footer-link">Excel to JSON</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources &amp; Company</h4>
            <ul className="footer-links">
              <li><Link href="/blog/" className="footer-link">Blog</Link></li>
              <li><Link href="/about-us/" className="footer-link">About</Link></li>
              <li><Link href="/contact/" className="footer-link">Contact</Link></li>
              <li><Link href="/privacy-policy/" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-column support">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://buymeacoffee.com/dataformatterpro" 
                  className="footer-link"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  ☕ Support DataFormatterPro
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} DataFormatterPro. All rights reserved.</p>
          <p>Built and maintained by DataFormatterPro.</p>
        </div>
      </div>
    </footer>
  );
}
