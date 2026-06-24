import { Mark, mergeAttributes, InputRule } from '@tiptap/core';

export const Hashtag = Mark.create({
  name: 'hashtag',

  addOptions() {
    return {
      HTMLAttributes: { class: 'rte-hashtag' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="hashtag"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'hashtag' }), 0];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /(?:^|\s)(#[a-zA-Z0-9_]+)$/,
        handler: ({ state, range, match }) => {
          const { tr } = state;
          const start = range.from + match[0].indexOf('#');
          const end = range.to;
          if (match[1]) {
            tr.addMark(start, end, this.type.create());
            tr.insertText(' ', end);
          }
        },
      }),
    ];
  },
});
