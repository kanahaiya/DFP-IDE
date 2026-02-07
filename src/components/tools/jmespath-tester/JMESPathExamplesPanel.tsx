'use client';

import React, { useState } from 'react';
import type { JMESPathExample } from '@/lib/jmespath/types';
import { JMESPATH_EXAMPLES, getJMESPathCategories } from '@/lib/jmespath/examples';

interface JMESPathExamplesPanelProps {
  onLoadExample: (example: JMESPathExample, queryIndex?: number) => void;
}

export function JMESPathExamplesPanel({ onLoadExample }: JMESPathExamplesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);
  
  const categories = getJMESPathCategories();
  
  const filteredExamples = selectedCategory
    ? JMESPATH_EXAMPLES.filter(e => e.category === selectedCategory)
    : JMESPATH_EXAMPLES;

  return (
    <div className="examples-panel">
      <h3 className="panel-title">
        <i className="fas fa-lightbulb"></i>
        Examples
      </h3>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Examples List */}
      <div className="examples-list">
        {filteredExamples.map((example) => (
          <div key={example.id} className="example-item">
            <button
              className="example-header"
              onClick={() => setExpandedExample(expandedExample === example.id ? null : example.id)}
            >
              <div className="example-info">
                <i className={example.icon} style={{ color: example.icon.includes('aws') ? '#FF9900' : '#3b82f6' }}></i>
                <div>
                  <span className="example-name">{example.name}</span>
                  <span className="example-desc">{example.description}</span>
                </div>
              </div>
              <i className={`fas fa-chevron-${expandedExample === example.id ? 'up' : 'down'}`}></i>
            </button>

            {expandedExample === example.id && (
              <div className="example-content">
                <button
                  className="load-json-btn"
                  onClick={() => onLoadExample(example)}
                >
                  <i className="fas fa-download"></i>
                  Load JSON Data
                </button>

                <div className="queries-list">
                  <span className="queries-label">Sample Queries:</span>
                  {example.queries.map((q, idx) => (
                    <button
                      key={idx}
                      className="query-item"
                      onClick={() => onLoadExample(example, idx)}
                      title={q.description}
                    >
                      <code>{q.query}</code>
                      <span>{q.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .examples-panel {
          padding: 1rem;
        }

        .panel-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-btn {
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--border-color, #333);
          border-radius: 999px;
          background: var(--bg-tertiary, #252525);
          color: var(--text-primary, #fff);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: var(--bg-secondary, #2a2a2a);
        }

        .category-btn.active {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 350px;
          overflow-y: auto;
        }

        .example-item {
          border: 1px solid var(--border-color, #333);
          border-radius: 6px;
          background: var(--bg-tertiary, #252525);
          overflow: hidden;
        }

        .example-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          color: var(--text-primary, #fff);
        }

        .example-header:hover {
          background: var(--bg-secondary, #2a2a2a);
        }

        .example-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .example-info i {
          font-size: 1.25rem;
        }

        .example-name {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .example-desc {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted, #888);
        }

        .example-content {
          padding: 0.75rem;
          border-top: 1px solid var(--border-color, #333);
          background: var(--bg-secondary, #2a2a2a);
        }

        .load-json-btn {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--primary, #3b82f6);
          border-radius: 4px;
          background: transparent;
          color: var(--primary, #3b82f6);
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          margin-bottom: 0.75rem;
        }

        .load-json-btn:hover {
          background: var(--primary, #3b82f6);
          color: white;
        }

        .queries-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted, #888);
          margin-bottom: 0.5rem;
        }

        .queries-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .query-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          background: var(--bg-tertiary, #252525);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .query-item:hover {
          background: var(--bg-primary, #1e1e1e);
        }

        .query-item code {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--success, #10b981);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .query-item span {
          font-size: 0.7rem;
          color: var(--text-muted, #888);
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
}
