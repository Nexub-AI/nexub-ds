import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <kbd
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          'inline-flex items-center justify-center font-mono text-xs',
          'px-1.5 py-0.5 min-w-[1.5rem]',
          'rounded border border-[var(--color-border-default)]',
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]',
          'shadow-[0_1px_0_var(--color-border-default)]',
          className,
        )}
        {...rest}
      >
        {children}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
