import { Node, mergeAttributes } from '@tiptap/core';

export const Audio = Node.create({
  name: 'audio',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      autoplay: {
        default: false,
      },
      loop: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div', 
      { class: 'audio-container my-4' }, 
      ['audio', mergeAttributes(HTMLAttributes, { class: 'w-full' })]
    ];
  },

  addCommands() {
    return {
      setAudio: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
