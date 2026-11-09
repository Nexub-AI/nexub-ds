'use client';

import * as React from 'react';
import { ChevronRight, MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { safeHref } from '../../utils/safeHref.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';

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

export interface BreadcrumbTrailItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbTrailProps extends React.HTMLAttributes<HTMLElement> {
  /** The path, root first. The last item is the current page. */
  items: BreadcrumbTrailItem[];
  /**
   * Most items shown. Longer trails keep the first item and the last
   * `maxItems - 1`, and put the rest in a "More" menu. Default 4.
   */
  maxItems?: number;
}

/** A whole breadcrumb from data, collapsing long paths into a menu. */
const Trail = React.forwardRef<HTMLElement, BreadcrumbTrailProps>(({ items, maxItems = 4, ...props }, ref) => {
  const messages = useNexubMessages();
  const keep = Math.max(2, maxItems);
  const collapsed = items.length > keep;
  const hidden = collapsed ? items.slice(1, items.length - (keep - 1)) : [];
  const shown = collapsed ? [items[0]!, ...items.slice(items.length - (keep - 1))] : items;
  const crumb = (item: BreadcrumbTrailItem, last: boolean) =>
    last ? <Page>{item.label}</Page> : <Link href={safeHref(item.href)}>{item.label}</Link>;

  return (
    <Root ref={ref} {...props}>
      <List>
        {shown.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Separator />}
            <Item>{crumb(item, i === shown.length - 1)}</Item>
            {i === 0 && collapsed && (
              <>
                <Separator />
                <Item>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      aria-label={messages.breadcrumbMore}
                      className="nx-state-layer flex h-9 w-9 items-center justify-center rounded-shape-control"
                    >
                      <MoreHorizontal size="sm" aria-hidden="true" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="start">
                      {hidden.map((h, j) => (
                        <DropdownMenu.Item key={j} asChild>
                          <a href={safeHref(h.href)}>{h.label}</a>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Item>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </Root>
  );
});
Trail.displayName = 'Breadcrumb.Trail';

export const Breadcrumb = { Root, List, Item, Link, Page, Separator, Ellipsis, Trail };
