import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Kbd } from '../Kbd/Kbd.js';

export interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[];
}

export const KeyboardShortcut = React.forwardRef<HTMLSpanElement, KeyboardShortcutProps>(
  ({ keys, className, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        aria-label={keys.join('+')}
        {...rest}
      >
        {keys.map((key, index) => (
          <React.Fragment key={`${key}-${index}`}>
            {index > 0 && (
              <span
                className="text-[var(--color-on-surface-muted)] text-xs select-none"
                aria-hidden="true"
              >
                +
              </span>
            )}
            <Kbd>{key}</Kbd>
          </React.Fragment>
        ))}
      </span>
    );
  },
);

KeyboardShortcut.displayName = 'KeyboardShortcut';
