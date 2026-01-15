 'use client';
 
 import React, { useMemo } from 'react';
 import { useTheme } from '@/hooks/useTheme';
 import { useLayout } from '@/hooks/useLayout';
import { DEFAULT_WORKSPACE_SETTINGS, useWorkspaceSettings } from '@/hooks/useWorkspaceSettings';
 
 interface WorkspaceSettingsModalProps {
   isOpen: boolean;
   onClose: () => void;
 }
 
 export function WorkspaceSettingsModal({ isOpen, onClose }: WorkspaceSettingsModalProps) {
   const { theme, setTheme } = useTheme();
   const { layout, setLayout } = useLayout();
   const [workspaceSettings, setWorkspaceSettings] = useWorkspaceSettings();
 
   const editor = workspaceSettings.editor;
 
   const canApplyBoth = useMemo(() => editor.applyLeft && editor.applyRight, [editor.applyLeft, editor.applyRight]);
 
   if (!isOpen) return null;
 
   return (
     <>
       <div className="dfp-modal-overlay" onClick={onClose} />
       <div className="dfp-modal dfp-modal-large" role="dialog" aria-modal="true" aria-label="Workspace settings">
         <div className="dfp-modal-header">
           <div className="dfp-modal-title">
             <i className="fas fa-cog" style={{ marginRight: 10 }}></i>
             Workspace / IDE Settings
           </div>
           <button className="dfp-modal-close" onClick={onClose} aria-label="Close settings">
             <i className="fas fa-times"></i>
           </button>
         </div>
 
         <div className="dfp-modal-body">
           <div className="panel-section">
             <h3 className="section-title">Global</h3>
 
             <div className="form-group">
               <label htmlFor="ws-theme">Theme</label>
               <select
                 id="ws-theme"
                 className="select-input"
                 value={theme}
                 onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
               >
                 <option value="dark">Dark</option>
                 <option value="light">Light</option>
               </select>
             </div>
 
             <div className="form-group">
               <label htmlFor="ws-layout">Editor Layout</label>
               <select
                 id="ws-layout"
                 className="select-input"
                 value={layout}
                 onChange={(e) => setLayout(e.target.value as 'horizontal' | 'vertical')}
               >
                 <option value="horizontal">Horizontal (side-by-side)</option>
                 <option value="vertical">Vertical (stacked)</option>
               </select>
               <p className="helper-text">Applies to all tools that use split editors.</p>
             </div>
           </div>
 
           <div className="panel-section">
             <h3 className="section-title">Workspace Editor Settings</h3>
 
             <div className="form-group">
               <label>Apply workspace settings to</label>
               <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                 <label className="checkbox-label" style={{ margin: 0 }}>
                   <input
                     type="checkbox"
                     checked={editor.applyLeft}
                     onChange={(e) =>
                       setWorkspaceSettings((prev) => ({
                         ...prev,
                         editor: { ...prev.editor, applyLeft: e.target.checked },
                       }))
                     }
                   />
                   <span>Left editor</span>
                 </label>
                 <label className="checkbox-label" style={{ margin: 0 }}>
                   <input
                     type="checkbox"
                     checked={editor.applyRight}
                     onChange={(e) =>
                       setWorkspaceSettings((prev) => ({
                         ...prev,
                         editor: { ...prev.editor, applyRight: e.target.checked },
                       }))
                     }
                   />
                   <span>Right editor</span>
                 </label>
                 <span className="helper-text" style={{ margin: 0 }}>
                   {canApplyBoth ? 'Both editors will use these settings.' : 'Only checked editors will use these settings.'}
                 </span>
               </div>
             </div>
 
             <div className="form-group">
               <label htmlFor="ws-font-size">Font size</label>
               <input
                 id="ws-font-size"
                 type="number"
                 className="text-input"
                 min={10}
                 max={24}
                 value={editor.fontSize}
                 onChange={(e) =>
                   setWorkspaceSettings((prev) => ({
                     ...prev,
                     editor: { ...prev.editor, fontSize: Number(e.target.value) || 13 },
                   }))
                 }
               />
             </div>
 
            <div className="form-group">
              <label htmlFor="ws-keyboard-mapping">Keyboard Mapping</label>
              <select
                id="ws-keyboard-mapping"
                className="select-input"
                value={editor.keyboardMapping || 'vscode'}
                onChange={(e) =>
                  setWorkspaceSettings((prev) => ({
                    ...prev,
                    editor: { ...prev.editor, keyboardMapping: e.target.value as typeof editor.keyboardMapping },
                  }))
                }
              >
                <option value="vscode">VS Code</option>
                <option value="sublime">Sublime Text</option>
                <option value="atom">Atom</option>
                <option value="vim">Vim (basic)</option>
                <option value="emacs">Emacs (basic)</option>
                <option value="basic">Basic / Notepad++</option>
              </select>
              <p className="helper-text">
                Multi-cursor: VS Code (Alt), Sublime/Atom (Ctrl/Cmd). Vim/Emacs enable modal-style navigation keys.
              </p>
            </div>

             <div className="form-group">
               <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={editor.showLineNumbers}
                   onChange={(e) =>
                     setWorkspaceSettings((prev) => ({
                       ...prev,
                       editor: { ...prev.editor, showLineNumbers: e.target.checked },
                     }))
                   }
                 />
                 <span>Show line numbers</span>
               </label>
             </div>
 
             <div className="form-group">
               <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={editor.wordWrap}
                   onChange={(e) =>
                     setWorkspaceSettings((prev) => ({
                       ...prev,
                       editor: { ...prev.editor, wordWrap: e.target.checked },
                     }))
                   }
                 />
                 <span>Word wrap</span>
               </label>
             </div>
 
             <div className="form-group">
               <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={editor.showMinimap}
                   onChange={(e) =>
                     setWorkspaceSettings((prev) => ({
                       ...prev,
                       editor: { ...prev.editor, showMinimap: e.target.checked },
                     }))
                   }
                 />
                 <span>Show minimap</span>
               </label>
             </div>
 
             <div className="form-group">
               <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={editor.highlightCurrentLine}
                   onChange={(e) =>
                     setWorkspaceSettings((prev) => ({
                       ...prev,
                       editor: { ...prev.editor, highlightCurrentLine: e.target.checked },
                     }))
                   }
                 />
                 <span>Highlight current line</span>
               </label>
             </div>
 
             <div className="form-group">
               <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={editor.showGlyphMargin}
                   onChange={(e) =>
                     setWorkspaceSettings((prev) => ({
                       ...prev,
                       editor: { ...prev.editor, showGlyphMargin: e.target.checked },
                     }))
                   }
                 />
                 <span>Show change indicators (glyph margin)</span>
               </label>
             </div>
 
             <div className="dfp-modal-actions" style={{ justifyContent: 'space-between' }}>
               <button
                 className="dfp-modal-btn btn-secondary"
                 type="button"
                 onClick={() => setWorkspaceSettings(DEFAULT_WORKSPACE_SETTINGS)}
               >
                 Reset to defaults
               </button>
               <button className="dfp-modal-btn btn-primary" type="button" onClick={onClose}>
                 Done
               </button>
             </div>
           </div>
         </div>
       </div>
     </>
   );
 }
 
