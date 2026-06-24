// ─── Inkora Editor ────────────────────────────────────────────────────────────
// Usage:  import { InkoraEditor, InkoraBasicEditor, InkoraViewer } from 'inkora'

// Full-featured editor: menu bar, media, tables, math, dark mode
export { InkoraEditor } from './RichTextEditor.jsx';

// Lightweight editor: single toolbar, bold/italic/lists/links
export { InkoraBasicEditor } from './BasicTextEditor.jsx';

// Read-only viewer — renders saved TipTap JSON with identical styles
export { InkoraViewer } from './RichTextViewer.jsx';

// Extension factory — for advanced customisation / creating your own editor
export { createEditorExtensions } from './extensions/index.js';

// Shared CSS string — inject via <style> tag or a CSS-in-JS tool if needed
export { editorStyles } from './styles.js';
