import * as React from 'react';
import { AlertCircle } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

export type FormErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="alert"
        className={cn(
          'flex items-center gap-1.5 text-sm text-[var(--color-danger-600)] leading-snug',
          className,
        )}
        {...props}
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {children}
      </p>
    );
  },
);

FormError.displayName = 'FormError';
