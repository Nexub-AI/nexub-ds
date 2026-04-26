import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  language?: string;
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ inline = true, language, className, children, ...rest }, ref) => {
    if (inline) {
      return (
        <code
          ref={ref as React.Ref<HTMLElement>}
          className={cn(
            'font-mono text-sm bg-[var(--color-bg-muted)] px-1.5 py-0.5 rounded',
            className,
          )}
          {...rest}
        >
          {children}
        </code>
      );
    }

    return (
      <pre
        className={cn(
          'overflow-x-auto rounded-md bg-[var(--color-bg-muted)] p-4',
          className,
        )}
      >
        <code
          ref={ref as React.Ref<HTMLElement>}
          className="font-mono text-sm"
          data-language={language}
          {...rest}
        >
          {children}
        </code>
      </pre>
    );
  },
);

Code.displayName = 'Code';
