'use client';

import React from 'react';

interface HelpSection {
  title: string;
  content: string;
  icon?: string;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  sections: HelpSection[];
}

export function HelpModal({ isOpen, onClose, toolName, sections }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="help-modal-overlay" onClick={onClose} />
      <div className="help-modal">
        <div className="help-modal-header">
          <h2>
            <i className="fas fa-question-circle" style={{ marginRight: '0.75rem', color: 'var(--primary)' }}></i>
            {toolName} - Help & Documentation
          </h2>
          <button className="help-modal-close" onClick={onClose} title="Close Help">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="help-modal-body">
          {sections.map((section, index) => (
            <div key={index} className="help-section">
              <h3 className="help-section-title">
                {section.icon && <i className={section.icon} style={{ marginRight: '0.5rem' }}></i>}
                {section.title}
              </h3>
              <div 
                className="help-section-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

        <div className="help-modal-footer">
          <button className="help-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .help-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .help-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 900px;
          max-height: 85vh;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          z-index: 10001;
          display: flex;
          flex-direction: column;
          animation: modalFadeIn 0.2s ease;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .help-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          background: var(--elevated);
        }

        .help-modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
        }

        .help-modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .help-modal-close:hover {
          background: var(--hover);
          color: var(--text);
          border-color: var(--primary);
        }

        .help-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .help-section {
          margin-bottom: 2rem;
        }

        .help-section:last-child {
          margin-bottom: 0;
        }

        .help-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .help-section-title i {
          color: var(--primary);
        }

        .help-section-content {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
        }

        .help-section-content :global(p) {
          margin-bottom: 1rem;
        }

        .help-section-content :global(ul),
        .help-section-content :global(ol) {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .help-section-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .help-section-content :global(code) {
          background: var(--elevated);
          padding: 0.2rem 0.4rem;
          border-radius: var(--radius);
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9em;
          color: var(--primary);
        }

        .help-section-content :global(strong) {
          color: var(--text);
          font-weight: 600;
        }

        .help-section-content :global(a) {
          color: var(--primary);
          text-decoration: none;
        }

        .help-section-content :global(a:hover) {
          text-decoration: underline;
        }

        .help-modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          background: var(--elevated);
        }

        .help-close-btn {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .help-close-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .help-modal {
            width: 95%;
            max-height: 90vh;
          }

          .help-modal-header {
            padding: 1.25rem 1.5rem;
          }

          .help-modal-header h2 {
            font-size: 1.25rem;
          }

          .help-modal-body {
            padding: 1.5rem;
          }

          .help-section-title {
            font-size: 1.125rem;
          }

          .help-modal-footer {
            padding: 1.25rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
