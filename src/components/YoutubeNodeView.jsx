'use client';
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';

function getEmbedUrl(src, start) {
  if (!src) return '';
  if (src.includes('youtube.com/embed/') || src.includes('player.vimeo.com')) return src;

  const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) {
    let url = `https://www.youtube.com/embed/${ytMatch[1]}`;
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
  }

  const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return src;
}

const CSS = `
.rte-yt-outer { display: block; line-height: 0; margin: 4px 0; }
.rte-yt-sizer { display: block; position: relative; max-width: 100%; }
.rte-yt-ratio { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; }
.rte-yt-ratio iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
`;

export function YoutubeNodeView({ node, selected, editor }) {
  const attrs = node.attrs;
  const embedUrl = getEmbedUrl(attrs.src, attrs.start);
  // Viewer mode: plain embed — no selection outline, strips, or play overlay
  const isEditable = editor?.isEditable ?? true;
  const showSelected = selected && isEditable;

  return (
    <NodeViewWrapper className="rte-yt-outer">
      <style>{CSS}</style>
      <div className="rte-yt-sizer" style={{ width: '100%' }}>
        <div
          className="rte-yt-ratio"
          style={{ outline: showSelected ? '2.5px solid #0b57d0' : 'none', outlineOffset: '2px' }}
        >
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {isEditable && <>
            {/* Border strips — clicking selects the node; center open for playback */}
            <div style={{ position:'absolute', top:0,     left:0, right:0,    height:'14%', zIndex:5, cursor:'pointer' }} />
            <div style={{ position:'absolute', bottom:0,  left:0, right:0,    height:'14%', zIndex:5, cursor:'pointer' }} />
            <div style={{ position:'absolute', top:'14%', left:0, width:'12%', bottom:'14%', zIndex:5, cursor:'pointer' }} />
            <div style={{ position:'absolute', top:'14%', right:0,width:'12%', bottom:'14%', zIndex:5, cursor:'pointer' }} />

            {!selected && (
              <div style={{
                position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                pointerEvents:'none', zIndex:6,
                width:48, height:48, borderRadius:'50%',
                background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><polygon points="4,2 16,9 4,16" fill="white"/></svg>
              </div>
            )}
          </>}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
