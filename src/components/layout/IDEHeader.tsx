'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useLayout } from '@/hooks/useLayout';
import { usePathname } from 'next/navigation';
import { useWorkspaceSettings } from '@/hooks/useWorkspaceSettings';
import { useEditorSnapshotsStore } from '@/store/editorSnapshots';
import { exportEditorsAsPng } from '@/lib/editorPngExport';
import { useToast } from '@/store/toast';
import { TOOLS, type ToolMetadata } from '@/config/tools';

interface IDEHeaderProps {
  toolName: string;
  onSidebarToggle: () => void;
  onHelpClick?: () => void;
}

export function IDEHeader({ toolName, onSidebarToggle, onHelpClick }: IDEHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { layout, toggleLayout } = useLayout();
  const pathname = usePathname() || '/';
  const toast = useToast();
  const [workspaceSettings, setWorkspaceSettings] = useWorkspaceSettings();
  const snapshotsByPath = useEditorSnapshotsStore((s) => s.byPath);

  // Tool search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter tools based on search query
  const filteredTools = TOOLS.filter((tool) => {
    if (!searchQuery.trim()) return tool.enabled;
    const query = searchQuery.toLowerCase();
    return (
      tool.enabled &&
      (tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query)))
    );
  });

  // Handle tool selection
  const handleSelectTool = useCallback(
    (tool: ToolMetadata) => {
      router.push(tool.route);
      setSearchQuery('');
      setIsSearchOpen(false);
      setSelectedIndex(0);
    },
    [router]
  );

  // Handle keyboard navigation in search
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredTools.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
        e.preventDefault();
        handleSelectTool(filteredTools[selectedIndex]);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    },
    [filteredTools, selectedIndex, handleSelectTool]
  );

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut to focus search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Don't trigger if focused in Monaco editor
        const target = e.target as HTMLElement;
        if (target.closest('.monaco-editor')) return;
        
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleToggleWordWrapBoth = () => {
    setWorkspaceSettings((prev) => ({
      ...prev,
      editor: {
        ...prev.editor,
        applyLeft: true,
        applyRight: true,
        wordWrap: !prev.editor.wordWrap,
      },
    }));
    toast.info(`Word wrap ${!workspaceSettings.editor.wordWrap ? 'enabled' : 'disabled'} (both editors)`);
  };

  const handleDownloadPng = async () => {
    const snap = snapshotsByPath[pathname] || {};
    const leftContent = snap.left?.value ?? '';
    const rightContent = snap.right?.value ?? '';
    const singleContent = snap.single?.value ?? '';
    const leftDiffs = snap.left?.diffs ?? [];
    const rightDiffs = snap.right?.diffs ?? [];
    const leftCursorLine = snap.left?.cursorLine;
    const rightCursorLine = snap.right?.cursorLine;
    const singleCursorLine = snap.single?.cursorLine;
    const leftLanguage = snap.left?.language;
    const rightLanguage = snap.right?.language;
    const singleLanguage = snap.single?.language;

    const hasBoth = Boolean(snap.left && snap.right);
    const hasSingle = Boolean(snap.single) && !hasBoth;

    // Check if there's actual content to export
    const hasContent = hasBoth 
      ? (leftContent.trim() || rightContent.trim())
      : (singleContent.trim());

    if (!hasContent) {
      toast.warning('Nothing to export. Add some content first.');
      return;
    }

    toast.info('Generating PNG...');
    
    try {
      await exportEditorsAsPng({
        filenameBase: toolName.toLowerCase().replace(/\s+/g, '-'),
        theme: theme === 'dark' ? 'dark' : 'light',
        layout: layout === 'vertical' ? 'vertical' : 'horizontal',
        left: hasBoth 
          ? { title: 'Left', text: leftContent, diffs: leftDiffs, cursorLine: leftCursorLine, language: leftLanguage }
          : hasSingle 
            ? { title: toolName, text: singleContent, cursorLine: singleCursorLine, language: singleLanguage }
            : undefined,
        right: hasBoth ? { title: 'Right', text: rightContent, diffs: rightDiffs, cursorLine: rightCursorLine, language: rightLanguage } : undefined,
      });

      toast.success('PNG downloaded!');
    } catch (error) {
      console.error('PNG Export failed:', error);
      toast.error('Failed to export PNG. Please try again.');
    }
  };

  return (
    <header className="ide-header">
      <div className="ide-header-left">
        <h1 className="ide-header-title">
          <i className="fas fa-project-diagram"></i>
          <span>
            {toolName} <span className="ide-pill">IDE</span>
          </span>
        </h1>
      </div>
      <div className="ide-header-right" style={{ marginLeft: 'auto' }}>
        {/* Tool Search */}
        <div className="tool-search-container" ref={searchContainerRef}>
          <div className="tool-search-input-wrapper">
            <i className="fas fa-search tool-search-icon"></i>
            <input
              ref={searchInputRef}
              type="text"
              role="combobox"
              className="tool-search-input"
              placeholder="Find tool... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search tools"
              aria-expanded={isSearchOpen}
              aria-haspopup="listbox"
              aria-controls="tool-search-listbox"
              aria-autocomplete="list"
            />
            {searchQuery && (
              <button
                className="tool-search-clear"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {isSearchOpen && (
            <div className="tool-search-dropdown" role="listbox" id="tool-search-listbox">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className={`tool-search-item ${index === selectedIndex ? 'selected' : ''} ${
                      tool.route === pathname ? 'current' : ''
                    }`}
                    onClick={() => handleSelectTool(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <i className={`${tool.icon} tool-search-item-icon`}></i>
                    <div className="tool-search-item-content">
                      <span className="tool-search-item-name">{tool.name}</span>
                      <span className="tool-search-item-desc">{tool.description}</span>
                    </div>
                    {tool.route === pathname && (
                      <span className="tool-search-item-badge">Current</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="tool-search-empty">
                  <i className="fas fa-search"></i>
                  <span>No tools found for &quot;{searchQuery}&quot;</span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleToggleWordWrapBoth}
          title="Toggle word wrap (both editors)"
        >
          <i className="fas fa-paragraph"></i>
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleDownloadPng}
          title="Download PNG (full editor content)"
        >
          <i className="fas fa-image"></i>
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleLayout}
          title={`Switch to ${layout === 'horizontal' ? 'Vertical' : 'Horizontal'} Layout`}
        >
          <i className={`fas fa-columns layout-icon ${layout === 'vertical' ? 'rotated' : ''}`}></i>
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <button 
          className="btn btn-secondary btn-sm" 
          id="helpBtn" 
          title="Documentation"
          onClick={onHelpClick}
        >
          <i className="fas fa-question-circle"></i> Help
        </button>
        <button
          className="btn btn-secondary icon-only-btn"
          id="sidebarToggle"
          title="Toggle Settings (Alt+S)"
          onClick={onSidebarToggle}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
}
