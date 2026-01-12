import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Endpoint, OpenAPISettings } from '@/types';

export interface Tab {
  id: string;
  name: string;
  inputJSON: string;
  endpoints: Endpoint[];
  settings: Partial<OpenAPISettings>;
  createdAt: number;
}

const MAX_TABS = 10;
const STORAGE_KEY = 'openapi-tabs';

export function useTabs() {
  // Initialize with empty state to avoid hydration mismatch
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Load tabs from localStorage only on client after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { tabs: savedTabs, activeTabId: savedActiveId } = JSON.parse(stored);
        if (savedTabs && savedTabs.length > 0) {
          setTabs(savedTabs);
          setActiveTabId(savedActiveId || savedTabs[0].id);
          return;
        }
      } catch (error) {
        console.error('Failed to load tabs from localStorage:', error);
      }
    }

    // Create default tab if none exist
    const timestamp = Date.now();
    const defaultTab: Tab = {
      id: `tab-${timestamp}`,
      name: 'JSON to OpenAPI',
      inputJSON: '',
      endpoints: [],
      settings: {},
      createdAt: timestamp,
    };
    setTabs([defaultTab]);
    setActiveTabId(defaultTab.id);
  }, []);

  // Helper function to create a new tab
  const createNewTab = useCallback((name?: string, currentTabs: Tab[] = tabs): Tab => {
    const timestamp = Date.now();
    // Calculate next untitled number: count existing untitled tabs and add 2
    // (First untitled is "Untitled 2" after the default "JSON to OpenAPI" tab)
    const untitledCount = currentTabs.filter(t => t.name.startsWith('Untitled')).length;
    const nextUntitled = untitledCount + 2;
    
    return {
      id: `tab-${timestamp}`,
      name: name || `Untitled ${nextUntitled}`,
      inputJSON: '',
      endpoints: [],
      settings: {},
      createdAt: timestamp,
    };
  }, [tabs]);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabs, activeTabId }));
    }
  }, [tabs, activeTabId]);

  const addTab = useCallback(() => {
    if (tabs.length >= MAX_TABS) {
      alert(`Maximum of ${MAX_TABS} tabs allowed`);
      return null;
    }

    const newTab = createNewTab();
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, [tabs.length, createNewTab]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      
      // If closing active tab, switch to another tab
      if (tabId === activeTabId) {
        const closedIndex = prev.findIndex(t => t.id === tabId);
        const newActiveTab = filtered[closedIndex] || filtered[closedIndex - 1] || filtered[0];
        setActiveTabId(newActiveTab?.id || null);
      }

      // If no tabs left, create a default one
      if (filtered.length === 0) {
        const defaultTab = createNewTab('JSON to OpenAPI');
        setActiveTabId(defaultTab.id);
        return [defaultTab];
      }

      return filtered;
    });
  }, [activeTabId, createNewTab]);

  const renameTab = useCallback((tabId: string, newName: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, name: newName.trim() || tab.name } : tab
    ));
  }, []);

  const updateTab = useCallback((tabId: string, updates: Partial<Omit<Tab, 'id' | 'createdAt'>>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, []);

  // Memoize activeTab to preserve referential equality when tab data doesn't change
  const activeTab = useMemo(() => {
    return tabs.find(tab => tab.id === activeTabId) || null;
  }, [tabs, activeTabId]);

  const switchTab = useCallback((tabId: string) => {
    if (tabs.some(tab => tab.id === tabId)) {
      setActiveTabId(tabId);
    }
  }, [tabs]);

  const duplicateTab = useCallback((tabId: string) => {
    if (tabs.length >= MAX_TABS) {
      alert(`Maximum of ${MAX_TABS} tabs allowed`);
      return null;
    }

    const tabToDuplicate = tabs.find(t => t.id === tabId);
    if (!tabToDuplicate) return null;

    const timestamp = Date.now();
    const newTab: Tab = {
      id: `tab-${timestamp}`,
      name: `${tabToDuplicate.name} Copy`,
      inputJSON: tabToDuplicate.inputJSON,
      endpoints: [...tabToDuplicate.endpoints],
      settings: { ...tabToDuplicate.settings },
      createdAt: timestamp,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, [tabs]);

  const closeOtherTabs = useCallback((tabId: string) => {
    setTabs(prev => {
      const targetTab = prev.find(t => t.id === tabId);
      if (!targetTab) return prev;
      
      setActiveTabId(tabId);
      return [targetTab];
    });
  }, []);

  const closeAllTabs = useCallback(() => {
    const defaultTab = createNewTab('JSON to OpenAPI');
    setTabs([defaultTab]);
    setActiveTabId(defaultTab.id);
  }, [createNewTab]);

  return {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    closeTab,
    renameTab,
    updateTab,
    switchTab,
    duplicateTab,
    closeOtherTabs,
    closeAllTabs,
    maxTabs: MAX_TABS,
    canAddTab: tabs.length < MAX_TABS,
  };
}
