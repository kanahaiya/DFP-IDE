'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: string;
  category: string;
}

const tools: Tool[] = [
  {
    id: 'json-to-openapi',
    name: 'JSON to OpenAPI',
    path: '/json-to-openapi',
    icon: 'fas fa-file-invoice',
    category: 'JSON TOOLS',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    path: '/json-formatter',
    icon: 'fas fa-align-left',
    category: 'JSON TOOLS',
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    path: '/json-validator',
    icon: 'fas fa-check-double',
    category: 'JSON TOOLS',
  },
];

interface ToolboxSidebarProps {
  isOpen: boolean;
}

export function ToolboxSidebar({ isOpen }: ToolboxSidebarProps) {
  const pathname = usePathname();

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

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
                href={tool.path}
                className={`toolbox-item ${pathname === tool.path ? 'active' : ''}`}
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
