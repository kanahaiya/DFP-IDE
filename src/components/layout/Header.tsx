'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useLayout } from '@/hooks/useLayout';
import { useState } from 'react';

/**
 * Global site header with navigation, theme toggle, and layout toggle
 */
export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const { layout, toggleLayout } = useLayout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    const normalizedPathname = pathname?.endsWith('/') ? pathname : `${pathname}/`;
    return normalizedPathname === normalizedPath;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <>
      <header className="header">
        <Link href="/" className="logo" aria-label="Data Formatter Pro home">
          <i className="fas fa-code logo-icon"></i>
          <span>Data Formatter Pro</span>
        </Link>

        <div className={`nav-container ${mobileMenuOpen ? 'active' : ''}`} id="primary-nav">
          <div className="nav-drawer-header">
            <div className="nav-drawer-title">Menu</div>
            <button
              className="btn btn-secondary btn-icon nav-close-btn"
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <Link
              href="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <div className="nav-dropdown">
              <button
                className="nav-link dropdown-toggle"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                aria-expanded={toolsDropdownOpen}
              >
                Tools <i className="fas fa-chevron-down"></i>
              </button>
              <div className={`dropdown-menu ${toolsDropdownOpen ? 'show' : ''}`}>
                <div className="dropdown-section">
                  <div className="dropdown-label">Core Tools</div>
                  <Link href="/json-formatter/" onClick={closeMobileMenu}>JSON Formatter</Link>
                  <Link href="/json-validator/" onClick={closeMobileMenu}>JSON Validator</Link>
                  <Link href="/json-viewer/" onClick={closeMobileMenu}>JSON Viewer</Link>
                </div>

                <div className="dropdown-section">
                  <div className="dropdown-label">Converters</div>
                  <Link href="/json-to-csv/" onClick={closeMobileMenu}>JSON to CSV</Link>
                  <Link href="/json-to-xml/" onClick={closeMobileMenu}>JSON to XML</Link>
                  <Link href="/json-to-yaml/" onClick={closeMobileMenu}>JSON to YAML</Link>
                  <Link href="/json-to-openapi/" onClick={closeMobileMenu}>JSON to OpenAPI</Link>
                  <Link href="/csv-to-json/" onClick={closeMobileMenu}>CSV to JSON</Link>
                </div>

                <div className="dropdown-section">
                  <div className="dropdown-label">Advanced Tools</div>
                  <Link href="/json-minifier/" onClick={closeMobileMenu}>JSON Minifier</Link>
                  <Link href="/json-parser/" onClick={closeMobileMenu}>JSON Parser</Link>
                  <Link href="/jsonpath-tester/" onClick={closeMobileMenu}>JSONPath Tester</Link>
                  <Link href="/jwt-decoder/" onClick={closeMobileMenu}>JWT Decoder</Link>
                </div>

                <div className="dropdown-footer">
                  <Link href="/tools/" className="dropdown-all-tools" onClick={closeMobileMenu}>
                    🧰 Browse All Tools →
                  </Link>
                </div>
              </div>
            </div>

            <div className="nav-divider"></div>

            <Link
              href="/blog/"
              className={`nav-link ${isActive('/blog/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
            <Link
              href="/about-us/"
              className={`nav-link ${isActive('/about-us/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact/"
              className={`nav-link ${isActive('/contact/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-secondary btn-icon"
            id="layoutToggleHeader"
            aria-label="Toggle split view"
            title="Toggle layout"
            onClick={toggleLayout}
          >
            <i className={`fas fa-columns ${layout === 'vertical' ? 'dfp-rotate-90' : ''}`}></i>
          </button>

          <button
            className="btn btn-secondary btn-icon theme-toggle"
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={toggleTheme}
          >
            {mounted && <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>}
          </button>

          <button
            className="btn btn-secondary btn-icon mobile-menu-btn"
            aria-label="Menu"
            aria-controls="primary-nav"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="nav-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
