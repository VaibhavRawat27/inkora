'use client';
import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const CSS = `
.rte-vid-outer { display: block; line-height: 0; }
.rte-vid-sizer { display: block; position: relative; max-width: 100%; line-height: 0; }
.rte-vid-sizer video { display: block; width: 100%; transition: filter .2s, border-radius .2s, box-shadow .2s; }
.rte-vid-rsz {
  position: absolute; width: 10px; height: 10px;
  background: #0b57d0; border: 2px solid #fff; border-radius: 2px;
  z-index: 20; box-shadow: 0 1px 4px rgba(0,0,0,.35); user-select: none;
}
.rte-vid-rsz-nw { top:-5px;  left:-5px;  cursor:nw-resize; }
.rte-vid-rsz-n  { top:-5px;  left:calc(50% - 5px); cursor:n-resize; }
.rte-vid-rsz-ne { top:-5px;  right:-5px; cursor:ne-resize; }
.rte-vid-rsz-e  { top:calc(50% - 5px); right:-5px; cursor:e-resize; }
.rte-vid-rsz-se { bottom:-5px; right:-5px; cursor:se-resize; }
.rte-vid-rsz-s  { bottom:-5px; left:calc(50% - 5px); cursor:s-resize; }
.rte-vid-rsz-sw { bottom:-5px; left:-5px;  cursor:sw-resize; }
.rte-vid-rsz-w  { top:calc(50% - 5px); left:-5px; cursor:w-resize; }
.rte-vid-rsz-badge {
  position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
  background:rgba(11,87,208,.85); color:#fff; font-size:11px; font-weight:700;
  padding:2px 9px; border-radius:10px; pointer-events:none;
  white-space:nowrap; font-family:monospace; z-index:21;
}
`;

function buildVideoStyle(attrs) {
  const { shape, frame, filters } = attrs;
  const style = { display: 'block', width: '100%' };

  if (shape === 'rounded') {
    style.borderRadius = '14px';
  } else if (shape === 'pill') {
    style.borderRadius = '999px';
  } else if (shape === 'circle') {
    style.borderRadius = '50%'; style.aspectRatio = '1/1'; style.objectFit = 'cover';
  } else if (shape === 'landscape') {
    style.aspectRatio = '16/9'; style.objectFit = 'cover';
  }

  if (frame === 'shadow') style.boxShadow = '0 6px 28px rgba(0,0,0,.22)';
  else if (frame === 'border') { style.boxShadow = '0 0 0 3px #e4e7eb'; if (!style.borderRadius) style.borderRadius = '4px'; }
  else if (frame === 'thick') { style.boxShadow = '0 0 0 7px #e4e7eb'; if (!style.borderRadius) style.borderRadius = '4px'; }
  else if (frame === 'glow') style.boxShadow = '0 0 0 3px #0b57d0, 0 0 22px rgba(11,87,208,.32)';
  else if (frame === 'vintage') style.boxShadow = '0 0 0 5px #c8a96e, 0 4px 14px rgba(0,0,0,.22)';
  else if (frame === 'dark') { style.boxShadow = '0 0 0 4px #202124'; if (!style.borderRadius) style.borderRadius = '4px'; }

  const f = filters ? filters.split(',').filter(Boolean) : [];
  const parts = [];
  if (f.includes('invert')) parts.push('invert(1)');
  if (f.includes('grayscale')) parts.push('grayscale(1)');
  if (f.includes('sepia')) parts.push('sepia(0.75)');
  if (f.includes('blur')) parts.push('blur(2px)');
  if (f.includes('bright')) parts.push('brightness(1.35)');
  if (f.includes('contrast')) parts.push('contrast(1.4)');
  if (parts.length) style.filter = parts.join(' ');

  return style;
}

const HANDLES = [
  { cls: 'nw', side: 'w' }, { cls: 'n',  side: 'e' }, { cls: 'ne', side: 'e' },
  { cls: 'e',  side: 'e' }, { cls: 'se', side: 'e' }, { cls: 's',  side: 'e' },
  { cls: 'sw', side: 'w' }, { cls: 'w',  side: 'w' },
];

export function VideoNodeView({ node, updateAttributes, selected }) {
  const [liveWidth, setLiveWidth] = useState(null);
  const [pendingWidth, setPendingWidth] = useState(null);
  const wrapRef = useRef(null);
  const attrs = node.attrs;

  useEffect(() => {
    if (pendingWidth !== null && attrs.width === pendingWidth) setPendingWidth(null);
  }, [attrs.width, pendingWidth]);

  const onResizeStart = (e, side) => {
    e.preventDefault(); e.stopPropagation();
    const el = wrapRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startW = el.getBoundingClientRect().width;
    const containerW = el.parentElement?.getBoundingClientRect().width || startW;
    const onMove = (ev) => {
      const newW = Math.max(80, Math.min(containerW, startW + (side === 'w' ? -(ev.clientX - startX) : (ev.clientX - startX))));
      setLiveWidth(Math.round(newW));
      el.style.width = `${Math.round(newW)}px`;
    };
    const onUp = (ev) => {
      const newW = Math.max(80, Math.min(containerW, startW + (side === 'w' ? -(ev.clientX - startX) : (ev.clientX - startX))));
      const pct = `${Math.max(10, Math.min(100, Math.round((newW / containerW) * 100)))}%`;
      el.style.width = '';
      setLiveWidth(null);
      setPendingWidth(pct);
      updateAttributes({ width: pct });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = side === 'w' ? 'w-resize' : 'e-resize';
    document.body.style.userSelect = 'none';
  };

  const sizerWidth = liveWidth !== null ? `${liveWidth}px` : pendingWidth !== null ? pendingWidth : (attrs.width || '100%');
  const align = attrs.align || 'left';
  const alignStyle = align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' }
    : align === 'right'  ? { marginLeft: 'auto', marginRight: 0 }
    : {};

  return (
    <NodeViewWrapper className="rte-vid-outer">
      <style>{CSS}</style>
      <div ref={wrapRef} className="rte-vid-sizer" style={{ width: sizerWidth, ...alignStyle }}>
        <video
          src={attrs.src} poster={attrs.poster}
          controls={attrs.controls !== false}
          autoPlay={attrs.autoplay} loop={attrs.loop} muted={attrs.muted}
          style={{ ...buildVideoStyle(attrs), outline: selected ? '2.5px solid #0b57d0' : 'none', outlineOffset: '2px' }}
        />
        {selected && (
          <>
            {HANDLES.map(h => (
              <div key={h.cls} className={`rte-vid-rsz rte-vid-rsz-${h.cls}`} onMouseDown={e => onResizeStart(e, h.side)} />
            ))}
            {liveWidth !== null && <div className="rte-vid-rsz-badge">{liveWidth}px</div>}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
