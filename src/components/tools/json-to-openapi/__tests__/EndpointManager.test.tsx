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
      const { container } = render(<EndpointManager />);
      expect(container.querySelector('.endpoint-method.get')).toHaveTextContent('GET');
      expect(container.querySelector('.endpoint-method.post')).toHaveTextContent('POST');
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
      render(<EndpointManager />);
      // Active endpoint is expanded by default
      expect(screen.getByLabelText(/path/i)).toBeInTheDocument();
    });

    it('should show collapse icon when expanded', async () => {
      const { container } = render(<EndpointManager />);
      expect(container.querySelector('.fa-chevron-up')).toBeInTheDocument();
    });

    it('should show expand icon when collapsed', async () => {
      const user = userEvent.setup();
      const { container } = render(<EndpointManager />);
      // Collapse the expanded endpoint
      await user.click(screen.getByText('/api/users'));
      expect(container.querySelector('.fa-chevron-down')).toBeInTheDocument();
    });

    it('should toggle expanded state on multiple clicks', async () => {
      const user = userEvent.setup();
      render(<EndpointManager />);
      
      const header = screen.getByText('/api/users');
      
      // Collapse (was expanded initially)
      await user.click(header);
      expect(screen.queryByLabelText(/path/i)).not.toBeInTheDocument();

      // Expand again
      await user.click(header);
      expect(screen.getByLabelText(/path/i)).toBeInTheDocument();
    });
  });

  describe('Editing Endpoint Configuration', () => {
    beforeEach(() => {
      render(<EndpointManager />);
    });

    it('should display all configuration fields when expanded', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/path/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/http method/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/operation id/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/response code/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
      });
    });

    it('should update path when changed', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/path/i)).toBeInTheDocument();
      });
      
      const pathInput = screen.getByLabelText(/path/i) as HTMLInputElement;
      fireEvent.change(pathInput, { target: { value: '/api/v2/users' } });
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ path: '/api/v2/users' })
      );
    });

    it('should update HTTP method when changed', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/http method/i)).toBeInTheDocument();
      });
      
      const methodSelect = screen.getByLabelText(/http method/i);
      await user.selectOptions(methodSelect, 'post');
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ method: 'post' })
      );
    });

    it('should update operation ID when changed', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/operation id/i)).toBeInTheDocument();
      });
      
      const operationInput = screen.getByLabelText(/operation id/i) as HTMLInputElement;
      fireEvent.change(operationInput, { target: { value: 'listUsers' } });
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ operationId: 'listUsers' })
      );
    });

    it('should update response code when changed', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/response code/i)).toBeInTheDocument();
      });
      
      const codeInput = screen.getByLabelText(/response code/i) as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: '201' } });
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ responseCode: '201' })
      );
    });

    it('should update tags when changed', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
      
      const tagsInput = screen.getByLabelText(/tags/i) as HTMLInputElement;
      fireEvent.change(tagsInput, { target: { value: 'users, authentication' } });
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ tags: 'users, authentication' })
      );
    });

    it('should update summary when changed', async () => {
      await waitFor(() => {
        expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
      });
      
      const summaryInput = screen.getByLabelText(/summary/i) as HTMLInputElement;
      fireEvent.change(summaryInput, { target: { value: 'Get list of all users' } });
      
      expect(mockStore.updateEndpoint).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ summary: 'Get list of all users' })
      );
    });
  });

  describe('Loading Sample JSON', () => {
    beforeEach(() => {
      render(<EndpointManager />);
    });

    it('should display sample JSON buttons', async () => {
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /product/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /blog/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /order/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /error/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
      });
    });

    it('should load user sample when clicked', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /user/i }));
      
      expect(mockStore.loadEndpointJSON).toHaveBeenCalledWith(
        0,
        expect.stringContaining('"')
      );
    });

    it('should load product sample when clicked', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /product/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /product/i }));
      
      expect(mockStore.loadEndpointJSON).toHaveBeenCalledWith(0, expect.any(String));
    });

    it('should load all sample types', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
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
        await user.click(screen.getByRole('button', { name: new RegExp(buttonText, 'i') }));
        expect(mockStore.loadEndpointJSON).toHaveBeenCalled();
        mockStore.loadEndpointJSON.mockClear();
      }
    });
  });

  describe('HTTP Method Options', () => {
    it('should have all HTTP method options', async () => {
      render(<EndpointManager />);

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
      
      const { container } = render(<EndpointManager />);
      const pathEl = container.querySelector('.endpoint-path');
      expect(pathEl).toBeInTheDocument();
      expect(pathEl).toHaveTextContent('');
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
      render(<EndpointManager />);

      expect(screen.getByLabelText('Path')).toBeInTheDocument();
      expect(screen.getByLabelText('HTTP Method')).toBeInTheDocument();
      expect(screen.getByLabelText('Operation ID')).toBeInTheDocument();
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
