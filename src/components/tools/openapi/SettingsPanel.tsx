'use client';

import { useOpenAPIStore } from '@/store/openapi';

/**
 * Settings panel for OpenAPI configuration with all options
 */
export function SettingsPanel() {
  const { settings, endpoints, activeEndpointIndex, updateSettings, updateEndpoint } = useOpenAPIStore();
  const activeEndpoint = endpoints[activeEndpointIndex];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value } as any);
  };

  const handleEndpointChange = (key: string, value: string) => {
    updateEndpoint(activeEndpointIndex, { [key]: value } as any);
  };

  return (
    <div className="settings-panel-content">
      {/* API Information */}
      <div className="settings-group">
        <h3><i className="fas fa-info-circle"></i> API Information</h3>
        <div className="form-row">
          <label htmlFor="api-title">Title</label>
          <input
            id="api-title"
            type="text"
            value={settings.title}
            onChange={(e) => handleSettingChange('title', e.target.value)}
            placeholder="My API"
          />
        </div>
        <div className="form-row">
          <label htmlFor="api-version">Version</label>
          <input
            id="api-version"
            type="text"
            value={settings.version}
            onChange={(e) => handleSettingChange('version', e.target.value)}
            placeholder="1.0.0"
          />
        </div>
        <div className="form-row">
          <label htmlFor="api-description">Description</label>
          <textarea
            id="api-description"
            value={settings.description}
            onChange={(e) => handleSettingChange('description', e.target.value)}
            placeholder="API description"
            rows={3}
          />
        </div>
        <div className="form-row">
          <label htmlFor="server-url">Server URL</label>
          <input
            id="server-url"
            type="url"
            value={settings.serverUrl}
            onChange={(e) => handleSettingChange('serverUrl', e.target.value)}
            placeholder="https://api.example.com"
          />
        </div>
        <div className="form-row">
          <label htmlFor="openapi-version">Specification Version</label>
          <select
            id="openapi-version"
            value={settings.openAPIVersion}
            onChange={(e) => handleSettingChange('openAPIVersion', e.target.value as any)}
          >
            <option value="3.0">OpenAPI 3.0</option>
            <option value="2.0">Swagger 2.0</option>
          </select>
        </div>
      </div>

      {/* Schema Options */}
      <div className="settings-group">
        <h3><i className="fas fa-sliders-h"></i> Schema Options</h3>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="includeExamples"
            checked={settings.includeExamples}
            onChange={(e) => handleSettingChange('includeExamples', e.target.checked)}
          />
          <label htmlFor="includeExamples">Include example values in schema</label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="markRequired"
            checked={settings.markRequired}
            onChange={(e) => handleSettingChange('markRequired', e.target.checked)}
          />
          <label htmlFor="markRequired">Mark all fields as required</label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="generateComponents"
            checked={settings.generateComponents}
            onChange={(e) => handleSettingChange('generateComponents', e.target.checked)}
          />
          <label htmlFor="generateComponents">Generate component schemas (reusable)</label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="detectFormats"
            checked={settings.detectFormats}
            onChange={(e) => handleSettingChange('detectFormats', e.target.checked)}
          />
          <label htmlFor="detectFormats">Detect formats (email, UUID, date, URL)</label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="addDescriptions"
            checked={settings.addDescriptions}
            onChange={(e) => handleSettingChange('addDescriptions', e.target.checked)}
          />
          <label htmlFor="addDescriptions">Add property descriptions</label>
        </div>
        
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="addConstraints"
            checked={settings.addConstraints}
            onChange={(e) => handleSettingChange('addConstraints', e.target.checked)}
          />
          <label htmlFor="addConstraints">Add min/max constraints for numbers</label>
        </div>
      </div>
    </div>
  );
}
