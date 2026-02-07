'use client';

import React from 'react';
import type { ExampleSchema } from '@/lib/schema-validator/types';

interface SchemaValidatorExamplesPanelProps {
  examples: ExampleSchema[];
  onLoadExample: (example: ExampleSchema) => void;
}

export function SchemaValidatorExamplesPanel({ examples, onLoadExample }: SchemaValidatorExamplesPanelProps) {
  return (
    <div className="settings-panel">
      <h3 className="settings-title">Example Schemas</h3>
      <p className="settings-description">
        Load a pre-built schema with sample data to get started quickly.
      </p>

      <div className="examples-list">
        {examples.map((example) => (
          <button
            key={example.id}
            className="example-card"
            onClick={() => onLoadExample(example)}
          >
            <div className="example-icon">
              <i className={`fas ${example.icon}`}></i>
            </div>
            <div className="example-content">
              <span className="example-name">{example.name}</span>
              <span className="example-description">{example.description}</span>
            </div>
            <div className="example-action">
              <i className="fas fa-chevron-right"></i>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .settings-panel {
          padding: 1rem;
        }

        .settings-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #aaa);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-description {
          font-size: 0.8rem;
          color: var(--text-muted, #888);
          margin-bottom: 1rem;
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .example-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-tertiary, #252525);
          border: 1px solid var(--border-color, #333);
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s;
        }

        .example-card:hover {
          border-color: var(--primary, #3b82f6);
          background: rgba(59, 130, 246, 0.05);
        }

        .example-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          color: var(--primary, #3b82f6);
          flex-shrink: 0;
        }

        .example-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .example-name {
          font-weight: 500;
          font-size: 0.85rem;
          color: var(--text-primary, #fff);
        }

        .example-description {
          font-size: 0.7rem;
          color: var(--text-muted, #888);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .example-action {
          color: var(--text-muted, #888);
          opacity: 0;
          transition: opacity 0.15s;
        }

        .example-card:hover .example-action {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
