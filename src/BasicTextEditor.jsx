'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { editorStyles } from './styles.js';

const LIGHT_VARS = {
  '--rte-page': '#ffffff',
  '--rte-bar': '#ffffff',
  '--rte-pill': '#f6f8fc',
  '--rte-hover': 'rgba(60,64,67,.09)',
  '--rte-border': '#e4e7eb',
  '--rte-ink': '#202124',
  '--rte-muted': '#5f6368',
  '--rte-accent': '#0b57d0',
  '--rte-accent-soft': '#d3e3fd',
  '--rte-shadow': '0 1px 2px rgba(0,0,0,.08),0 8px 28px rgba(0,0,0,.08)',
};

const DARK_VARS = {
  '--rte-page': '#1f2023',
  '--rte-bar': '#26272b',
  '--rte-pill': '#2b2c30',
  '--rte-hover': 'rgba(255,255,255,.09)',
  '--rte-border': '#3c4043',
  '--rte-ink': '#e8eaed',
  '--rte-muted': '#9aa0a6',
  '--rte-accent': '#8ab4f8',
  '--rte-accent-soft': '#1e3a5f',
  '--rte-shadow': '0 1px 2px rgba(0,0,0,.5),0 10px 30px rgba(0,0,0,.45)',
};

const TOOLBAR_CSS = `
.bte-toolbar * { box-sizing: border-box; }
.bte-btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 30px; min-width: 30px; padding: 0 6px; border: none;
  background: transparent; color: var(--rte-ink); border-radius: 6px;
  cursor: pointer; transition: background 0.1s; flex-shrink: 0;
  font-family: 'Roboto', Arial, sans-serif;
}
.bte-btn:hover { background: var(--rte-hover); }
.bte-btn.is-active { background: var(--rte-accent-soft); color: var(--rte-accent); }
.bte-btn:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
.bte-sep { width: 1px; height: 20px; background: var(--rte-border); margin: 0 3px; flex-shrink: 0; }
`;

