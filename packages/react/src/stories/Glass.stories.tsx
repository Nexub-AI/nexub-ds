import * as React from 'react';
import type { Meta } from '@storybook/react';
import { glassSurfaceClass } from '../utils/glass.js';
import { cn } from '../utils/cn.js';
import { Button } from '../components/Button/Button.js';
import { TopNav } from '../components/TopNav/TopNav.js';

// Glass 2.0 review surface (design refresh Phase 3): thickness, tint, clear,
// the intensity dial and the soft scroll edge, over a busy backdrop.
const meta: Meta = { title: 'Foundations/Glass' };
export default meta;

const backdrop: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  background:
    'radial-gradient(circle at 15% 25%, #4099f1 0 18%, transparent 19%), radial-gradient(circle at 70% 30%, #f59e0b 0 14%, transparent 15%), radial-gradient(circle at 45% 80%, #8b5cf6 0 20%, transparent 21%), repeating-linear-gradient(45deg, light-dark(#e8e8ef, #20222a) 0 12px, light-dark(#fafafe, #14151a) 12px 24px)',
};

function Swatch({ label, ...attrs }: { label: string } & Record<string, string | undefined>) {
  return (
    <div
      data-material="glass"
      {...attrs}
      className={cn('grid h-28 place-items-center rounded-shape-container border text-label-lg text-[var(--color-on-surface)]', glassSurfaceClass)}
    >
      {label}
    </div>
  );
}

export const Material = () => (
  <div style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
    <div style={{ ...backdrop, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Swatch label="Thin" data-glass-thickness="thin" />
      <Swatch label="Regular" />
      <Swatch label="Thick" data-glass-thickness="thick" />
      <div data-material="glass" data-glass-tint="primary" className={cn('grid h-28 place-items-center rounded-shape-container border text-label-lg text-[var(--color-on-primary)]', glassSurfaceClass)}>
        Tint · primary
      </div>
      <div data-material="glass" data-glass-variant="clear" className={cn('grid h-28 place-items-center rounded-shape-container border text-title-md font-semibold text-white', glassSurfaceClass)}>
        Clear
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="glass">Glass</Button>
        <Button variant="glass" disabled>
          Disabled
        </Button>
      </div>
    </div>
    {/* The dial: the same surface at every user intensity. */}
    <div style={{ ...backdrop, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {(['clear', 'balanced', 'tinted', 'off'] as const).map((g) => (
        <div key={g} data-glass={g}>
          <Swatch label={`Dial · ${g}`} />
        </div>
      ))}
    </div>
  </div>
);

/** A glass bar with the soft scroll edge: content dissolves under it, no divider. */
export const ScrollEdge = () => (
  <div style={{ ...backdrop, padding: 0, height: 320, overflow: 'auto', position: 'relative' }}>
    <TopNav.Root surface="glass" scrollEdge="soft" aria-label="Demo">
      <span className="text-title-md">Soft scroll edge</span>
    </TopNav.Root>
    <div style={{ padding: 24, display: 'grid', gap: 12 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i} className="text-body-md text-[var(--color-on-surface)]">
          Row {i + 1}: scrolling content passes under the bar and fades out instead of meeting a hard line.
        </p>
      ))}
    </div>
  </div>
);
