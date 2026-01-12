import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPanel } from '../SettingsPanel';
import { useOpenAPIStore } from '@/store/openapi';

jest.mock('@/store/openapi');

describe('SettingsPanel', () => {
  const mockSettings = {
    title: 'My API',
    version: '1.0.0',
    description: 'Test API',
    serverUrl: 'https://api.example.com',
    openAPIVersion: '3.0',
    includeExamples: true,
    markRequired: true,
    generateComponents: true,
    detectFormats: true,
    addDescriptions: true,
    addConstraints: true,
  };

  const mockStore = {
    settings: mockSettings,
    updateSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOpenAPIStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render API Information section', () => {
      render(<SettingsPanel />);
      expect(screen.getByText('API Information')).toBeInTheDocument();
    });

    it('should render Schema Options section', () => {
      render(<SettingsPanel />);
      expect(screen.getByText('Schema Options')).toBeInTheDocument();
    });

    it('should render all input fields', () => {
      render(<SettingsPanel />);
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Version')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Server URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Specification Version')).toBeInTheDocument();
    });

    it('should render all checkboxes', () => {
      render(<SettingsPanel />);
      
      expect(screen.getByLabelText('Include example values in schema')).toBeInTheDocument();
      expect(screen.getByLabelText('Mark all fields as required')).toBeInTheDocument();
      expect(screen.getByLabelText('Generate component schemas (reusable)')).toBeInTheDocument();
      expect(screen.getByLabelText('Detect formats (email, UUID, date, URL)')).toBeInTheDocument();
      expect(screen.getByLabelText('Add property descriptions')).toBeInTheDocument();
      expect(screen.getByLabelText('Add min/max constraints for numbers')).toBeInTheDocument();
    });

    it('should display current values', () => {
      render(<SettingsPanel />);
      
      expect(screen.getByDisplayValue('My API')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1.0.0')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test API')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://api.example.com')).toBeInTheDocument();
    });
  });

  describe('API Information Updates', () => {
    it('should update title', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      await user.clear(titleInput);
      await user.type(titleInput, 'New API');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ title: 'New API' });
    });

    it('should update version', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const versionInput = screen.getByLabelText('Version') as HTMLInputElement;
      await user.clear(versionInput);
      await user.type(versionInput, '2.0.0');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ version: '2.0.0' });
    });

    it('should update description', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      await user.clear(descInput);
      await user.type(descInput, 'New description');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ description: 'New description' });
    });

    it('should update server URL', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const urlInput = screen.getByLabelText('Server URL') as HTMLInputElement;
      await user.clear(urlInput);
      await user.type(urlInput, 'https://new-api.com');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ serverUrl: 'https://new-api.com' });
    });

    it('should update specification version', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const versionSelect = screen.getByLabelText('Specification Version');
      await user.selectOptions(versionSelect, '2.0');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ openAPIVersion: '2.0' });
    });
  });

  describe('Schema Options Updates', () => {
    it('should toggle includeExamples', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Include example values in schema');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ includeExamples: expect.any(Boolean) });
    });

    it('should toggle markRequired', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Mark all fields as required');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ markRequired: expect.any(Boolean) });
    });

    it('should toggle generateComponents', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Generate component schemas (reusable)');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ generateComponents: expect.any(Boolean) });
    });

    it('should toggle detectFormats', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Detect formats (email, UUID, date, URL)');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ detectFormats: expect.any(Boolean) });
    });

    it('should toggle addDescriptions', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Add property descriptions');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ addDescriptions: expect.any(Boolean) });
    });

    it('should toggle addConstraints', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Add min/max constraints for numbers');
      await user.click(checkbox);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({ addConstraints: expect.any(Boolean) });
    });
  });

  describe('Checkbox States', () => {
    it('should check checkboxes based on settings', () => {
      render(<SettingsPanel />);
      
      expect(screen.getByLabelText('Include example values in schema')).toBeChecked();
      expect(screen.getByLabelText('Mark all fields as required')).toBeChecked();
      expect(screen.getByLabelText('Generate component schemas (reusable)')).toBeChecked();
    });

    it('should uncheck checkboxes when settings are false', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        settings: { ...mockSettings, includeExamples: false, markRequired: false },
      });
      
      render(<SettingsPanel />);
      
      expect(screen.getByLabelText('Include example values in schema')).not.toBeChecked();
      expect(screen.getByLabelText('Mark all fields as required')).not.toBeChecked();
    });
  });

  describe('Input Placeholders', () => {
    it('should show placeholders for text inputs', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        settings: { ...mockSettings, title: '', version: '' },
      });
      
      render(<SettingsPanel />);
      
      expect(screen.getByPlaceholderText('My API')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('1.0.0')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('API description')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('https://api.example.com')).toBeInTheDocument();
    });
  });

  describe('Description Textarea', () => {
    it('should render as textarea with rows', () => {
      render(<SettingsPanel />);
      
      const textarea = screen.getByLabelText('Description');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('should handle multiline input', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const textarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
      await user.clear(textarea);
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });
  });

  describe('Specification Version Options', () => {
    it('should have OpenAPI 3.0 option', () => {
      render(<SettingsPanel />);
      
      const select = screen.getByLabelText('Specification Version');
      const options = Array.from(select.querySelectorAll('option')).map(opt => opt.value);
      
      expect(options).toContain('3.0');
    });

    it('should have Swagger 2.0 option', () => {
      render(<SettingsPanel />);
      
      const select = screen.getByLabelText('Specification Version');
      const options = Array.from(select.querySelectorAll('option')).map(opt => opt.value);
      
      expect(options).toContain('2.0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const longTitle = 'A'.repeat(200);
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      
      await user.clear(titleInput);
      await user.type(titleInput, longTitle);
      
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });

    it('should handle special characters in inputs', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      await user.clear(titleInput);
      await user.type(titleInput, 'API @#$% & *');
      
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });

    it('should handle empty values', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      await user.clear(titleInput);
      
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });

    it('should handle URL with query parameters', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const urlInput = screen.getByLabelText('Server URL') as HTMLInputElement;
      await user.clear(urlInput);
      await user.type(urlInput, 'https://api.com?key=value&foo=bar');
      
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title');
      expect(titleInput).toHaveAttribute('id', 'api-title');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title');
      titleInput.focus();
      
      expect(titleInput).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(screen.getByLabelText('Version')).toHaveFocus();
    });

    it('should have accessible checkbox labels', () => {
      render(<SettingsPanel />);
      
      const checkbox = screen.getByLabelText('Include example values in schema');
      expect(checkbox).toHaveAttribute('id', 'includeExamples');
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const start = performance.now();
      render(<SettingsPanel />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });

    it('should handle rapid input changes', async () => {
      const user = userEvent.setup();
      render(<SettingsPanel />);
      
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      
      await user.clear(titleInput);
      await user.type(titleInput, 'ABC');
      
      // Should be called for each character
      expect(mockStore.updateSettings).toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    it('should render section icons', () => {
      const { container } = render(<SettingsPanel />);
      
      expect(container.querySelector('.fa-info-circle')).toBeInTheDocument();
      expect(container.querySelector('.fa-sliders-h')).toBeInTheDocument();
    });
  });
});
