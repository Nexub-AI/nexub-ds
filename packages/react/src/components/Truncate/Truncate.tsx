'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
// Loaded only once the text is actually clipped, so a Truncate that fits stays tiny.
const LazyTooltip = React.lazy(() => import('../Tooltip/Tooltip.js').then((m) => ({ default: m.Tooltip })));

export interface TruncateProps extends React.HTMLAttributes<HTMLElement> {
  /** Lines shown before the text is clipped. @default 1 */
  lines?: number;
  /** @default 'span' */
  as?: React.ElementType;
  /** Show the full text in a tooltip while it is clipped (string children only). @default true */
  tooltip?: boolean;
}

// Same approach as Text: classes for 2–6 (strict-CSP safe), inline beyond that.
const LINE_CLAMP: Record<number, string> = {
  2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4', 5: 'line-clamp-5', 6: 'line-clamp-6',
};

/**
 * Text clipped to one line (or `lines`). While it is clipped, and only then, it is a tab
 * stop with a tooltip holding the full text; text that fits adds neither.
 */
export const Truncate = React.forwardRef<HTMLElement, TruncateProps>(
  ({ lines = 1, as: Comp = 'span', tooltip = true, className, style, children, ...props }, ref) => {
    // State, not a ref: wrapping in the tooltip remounts the element, and the observer must follow it.
    const [el, setEl] = React.useState<HTMLElement | null>(null);
    const [clipped, setClipped] = React.useState(false);
    const single = lines <= 1;

    React.useEffect(() => {
      if (!el) return;
      const measure = () => setClipped(single ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight);
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [el, single, lines, children]);

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        setEl(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const tip = tooltip && clipped && typeof children === 'string';
    const clampClass = single ? 'block truncate' : LINE_CLAMP[lines];
    const clampStyle: React.CSSProperties | undefined = clampClass
      ? undefined
      : { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
    const text = (focusable: boolean) => (
      <Comp
        ref={setRefs}
        // Keyboard users reach the tooltip through this tab stop; none when the text fits.
        tabIndex={focusable ? 0 : undefined}
        className={cn('min-w-0 max-w-full', clampClass, className)}
        style={clampStyle ? { ...clampStyle, ...style } : style}
        {...props}
      >
        {children}
      </Comp>
    );
    if (!tip) return text(false);
    return (
      // The tab stop arrives with the tooltip: the swap remounts the element, which would drop focus.
      <React.Suspense fallback={text(false)}>
        <LazyTooltip label={children}>{text(true)}</LazyTooltip>
      </React.Suspense>
    );
  },
);

Truncate.displayName = 'Truncate';
