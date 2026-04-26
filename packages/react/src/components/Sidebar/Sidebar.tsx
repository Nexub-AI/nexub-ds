import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

const Root = React.forwardRef<HTMLElement, SidebarRootProps>(
  ({ className, collapsed = false, ...props }, ref) => (
    <aside
      ref={ref}
      data-collapsed={collapsed}
      className={cn(
        'flex flex-col gap-1 bg-[var(--color-bg-default)] border-r border-[var(--color-border-default)] transition-all duration-200',
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

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const Group = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-0.5 p-2', className)} {...props}>
      {label && (
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
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
}

const Item = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, icon, active, children, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-[var(--color-brand-primary-500)] text-white'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </a>
  ),
);
Item.displayName = 'Sidebar.Item';

const Separator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('my-2 border-[var(--color-border-default)]', className)}
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
        'mt-auto border-t border-[var(--color-border-default)] p-4',
        className,
      )}
      {...props}
    />
  ),
);
Footer.displayName = 'Sidebar.Footer';

export const Sidebar = { Root, Group, Item, Separator, Footer };
