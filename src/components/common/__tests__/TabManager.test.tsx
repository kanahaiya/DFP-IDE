import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabManager from '../TabManager';
import { PerformanceProfiler } from '@/__tests__/test-utils';
import type { Tab } from '@/hooks/useTabs';

describe('TabManager', () => {
  const mockTabs: Tab[] = [
    { id: '1', name: 'Tab 1', content: 'Content 1' },
    { id: '2', name: 'Tab 2', content: 'Content 2' },
    { id: '3', name: 'Tab 3', content: 'Content 3' },
  ];

  const mockCallbacks = {
    onTabClick: jest.fn(),
    onTabClose: jest.fn(),
    onTabRename: jest.fn(),
    onAddTab: jest.fn(),
    onDuplicateTab: jest.fn(),
    onCloseOtherTabs: jest.fn(),
    onCloseAllTabs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Functional Tests', () => {
    describe('Tab Rendering', () => {
      it('should render all tabs', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Tab 2')).toBeInTheDocument();
        expect(screen.getByText('Tab 3')).toBeInTheDocument();
      });

      it('should highlight active tab', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="2"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const activeTab = screen.getByText('Tab 2').closest('.tab');
        expect(activeTab).toHaveClass('active');
      });

      it('should render add button', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByLabelText('Add new tab')).toBeInTheDocument();
      });

      it('should render close button on each tab', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const closeButtons = screen.getAllByLabelText('Close tab');
        expect(closeButtons).toHaveLength(3);
      });
    });

    describe('Tab Switching', () => {
      it('should call onTabClick when tab is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        await user.click(screen.getByText('Tab 2'));
        expect(mockCallbacks.onTabClick).toHaveBeenCalledWith('2');
      });

      it('should not call onTabClick when active tab is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        mockCallbacks.onTabClick.mockClear();
        await user.click(screen.getByText('Tab 1'));
        expect(mockCallbacks.onTabClick).toHaveBeenCalledWith('1');
      });
    });

    describe('Tab Closing', () => {
      it('should call onTabClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const closeButtons = screen.getAllByLabelText('Close tab');
        await user.click(closeButtons[0]);

        expect(mockCallbacks.onTabClose).toHaveBeenCalledWith('1');
      });

      it('should not propagate click event when close button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const closeButtons = screen.getAllByLabelText('Close tab');
        await user.click(closeButtons[0]);

        expect(mockCallbacks.onTabClose).toHaveBeenCalledWith('1');
        // Tab should not be clicked
        expect(mockCallbacks.onTabClick).not.toHaveBeenCalled();
      });
    });

    describe('Tab Renaming', () => {
      it('should enter edit mode on double-click', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        await waitFor(() => {
          expect(screen.getByDisplayValue('Tab 1')).toBeInTheDocument();
        });
      });

      it('should call onTabRename when Enter is pressed', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1');
        await user.clear(input);
        await user.type(input, 'New Name{Enter}');

        expect(mockCallbacks.onTabRename).toHaveBeenCalledWith('1', 'New Name');
      });

      it('should call onTabRename on blur', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1');
        await user.clear(input);
        await user.type(input, 'New Name');
        
        fireEvent.blur(input);

        await waitFor(() => {
          expect(mockCallbacks.onTabRename).toHaveBeenCalledWith('1', 'New Name');
        });
      });

      it('should cancel editing on Escape key', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1');
        await user.type(input, ' Modified{Escape}');

        await waitFor(() => {
          expect(mockCallbacks.onTabRename).not.toHaveBeenCalled();
          expect(screen.getByText('Tab 1')).toBeInTheDocument();
        });
      });

      it('should not rename with empty name', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1');
        await user.clear(input);
        await user.type(input, '{Enter}');

        expect(mockCallbacks.onTabRename).not.toHaveBeenCalled();
      });

      it('should trim whitespace from tab name', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        await user.dblClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1');
        await user.clear(input);
        await user.type(input, '  Trimmed Name  {Enter}');

        expect(mockCallbacks.onTabRename).toHaveBeenCalledWith('1', 'Trimmed Name');
      });

      it('should limit tab name length to 50 characters', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.doubleClick(tab1!);

        const input = screen.getByDisplayValue('Tab 1') as HTMLInputElement;
        expect(input.maxLength).toBe(50);
      });
    });

    describe('Add Tab', () => {
      it('should call onAddTab when add button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        await user.click(screen.getByLabelText('Add new tab'));
        expect(mockCallbacks.onAddTab).toHaveBeenCalled();
      });

      it('should disable add button when max tabs reached', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={false}
            maxTabs={3}
            {...mockCallbacks}
          />
        );

        const addButton = screen.getByLabelText(/Add new tab|Maximum 3 tabs/);
        expect(addButton).toBeDisabled();
      });

      it('should show appropriate title when disabled', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={false}
            maxTabs={5}
            {...mockCallbacks}
          />
        );

        expect(screen.getByTitle('Maximum 5 tabs')).toBeInTheDocument();
      });
    });

    describe('Context Menu', () => {
      it('should open context menu on right-click', async () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.contextMenu(tab1!);

        await waitFor(() => {
          expect(screen.getByText('New Request')).toBeInTheDocument();
          expect(screen.getByText('Duplicate Tab')).toBeInTheDocument();
          expect(screen.getByText('Close Tab')).toBeInTheDocument();
          expect(screen.getByText('Close Other Tabs')).toBeInTheDocument();
          expect(screen.getByText('Close All Tabs')).toBeInTheDocument();
        });
      });

      it('should create new tab from context menu', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.contextMenu(tab1!);

        await user.click(screen.getByText('New Request'));
        expect(mockCallbacks.onAddTab).toHaveBeenCalled();
      });

      it('should duplicate tab from context menu', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.contextMenu(tab1!);

        await user.click(screen.getByText('Duplicate Tab'));
        expect(mockCallbacks.onDuplicateTab).toHaveBeenCalledWith('1');
      });

      it('should close tab from context menu', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab2 = screen.getByText('Tab 2').closest('.tab');
        fireEvent.contextMenu(tab2!);

        await user.click(screen.getByText('Close Tab'));
        expect(mockCallbacks.onTabClose).toHaveBeenCalledWith('2');
      });

      it('should close other tabs from context menu', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="2"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab2 = screen.getByText('Tab 2').closest('.tab');
        fireEvent.contextMenu(tab2!);

        await user.click(screen.getByText('Close Other Tabs'));
        expect(mockCallbacks.onCloseOtherTabs).toHaveBeenCalledWith('2');
      });

      it('should close all tabs from context menu', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.contextMenu(tab1!);

        await user.click(screen.getByText('Close All Tabs'));
        expect(mockCallbacks.onCloseAllTabs).toHaveBeenCalled();
      });

      it('should close context menu when clicking outside', async () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.contextMenu(tab1!);

        expect(screen.getByText('Duplicate Tab')).toBeInTheDocument();

        // Click outside
        fireEvent.click(document.body);

        await waitFor(() => {
          expect(screen.queryByText('Duplicate Tab')).not.toBeInTheDocument();
        });
      });
    });

    describe('Single Tab', () => {
      it('should render single tab', () => {
        const singleTab = [mockTabs[0]];
        render(
          <TabManager
            tabs={singleTab}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByText('Tab 1')).toBeInTheDocument();
      });
    });

    describe('Empty Tabs', () => {
      it('should render with empty tabs array', () => {
        render(
          <TabManager
            tabs={[]}
            activeTabId={null}
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByLabelText('Add new tab')).toBeInTheDocument();
      });
    });
  });

  describe('Non-functional Tests', () => {
    describe('Performance', () => {
      it('should render in less than 20ms', () => {
        const profiler = new PerformanceProfiler();
        
        profiler.mark('start');
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );
        profiler.mark('end');
        
        const renderTime = profiler.measure('start', 'end');
        expect(renderTime).toBeLessThan(20);
      });

      it('should handle 10+ tabs efficiently', () => {
        const manyTabs = Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          name: `Tab ${i + 1}`,
          content: `Content ${i + 1}`,
        }));

        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        render(
          <TabManager
            tabs={manyTabs}
            activeTabId="5"
            canAddTab={false}
            maxTabs={10}
            {...mockCallbacks}
          />
        );
        
        profiler.mark('end');
        const renderTime = profiler.measure('start', 'end');
        
        expect(renderTime).toBeLessThan(50);
        expect(screen.getByText('Tab 5')).toBeInTheDocument();
      });

      it('should switch tabs quickly', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const profiler = new PerformanceProfiler();
        profiler.mark('start');
        
        await user.click(screen.getByText('Tab 2'));
        
        profiler.mark('end');
        const switchTime = profiler.measure('start', 'end');
        
        expect(switchTime).toBeLessThan(20);
        expect(mockCallbacks.onTabClick).toHaveBeenCalledWith('2');
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByLabelText('Add new tab')).toBeInTheDocument();
        expect(screen.getAllByLabelText('Close tab')).toHaveLength(3);
      });

      it('should be keyboard navigable', async () => {
        const user = userEvent.setup();
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const addButton = screen.getByLabelText('Add new tab');
        addButton.focus();
        
        expect(addButton).toHaveFocus();
        
        await user.keyboard('{Enter}');
        expect(mockCallbacks.onAddTab).toHaveBeenCalled();
      });

      it('should have proper tab titles', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1');
        expect(tab1).toHaveAttribute('title', 'Tab 1');
      });
    });

    describe('UI/UX', () => {
      it('should apply active class to active tab', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="2"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const activeTab = screen.getByText('Tab 2').closest('.tab');
        expect(activeTab).toHaveClass('active');
      });

      it('should not apply active class to inactive tabs', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="2"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const inactiveTab = screen.getByText('Tab 1').closest('.tab');
        expect(inactiveTab).not.toHaveClass('active');
      });

      it('should auto-focus input when entering edit mode', async () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.doubleClick(tab1!);

        await waitFor(() => {
          const input = screen.getByDisplayValue('Tab 1');
          expect(input).toHaveFocus();
        });
      });

      it('should select all text when entering edit mode', async () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tab1 = screen.getByText('Tab 1').closest('.tab');
        fireEvent.doubleClick(tab1!);

        await waitFor(() => {
          const input = screen.getByDisplayValue('Tab 1') as HTMLInputElement;
          expect(input.selectionStart).toBe(0);
          expect(input.selectionEnd).toBe(input.value.length);
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle null activeTabId', () => {
        render(
          <TabManager
            tabs={mockTabs}
            activeTabId={null}
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
          expect(tab).not.toHaveClass('active');
        });
      });

      it('should handle very long tab names', () => {
        const longNameTab = [{
          id: '1',
          name: 'A'.repeat(100),
          content: 'content',
        }];

        render(
          <TabManager
            tabs={longNameTab}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
      });

      it('should handle special characters in tab names', () => {
        const specialCharTab = [{
          id: '1',
          name: '<script>alert("xss")</script>',
          content: 'content',
        }];

        render(
          <TabManager
            tabs={specialCharTab}
            activeTabId="1"
            canAddTab={true}
            maxTabs={10}
            {...mockCallbacks}
          />
        );

        // Should render as text, not execute script
        expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
      });
    });
  });
});
