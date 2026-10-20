import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

export interface TopNavRootProps extends React.HTMLAttributes<HTMLElement> {
  surface?: SurfaceValue;
  /** Sticky-bar edge: `soft` dissolves scrolling content under the bar (no
   *  divider), `hard` is an opaque band for pinned headers. Default: a divider. */
  scrollEdge?: 'soft' | 'hard';
}

const Root = React.forwardRef<HTMLElement, TopNavRootProps>(
  ({ className, children, surface = 'solid', scrollEdge, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-[var(--z-sticky,100)] flex h-[var(--size-nav-header,64px)] items-center border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4',
        surface === 'glass' && glassSurfaceClass,
        className,
      )}
      data-material={surface === 'glass' ? 'glass' : undefined}
      data-scroll-edge={scrollEdge}
      {...props}
    >
      <div className="flex w-full items-center gap-4">{children}</div>
    </header>
  ),
);
Root.displayName = 'TopNav.Root';

const Logo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('shrink-0 flex items-center', className)} {...props} />
  ),
);
Logo.displayName = 'TopNav.Logo';

const Menu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    // Scrolls horizontally on narrow screens rather than hiding the links.
    <nav
      ref={ref}
      aria-label="Main"
      className={cn('flex min-w-0 items-center gap-1 overflow-x-auto', className)}
      {...props}
    />
  ),
);
Menu.displayName = 'TopNav.Menu';

export interface TopNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  /** Render the child element (e.g. a router `<Link>`) instead of an `<a>`. */
  asChild?: boolean;
}

const Item = React.forwardRef<HTMLAnchorElement, TopNavItemProps>(
  ({ className, active, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
    <Comp
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 shrink-0 items-center rounded-md px-4 text-sm font-medium transition-colors',
        active
          ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
        className,
      )}
      {...props}
    />
    );
  },
);
Item.displayName = 'TopNav.Item';

const Actions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ml-auto flex items-center gap-2', className)} {...props} />
  ),
);
Actions.displayName = 'TopNav.Actions';

export const TopNav = { Root, Logo, Menu, Item, Actions };
