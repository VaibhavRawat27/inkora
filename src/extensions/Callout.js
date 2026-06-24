import { Node, mergeAttributes } from '@tiptap/core';

const COLOR_STYLES = {
  blue:  { background: '#eff6ff', borderColor: '#bfdbfe' },
  amber: { background: '#fffbeb', borderColor: '#fde68a' },
  red:   { background: '#fff1f2', borderColor: '#fecdd3' },
  green: { background: '#f0fdf4', borderColor: '#bbf7d0' },
  gray:  { background: '#f9fafb', borderColor: '#e5e7eb' },
};

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      emoji: { default: '💡' },
      color: { default: 'blue' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const c = COLOR_STYLES[HTMLAttributes.color] || COLOR_STYLES.blue;
    const style = `display:flex;gap:12px;padding:14px 16px;border:1px solid ${c.borderColor};border-radius:8px;margin:12px 0;background:${c.background}`;
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout', style }),
      ['div', { style: 'user-select:none;padding-top:1px;flex-shrink:0' }, HTMLAttributes.emoji],
      ['div', { style: 'flex:1;min-width:0' }, 0],
    ];
  },

  addCommands() {
    return {
      setCallout: (attributes) => ({ commands }) => commands.setNode(this.name, attributes),
      toggleCallout: (attributes) => ({ commands }) => commands.toggleNode(this.name, 'paragraph', attributes),
    };
  },
});
