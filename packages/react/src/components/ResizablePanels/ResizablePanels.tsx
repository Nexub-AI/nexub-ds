'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface ResizablePanelsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Side by side (`horizontal`) or stacked (`vertical`). @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  /** One percentage per panel, adding up to 100. Persist them yourself. */
  sizes?: number[];
  defaultSizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
  /** Smallest size per panel, in percent. @default 10 each */
  minSizes?: number[];
  /** Names each separator: "Resize panels" by default. */
  handleLabel?: string;
  /** The panels; a separator goes between each pair. */
  children: React.ReactNode;
}

const STEP = 5;

/**
 * Panels with draggable separators (ARIA window splitter). Arrow keys move a
 * focused separator by 5%, Home/End to its limits, and Enter resets the pair.
 */
export function ResizablePanels({
  direction = 'horizontal',
  sizes: sizesProp,
  defaultSizes,
  onSizesChange,
  minSizes,
  handleLabel,
  className,
  children,
  ...props
}: ResizablePanelsProps) {
  const t = useNexubMessages();
  const { dir } = useLocale();
  const panels = React.Children.toArray(children);
  const n = panels.length;
  const even = Array.from({ length: n }, () => 100 / n);
  const initial = defaultSizes ?? even;
  const [sizes = even, setSizes] = useControllableState<number[]>({
    value: sizesProp,
    defaultValue: initial,
    onChange: onSizesChange,
  });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const baseId = React.useId();
  const horizontal = direction === 'horizontal';
  const min = (i: number) => minSizes?.[i] ?? 10;

  // Sets panel i to `to` percent, taking the difference from panel i+1, within both minimums.
  const resize = (current: number[], i: number, to: number) => {
    const pair = current[i]! + current[i + 1]!;
    const a = Math.min(pair - min(i + 1), Math.max(min(i), to));
    const next = [...current];
    next[i] = Math.round(a * 100) / 100;
    next[i + 1] = Math.round((pair - a) * 100) / 100;
    setSizes(next);
  };

  const startDrag = (i: number, e: React.PointerEvent) => {
    const root = rootRef.current;
    if (!root) return;
    e.preventDefault();
    const rect = root.getBoundingClientRect();
    const total = horizontal ? rect.width : rect.height;
    const origin = horizontal ? e.clientX : e.clientY;
    const start = [...sizes];
    const flip = horizontal && dir === 'rtl' ? -1 : 1;
    const onMove = (ev: PointerEvent) => {
      const pos = horizontal ? ev.clientX : ev.clientY;
      resize(start, i, start[i]! + (((pos - origin) * flip) / total) * 100);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    const fwd = horizontal ? (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const back = horizontal ? (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const pair = sizes[i]! + sizes[i + 1]!;
    let to: number | undefined;
    if (e.key === fwd) to = sizes[i]! + STEP;
    else if (e.key === back) to = sizes[i]! - STEP;
    else if (e.key === 'Home') to = min(i);
    else if (e.key === 'End') to = pair - min(i + 1);
    else if (e.key === 'Enter') to = (initial[i]! / (initial[i]! + initial[i + 1]!)) * pair;
    if (to === undefined) return;
    e.preventDefault();
    resize(sizes, i, to);
  };

  return (
    <div
      ref={rootRef}
      className={cn('flex min-h-0 min-w-0', horizontal ? 'flex-row' : 'flex-col', className)}
      {...props}
    >
      {panels.map((panel, i) => (
        <React.Fragment key={i}>
          <div
            id={`${baseId}-${i}`}
            ref={(el) => {
              // CSSOM, not a style attribute: strict-CSP pages block inline styles.
              if (el) el.style.flex = `${sizes[i] ?? 0} 1 0px`;
            }}
            className="min-h-0 min-w-0 overflow-auto"
          >
            {panel}
          </div>
          {i < n - 1 && (
            <div
              role="separator"
              tabIndex={0}
              aria-label={handleLabel ?? t.resizePanels}
              aria-controls={`${baseId}-${i}`}
              aria-orientation={horizontal ? 'vertical' : 'horizontal'}
              aria-valuenow={Math.round(sizes[i]!)}
              aria-valuemin={min(i)}
              aria-valuemax={Math.round(sizes[i]! + sizes[i + 1]! - min(i + 1))}
              onPointerDown={(e) => startDrag(i, e)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className={cn(
                'relative shrink-0 touch-none bg-[var(--color-outline-variant)] outline-none',
                // A wider invisible hit area around the 1px line.
                horizontal
                  ? 'w-px cursor-col-resize before:absolute before:-inset-x-1.5 before:inset-y-0'
                  : 'h-px cursor-row-resize before:absolute before:inset-x-0 before:-inset-y-1.5',
                'hover:bg-[var(--color-primary)] focus-visible:bg-[var(--color-primary)] focus-visible:shadow-[0_0_0_1px_var(--color-primary)]',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
