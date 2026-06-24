import React from 'react';

const Svg = ({ children, size = 16, strokeWidth = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const BoldIcon = () => <Svg><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></Svg>;
export const ItalicIcon = () => <Svg><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></Svg>;
export const UnderlineIcon = () => <Svg><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></Svg>;
export const StrikeIcon = () => <Svg><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></Svg>;
export const CodeIcon = () => <Svg><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Svg>;
export const CodeBlockIcon = () => <Svg><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m10 9-3 3 3 3"/><path d="m14 9 3 3-3 3"/></Svg>;
export const LinkIcon = () => <Svg><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Svg>;
export const UnlinkIcon = () => <Svg><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/></Svg>;
export const AlignLeftIcon = () => <Svg><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></Svg>;
export const AlignCenterIcon = () => <Svg><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></Svg>;
export const AlignRightIcon = () => <Svg><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></Svg>;
export const AlignJustifyIcon = () => <Svg><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Svg>;
export const BulletListIcon = () => <Svg><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></Svg>;
export const OrderedListIcon = () => <Svg><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" strokeWidth="1.5"/><path d="M4 10h2" strokeWidth="1.5"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="1.5"/></Svg>;
export const TaskListIcon = () => <Svg><rect x="3" y="4" width="7" height="7" rx="1"/><polyline points="5.5 7.5 6.5 8.5 8.5 6.5"/><line x1="13" y1="8" x2="21" y2="8"/><line x1="13" y1="15" x2="21" y2="15"/><rect x="3" y="11" width="7" height="7" rx="1"/></Svg>;
export const QuoteIcon = () => <Svg><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v7c0 1.25.756 2.017 2 2h2c1.25 0 2 .75 2 2v3"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-3c-1.25 0-2 .75-2 2v7c0 1.25.756 2.017 2 2h2c1.25 0 2 .75 2 2v3"/></Svg>;
export const HrIcon = () => <Svg><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 12 4 16 8"/><polyline points="16 16 12 20 8 16"/></Svg>;
export const ImageIcon = () => <Svg><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></Svg>;
export const VideoIcon = () => <Svg><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></Svg>;
export const AudioIcon = () => <Svg><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Svg>;
export const TableIcon = () => <Svg><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></Svg>;
export const UndoIcon = () => <Svg><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></Svg>;
export const RedoIcon = () => <Svg><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></Svg>;
export const HighlightIcon = () => <Svg><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></Svg>;
export const ColorIcon = () => <Svg><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="7" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17" cy="9" r="1" fill="currentColor" stroke="none"/></Svg>;
export const SubIcon = () => <Svg><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></Svg>;
export const SupIcon = () => <Svg><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.44-2 1.5-2.5S20 8.33 20 7c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></Svg>;
export const CalloutIcon = () => <Svg><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3"/></Svg>;
export const ChevronDownIcon = () => <Svg size={12}><polyline points="6 9 12 15 18 9"/></Svg>;
export const SunIcon = () => <Svg><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Svg>;
export const MoonIcon = () => <Svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Svg>;
export const PlusRowIcon = () => <Svg size={14}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="12" x2="12" y2="21"/><line x1="9" y1="16.5" x2="15" y2="16.5"/><line x1="12" y1="13.5" x2="12" y2="19.5"/></Svg>;
export const PlusColIcon = () => <Svg size={14}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="12" y1="12" x2="21" y2="12"/><line x1="16.5" y1="9" x2="16.5" y2="15"/><line x1="13.5" y1="12" x2="19.5" y2="12"/></Svg>;
export const MinusRowIcon = () => <Svg size={14}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="15" x2="16" y2="15"/></Svg>;
export const MinusColIcon = () => <Svg size={14}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="8" x2="15" y2="16"/></Svg>;
export const MergeCellsIcon = () => <Svg size={14}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 9 12 12 8 15"/><polyline points="16 9 12 12 16 15"/></Svg>;
export const CheckIcon = () => <Svg size={14}><polyline points="20 6 9 17 4 12"/></Svg>;
export const TypeIcon = () => <Svg><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></Svg>;
export const MaximizeIcon = ({ size = 16 }) => <Svg size={size}><path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6"/></Svg>;
export const MinimizeIcon = ({ size = 16 }) => <Svg size={size}><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/></Svg>;
