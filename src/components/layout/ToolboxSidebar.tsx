'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getEnabledTools, type ToolMetadata } from '@/config/tools';
import { ToolIcon } from '@/components/common/ToolIcon';

interface ToolboxSidebarProps {
  isOpen: boolean;
}

const SCROLL_POSITION_KEY = 'toolbox-sidebar-scroll-position';
const COLLAPSED_CATEGORIES_KEY = 'toolbox-sidebar-collapsed-categories-v1';

export function ToolboxSidebar({ isOpen }: ToolboxSidebarProps) {
  const pathname = usePathname();
  const tools = getEnabledTools();
  const listRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);

  // Group tools by category
  const groupedTools = useMemo(() => {
    return tools.reduce((acc, tool) => {
      const categoryName = tool.category.toUpperCase().replace('-', ' ') + ' TOOLS';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(tool);
      return acc;
    }, {} as Record<string, ToolMetadata[]>);
  }, [tools]);

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Restore collapsed categories on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAPSED_CATEGORIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        if (parsed && typeof parsed === 'object') {
          setCollapsedCategories(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Ensure active tool's category stays expanded
  useEffect(() => {
    const activeTool = tools.find((t) => t.route === pathname);
    if (!activeTool) return;

    const activeCategory = activeTool.category.toUpperCase().replace('-', ' ') + ' TOOLS';
    setCollapsedCategories((prev) => {
      if (!prev[activeCategory]) return prev;
      const next = { ...prev, [activeCategory]: false };
      try {
        localStorage.setItem(COLLAPSED_CATEGORIES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [pathname, tools]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = { ...prev, [category]: !prev[category] };
      try {
        localStorage.setItem(COLLAPSED_CATEGORIES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Restore scroll position on mount
  useEffect(() => {
    if (!listRef.current) return;
    
    const savedScrollPosition = localStorage.getItem(SCROLL_POSITION_KEY);
    if (savedScrollPosition) {
      isRestoringRef.current = true;
      listRef.current.scrollTop = parseInt(savedScrollPosition, 10);
      // Reset flag after a short delay to allow scroll to complete
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }
  }, []);

  // Save scroll position when it changes
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleScroll = () => {
      // Don't save scroll position if we're currently restoring it
      if (isRestoringRef.current) return;
      localStorage.setItem(SCROLL_POSITION_KEY, String(listElement.scrollTop));
    };

    listElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside className={`toolbox-sidebar ${!isOpen ? 'collapsed' : ''}`} id="toolboxSidebar">
      <div className="toolbox-header">Tools Explorer</div>
      <div className="toolbox-list" ref={listRef}>
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <button
              type="button"
              className="toolbox-category"
              aria-expanded={!collapsedCategories[category]}
              onClick={() => toggleCategory(category)}
            >
              <span className="toolbox-category-left">
                <span
                  className={`toolbox-category-chevron ${
                    collapsedCategories[category] ? 'collapsed' : 'expanded'
                  }`}
                  aria-hidden="true"
                />
                <span>{category}</span>
              </span>
              <span className="toolbox-category-count">{categoryTools.length}</span>
            </button>

            {!collapsedCategories[category] &&
              categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.route}
                  className={`toolbox-item ${pathname === tool.route ? 'active' : ''}`}
                  title={tool.description}
                >
                  <ToolIcon icon={tool.icon} toolId={tool.id} />
                  {tool.name}
                </Link>
              ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
