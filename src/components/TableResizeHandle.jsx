'use client';
import React, { useEffect, useRef, useState } from 'react';
import { TableMap } from '@tiptap/pm/tables';

/**
 * Corner drag handle for tables. Appears at the bottom-right corner of the
 * hovered table; dragging resizes the whole table on both axes by scaling
 * every column and row proportionally. On release the size is persisted
 * natively: column widths as `colwidth` on every cell (the same attribute
 * TipTap's column-resize uses) and row heights as `rowheight` on every row —
 * so the resize survives serialization and shows in the viewer.
 */
export default function TableResizeHandle({ editor }) {
  const [corner, setCorner] = useState(null); // { x, y } viewport coords
  const tableRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const editorDom = editor.view.dom;

    const onMouseMove = (e) => {
      if (dragRef.current) return;
      const table = e.target.closest?.('table');
      if (table && editorDom.contains(table)) {
        tableRef.current = table;
        const r = table.getBoundingClientRect();
        setCorner({ x: r.right, y: r.bottom });
      }
    };

    const onDocMouseMove = (e) => {
      if (dragRef.current || !tableRef.current) return;
      const r = tableRef.current.getBoundingClientRect();
      const near =
        e.clientX >= r.left - 8 && e.clientX <= r.right + 24 &&
        e.clientY >= r.top - 8 && e.clientY <= r.bottom + 24;
      if (!near) {
        setCorner(null);
        tableRef.current = null;
      }
    };

    const onScroll = () => {
      if (dragRef.current) return;
      if (tableRef.current) {
        const r = tableRef.current.getBoundingClientRect();
        setCorner({ x: r.right, y: r.bottom });
      }
    };

    editorDom.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousemove', onDocMouseMove);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      editorDom.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onDocMouseMove);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [editor]);

  const commit = () => {
    const drag = dragRef.current;
    if (!drag || !editor || editor.isDestroyed) return;
    const { table, finalColWidths, finalRowHeights } = drag;
    const view = editor.view;

    let pos;
    try { pos = view.posAtDOM(table, 0); } catch { return; }
    const $pos = view.state.doc.resolve(pos);

    let tableNode = null, tablePos = null;
    for (let depth = $pos.depth; depth > 0; depth--) {
      const n = $pos.node(depth);
      if (n.type.spec.tableRole === 'table') {
        tableNode = n;
        tablePos = $pos.before(depth);
        break;
      }
    }
    if (!tableNode) return;

    const map = TableMap.get(tableNode);
    const tableStart = tablePos + 1;
    let tr = view.state.tr;

    // colwidth on every cell (skip rowspan/colspan continuation slots)
    for (let row = 0; row < map.height; row++) {
      for (let col = 0; col < map.width; col++) {
        const idx = row * map.width + col;
        const cellOffset = map.map[idx];
        if (row > 0 && map.map[idx - map.width] === cellOffset) continue;
        if (col > 0 && map.map[idx - 1] === cellOffset) continue;
        const cell = tableNode.nodeAt(cellOffset);
        if (!cell) continue;
        const colspan = cell.attrs.colspan || 1;
        const widths = [];
        for (let i = 0; i < colspan; i++) {
          widths.push(finalColWidths[col + i] || finalColWidths[finalColWidths.length - 1] || 100);
        }
        tr = tr.setNodeMarkup(tableStart + cellOffset, null, { ...cell.attrs, colwidth: widths });
      }
    }

    // rowheight on every row
    tableNode.forEach((rowNode, offset, index) => {
      if (rowNode.type.spec.tableRole !== 'row') return;
      const h = finalRowHeights[index];
      if (!h) return;
      tr = tr.setNodeMarkup(tableStart + offset, null, { ...rowNode.attrs, rowheight: h });
    });

    view.dispatch(tr);

    // colgroup + row attrs now own the size; drop the temporary inline styles
    table.style.width = '';
    table.style.height = '';
  };

  const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const table = tableRef.current;
    if (!table) return;
    const r = table.getBoundingClientRect();

    // Snapshot per-column widths (from first-row cells, expanding colspans)
    // and per-row heights. During the drag these are scaled and written to
    // the <col> elements / <tr>s directly — that's what lets the table
    // SHRINK even when explicit colwidths were committed previously.
    const rows = Array.from(table.rows);
    if (!rows.length) return;
    const startColWidths = [];
    Array.from(rows[0].children).forEach(cell => {
      const w = cell.getBoundingClientRect().width;
      const span = cell.colSpan || 1;
      for (let i = 0; i < span; i++) startColWidths.push(w / span);
    });
    const startRowHeights = rows.map(row => row.getBoundingClientRect().height);
    const cols = Array.from(table.querySelectorAll('colgroup > col'));

    // Never let the table outgrow its canvas: cap at the wrapper's width
    // (the .tableWrapper scrolls horizontally, so anything wider is invisible)
    const wrapper = table.closest('.tableWrapper') || table.parentElement;
    const maxW = wrapper ? wrapper.clientWidth : Infinity;

    // Row heights are previewed via a <style> tag in <head> rather than by
    // mutating the <tr>s: rows live in ProseMirror's editable content, so its
    // MutationObserver instantly reverts inline style changes mid-drag.
    // (<col>/<table> mutations are ignored — they belong to the node view.)
    table.setAttribute('data-rte-resizing', '');
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    dragRef.current = {
      table, cols, rows, maxW, styleEl,
      startX: e.clientX, startY: e.clientY,
      w: r.width, h: r.height,
      startColWidths, startRowHeights,
      finalColWidths: startColWidths.map(Math.round),
      finalRowHeights: startRowHeights.map(Math.round),
    };

    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const nw = Math.min(d.maxW, Math.max(120, d.w + (ev.clientX - d.startX)));
      const nh = Math.max(50, d.h + (ev.clientY - d.startY));
      const scaleX = nw / d.w;
      const scaleY = nh / d.h;

      d.finalColWidths = d.startColWidths.map(w => Math.max(32, Math.round(w * scaleX)));
      d.finalRowHeights = d.startRowHeights.map(h => Math.max(24, Math.round(h * scaleY)));

      // Scale each column, not just the table width — with fixed colwidths a
      // table can never render narrower than their sum, so shrink must go
      // through the <col> elements themselves.
      if (d.cols.length === d.finalColWidths.length) {
        d.cols.forEach((col, i) => { col.style.width = `${d.finalColWidths[i]}px`; });
      }
      d.table.style.width = `${d.finalColWidths.reduce((a, b) => a + b, 0)}px`;
      d.styleEl.textContent = d.finalRowHeights
        .map((h, i) => `[data-rte-resizing] tr:nth-of-type(${i + 1}){height:${h}px !important;}`)
        .join('\n');

      const nr = d.table.getBoundingClientRect();
      setCorner({ x: nr.right, y: nr.bottom });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      commit();
      const d = dragRef.current;
      if (d) {
        d.table.removeAttribute('data-rte-resizing');
        d.styleEl.remove();
      }
      dragRef.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  if (!corner || !editor?.isEditable) return null;

  return (
    <div
      onMouseDown={startDrag}
      title="Drag to resize table"
      style={{
        position: 'fixed',
        left: corner.x - 7,
        top: corner.y - 7,
        width: 14,
        height: 14,
        borderRadius: 4,
        background: 'var(--rte-accent, #0b57d0)',
        border: '2px solid var(--rte-page, #fff)',
        boxShadow: '0 1px 4px rgba(0,0,0,.3)',
        cursor: 'nwse-resize',
        zIndex: 60,
      }}
    />
  );
}