function Btn({ active, title, disabled, onClick, children, style }) {
  return (
    <button
      className={`bte-btn${active ? ' is-active' : ''}`}
      title={title}
      disabled={disabled}
      style={style}
      onMouseDown={e => { e.preventDefault(); onClick?.(); }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="bte-sep" />;
}

/**
 * InkoraBasicEditor — lightweight plug-and-play rich text editor.
 *
 * Props:
 *   value         {Object}   Initial content (TipTap JSON). Optional.
 *   onChange      {Function} Called with TipTap JSON on every change.
 *   onSave        {Function} Called with TipTap JSON (debounced, 1s). Optional.
 *   placeholder   {string}   Placeholder text.
 *   theme         {'light'|'dark'}  Default: 'light'
 *   width         {string|number}   CSS width. Default: '100%'
 *   height        {string|number}   Fixed height for the content area. Optional.
 *   minHeight     {number}          Min height (px) for the content area. Default: 150.
 *   readOnly      {boolean}         Hides toolbar and disables editing. Default: false.
 *
 * Usage:
 *   import { InkoraBasicEditor } from 'inkora';
 *   <InkoraBasicEditor width="100%" minHeight={200} onChange={setContent} />
 */
export function InkoraBasicEditor({
  value,
  onChange,
  onSave,
  placeholder = 'Start writing…',
  theme = 'light',
  width = '100%',
  height,
  minHeight = 150,
  readOnly = false,
}) {
  const cssVars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;
  const saveTimerRef = useRef(null);

  const extensions = useMemo(() => [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    }),
    Placeholder.configure({ placeholder }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
      if (onSave) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => onSave(json), 1000);
      }
    },
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const insertLink = () => setShowLinkModal(true);

  const contentStyle = {
    background: 'var(--rte-page)',
    overflowY: 'auto',
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : { minHeight }),
  };

  return (
    <div
      className={`inkora-basic-editor ${theme}`}
      style={{
        ...cssVars,
        width: typeof width === 'number' ? `${width}px` : width,
        borderRadius: 10,
        border: '1px solid var(--rte-border)',
        background: 'var(--rte-bar)',
        overflow: 'hidden',
        boxShadow: 'var(--rte-shadow)',
        fontFamily: "'Roboto', Arial, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: editorStyles + TOOLBAR_CSS }} />

      {!readOnly && (
        <div
          className="bte-toolbar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            padding: '5px 8px',
            borderBottom: '1px solid var(--rte-border)',
            background: 'var(--rte-pill)',
          }}
        >
          {/* Undo / Redo */}
          <Btn title="Undo (⌘Z)" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"/><path d="M3 13C5 7.333 9.333 4.667 14 4.667c4.667 0 7.333 2.667 7 8"/>
            </svg>
          </Btn>
          <Btn title="Redo (⌘Y)" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"/><path d="M21 13c-2-5.667-6.333-8.333-11-8.333C5.333 4.667 2.667 7.333 3 13"/>
            </svg>
          </Btn>

          <Sep />

          {/* Block style */}
          <Btn
            title="Normal text"
            active={editor?.isActive('paragraph')}
            style={{ fontSize: 12, fontWeight: 600, minWidth: 28 }}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >¶</Btn>
          <Btn
            title="Heading 1"
            active={editor?.isActive('heading', { level: 1 })}
            style={{ fontSize: 12, fontWeight: 700 }}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >H1</Btn>
          <Btn
            title="Heading 2"
            active={editor?.isActive('heading', { level: 2 })}
            style={{ fontSize: 12, fontWeight: 700 }}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >H2</Btn>
          <Btn
            title="Heading 3"
            active={editor?.isActive('heading', { level: 3 })}
            style={{ fontSize: 12, fontWeight: 700 }}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >H3</Btn>

          <Sep />

          {/* Inline marks */}
          <Btn title="Bold (⌘B)" active={editor?.isActive('bold')} style={{ fontWeight: 700, fontSize: 15 }} onClick={() => editor?.chain().focus().toggleBold().run()}>B</Btn>
          <Btn title="Italic (⌘I)" active={editor?.isActive('italic')} style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: 15 }} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</Btn>
          <Btn title="Underline (⌘U)" active={editor?.isActive('underline')} style={{ textDecoration: 'underline', fontSize: 15 }} onClick={() => editor?.chain().focus().toggleUnderline().run()}>U</Btn>
          <Btn title="Strikethrough" active={editor?.isActive('strike')} style={{ textDecoration: 'line-through', fontSize: 15 }} onClick={() => editor?.chain().focus().toggleStrike().run()}>S</Btn>

          <Sep />

          {/* Link */}
          <Btn title="Link (⌘K)" active={editor?.isActive('link')} onClick={insertLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </Btn>

          <Sep />

          {/* Lists */}
          <Btn title="Bullet list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
              <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none"/>
              <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/>
              <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
          </Btn>
          <Btn title="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
              <path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
            </svg>
          </Btn>

          <Sep />

          {/* Blockquote */}
          <Btn title="Blockquote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </Btn>

          <Sep />

          {/* Clear formatting */}
          <Btn title="Clear formatting" onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7V5h13v2"/><path d="M11 5l-2 14M14 12l6 6M20 12l-6 6"/>
            </svg>
          </Btn>
        </div>
      )}

      <div style={contentStyle}>
        <div style={{ padding: '14px 18px' }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {showLinkModal && <BasicLinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}
    </div>
  );
}

function BasicLinkModal({ editor, onClose }) {
  const [url, setUrl] = useState(() => editor?.getAttributes('link').href || '');
  const inputRef = useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
  const apply = () => {
    if (!url.trim()) { editor?.chain().focus().unsetLink().run(); }
    else { editor?.chain().focus().setLink({ href: url.trim() }).run(); }
    onClose();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.3)' }} onMouseDown={onClose}>
      <div style={{ background: 'var(--rte-bar, #fff)', border: '1px solid var(--rte-border, #e4e7eb)', borderRadius: 10, padding: '18px 20px', width: 340, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }} onMouseDown={e => e.stopPropagation()}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--rte-ink, #202124)' }}>Insert link</div>
        <input ref={inputRef} type="url" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } if (e.key === 'Escape') onClose(); }} style={{ width: '100%', padding: '8px 12px', fontSize: 14, borderRadius: 7, border: '1.5px solid var(--rte-border, #e4e7eb)', background: 'var(--rte-page, #fff)', color: 'var(--rte-ink, #202124)', outline: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {editor?.isActive('link') && <button onClick={() => { editor?.chain().focus().unsetLink().run(); onClose(); }} style={{ padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--rte-muted, #5f6368)' }}>Remove</button>}
          <button onClick={onClose} style={{ padding: '6px 12px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--rte-muted, #5f6368)' }}>Cancel</button>
          <button onClick={apply} style={{ padding: '6px 14px', fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'var(--rte-accent, #0b57d0)', color: '#fff', fontWeight: 600 }}>Apply</button>
        </div>
      </div>
    </div>
  );
}
