'use client';

import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';

export type SliderMark = number | { value: number; label?: string };

export interface SliderProps extends RadixSlider.SliderProps {
  /** Accessible name per thumb (e.g. ['Minimum', 'Maximum']). Falls back to `aria-label`. */
  thumbLabels?: string[];
  /** Ticks along the track, optionally labelled (`[0, { value: 50, label: '50%' }, 100]`). */
  marks?: SliderMark[];
  /** Value bubble above each thumb: `true` always, `'hover'` on hover, focus and drag. */
  showValue?: boolean | 'hover';
  /** Formats the bubble and each thumb's `aria-valuetext`. */
  formatValue?: (value: number) => string;
  /** Track thickness and thumb size; `md` is the default. */
  size?: Size;
  /** Error-coloured range and thumb, `aria-invalid` on the root. */
  invalid?: boolean;
  /** Focusable but pointer and keys do not change the value; `aria-readonly` on each thumb. */
  readOnly?: boolean;
}

// thumbRem feeds the tick offset below; keep it equal to the thumb class.
const sizes: Record<Size, { track: string; thumb: string; thumbRem: number }> = {
  sm: { track: 'h-1', thumb: 'h-4 w-4', thumbRem: 1 },
  md: { track: 'h-1.5', thumb: 'h-5 w-5', thumbRem: 1.25 },
  lg: { track: 'h-2', thumb: 'h-6 w-6', thumbRem: 1.5 },
};
const STEP_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    { className, thumbLabels, marks, showValue, formatValue, size = 'md', invalid, readOnly, 'aria-label': ariaLabel, onValueChange, onKeyDownCapture, onPointerDownCapture, ...props },
    ref,
  ) => {
    const { min = 0, max = 100, inverted } = props;
    // Uncontrolled values are tracked only to show them; Radix still owns the state.
    const [own, setOwn] = React.useState(props.defaultValue ?? [min]);
    const values = props.value ?? own;
    // Thumb count only — keyed by index so a thumb never remounts while dragging.
    const count = (props.value ?? props.defaultValue ?? [0]).length;
    const format = formatValue ?? String;
    const s = sizes[size];
    // Matches Radix's in-bounds thumb offset (half the thumb at the ends), so ticks line up.
    const at = (v: number) => {
      const p = ((v - min) / (max - min)) * 100;
      const pct = inverted ? 100 - p : p;
      return { insetInlineStart: `calc(${pct}% + ${(0.5 - pct / 100) * s.thumbRem}rem)` };
    };
    // 10.5: each thumb is placed here, from its value, instead of by Radix's wrapper: Radix
    // renders thumbs hidden on the server and offsets them only after measuring, so they
    // appeared and moved after hydration. The wrapper gets display: contents (root class
    // below), and the same position is in the server HTML. Vertical stays with Radix.
    const placed = props.orientation !== 'vertical';
    const thumbStyle = (v: number | undefined): React.CSSProperties | undefined =>
      placed && v !== undefined
        ? { ...at(Math.min(max, Math.max(min, v))), marginInlineStart: `${-s.thumbRem / 2}rem`, position: 'absolute', display: 'block' }
        : undefined;
    const list = marks?.map((m) => (typeof m === 'number' ? { value: m } : m));
    const labelled = list?.some((m) => m.label);
    return (
      <RadixSlider.Root
        ref={ref}
        className={cn(
          'group relative flex h-control-sm w-full touch-none select-none items-center',
          placed && '[&>span:has(>[role=slider])]:contents',
          labelled && 'mb-5',
          className,
        )}
        onValueChange={(v) => {
          setOwn(v);
          onValueChange?.(v);
        }}
        // Read-only: Radix never sees the pointer or the step keys; Tab and focus still work.
        onPointerDownCapture={(e) => {
          onPointerDownCapture?.(e);
          if (readOnly) e.stopPropagation();
        }}
        onKeyDownCapture={(e) => {
          onKeyDownCapture?.(e);
          if (readOnly && STEP_KEYS.includes(e.key)) e.stopPropagation();
        }}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
      >
        <RadixSlider.Track className={cn('relative w-full grow overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]', s.track)}>
          <RadixSlider.Range className="absolute h-full bg-[var(--color-primary)] group-aria-invalid:bg-[var(--color-error)] group-data-[disabled]:bg-[var(--color-text-disabled)]" />
        </RadixSlider.Track>
        {/* Zero-width anchors centre each tick on its value in either direction. */}
        {list?.map((m) => (
          <span
            key={m.value}
            aria-hidden="true"
            data-mark={m.value}
            className="pointer-events-none absolute inset-y-0 flex w-0 flex-col items-center justify-center"
            style={at(m.value)}
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-on-surface-muted)]" />
            {m.label && (
              <span className="absolute top-full whitespace-nowrap text-label-sm text-[var(--color-on-surface-muted)]">
                {m.label}
              </span>
            )}
          </span>
        ))}
        {Array.from({ length: count }, (_, i) => (
          <RadixSlider.Thumb
            key={i}
            asChild
            aria-label={thumbLabels?.[i] ?? ariaLabel}
            aria-valuetext={formatValue && values[i] !== undefined ? formatValue(values[i]) : undefined}
            aria-readonly={readOnly || undefined}
            // Solid primary knob with a surface ring; the state-layer halo is wider than the knob.
            className={cn(
              'nx-state-layer group/thumb relative block rounded-full border-2 border-[var(--color-surface-container-lowest)] bg-[var(--color-primary)] text-[var(--color-primary)] shadow-elevation-1',
              s.thumb,
              'group-aria-invalid:bg-[var(--color-error)] group-aria-invalid:text-[var(--color-error)]',
              readOnly ? 'before:-inset-2.5 cursor-default' : 'before:-inset-2.5 cursor-grab active:cursor-grabbing',
              // Opaque disabled knob (text-disabled is translucent and would show the range through it).
              'group-data-[disabled]:pointer-events-none group-data-[disabled]:bg-[color-mix(in_srgb,var(--color-on-surface)_38%,var(--color-surface))]',
            )}
          >
            {/* The child's style wins over the display: none Radix sets while it has no value yet (server). */}
            <span style={thumbStyle(values[i])}>
              {showValue && values[i] !== undefined && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-2 py-1 text-label-md tabular-nums text-[var(--color-inverse-on-surface)] shadow-elevation-1 transition-opacity',
                    showValue === 'hover' &&
                      'opacity-0 group-hover/thumb:opacity-100 group-focus/thumb:opacity-100',
                  )}
                >
                  {format(values[i])}
                </span>
              )}
            </span>
          </RadixSlider.Thumb>
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = 'Slider';
