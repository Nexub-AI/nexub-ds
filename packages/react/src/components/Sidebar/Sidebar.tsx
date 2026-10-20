import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

const Root = React.forwardRef<HTMLElement, SidebarRootProps>(
  ({ className, collapsed = false, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Sidebar"
      data-collapsed={collapsed}
      className={cn(
        // Chrome recedes: a tonal panel, no divider.
        'group/sidebar flex flex-col gap-1 bg-[var(--color-surface-container-low)] transition-[width] duration-spatial-default ease-spatial-default',
        collapsed
          ? 'w-[var(--size-nav-sidebar-collapsed,56px)]'
          : 'w-[var(--size-nav-sidebar,240px)]',
        'h-full overflow-y-auto overflow-x-hidden',
        className,
      )}
      {...props}
    />
  ),
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
      // Native tooltip for the icon-only collapsed state.
      title: typeof label === 'string' ? label : undefined,
      className: cn(
        // Active = the secondary-container pill (M3 nav indicator), not a solid brand fill.
        'nx-state-layer relative flex h-control-md items-center gap-3 rounded-shape-control px-3 text-label-lg',
        active
          ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]'
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

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-auto border-t border-[var(--color-outline-variant)] p-4',
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = 'Sidebar.Footer';

export const Sidebar = { Root, Header, Group, Item, Separator, Footer };
