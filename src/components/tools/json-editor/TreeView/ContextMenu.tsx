'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TreeNode, NodeType } from '@/lib/json-editor/types';

interface ContextMenuProps {
  x: number;
  y: number;
  node: TreeNode;
  onAdd: (type: NodeType) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangeType: (type: NodeType) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  canPaste: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const TYPE_OPTIONS: { type: NodeType; label: string; icon: string }[] = [
  { type: 'string', label: 'String', icon: 'fas fa-quote-right' },
  { type: 'number', label: 'Number', icon: 'fas fa-hashtag' },
  { type: 'boolean', label: 'Boolean', icon: 'fas fa-toggle-on' },
  { type: 'null', label: 'Null', icon: 'fas fa-minus' },
  { type: 'object', label: 'Object', icon: 'fas fa-brackets-curly' },
  { type: 'array', label: 'Array', icon: 'fas fa-brackets-square' },
];

export function ContextMenu({
  x,
  y,
  node,
  onAdd,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onChangeType,
  onCopy,
  onCut,
  onPaste,
  canPaste,
  onExpandAll,
  onCollapseAll,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [addSubmenuOpen, setAddSubmenuOpen] = useState(false);
  const [typeSubmenuOpen, setTypeSubmenuOpen] = useState(false);
  const [position, setPosition] = useState({ x, y });

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = x;
      let newY = y;
      
      if (x + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 10;
      }
      if (y + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 10;
      }
      
      setPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  const isRoot = node.depth === 0;
  const isArrayItem = node.parentId && /^\d+$/.test(node.key);
  const canAddChildren = node.type === 'object' || node.type === 'array';

  return (
    <div
      ref={menuRef}
      className="json-editor-context-menu"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add submenu */}
      {canAddChildren && (
        <div
          className="submenu-host"
          onMouseEnter={() => setAddSubmenuOpen(true)}
          onMouseLeave={() => setAddSubmenuOpen(false)}
        >
          <MenuItem icon="fas fa-plus" label="Add Property" hasSubmenu />
          {addSubmenuOpen && (
            <div className="json-editor-context-submenu">
              {TYPE_OPTIONS.map(({ type, label, icon }) => (
                <MenuItem
                  key={type}
                  icon={icon}
                  label={label}
                  onClick={() => onAdd(type)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Clipboard */}
      <MenuItem icon="fas fa-copy" label="Copy" shortcut="Ctrl+C" onClick={onCopy} />
      {!isRoot && (
        <MenuItem icon="fas fa-cut" label="Cut" shortcut="Ctrl+X" onClick={onCut} />
      )}
      {canAddChildren && (
        <MenuItem 
          icon="fas fa-paste" 
          label="Paste" 
          shortcut="Ctrl+V" 
          onClick={onPaste}
          disabled={!canPaste}
        />
      )}

      <Separator />

      {/* Edit */}
      {!isRoot && (
        <>
          <MenuItem icon="fas fa-clone" label="Duplicate" shortcut="Ctrl+D" onClick={onDuplicate} />
          <MenuItem 
            icon="fas fa-trash" 
            label="Delete" 
            shortcut="Delete" 
            onClick={onDelete}
            danger
          />
        </>
      )}

      {/* Move (for array items) */}
      {isArrayItem && (
        <>
          <Separator />
          <MenuItem icon="fas fa-arrow-up" label="Move Up" onClick={onMoveUp} />
          <MenuItem icon="fas fa-arrow-down" label="Move Down" onClick={onMoveDown} />
        </>
      )}

      {/* Change type */}
      {!isRoot && (
        <>
          <Separator />
          <div
            className="submenu-host"
            onMouseEnter={() => setTypeSubmenuOpen(true)}
            onMouseLeave={() => setTypeSubmenuOpen(false)}
          >
            <MenuItem icon="fas fa-exchange-alt" label="Change Type" hasSubmenu />
            {typeSubmenuOpen && (
              <div className="json-editor-context-submenu">
                {TYPE_OPTIONS.map(({ type, label, icon }) => (
                  <MenuItem
                    key={type}
                    icon={icon}
                    label={label}
                    onClick={() => onChangeType(type)}
                    active={node.type === type}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Expand/Collapse */}
      {canAddChildren && (
        <>
          <Separator />
          <MenuItem icon="fas fa-expand" label="Expand All" onClick={onExpandAll} />
          <MenuItem icon="fas fa-compress" label="Collapse All" onClick={onCollapseAll} />
        </>
      )}

      <style jsx>{`
        .json-editor-context-menu {
          position: fixed;
          z-index: 9999;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          padding: 0.25rem 0;
          min-width: 200px;
        }

        .submenu-host {
          position: relative;
        }

        .json-editor-context-submenu {
          position: absolute;
          left: 100%;
          top: 0;
          margin-left: 6px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          padding: 0.25rem 0;
          min-width: 160px;
        }
      `}</style>
    </div>
  );
}

interface MenuItemProps {
  icon: string;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  active?: boolean;
  hasSubmenu?: boolean;
}

function MenuItem({
  icon,
  label,
  shortcut,
  onClick,
  disabled,
  danger,
  active,
  hasSubmenu,
}: MenuItemProps) {
  return (
    <button
      className={`menu-item ${disabled ? 'disabled' : ''} ${danger ? 'danger' : ''} ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={`${icon} icon`} aria-hidden="true" />
      <span className="label">{label}</span>
      {shortcut && (
        <span className="shortcut">{shortcut}</span>
      )}
      {hasSubmenu && (
        <i className="fas fa-chevron-right submenu" aria-hidden="true" />
      )}

      <style jsx>{`
        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          text-align: left;
          font-size: 0.875rem;
          border: none;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .menu-item:hover:not(.disabled) {
          background: var(--hover);
        }

        .menu-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-item.danger {
          color: var(--danger);
        }

        .menu-item.danger:hover:not(.disabled) {
          background: rgba(248, 81, 73, 0.12);
        }

        .menu-item.active {
          background: rgba(88, 166, 255, 0.15);
          color: var(--primary);
        }

        .icon {
          width: 16px;
          text-align: center;
          color: inherit;
          opacity: 0.95;
          flex-shrink: 0;
        }

        .label {
          flex: 1;
        }

        .shortcut {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-left: 0.75rem;
          white-space: nowrap;
        }

        .submenu {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-left: 0.25rem;
          flex-shrink: 0;
        }
      `}</style>
    </button>
  );
}

function Separator() {
  return (
    <>
      <div className="sep" />
      <style jsx>{`
        .sep {
          height: 1px;
          background: var(--border);
          margin: 0.25rem 0;
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
