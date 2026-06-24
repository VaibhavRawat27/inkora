import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
// Consumers must add katex CSS themselves:  import 'katex/dist/katex.min.css'

function MathNodeView({ node, updateAttributes, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [latexInput, setLatexInput] = useState(node.attrs.latex || 'e = mc^2');
  const containerRef = useRef(null);

  useEffect(() => {
    setLatexInput(node.attrs.latex);
  }, [node.attrs.latex]);

  useEffect(() => {
    if (containerRef.current && !isEditing) {
      try {
        katex.render(node.attrs.latex || '\\text{empty}', containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        containerRef.current.innerHTML = `<span style="color: #ef4444; font-size: 14px;">Error: ${err.message}</span>`;
      }
    }
  }, [node.attrs.latex, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    updateAttributes({ latex: latexInput });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <div
        contentEditable={false}
        style={{ userSelect: 'none', margin: '12px 0', padding: 12, border: '1px solid var(--rte-border)', borderRadius: 8, background: 'var(--rte-pill)' }}
      >
        <div style={{ fontSize: 11, color: 'var(--rte-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>Edit LaTeX Formula</div>
        <input 
          type="text" 
          value={latexInput}
          onChange={e => setLatexInput(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            background: 'var(--rte-page)',
            color: 'var(--rte-ink)',
            border: '1.5px solid var(--rte-border)',
            borderRadius: 6,
            outline: 'none',
          }}
        />
        <div style={{ fontSize: 10, color: 'var(--rte-muted)', marginTop: 4 }}>Press Enter to save, or click outside.</div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      contentEditable={false}
      style={{
        display: 'flex', justifyContent: 'center', minHeight: '2.5em', alignItems: 'center',
        margin: '16px 0', padding: 8, borderRadius: 8, cursor: 'pointer',
        background: selected ? 'var(--rte-accent-soft, #d3e3fd)' : 'rgba(120,120,150,.05)',
        outline: selected ? '2px solid var(--rte-accent, #0b57d0)' : 'none',
        outlineOffset: 2, transition: 'background .15s',
      }}
    >
      <div ref={containerRef} style={{ fontSize: 18 }} />
    </div>
  );
}

export const Math = Node.create({
  name: 'mathFormula',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: 'e = mc^2',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-formula"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'math-formula', class: 'math-formula' }),
      HTMLAttributes.latex
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView);
  },

  addCommands() {
    return {
      setMathFormula: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
