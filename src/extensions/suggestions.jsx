import React from 'react';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

// ─── Mention dropdown UI ──────────────────────────────────────────────────────
// MentionList MUST be defined before the suggestion object that references it.

const MentionList = React.forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectItem = index => {
    const item = props.items[index];
    if (item) props.command({ id: item });
  };

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e4e7eb',
      borderRadius: 8,
      boxShadow: '0 8px 26px rgba(0,0,0,.18)',
      overflow: 'hidden',
      minWidth: 180,
      padding: '4px 0',
      fontFamily: 'inherit',
    }}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '7px 14px',
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              background: index === selectedIndex ? '#0b57d0' : 'transparent',
              color: index === selectedIndex ? '#fff' : '#202124',
              transition: 'background .1s',
            }}
          >
            {item}
          </button>
        ))
      ) : (
        <div style={{ padding: '8px 14px', fontSize: 13, color: '#9aa0a6', fontStyle: 'italic' }}>
          No results
        </div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

// ─── Suggestion config ────────────────────────────────────────────────────────
// `items` returns an empty array by default — consumers pass their own list via
// mentionOptions.suggestion.items in the editor props.

export default {
  items: ({ query }) => {
    // Default: no built-in items. Override via editor prop:
    //   <ProEditor mentionOptions={{ suggestion: { items: ({ query }) => myUsers.filter(...) } }} />
    return [];
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);
        if (!props.clientRect) return;
        popup[0].setProps({ getReferenceClientRect: props.clientRect });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
