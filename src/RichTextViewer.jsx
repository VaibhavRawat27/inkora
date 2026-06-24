'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createEditorExtensions } from './extensions/index.js';
import { editorStyles } from './styles.js';

export function InkoraViewer({ content, theme = 'light' }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const extensions = useMemo(() => createEditorExtensions({ isEditable: false }), []);

  const editor = useEditor({
    extensions,
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  });

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!isMounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0' }}>
        {[['55%', 28], ['100%', 14], ['83%', 14], ['70%', 14]].map(([w, h], i) => (
          <div key={i} style={{
            width: w, height: h, borderRadius: 4,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'rte-shimmer 1.4s infinite',
          }} />
        ))}
        <style>{`@keyframes rte-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      </div>
    );
  }

  return (
    <div className={`inkora-viewer ${theme}`} style={{ width: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <div className="viewer-inner" style={{ padding: '16px 20px', maxWidth: 860, margin: '0 auto' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
