import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointManager } from '../EndpointManager';
import { useOpenAPIStore } from '@/store/openapi';
import { PerformanceProfiler } from '@/__tests__/test-utils';

// Mock the store
jest.mock('@/store/openapi');

describe('EndpointManager', () => {
  const mockStore = {
    endpoints: [
      {
        id: '1',
        path: '/api/users',
        method: 'get',
        json: '{"id": 1, "name": "John"}',
        operationId: 'getUsers',
        summary: 'Get all users',
        tags: 'users',
        responseCode: '200',
      },
      {
        id: '2',
        path: '/api/products',
        method: 'post',
        json: '',
        responseCode: '201',
      },
    ],
    activeEndpointIndex: 0,
    addEndpoint: jest.fn(),
    removeEndpoint: jest.fn(),
    setActiveEndpoint: jest.fn(),
    updateEndpoint: jest.fn(),
    loadEndpointJSON: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOpenAPIStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  describe('Rendering', () => {
    it('should render endpoint manager with title', () => {
      render(<EndpointManager />);
      expect(screen.getByText('API Endpoints')).toBeInTheDocument();
    });

    it('should display endpoint count badge', () => {
      render(<EndpointManager />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render add endpoint button', () => {
      render(<EndpointManager />);
      expect(screen.getByTitle('Add new endpoint')).toBeInTheDocument();
    });

    it('should render all endpoints', () => {
      render(<EndpointManager />);
      expect(screen.getByText('/api/users')).toBeInTheDocument();
      expect(screen.getByText('/api/products')).toBeInTheDocument();
    });

    it('should display HTTP methods', () => {
      render(<EndpointManager />);
      expect(screen.getByText('GET')).toBeInTheDocument();
      expect(screen.getByText('POST')).toBeInTheDocument();
    });

    it('should show JSON status icon for endpoint with JSON', () => {
      const { container } = render(<EndpointManager />);
      const checkIcon = container.querySelector('.fa-check-circle');
      expect(checkIcon).toBeInTheDocument();
    });

    it('should show warning icon for endpoint without JSON', () => {
      const { container } = render(<EndpointManager />);
      const warningIcon = container.querySelector('.fa-exclamation-circle');
      expect(warningIcon).toBeInTheDocument();
    });
  });

  describe('Adding Endpoints', () => {
    it('should call addEndpoint when add button clicked', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      await user.click(screen.getByTitle('Add new endpoint'));
      expect(mockStore.addEndpoint).toHaveBeenCalledTimes(1);
    });
  });

  describe('Removing Endpoints', () => {
    it('should call removeEndpoint when remove button clicked', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      const removeButtons = screen.getAllByTitle('Remove endpoint');
      await user.click(removeButtons[0]);
      
      expect(mockStore.removeEndpoint).toHaveBeenCalledWith(0);
    });

    it('should disable remove button when only one endpoint exists', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [mockStore.endpoints[0]],
      });
      
      render(<EndpointManager />);
      
      const removeButton = screen.getByTitle('Remove endpoint');
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Expanding/Collapsing Endpoints', () => {
    it('should expand endpoint when header is clicked', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      const endpoint = screen.getByText('/api/users').closest('.endpoint-card');
      await user.click(screen.getByText('/api/users'));
      
      await waitFor(() => {
        expect(screen.getByLabelText('Path')).toBeInTheDocument();
      });
    });

    it('should show collapse icon when expanded', async () => {
      const user = userEvent.setup();
      const { container } = render(<EndpointManager />);
      
      await user.click(screen.getByText('/api/users'));
      
      await waitFor(() => {
        expect(container.querySelector('.fa-chevron-up')).toBeInTheDocument();
      });
    });

    it('should show expand icon when collapsed', () => {
      const { container } = render(<EndpointManager />);
      expect(container.querySelector('.fa-chevron-down')).toBeInTheDocument();
    });

    it('should toggle expanded state on multiple clicks', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      const header = screen.getByText('/api/users');
      
      // Expand
      await user.click(header);
      await waitFor(() => {
        expect(screen.getByLabelText('Path')).toBeInTheDocument();
      });
      
      // Collapse
      await user.click(header);
      await waitFor(() => {
        expect(screen.queryByLabelFor('Path')).not.toBeInTheDocument();
      });
    });
  });

  describe('Editing Endpoint Configuration', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      await user.click(screen.getByText('/api/users'));
    });

    it('should display all configuration fields when expanded', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText('Path')).toBeInTheDocument();
        expect(screen.getByLabelText('HTTP Method')).toBeInTheDocument();
        expect(screen.getByLabelText('Operation ID')).toBeInTheDocument();
        expect(screen.getByLabelText('Response Code')).toBeInTheDocument();
        expect(screen.getByLabelText('Tags (comma-separated)')).toBeInTheDocument();
        expect(screen.getByLabelText('Summary')).toBeInTheDocument();
      });
    });

    it('should update path when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Path')).toBeInTheDocument();
      });
      
      const pathInput = screen.getByLabelText('Path') as HTMLInputElement;
      await user.clear(pathInput);
      await user.type(pathInput, '/api/v2/users');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ path: '/api/v2/users' })
      );
    });

    it('should update HTTP method when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('HTTP Method')).toBeInTheDocument();
      });
      
      const methodSelect = screen.getByLabelText('HTTP Method');
      await user.selectOptions(methodSelect, 'post');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ method: 'post' })
      );
    });

    it('should update operation ID when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Operation ID')).toBeInTheDocument();
      });
      
      const operationInput = screen.getByLabelText('Operation ID') as HTMLInputElement;
      await user.clear(operationInput);
      await user.type(operationInput, 'listUsers');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ operationId: 'listUsers' })
      );
    });

    it('should update response code when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Response Code')).toBeInTheDocument();
      });
      
      const codeInput = screen.getByLabelText('Response Code') as HTMLInputElement;
      await user.clear(codeInput);
      await user.type(codeInput, '201');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ responseCode: '201' })
      );
    });

    it('should update tags when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Tags (comma-separated)')).toBeInTheDocument();
      });
      
      const tagsInput = screen.getByLabelText('Tags (comma-separated)') as HTMLInputElement;
      await user.clear(tagsInput);
      await user.type(tagsInput, 'users, authentication');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ tags: 'users, authentication' })
      );
    });

    it('should update summary when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Summary')).toBeInTheDocument();
      });
      
      const summaryInput = screen.getByLabelText('Summary') as HTMLInputElement;
      await user.clear(summaryInput);
      await user.type(summaryInput, 'Get list of all users');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ summary: 'Get list of all users' })
      );
    });
  });

  describe('Loading Sample JSON', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      await user.click(screen.getByText('/api/users'));
    });

    it('should display sample JSON buttons', async () => {
      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.getByText('Order')).toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('List')).toBeInTheDocument();
      });
    });

    it('should load user sample when clicked', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('User'));
      
      expect(mockStore.loadEndpointJSON).toHaveBeenCalledWith(
        0,
        expect.stringContaining('"')
      );
    });

    it('should load product sample when clicked', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('Product')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Product'));
      
      expect(mockStore.loadEndpointJSON).toHaveBeenCalledWith(0, expect.any(String));
    });

    it('should load all sample types', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
      });
      
      const sampleButtons = [
        'User',
        'Product',
        'Blog',
        'Order',
        'Error',
        'List',
      ];
      
      for (const buttonText of sampleButtons) {
        await user.click(screen.getByText(buttonText));
        expect(mockStore.loadEndpointJSON).toHaveBeenCalled();
        mockStore.loadEndpointJSON.mockClear();
      }
    });
  });

  describe('HTTP Method Options', () => {
    it('should have all HTTP method options', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      await user.click(screen.getByText('/api/users'));
      
      await waitFor(() => {
        const methodSelect = screen.getByLabelText('HTTP Method');
        expect(methodSelect).toBeInTheDocument();
        
        const options = Array.from(methodSelect.querySelectorAll('option')).map(
          (opt) => opt.value
        );
        
        expect(options).toContain('get');
        expect(options).toContain('post');
        expect(options).toContain('put');
        expect(options).toContain('patch');
        expect(options).toContain('delete');
      });
    });
  });

  describe('Active State', () => {
    it('should apply active class to active endpoint', () => {
      const { container } = render(<EndpointManager />);
      
      const endpoints = container.querySelectorAll('.endpoint-card');
      expect(endpoints[0]).toHaveClass('active');
    });

    it('should set active endpoint when clicked', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      await user.click(screen.getByText('/api/products'));
      
      expect(mockStore.setActiveEndpoint).toHaveBeenCalledWith(1);
    });
  });

  describe('Performance', () => {
    it('should render quickly with multiple endpoints', () => {
      const manyEndpoints = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        path: `/api/endpoint${i}`,
        method: 'get',
        json: '{}',
        responseCode: '200',
      }));
      
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: manyEndpoints,
      });
      
      const profiler = new PerformanceProfiler();
      profiler.mark('start');
      
      render(<EndpointManager />);
      
      profiler.mark('end');
      const renderTime = profiler.measure('start', 'end');
      
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle endpoints with empty path', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [{ ...mockStore.endpoints[0], path: '' }],
      });
      
      render(<EndpointManager />);
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle endpoints with long paths', () => {
      const longPath = '/api/v1/very/long/path/to/resource/with/many/segments';
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [{ ...mockStore.endpoints[0], path: longPath }],
      });
      
      render(<EndpointManager />);
      expect(screen.getByText(longPath)).toBeInTheDocument();
    });

    it('should handle endpoints with special characters in path', () => {
      const specialPath = '/api/users/{id}/posts/{postId}';
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [{ ...mockStore.endpoints[0], path: specialPath }],
      });
      
      render(<EndpointManager />);
      expect(screen.getByText(specialPath)).toBeInTheDocument();
    });

    it('should handle empty JSON', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [{ ...mockStore.endpoints[0], json: '' }],
      });
      
      const { container } = render(<EndpointManager />);
      expect(container.querySelector('.fa-exclamation-circle')).toBeInTheDocument();
    });

    it('should handle whitespace-only JSON', () => {
      (useOpenAPIStore as unknown as jest.Mock).mockReturnValue({
        ...mockStore,
        endpoints: [{ ...mockStore.endpoints[0], json: '   \n   ' }],
      });
      
      const { container } = render(<EndpointManager />);
      expect(container.querySelector('.fa-exclamation-circle')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      await user.click(screen.getByText('/api/users'));
      
      await waitFor(() => {
        expect(screen.getByLabelText('Path')).toBeInTheDocument();
        expect(screen.getByLabelText('HTTP Method')).toBeInTheDocument();
        expect(screen.getByLabelText('Operation ID')).toBeInTheDocument();
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      const addButton = screen.getByTitle('Add new endpoint');
      addButton.focus();
      
      expect(addButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockStore.addEndpoint).toHaveBeenCalled();
    });
  });
});
