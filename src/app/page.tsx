'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolboxSidebar } from '@/components/layout/ToolboxSidebar';
import { ActivityBar } from '@/components/layout/ActivityBar';
import { useState } from 'react';

export default function HomePage() {
  // Always show explorer sidebar on homepage
  const [activeView] = useState<'explorer' | 'search' | null>('explorer');

  return (
    <>
      <Header />
      <main id="main-content" className="homepage-main">
        <div className="ide-container homepage-container">
          <ActivityBar
            activeView={activeView}
            onViewChange={() => {}}
            onWorkspaceSettingsClick={() => {}}
          />
          
          <ToolboxSidebar isOpen={true} />
          
          <div className="ide-main homepage-content">
            <div className="homepage-hero">
              <h1 className="homepage-title">
                <span>Data</span>
                <span>Formatter</span>
                <span>Pro</span>
              </h1>
              <p className="homepage-tagline">
                Fast, privacy-first JSON & data utilities for developers
              </p>
              <div className="homepage-actions">
                <Link href="/json-to-openapi" className="btn btn-primary">
                  <i className="fas fa-file-code"></i>
                  JSON to OpenAPI
                </Link>
                <Link href="/csv-to-json" className="btn btn-primary">
                  <i className="fas fa-table"></i>
                  CSV to JSON
                </Link>
                <Link href="/tools" className="btn btn-secondary">
                  <i className="fas fa-tools"></i>
                  Browse All Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .homepage-main {
          min-height: calc(100vh - var(--header-height));
          display: flex;
          flex-direction: column;
          flex: 1;
          background: var(--bg);
        }
        
        .homepage-container {
          display: flex;
          flex: 1;
          height: calc(100vh - var(--header-height));
          overflow: hidden;
        }
        
        .homepage-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 4rem 5rem;
          overflow-y: auto;
          overflow-x: hidden;
          background: var(--bg);
        }
        
        .homepage-hero {
          max-width: 1000px;
          width: 100%;
        }
        
        .homepage-title {
          font-size: 6rem;
          font-weight: 700;
          margin: 0 0 2rem 0;
          color: var(--text);
          line-height: 1.1;
          letter-spacing: -0.03em;
          text-align: left;
        }
        
        .homepage-title span {
          display: block;
        }
        
        .homepage-tagline {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin: 0 0 3rem 0;
          font-weight: 400;
          line-height: 1.6;
        }
        
        .homepage-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .homepage-actions .btn {
          font-size: 1.1rem;
          padding: 0.75rem 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .homepage-content {
            padding: 3rem 3rem;
          }
          
          .homepage-title {
            font-size: 4.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .homepage-content {
            padding: 2rem 1.5rem;
          }
          
          .homepage-title {
            font-size: 3rem;
          }
          
          .homepage-tagline {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
