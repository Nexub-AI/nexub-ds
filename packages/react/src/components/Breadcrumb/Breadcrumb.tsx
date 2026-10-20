import * as React from 'react';
import { ChevronRight, MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

const Root = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} aria-label={useNexubMessages().breadcrumb} className={cn('', className)} {...props} />
  ),
);
Root.displayName = 'Breadcrumb.Root';

const List = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-on-surface-muted)] sm:gap-2.5',
        className,
      )}
      {...props}
    />
  ),
);
List.displayName = 'Breadcrumb.List';

const Item = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  ),
);
Item.displayName = 'Breadcrumb.Item';

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn('transition-colors hover:text-[var(--color-on-surface)]', className)}
    {...props}
  >
    {children}
  </a>
));
Link.displayName = 'Breadcrumb.Link';

const Page = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-current="page"
      aria-disabled="true"
      className={cn('font-normal text-[var(--color-on-surface)]', className)}
      {...props}
    />
  ),
);
Page.displayName = 'Breadcrumb.Page';

const Separator = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
  >
    {children ?? <ChevronRight aria-hidden="true" className="rtl:-scale-x-100" />}
  </li>
);
Separator.displayName = 'Breadcrumb.Separator';

const Ellipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal size="sm" aria-hidden="true" />
    <span className="sr-only">{useNexubMessages().breadcrumbMore}</span>
  </span>
);
Ellipsis.displayName = 'Breadcrumb.Ellipsis';

export const Breadcrumb = { Root, List, Item, Link, Page, Separator, Ellipsis };
