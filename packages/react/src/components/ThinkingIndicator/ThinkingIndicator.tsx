'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface ThinkingIndicatorMessages {
  thinking: string;
}

const fallbackMessages: ThinkingIndicatorMessages = { thinking: 'Thinking' };

export interface ThinkingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible text. Pass `null` to hide it (it is still announced). @default messages.thinking */
  label?: React.ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Local overrides for this component's strings. */
  messages?: Partial<ThinkingIndicatorMessages>;
}

/**
 * Shows the assistant is working before tokens arrive: a primary-tinted shape
 * morphing between a circle and a soft four-lobed squircle (.nx-morph), and a
 * label with a decorative shimmer (.nx-shimmer). Reduced motion: both static.
 */
export const ThinkingIndicator = React.forwardRef<HTMLDivElement, ThinkingIndicatorProps>(
  ({ label, size = 'md', messages: messagesProp, className, ...props }, ref) => {
    const m = {
      ...fallbackMessages,
      ...(useNexubMessages() as unknown as Partial<ThinkingIndicatorMessages>),
      ...messagesProp,
    };
    const text = label === undefined ? m.thinking : label;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          'inline-flex items-center text-[var(--color-on-surface-variant)]',
          size === 'sm' ? 'gap-2 text-label-md' : 'gap-2.5 text-body-md',
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'nx-morph shrink-0 rounded-full bg-[var(--color-primary)]',
            size === 'sm' ? 'size-4' : 'size-5',
          )}
        />
        {text === null ? (
          <span className="sr-only">{m.thinking}</span>
        ) : (
          <span className="nx-shimmer">{text}</span>
        )}
      </div>
    );
  },
);

ThinkingIndicator.displayName = 'ThinkingIndicator';
