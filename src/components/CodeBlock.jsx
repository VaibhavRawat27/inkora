'use client';
import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function CodeBlock({ node, updateAttributes, extension }) {
  const { language: defaultLanguage, collapsed } = node.attrs;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const lineCount = (node.textContent.match(/\n/g) || []).length + 1;
  const displayLang = defaultLanguage || 'plaintext';

  return (
    <NodeViewWrapper style={{
      display: 'block',
      margin: '20px 0',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #303030',
      background: '#1e1e1e',
      boxShadow: '0 4px 16px rgba(0,0,0,.35)',
      fontFamily: 'monospace',
    }}>
      {/* Header */}
      <div contentEditable={false} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        background: '#252526',
        borderBottom: '1px solid #303030',
        userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>
          {/* Language selector */}
          <select
            value={displayLang}
            onChange={e => updateAttributes({ language: e.target.value })}
            contentEditable={false}
            style={{
              background: '#3c3c3c',
              color: '#cccccc',
              fontSize: 11,
              fontFamily: 'monospace',
              padding: '2px 20px 2px 7px',
              borderRadius: 4,
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
            }}
          >
            <option value="plaintext">plaintext</option>
            {extension.options.lowlight.listLanguages().sort().map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} contentEditable={false}>
          <button
            onClick={() => updateAttributes({ collapsed: !collapsed })}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 11, color: '#858585', padding: '2px 7px', borderRadius: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#3c3c3c'; e.currentTarget.style.color = '#cccccc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#858585'; }}
          >
            {collapsed ? '▶ Expand' : '▼ Collapse'}
          </button>

          <button
            onClick={copyToClipboard}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: isCopied ? 'rgba(52,211,153,.15)' : 'transparent',
              border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500,
              color: isCopied ? '#34d399' : '#858585',
              padding: '3px 9px', borderRadius: 4,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { if (!isCopied) { e.currentTarget.style.background = '#3c3c3c'; e.currentTarget.style.color = '#cccccc'; } }}
            onMouseLeave={e => { if (!isCopied) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#858585'; } }}
          >
            {isCopied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      {!collapsed && (
        <div style={{ display: 'flex', fontFamily: 'monospace', fontSize: 13, lineHeight: '24px', overflowX: 'auto' }}>
          {/* Line numbers */}
          <div
            contentEditable={false}
            aria-hidden="true"
            style={{
              userSelect: 'none', textAlign: 'right',
              color: '#4a4a4a', background: '#1e1e1e',
              borderRight: '1px solid #303030',
              padding: '16px 10px', minWidth: '2.8rem',
              flexShrink: 0, fontSize: 12,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} style={{ lineHeight: '24px' }}>{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <pre style={{ flex: 1, padding: '16px', margin: 0, background: 'transparent', overflowX: 'auto' }}>
            <NodeViewContent as="code" className={`language-${displayLang}`} style={{ display: 'block' }} />
          </pre>
        </div>
      )}

      {collapsed && (
        <div contentEditable={false} style={{
          padding: '8px 14px', color: '#858585', fontSize: 12,
          fontFamily: 'monospace', fontStyle: 'italic',
        }}>
          {lineCount} line{lineCount !== 1 ? 's' : ''} hidden — click Expand to show
        </div>
      )}
    </NodeViewWrapper>
  );
}
