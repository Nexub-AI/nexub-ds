import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
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
  /** Render the child element (e.g. a router `<Link>`) instead of an `<a>`. */
  asChild?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant, external = false, asChild, className, children, target, rel, ...rest }, ref) => {
    const resolvedTarget = external ? '_blank' : target;
    // Any new-tab link always gets noopener/noreferrer, merged with caller's rel.
    const resolvedRel =
      resolvedTarget === '_blank'
        ? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), 'noopener', 'noreferrer'])].join(' ')
        : rel;
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        className={cn(linkVariants({ variant }), className)}
        {...rest}
        target={resolvedTarget}
        rel={resolvedRel}
      >
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {external && <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          </>
        )}
      </Comp>
    );
  },
);

Link.displayName = 'Link';
