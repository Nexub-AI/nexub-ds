'use client';

import * as React from 'react';
import { Slider } from '../Slider/Slider.js';
import { Button } from '../Button/Button.js';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface ChartZoomProps<T> {
  data: T[];
  /** The category key, shown as the range's ends. */
  index: keyof T;
  /** Render the chart for the visible slice (charts stay server-friendly; only this wrapper is client). */
  children: (slice: T[]) => React.ReactNode;
  /** Start and end indexes. @default the whole range */
  defaultRange?: [number, number];
  /** Fewest categories shown. @default 2 */
  minSpan?: number;
  className?: string;
}

/**
 * Zoom a chart to part of its range with a two-thumb slider under it (keyboard
 * and touch friendly), and reset to the whole range.
 */
export function ChartZoom<T>({ data, index, children, defaultRange, minSpan = 2, className }: ChartZoomProps<T>) {
  const t = useNexubMessages();
  const full: [number, number] = [0, Math.max(0, data.length - 1)];
  const [range, setRange] = React.useState<[number, number]>(defaultRange ?? full);
  const [a, b] = [Math.max(0, range[0]), Math.min(full[1], range[1])];
  const zoomed = a > 0 || b < full[1];
  const label = (i: number) => String(data[i]?.[index] ?? '');

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {children(data.slice(a, b + 1))}
      <div className="flex items-center gap-3">
        <Slider
          min={0}
          max={full[1]}
          step={1}
          minStepsBetweenThumbs={Math.max(1, minSpan - 1)}
          value={[a, b]}
          onValueChange={(v) => setRange([v[0]!, v[1]!])}
          thumbLabels={[`${t.zoomStart}: ${label(a)}`, `${t.zoomEnd}: ${label(b)}`]}
          className="flex-1"
        />
        <span aria-hidden="true" className="min-w-max text-label-md tabular-nums text-[var(--color-on-surface-muted)]">
          {label(a)} – {label(b)}
        </span>
        <Button variant="text" size="sm" disabled={!zoomed} onClick={() => setRange(full)}>
          {t.resetZoom}
        </Button>
      </div>
    </div>
  );
}
