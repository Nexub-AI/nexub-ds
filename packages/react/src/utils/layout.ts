import type * as React from 'react';

// Layout props → Tailwind classes, so Stack/Flex/Grid render no `style`
// attribute for scale values. A strict CSP (`style-src` without
// 'unsafe-inline') blocks server-rendered style attributes. Values off the
// scale (arbitrary strings) still fall back to inline style.
// Class strings must stay literal so Tailwind can scan them.

const GAP: Record<string, string> = {
  '0': 'gap-0', '0.5': 'gap-0.5', '1': 'gap-1', '1.5': 'gap-1.5', '2': 'gap-2',
  '2.5': 'gap-2.5', '3': 'gap-3', '3.5': 'gap-3.5', '4': 'gap-4', '5': 'gap-5',
  '6': 'gap-6', '7': 'gap-7', '8': 'gap-8', '9': 'gap-9', '10': 'gap-10',
  '11': 'gap-11', '12': 'gap-12', '14': 'gap-14', '16': 'gap-16', '20': 'gap-20',
  '24': 'gap-24',
};

const ALIGN: Record<string, string> = {
  start: 'items-start', 'flex-start': 'items-start', end: 'items-end',
  'flex-end': 'items-end', center: 'items-center', baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const JUSTIFY: Record<string, string> = {
  start: 'justify-start', 'flex-start': 'justify-start', end: 'justify-end',
  'flex-end': 'justify-end', center: 'justify-center', between: 'justify-between',
  'space-between': 'justify-between', around: 'justify-around',
  'space-around': 'justify-around', evenly: 'justify-evenly',
  'space-evenly': 'justify-evenly', stretch: 'justify-stretch',
};

const COLS: Record<string, string> = {
  '1': 'grid-cols-1', '2': 'grid-cols-2', '3': 'grid-cols-3', '4': 'grid-cols-4',
  '5': 'grid-cols-5', '6': 'grid-cols-6', '7': 'grid-cols-7', '8': 'grid-cols-8',
  '9': 'grid-cols-9', '10': 'grid-cols-10', '11': 'grid-cols-11', '12': 'grid-cols-12',
};

const ROWS: Record<string, string> = {
  '1': 'grid-rows-1', '2': 'grid-rows-2', '3': 'grid-rows-3', '4': 'grid-rows-4',
  '5': 'grid-rows-5', '6': 'grid-rows-6', '7': 'grid-rows-7', '8': 'grid-rows-8',
  '9': 'grid-rows-9', '10': 'grid-rows-10', '11': 'grid-rows-11', '12': 'grid-rows-12',
};

export interface LayoutInput {
  gap?: number | string;
  align?: string;
  justify?: string;
  cols?: number | string;
  rows?: number | string;
  style?: React.CSSProperties;
}

/** Classes for on-scale values; a style object only for the rest (else undefined). */
export function layoutProps({ gap, align, justify, cols, rows, style }: LayoutInput): {
  className: string[];
  style: React.CSSProperties | undefined;
} {
  const className: string[] = [];
  const s: React.CSSProperties = {};

  if (gap !== undefined) {
    const cls = typeof gap === 'number' ? GAP[String(gap)] : undefined;
    if (cls) className.push(cls);
    else s.gap = typeof gap === 'number' ? `${gap * 0.25}rem` : gap;
  }
  if (align) {
    if (ALIGN[align]) className.push(ALIGN[align]);
    else s.alignItems = align;
  }
  if (justify) {
    if (JUSTIFY[justify]) className.push(JUSTIFY[justify]);
    else s.justifyContent = justify;
  }
  if (cols !== undefined) {
    const cls = typeof cols === 'number' ? COLS[String(cols)] : undefined;
    if (cls) className.push(cls);
    else s.gridTemplateColumns = typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols;
  }
  if (rows !== undefined) {
    const cls = typeof rows === 'number' ? ROWS[String(rows)] : undefined;
    if (cls) className.push(cls);
    else s.gridTemplateRows = typeof rows === 'number' ? `repeat(${rows}, minmax(0, 1fr))` : rows;
  }

  const merged = { ...s, ...style };
  return { className, style: Object.keys(merged).length ? merged : undefined };
}
