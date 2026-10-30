'use client';

import * as React from 'react';

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

export function PreviewToolbar({ state, onChange }: Props) {
  return (
    <div
      role="toolbar"
      aria-label="Preview controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '6px 12px',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      <SegGroup label="Background">
        {BG_OPTIONS.map((o) => (
          <SegBtn
            key={o.value}
            active={state.bg === o.value}
            onClick={() => onChange((prev) => ({ ...prev, bg: o.value }))}
            title={o.label}
          >
            {o.label}
          </SegBtn>
        ))}
      </SegGroup>

      <SegGroup label="Width">
        {WIDTH_OPTIONS.map((o) => (
          <SegBtn
            key={o.value}
            active={state.width === o.value}
            onClick={() => onChange((prev) => ({ ...prev, width: o.value }))}
            title={o.title}
          >
            {o.label}
          </SegBtn>
        ))}
      </SegGroup>

      <SegGroup label="Direction">
        {(['ltr', 'rtl'] as const).map((d) => (
          <SegBtn
            key={d}
            active={state.dir === d}
            onClick={() => onChange((prev) => ({ ...prev, dir: d }))}
            title={d === 'ltr' ? 'Left to right' : 'Right to left'}
          >
            {d.toUpperCase()}
          </SegBtn>
        ))}
      </SegGroup>
    </div>
  );
}

function SegGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className="text-[var(--color-on-surface-variant)] font-semibold tracking-wide uppercase text-[0.62rem]"
      >
        {label}
      </span>
      <div
        className="inline-flex gap-0.5 p-0.5 bg-[var(--color-surface-container-high)] rounded-shape-control"
      >
        {children}
      </div>
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className="nx-state-layer"
      style={{
        padding: '3px 8px',
        minHeight: '24px',
        fontSize: '0.7rem',
        fontFamily: 'inherit',
        fontWeight: active ? 600 : 500,
        background: active ? 'var(--color-secondary-container)' : 'transparent',
        color: active ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
        border: 'none',
        borderRadius: 'var(--shape-control)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export const DEFAULT_TOOLBAR_STATE: PreviewToolbarState = {
  bg: 'grid',
  width: 'full',
  dir: 'ltr',
};

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
