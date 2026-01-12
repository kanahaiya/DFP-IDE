'use client';

import { useOpenAPIStore } from '@/store/openapi';
import { SampleTemplates, type SampleTemplateName } from '@/lib/openapi/sampleTemplates';
import { useState } from 'react';

/**
 * Endpoint list and configuration component
 */
export function EndpointManager() {
  const { endpoints, activeEndpointIndex, addEndpoint, removeEndpoint, setActiveEndpoint, updateEndpoint, loadEndpointJSON } = useOpenAPIStore();
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(activeEndpointIndex);

  const handleLoadSample = (index: number, sampleName: SampleTemplateName) => {
    const sample = SampleTemplates[sampleName];
    const jsonStr = JSON.stringify(sample, null, 2);
    loadEndpointJSON(index, jsonStr);
  };

  const toggleExpanded = (index: number) => {
    setExpandedEndpoint(expandedEndpoint === index ? null : index);
    setActiveEndpoint(index);
  };

  const handleEndpointChange = (index: number, field: string, value: string) => {
    updateEndpoint(index, { [field]: value });
  };

  return (
    <div className="endpoint-manager">
      <div className="endpoint-manager-header">
        <h3 className="endpoint-manager-title">
          <i className="fas fa-route"></i> API Endpoints <span className="endpoint-badge">{endpoints.length}</span>
        </h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={addEndpoint}
          title="Add new endpoint"
        >
          <i className="fas fa-plus"></i>
          Add
        </button>
      </div>

      <div className="endpoint-list">
        {endpoints.map((endpoint, index) => {
          const isActive = index === activeEndpointIndex;
          const isExpanded = expandedEndpoint === index;
          const hasJSON = endpoint.json && endpoint.json.trim().length > 0;

          return (
            <div
              key={endpoint.id}
              className={`endpoint-card ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="endpoint-header"
                onClick={() => toggleExpanded(index)}
              >
                <div className="endpoint-info">
                  <span className={`endpoint-method ${endpoint.method}`}>
                    {endpoint.method.toUpperCase()}
                  </span>
                  <span className="endpoint-path">{endpoint.path}</span>
                  {hasJSON ? (
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', fontSize: '0.75rem' }} title="Has JSON schema"></i>
                  ) : (
                    <i className="fas fa-exclamation-circle" style={{ color: 'var(--warning)', fontSize: '0.75rem' }} title="No JSON schema"></i>
                  )}
                </div>

                <div className="endpoint-header-actions">
                  <button
                    className="btn btn-secondary btn-sm btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEndpoint(index);
                    }}
                    disabled={endpoints.length <= 1}
                    title="Remove endpoint"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}></i>
                </div>
              </div>

              {isExpanded && (
                <div className="endpoint-config">
                  <div className="form-row">
                    <label htmlFor={`path-${index}`}>
                      <i className="fas fa-link"></i> Path
                    </label>
                    <input
                      id={`path-${index}`}
                      type="text"
                      className="form-control"
                      value={endpoint.path}
                      onChange={(e) => handleEndpointChange(index, 'path', e.target.value)}
                      placeholder="/api/endpoint"
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor={`method-${index}`}>
                      <i className="fas fa-exchange-alt"></i> HTTP Method
                    </label>
                    <select
                      id={`method-${index}`}
                      className="form-control"
                      value={endpoint.method}
                      onChange={(e) => handleEndpointChange(index, 'method', e.target.value)}
                    >
                      <option value="get">GET</option>
                      <option value="post">POST</option>
                      <option value="put">PUT</option>
                      <option value="patch">PATCH</option>
                      <option value="delete">DELETE</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor={`operationId-${index}`}>
                      <i className="fas fa-tag"></i> Operation ID
                    </label>
                    <input
                      id={`operationId-${index}`}
                      type="text"
                      className="form-control"
                      value={endpoint.operationId || ''}
                      onChange={(e) => handleEndpointChange(index, 'operationId', e.target.value)}
                      placeholder="getUser, createOrder, etc."
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor={`responseCode-${index}`}>
                      <i className="fas fa-code"></i> Response Code
                    </label>
                    <input
                      id={`responseCode-${index}`}
                      type="text"
                      className="form-control"
                      value={endpoint.responseCode}
                      onChange={(e) => handleEndpointChange(index, 'responseCode', e.target.value)}
                      placeholder="200"
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor={`tags-${index}`}>
                      <i className="fas fa-tags"></i> Tags (comma-separated)
                    </label>
                    <input
                      id={`tags-${index}`}
                      type="text"
                      className="form-control"
                      value={endpoint.tags || ''}
                      onChange={(e) => handleEndpointChange(index, 'tags', e.target.value)}
                      placeholder="users, authentication"
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor={`summary-${index}`}>
                      <i className="fas fa-align-left"></i> Summary
                    </label>
                    <input
                      id={`summary-${index}`}
                      type="text"
                      className="form-control"
                      value={endpoint.summary || ''}
                      onChange={(e) => handleEndpointChange(index, 'summary', e.target.value)}
                      placeholder="Get user by ID"
                    />
                  </div>

                  <div className="form-row" style={{ marginTop: '1rem' }}>
                    <label>
                      <i className="fas fa-file-code"></i> Load Sample JSON
                    </label>
                    <div className="endpoint-sample-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'user')}
                      >
                        <i className="fas fa-user"></i> User
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'product')}
                      >
                        <i className="fas fa-box"></i> Product
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'blog')}
                      >
                        <i className="fas fa-newspaper"></i> Blog
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'order')}
                      >
                        <i className="fas fa-shopping-cart"></i> Order
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'error')}
                      >
                        <i className="fas fa-exclamation-triangle"></i> Error
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLoadSample(index, 'paginated')}
                      >
                        <i className="fas fa-list"></i> List
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
