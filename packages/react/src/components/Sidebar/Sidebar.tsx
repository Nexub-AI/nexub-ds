'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { accentAttrs } from '@nexub/core';
import type { DivisionKey, ProductKey } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  /** 10.3: the app or division this sidebar belongs to. Sets `data-product` / `data-division`,
   *  so the active item takes that accent (needs `@nexub/themes/products` or `/divisions`). */
  accent?: ProductKey | DivisionKey;
}

const Root = React.forwardRef<HTMLElement, SidebarRootProps>(
  ({ className, collapsed = false, accent, children, ...props }, forwardedRef) => {
    const messages = useNexubMessages();
    const ref = React.useRef<HTMLElement>(null);
    // Drives the marker beside the active item (shown by the vivid layer only).
    useSlidingIndicator(ref, '[aria-current="page"]');
    return (
    <nav
      ref={useMergedRefs(ref, forwardedRef)}
      {...accentAttrs(accent)}
      aria-label={messages.sidebar}
      data-collapsed={collapsed}
      className={cn(
        // Chrome recedes: a tonal panel, no divider.
        'group/sidebar relative flex flex-col gap-1 bg-[var(--color-surface-container-low)] transition-[width] duration-spatial-default ease-spatial-default',
        collapsed
          ? 'w-[var(--size-nav-sidebar-collapsed,56px)]'
          : 'w-[var(--size-nav-sidebar,240px)]',
        'h-full overflow-y-auto overflow-x-hidden',
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'nx-nav-marker pointer-events-none absolute start-0 top-2 w-1 rounded-e-full bg-[var(--color-spot,var(--color-primary))]',
          'h-[calc(var(--nx-ind-h,0px)-1rem)] translate-y-[var(--nx-ind-y,0px)] opacity-[var(--nx-ind-o,0)]',
          '[[data-nx-indicator=ready]>&]:transition-transform [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
        )}
      />
    </nav>
    );
  },
);
Root.displayName = 'Sidebar.Root';

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trailing element next to the logo, e.g. a "Live" `<Badge>`. Moves under the logo when they don't fit. */
  status?: React.ReactNode;
}

/** Top of the sidebar: a logo (children) and an optional status. */
const Header = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, status, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Wraps instead of overlapping: the status drops to its own line when
        // the logo needs the width, and a logo wider than the sidebar truncates.
        'flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[var(--color-outline-variant)] px-3 py-3 group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-2',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 max-w-full items-center">{children}</div>
      {status && (
        <div className="flex shrink-0 items-center group-data-[collapsed=true]/sidebar:sr-only">{status}</div>
      )}
    </div>
  ),
);
Header.displayName = 'Sidebar.Header';

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const Group = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-0.5 p-2', className)} {...props}>
      {label && (
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-muted)]">
          {label}
        </p>
      )}
      {children}
    </div>
  ),
);
Group.displayName = 'Sidebar.Group';

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  /** Render the child element (e.g. a router `<Link>`) instead of an `<a>`. */
  asChild?: boolean;
}

const Item = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, icon, active, asChild, children, ...props }, ref) => {
    const child = asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null;
    const label = child ? child.props.children : children;
    const content = (
      <>
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        {/* Visually hidden (still announced) when the sidebar is collapsed. */}
        <span className="flex-1 truncate group-data-[collapsed=true]/sidebar:sr-only">{label}</span>
      </>
    );
    const itemProps = {
      ref,
      'aria-current': active ? ('page' as const) : undefined,
      'data-nx': 'nav-item',
      // Native tooltip for the icon-only collapsed state.
      title: typeof label === 'string' ? label : undefined,
      className: cn(
        // Active = the secondary-container pill (M3 nav indicator), not a solid brand fill.
        'nx-state-layer relative flex h-control-md items-center gap-3 rounded-shape-control px-3 text-label-lg',
        active
          ? 'bg-[var(--nav-active-bg,var(--color-secondary-container))] text-[var(--nav-active-fg,var(--color-on-secondary-container))]'
          : 'text-[var(--color-on-surface-variant)]',
        className,
      ),
      ...props,
    };
    return child ? (
      <Slot {...itemProps}>{React.cloneElement(child, undefined, content)}</Slot>
    ) : (
      <a {...itemProps}>{content}</a>
    );
  },
);
Item.displayName = 'Sidebar.Item';

const Separator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('my-2 border-[var(--color-outline-variant)]', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Sidebar.Separator';

/** Bottom of the sidebar, e.g. a version line. Stays pinned while the items scroll above it. */
const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'sticky bottom-0 mt-auto shrink-0 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-4',
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = 'Sidebar.Footer';

export const Sidebar = { Root, Header, Group, Item, Separator, Footer };
