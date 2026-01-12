import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutputFormatToggle } from '../OutputFormatToggle';
import { useOpenAPIStore } from '@/store/openapi';

jest.mock('@/store/openapi');

describe('OutputFormatToggle', () => {
  const mockStore = {
    outputFormat: 'yaml' as const,
    setOutputFormat: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOpenAPIStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render both format buttons', () => {
      render(<OutputFormatToggle />);
      expect(screen.getByText('YAML')).toBeInTheDocument();
      expect(screen.getByText('JSON')).toBeInTheDocument();
    });

    it('should highlight active format', () => {
      render(<OutputFormatToggle />);
      const yamlButton = screen.getByText('YAML');
      expect(yamlButton).toHaveClass('active');
    });

    it('should not highlight inactive format', () => {
      render(<OutputFormatToggle />);
      const jsonButton = screen.getByText('JSON');
      expect(jsonButton).not.toHaveClass('active');
    });

    it('should render with JSON format active', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        outputFormat: 'json',
      });
      
      render(<OutputFormatToggle />);
      const jsonButton = screen.getByText('JSON');
      expect(jsonButton).toHaveClass('active');
    });
  });

  describe('Format Switching', () => {
    it('should call setOutputFormat when YAML clicked', async () => {
      const user = userEvent.setup();
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        outputFormat: 'json',
      });
      
      render(<OutputFormatToggle />);
      await user.click(screen.getByText('YAML'));
      
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('yaml');
    });

    it('should call setOutputFormat when JSON clicked', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      await user.click(screen.getByText('JSON'));
      
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('json');
    });

    it('should allow switching back and forth', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      await user.click(screen.getByText('JSON'));
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('json');
      
      mockStore.setOutputFormat.mockClear();
      
      await user.click(screen.getByText('YAML'));
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('yaml');
    });
  });

  describe('Tooltips', () => {
    it('should show tooltip for YAML button', () => {
      render(<OutputFormatToggle />);
      const yamlButton = screen.getByTitle('Switch to YAML format');
      expect(yamlButton).toBeInTheDocument();
    });

    it('should show tooltip for JSON button', () => {
      render(<OutputFormatToggle />);
      const jsonButton = screen.getByTitle('Switch to JSON format');
      expect(jsonButton).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const start = performance.now();
      render(<OutputFormatToggle />);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      const jsonButton = screen.getByText('JSON');
      const yamlButton = screen.getByText('YAML');
      
      // Rapid clicking
      await user.click(jsonButton);
      await user.click(yamlButton);
      await user.click(jsonButton);
      await user.click(yamlButton);
      
      expect(mockStore.setOutputFormat).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      const yamlButton = screen.getByText('YAML');
      yamlButton.focus();
      
      expect(yamlButton).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(screen.getByText('JSON')).toHaveFocus();
    });

    it('should activate on Enter key', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      const jsonButton = screen.getByText('JSON');
      jsonButton.focus();
      
      await user.keyboard('{Enter}');
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('json');
    });

    it('should activate on Space key', async () => {
      const user = userEvent.setup();
      render(<OutputFormatToggle />);
      
      const jsonButton = screen.getByText('JSON');
      jsonButton.focus();
      
      await user.keyboard(' ');
      expect(mockStore.setOutputFormat).toHaveBeenCalledWith('json');
    });
  });

  describe('Visual States', () => {
    it('should apply correct classes for YAML active state', () => {
      render(<OutputFormatToggle />);
      const yamlButton = screen.getByText('YAML');
      
      expect(yamlButton).toHaveClass('active');
    });

    it('should apply correct classes for JSON active state', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        outputFormat: 'json',
      });
      
      render(<OutputFormatToggle />);
      const jsonButton = screen.getByText('JSON');
      
      expect(jsonButton).toHaveClass('active');
    });

    it('should have format-toggle container class', () => {
      const { container } = render(<OutputFormatToggle />);
      expect(container.querySelector('.format-toggle')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined outputFormat gracefully', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        outputFormat: undefined,
        setOutputFormat: mockStore.setOutputFormat,
      });
      
      expect(() => render(<OutputFormatToggle />)).not.toThrow();
    });

    it('should handle null outputFormat gracefully', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        outputFormat: null,
        setOutputFormat: mockStore.setOutputFormat,
      });
      
      expect(() => render(<OutputFormatToggle />)).not.toThrow();
    });
  });

  describe('Integration with Store', () => {
    it('should reflect store changes', () => {
      const { rerender } = render(<OutputFormatToggle />);
      
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        outputFormat: 'json',
      });
      
      rerender(<OutputFormatToggle />);
      
      expect(screen.getByText('JSON')).toHaveClass('active');
    });
  });
});
