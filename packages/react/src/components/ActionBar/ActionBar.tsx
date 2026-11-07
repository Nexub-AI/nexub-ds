import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { floatingSurface } from '../../utils/surface.js';

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Status on the start side, e.g. "Unsaved changes". Announced politely. */
  message?: React.ReactNode;
  /** Names the region. @default the message when it's a string */
  'aria-label'?: string;
}

/**
 * Save / cancel that stay in view at the bottom of a long form or settings
 * page. Put it last inside the scrolling area.
 */
export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  { message, className, children, 'aria-label': ariaLabel, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel ?? (typeof message === 'string' ? message : undefined)}
      className={cn(
        floatingSurface,
        'sticky bottom-4 z-10 flex flex-wrap items-center gap-3 px-4 py-2',
        className,
      )}
      {...props}
    >
      {message !== undefined && (
        <span aria-live="polite" className="me-auto text-label-lg text-[var(--color-on-surface)]">
          {message}
        </span>
      )}
      <div className={cn('flex flex-wrap items-center gap-2', message === undefined && 'ms-auto')}>{children}</div>
    </div>
  );
});
