'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getEnabledTools, type ToolMetadata } from '@/config/tools';

interface ToolboxSidebarProps {
  isOpen: boolean;
}

export function ToolboxSidebar({ isOpen }: ToolboxSidebarProps) {
  const pathname = usePathname();
  const tools = getEnabledTools();

  // Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    const categoryName = tool.category.toUpperCase().replace('-', ' ') + ' TOOLS';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(tool);
    return acc;
  }, {} as Record<string, ToolMetadata[]>);

  return (
    <aside className={`toolbox-sidebar ${!isOpen ? 'collapsed' : ''}`} id="toolboxSidebar">
      <div className="toolbox-header">Tools Explorer</div>
      <div className="toolbox-list">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <div className="toolbox-category">{category}</div>
            {categoryTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.route}
                className={`toolbox-item ${pathname === tool.route ? 'active' : ''}`}
                title={tool.description}
              >
                <i className={tool.icon}></i>
                {tool.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
