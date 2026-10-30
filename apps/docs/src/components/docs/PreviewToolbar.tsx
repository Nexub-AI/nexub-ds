'use client';

import * as React from 'react';
import { SegmentedControl, Text } from '@nexub/react';

export type PreviewBg = 'grid' | 'dotted' | 'solid' | 'transparent';
export type PreviewWidth = 'full' | '768' | '480' | '360';
export type PreviewDir = 'ltr' | 'rtl';

export interface PreviewToolbarState {
  bg: PreviewBg;
  width: PreviewWidth;
  dir: PreviewDir;
}

interface Props {
  state: PreviewToolbarState;
  /** Accepts either a new state or a functional updater (matches `useState`'s setter). */
  onChange: React.Dispatch<React.SetStateAction<PreviewToolbarState>>;
}

const BG_OPTIONS: { value: PreviewBg; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'dotted', label: 'Dots' },
  { value: 'solid', label: 'Solid' },
  { value: 'transparent', label: 'None' },
];

const WIDTH_OPTIONS: { value: PreviewWidth; label: string; title: string }[] = [
  { value: 'full', label: '∞', title: 'Full width' },
  { value: '768', label: '768', title: 'Tablet' },
  { value: '480', label: '480', title: 'Phablet' },
  { value: '360', label: '360', title: 'Mobile' },
];

const DIR_OPTIONS: { value: PreviewDir; label: string; title: string }[] = [
  { value: 'ltr', label: 'LTR', title: 'Left to right' },
  { value: 'rtl', label: 'RTL', title: 'Right to left' },
];

export function PreviewToolbar({ state, onChange }: Props) {
  return (
    <div role="toolbar" aria-label="Preview controls" className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2">
      <Group label="Background" value={state.bg} options={BG_OPTIONS} onChange={(bg) => onChange((p) => ({ ...p, bg }))} />
      <Group label="Width" value={state.width} options={WIDTH_OPTIONS} onChange={(width) => onChange((p) => ({ ...p, width }))} />
      <Group label="Direction" value={state.dir} options={DIR_OPTIONS} onChange={(dir) => onChange((p) => ({ ...p, dir }))} />
    </div>
  );
}

function Group<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; title?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Text size="label" weight="semibold" tone="muted" className="uppercase tracking-wide" aria-hidden="true">
        {label}
      </Text>
      <SegmentedControl.Root size="sm" aria-label={label} value={value} onValueChange={(v) => v && onChange(v as T)}>
        {options.map((o) => (
          <SegmentedControl.Item key={o.value} value={o.value} title={o.title ?? o.label} className="!px-2.5 text-label-sm">
            {o.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </div>
  );
}

export const DEFAULT_TOOLBAR_STATE: PreviewToolbarState = {
  bg: 'grid',
  width: 'full',
  dir: 'ltr',
};

/** Background class for the preview canvas (see globals.css `.docs-bg-*`). */
export function bgClass(bg: PreviewBg): string {
  return `docs-bg-${bg}`;
}

/** @deprecated Use `bgClass` — kept for callers that still spread style objects. */
export function bgImage(bg: PreviewBg): React.CSSProperties {
  switch (bg) {
    case 'grid':
      return {
        backgroundImage: 'radial-gradient(var(--color-outline-variant) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      };
    case 'dotted':
      return {
        backgroundImage: 'radial-gradient(var(--color-surface-container-high) 1.2px, transparent 1.2px)',
        backgroundSize: '14px 14px',
      };
    case 'solid':
      return { backgroundImage: 'none', background: 'var(--color-surface-container-high)' };
    case 'transparent':
      return { backgroundImage: 'none' };
  }
}

export function widthPx(w: PreviewWidth): string | number {
  return w === 'full' ? '100%' : `${w}px`;
}
