'use client';

import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/cn.js';

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
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    { className, thumbLabels, marks, showValue, formatValue, 'aria-label': ariaLabel, onValueChange, ...props },
    ref,
  ) => {
    const { min = 0, max = 100, inverted } = props;
    // Uncontrolled values are tracked only to show them; Radix still owns the state.
    const [own, setOwn] = React.useState(props.defaultValue ?? [min]);
    const values = props.value ?? own;
    // Thumb count only — keyed by index so a thumb never remounts while dragging.
    const count = (props.value ?? props.defaultValue ?? [0]).length;
    const format = formatValue ?? String;
    // Matches Radix's in-bounds thumb offset (half the 1.25rem thumb at the ends), so ticks line up.
    const at = (v: number) => {
      const p = ((v - min) / (max - min)) * 100;
      const pct = inverted ? 100 - p : p;
      return { insetInlineStart: `calc(${pct}% + ${(0.5 - pct / 100) * 1.25}rem)` };
    };
    const list = marks?.map((m) => (typeof m === 'number' ? { value: m } : m));
    const labelled = list?.some((m) => m.label);
    return (
      <RadixSlider.Root
        ref={ref}
        className={cn(
          'group relative flex h-control-sm w-full touch-none select-none items-center',
          labelled && 'mb-5',
          className,
        )}
        onValueChange={(v) => {
          setOwn(v);
          onValueChange?.(v);
        }}
        {...props}
      >
        <RadixSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
          <RadixSlider.Range className="absolute h-full bg-[var(--color-primary)] group-data-[disabled]:bg-[var(--color-text-disabled)]" />
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
            aria-label={thumbLabels?.[i] ?? ariaLabel}
            aria-valuetext={formatValue && values[i] !== undefined ? formatValue(values[i]) : undefined}
            // Solid primary knob with a surface ring; the state-layer halo is wider than the knob.
            className={cn(
              'nx-state-layer group/thumb relative block h-5 w-5 rounded-full border-2 border-[var(--color-surface-container-lowest)] bg-[var(--color-primary)] text-[var(--color-primary)] shadow-elevation-1',
              'before:-inset-2.5 cursor-grab active:cursor-grabbing',
              // Opaque disabled knob (text-disabled is translucent and would show the range through it).
              'group-data-[disabled]:pointer-events-none group-data-[disabled]:bg-[color-mix(in_srgb,var(--color-on-surface)_38%,var(--color-surface))]',
            )}
          >
            {showValue && values[i] !== undefined && (
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-2 py-1 text-label-md text-[var(--color-inverse-on-surface)] shadow-elevation-1 transition-opacity',
                  showValue === 'hover' &&
                    'opacity-0 group-hover/thumb:opacity-100 group-focus/thumb:opacity-100',
                )}
              >
                {format(values[i])}
              </span>
            )}
          </RadixSlider.Thumb>
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = 'Slider';
