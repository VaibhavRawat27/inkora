import { Extension } from '@tiptap/core';

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => ({ tr, state }) => {
        const { from, to } = state.selection;
        let changed = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight,
            });
            changed = true;
          }
        });
        return changed;
      },
      unsetLineHeight: () => ({ tr, state }) => {
        const { from, to } = state.selection;
        let changed = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight: null,
            });
            changed = true;
          }
        });
        return changed;
      },
    };
  },
});
