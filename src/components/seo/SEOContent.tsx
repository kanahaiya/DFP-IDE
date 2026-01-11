'use client';

import { useState } from 'react';
import type { FAQItem, FeatureItem } from '@/types';
import type { HowToStep, EducationalSection, TechnicalSpec, WhyChooseItem, UseCase, ComparisonRow, RelatedTool } from '@/data/json-to-openapi-seo';

interface SEOContentProps {
  features?: FeatureItem[];
  howToSteps?: HowToStep[];
  educationalContent?: EducationalSection[];
  useCases?: UseCase[];
  faqs?: FAQItem[];
  technicalSpecs?: TechnicalSpec[];
  whyChoose?: WhyChooseItem[];
  comparison?: ComparisonRow[];
  relatedTools?: RelatedTool[];
}

/**
 * SEO content section component
 * Displays features, how-to, educational content, use cases, FAQs, and more below the tool
 */
export function SEOContent({ 
  features, 
  howToSteps, 
  educationalContent, 
  useCases, 
  faqs, 
  technicalSpecs,
  whyChoose,
  comparison,
  relatedTools
}: SEOContentProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 3000);
      return;
    }

    // Set loading state
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      // Call the API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message || 'Thank you for subscribing! Check your email to confirm.');
        setNewsletterEmail('');
        setTimeout(() => {
          setNewsletterStatus('idle');
          setNewsletterMessage('');
        }, 5000);
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.message || 'Failed to subscribe. Please try again.');
        setTimeout(() => {
          setNewsletterStatus('idle');
          setNewsletterMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      setNewsletterMessage('An error occurred. Please try again later.');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 3000);
    }
  };

  return (
    <div className="seo-content">
      {/* Hero Title Section */}
      <section className="seo-hero-section">
        <div className="container">
          <h1 className="seo-hero-title">
            JSON to OpenAPI Converter - Generate API Specs Instantly
          </h1>
          <p className="seo-hero-subtitle">
            Convert JSON examples into production-ready OpenAPI 3.0 specifications in seconds. Free online tool with smart type detection, multi-endpoint support, and instant results. No signup required.
          </p>
          <div className="seo-trust-badges">
            <div className="trust-badge">
              <i className="fas fa-gift"></i>
              <span>100% Free</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-shield-alt"></i>
              <span>Secure &amp; Private</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-bolt"></i>
              <span>Instant Results</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-user-slash"></i>
              <span>No Signup</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-code"></i>
              <span>YAML &amp; JSON</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-check-circle"></i>
              <span>Smart Detection</span>
            </div>
          </div>
          <div className="seo-privacy-banner">
            <i className="fas fa-lock"></i>
            <strong>100% Client-Side Processing</strong> • Your data never leaves your browser. Zero uploads, zero servers, complete privacy.
          </div>
        </div>
      </section>

      {/* Educational Content - What is OpenAPI - FIRST */}
      {educationalContent && educationalContent.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <div className="educational-content">
              {educationalContent.map((section, index) => (
                <div key={index} className={`educational-box ${section.type || 'info'}`}>
                  <div className="educational-icon">
                    <i className={section.type === 'tip' ? 'fas fa-lightbulb' : section.type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'}></i>
                  </div>
                  <div className="educational-text">
                    <h3 className="educational-title">{section.title}</h3>
                    <p className="educational-description" dangerouslySetInnerHTML={{ __html: section.content }}></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How-To Steps - SECOND */}
      {howToSteps && howToSteps.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">How to Convert JSON to OpenAPI Specification</h2>
            <div className="how-to-steps">
              {howToSteps.map((step, index) => (
                <div key={index} className="how-to-step" id={`step-${step.number}`}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description" dangerouslySetInnerHTML={{ __html: step.description }}></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Features - THIRD */}
      {features && features.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">OpenAPI Generator Features</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {useCases && useCases.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">Common Use Cases</h2>
            <div className="use-cases-grid">
              {useCases.map((useCase, index) => (
                <div key={index} className="use-case-card">
                  <div className="use-case-icon">
                    <i className={useCase.icon}></i>
                  </div>
                  <h3 className="use-case-title">{useCase.title}</h3>
                  <p className="use-case-description">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {whyChoose && whyChoose.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">Why Choose This JSON to OpenAPI Converter?</h2>
            <div className="why-choose-list">
              {whyChoose.map((item, index) => (
                <div key={index} className="why-choose-item" style={{ backgroundColor: item.color || '#F5F5F5' }}>
                  <div className="why-choose-check">✓</div>
                  <div className="why-choose-content">
                    <h3 className="why-choose-title">{item.title}</h3>
                    <p className="why-choose-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {technicalSpecs && technicalSpecs.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">Technical Specifications</h2>
            <div className="technical-specs-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {technicalSpecs.map((spec, index) => (
                    <tr key={index}>
                      <td><strong>{spec.feature}</strong></td>
                      <td>{spec.specification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {comparison && comparison.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">JSON to OpenAPI Converter vs Competitors</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              See why developers choose our tool over alternatives
            </p>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="our-tool-column">Our Tool</th>
                    <th>Competitor A</th>
                    <th>Competitor B</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <tr key={index}>
                      <td><strong>{row.feature}</strong></td>
                      <td className="our-tool-column">
                        {typeof row.ourTool === 'boolean' ? (
                          row.ourTool ? <span className="check-icon">✓</span> : <span className="cross-icon">✗</span>
                        ) : (
                          row.ourTool
                        )}
                      </td>
                      <td>
                        {typeof row.competitorA === 'boolean' ? (
                          row.competitorA ? <span className="check-icon">✓</span> : <span className="cross-icon">✗</span>
                        ) : (
                          row.competitorA
                        )}
                      </td>
                      <td>
                        {typeof row.competitorB === 'boolean' ? (
                          row.competitorB ? <span className="check-icon">✓</span> : <span className="cross-icon">✗</span>
                        ) : (
                          row.competitorB
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">{faq.question}</summary>
                  <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedTools && relatedTools.length > 0 && (
        <section className="seo-section">
          <div className="container">
            <h2 className="seo-section-title">Other Tools You Might Like</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Explore our suite of developer tools for data formatting and conversion
            </p>
            <div className="related-tools-grid">
              {relatedTools.map((tool, index) => (
                <a key={index} href={tool.link} className="related-tool-card">
                  <div className="related-tool-icon">
                    <i className={tool.icon}></i>
                  </div>
                  <h3 className="related-tool-title">{tool.title}</h3>
                  <p className="related-tool-description">{tool.description}</p>
                  <div className="related-tool-cta">
                    Try Now <i className="fas fa-arrow-right"></i>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter/CTA Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              <i className="fas fa-envelope" style={{ marginRight: '0.75rem' }}></i>
              Stay Updated with Developer Tools & Tips
            </h2>
            <p className="newsletter-subtitle">
              Join 10,000+ developers who receive weekly updates about new tools, API best practices, and productivity tips. No spam, unsubscribe anytime.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-group">
                <i className="fas fa-envelope newsletter-icon"></i>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={newsletterStatus === 'success' || newsletterStatus === 'loading'}
                />
                <button 
                  type="submit" 
                  className="newsletter-button"
                  disabled={newsletterStatus === 'success' || newsletterStatus === 'loading'}
                >
                  {newsletterStatus === 'loading' ? (
                    <>Subscribing... <i className="fas fa-spinner fa-spin"></i></>
                  ) : newsletterStatus === 'success' ? (
                    <>Subscribed! <i className="fas fa-check"></i></>
                  ) : (
                    <>Subscribe <i className="fas fa-arrow-right"></i></>
                  )}
                </button>
              </div>
              {newsletterStatus === 'success' && newsletterMessage && (
                <p className="newsletter-message newsletter-success">
                  <i className="fas fa-check-circle"></i> {newsletterMessage}
                </p>
              )}
              {newsletterStatus === 'error' && newsletterMessage && (
                <p className="newsletter-message newsletter-error">
                  <i className="fas fa-exclamation-circle"></i> {newsletterMessage}
                </p>
              )}
            </form>
            <div className="newsletter-benefits">
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Weekly tool updates</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>API best practices</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Productivity tips</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>No spam, ever</span>
              </div>
            </div>
            <p className="newsletter-privacy">
              <i className="fas fa-shield-alt"></i>
              We respect your privacy. Read our <a href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .seo-content {
          margin-top: auto;
          background: var(--card);
        }

        .seo-section {
          padding: 3rem 0;
          border-top: 1px solid var(--border);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
        }

        .seo-section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--text);
        }

        /* Hero Title Section */
        .seo-hero-section {
          background: var(--bg);
          padding: 4rem 0 3rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }

        .seo-hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .seo-hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          text-align: center;
          margin: 0 0 2.5rem;
          line-height: 1.6;
        }

        .seo-trust-badges {
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
          gap: 1.25rem;
          margin-bottom: 3rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }

        .seo-trust-badges::-webkit-scrollbar {
          height: 4px;
        }

        .seo-trust-badges::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px; /* Pill-shaped */
          font-size: 0.9rem;
          color: var(--text);
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(88, 166, 255, 0.5);
          transform: translateY(-1px);
        }

        .trust-badge i {
          color: var(--primary);
          font-size: 1.125rem;
        }

        .seo-privacy-banner {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          padding: 1.25rem 2rem;
          border-radius: var(--radius-lg);
          color: var(--text);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .seo-privacy-banner i {
          color: #4CAF50;
          font-size: 1.125rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 1.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-subtle);
          border-radius: 50%;
          font-size: 1.5rem;
          color: var(--primary);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .how-to-steps {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .how-to-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .step-number {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .step-description {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
        }

        .educational-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .educational-box {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border-left: 4px solid;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .educational-box.info {
          background: rgba(33, 150, 243, 0.1);
          border-color: #2196F3;
        }

        .educational-box.tip {
          background: rgba(255, 193, 7, 0.1);
          border-color: #FFC107;
        }

        .educational-box.warning {
          background: rgba(244, 67, 54, 0.1);
          border-color: #F44336;
        }

        .educational-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .educational-box.info .educational-icon {
          color: #2196F3;
        }

        .educational-box.tip .educational-icon {
          color: #F57C00;
        }

        .educational-box.warning .educational-icon {
          color: #F44336;
        }

        .educational-text {
          flex: 1;
        }

        .educational-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .educational-description {
          color: var(--text);
          line-height: 1.7;
          font-size: 1rem;
        }

        .educational-description a {
          color: var(--primary);
          text-decoration: underline;
        }

        .educational-description a:hover {
          opacity: 0.8;
        }

        .use-cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .use-case-card {
          padding: 1.5rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
        }

        .use-case-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .use-case-icon {
          width: 50px;
          height: 50px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-subtle);
          border-radius: 50%;
          font-size: 1.25rem;
          color: var(--primary);
        }

        .use-case-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .use-case-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .why-choose-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .why-choose-item {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          border: 1px solid var(--border);
        }

        .why-choose-check {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .why-choose-content {
          flex: 1;
        }

        .why-choose-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .why-choose-description {
          color: var(--text);
          line-height: 1.7;
          font-size: 1rem;
        }

        .technical-specs-table {
          overflow-x: auto;
        }

        .technical-specs-table table {
          width: 100%;
          border-collapse: collapse;
          background: var(--elevated);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .technical-specs-table th,
        .technical-specs-table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }

        .technical-specs-table th:last-child,
        .technical-specs-table td:last-child {
          border-right: none;
        }

        .technical-specs-table th {
          background: var(--card);
          font-weight: 600;
          color: var(--text);
          font-size: 1rem;
        }

        .technical-specs-table td {
          color: var(--text-secondary);
          background: var(--elevated);
        }

        .technical-specs-table tr:last-child td {
          border-bottom: none;
        }

        .technical-specs-table tbody tr:hover {
          background: var(--card);
        }

        .technical-specs-table tbody tr:hover td {
          background: var(--card);
        }

        .comparison-table-wrapper {
          overflow-x: auto;
          margin: 0 auto;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--elevated);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .comparison-table th,
        .comparison-table td {
          padding: 1rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }

        .comparison-table th:last-child,
        .comparison-table td:last-child {
          border-right: none;
        }

        .comparison-table th {
          background: var(--card);
          font-weight: 600;
          color: var(--text);
          font-size: 1rem;
        }

        .comparison-table th:first-child,
        .comparison-table td:first-child {
          text-align: left;
        }

        .comparison-table .our-tool-column {
          background: rgba(88, 166, 255, 0.15);
          font-weight: 600;
          color: var(--primary);
        }

        .comparison-table td {
          color: var(--text-secondary);
          background: var(--elevated);
        }

        .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .comparison-table tbody tr:hover {
          background: var(--card);
        }

        .comparison-table tbody tr:hover td {
          background: var(--card);
        }

        .comparison-table tbody tr:hover .our-tool-column {
          background: rgba(88, 166, 255, 0.2);
        }

        .check-icon {
          color: #4CAF50;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .cross-icon {
          color: #F44336;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .related-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .related-tool-card {
          padding: 2rem;
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .related-tool-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .related-tool-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-subtle);
          border-radius: 50%;
          font-size: 1.75rem;
          color: var(--primary);
          transition: all 0.3s ease;
        }

        .related-tool-card:hover .related-tool-icon {
          transform: scale(1.1);
          background: var(--primary);
          color: white;
        }

        .related-tool-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text);
        }

        .related-tool-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .related-tool-cta {
          color: var(--primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: gap 0.3s ease;
        }

        .related-tool-card:hover .related-tool-cta {
          gap: 0.75rem;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .faq-item {
          background: var(--elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .faq-question {
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text);
          list-style: none;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .faq-question::-webkit-details-marker {
          display: none;
        }

        .faq-question::after {
          content: '+';
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--primary);
        }

        .faq-item[open] .faq-question::after {
          content: '−';
        }

        .faq-question:hover {
          background: var(--bg);
        }

        .faq-answer {
          padding: 0 1.5rem 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .seo-section {
            padding: 2rem 0;
          }

          .seo-section-title {
            font-size: 1.5rem;
          }

          /* Hero Section Mobile */
          .seo-hero-section {
            padding: 3rem 0 2rem;
          }

          .seo-hero-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .seo-hero-subtitle {
            font-size: 1.125rem;
            margin-bottom: 2rem;
          }

          .seo-trust-badges {
            gap: 1rem;
            justify-content: flex-start;
            padding: 0.5rem 1rem;
            margin-bottom: 2.5rem;
          }

          .trust-badge {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
          }

          .trust-badge i {
            font-size: 1rem;
          }

          .seo-privacy-banner {
            flex-direction: column;
            text-align: center;
            padding: 1.125rem 1.5rem;
            font-size: 0.875rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .use-cases-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .how-to-step {
            flex-direction: column;
            gap: 1rem;
          }

          .step-number {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }

          .step-title {
            font-size: 1.25rem;
          }

          .educational-box {
            flex-direction: column;
            gap: 1rem;
          }

          .technical-specs-table th,
          .technical-specs-table td {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .container {
            padding: 0 1rem;
          }

          .related-tools-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }

        /* Newsletter/CTA Section */
        .newsletter-section {
          background: linear-gradient(135deg, rgba(88, 166, 255, 0.1) 0%, rgba(88, 166, 255, 0.05) 100%);
          border-top: 1px solid var(--border);
          padding: 4rem 0 3.5rem; /* Slightly less bottom padding for better flow to footer */
        }

        .newsletter-content {
          text-align: center;
        }

        .newsletter-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .newsletter-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .newsletter-form {
          max-width: 500px;
          margin: 0 auto 1.5rem;
        }

        .newsletter-input-group {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--card);
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          transition: border-color 0.3s ease;
        }

        .newsletter-input-group:focus-within {
          border-color: var(--primary);
        }

        .newsletter-icon {
          color: var(--text-secondary);
          margin-left: 0.75rem;
          font-size: 1.125rem;
        }

        .newsletter-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          color: var(--text);
          outline: none;
        }

        .newsletter-input::placeholder {
          color: var(--text-secondary);
        }

        .newsletter-button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: var(--radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .newsletter-button:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);
        }

        .newsletter-button i {
          transition: transform 0.3s ease;
        }

        .newsletter-button:hover i {
          transform: translateX(3px);
        }

        .newsletter-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .newsletter-message {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          text-align: left;
        }

        .newsletter-success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
        }

        .newsletter-success i {
          color: #4CAF50;
          font-size: 1.1rem;
        }

        .newsletter-error {
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #F44336;
        }

        .newsletter-error i {
          color: #F44336;
          font-size: 1.1rem;
        }

        .newsletter-benefits {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .benefit-item i {
          color: var(--primary);
          font-size: 1.125rem;
        }

        .newsletter-privacy {
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .newsletter-privacy i {
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .newsletter-section {
            padding: 3rem 0 2.5rem; /* Adjusted mobile spacing */
          }

          .newsletter-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .newsletter-subtitle {
            font-size: 1rem;
          }

          .newsletter-input-group {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem;
          }

          .newsletter-input {
            text-align: center;
            padding: 0.75rem;
          }

          .newsletter-button {
            width: 100%;
            justify-content: center;
          }

          .newsletter-benefits {
            flex-direction: column;
            gap: 0.75rem;
          }

          .benefit-item {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
