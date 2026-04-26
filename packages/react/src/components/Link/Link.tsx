import * as React from 'react';
import { ExternalLink } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const linkVariants = cva(
  [
    'inline-flex items-center gap-1 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] rounded-sm',
  ],
  {
    variants: {
      variant: {
        default:
          'text-[var(--color-brand-primary-500)] hover:text-[var(--color-brand-primary-600)]',
        muted:
          'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
        underlined:
          'text-[var(--color-brand-primary-500)] underline underline-offset-4 hover:text-[var(--color-brand-primary-600)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant, external = false, className, children, ...rest }, ref) => {
    const externalProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <a
        ref={ref}
        className={cn(linkVariants({ variant }), className)}
        {...externalProps}
        {...rest}
      >
        {children}
        {external && (
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
        )}
      </a>
    );
  },
);

Link.displayName = 'Link';
