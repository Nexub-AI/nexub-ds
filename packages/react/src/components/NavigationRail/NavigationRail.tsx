import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface NavigationRailRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Accessible name for the landmark. @default 'Main' */
  'aria-label'?: string;
  /** Optional slot above the items, e.g. a primary action or logo. */
  header?: React.ReactNode;
}

/**
 * Navigation for medium-width windows (M3 navigation rail): between TopNav
 * (compact) and Sidebar (expanded). Icons over labels, an active pill behind the icon.
 */
const Root = React.forwardRef<HTMLElement, NavigationRailRootProps>(
  ({ className, header, children, 'aria-label': ariaLabel, ...props }, ref) => {
    const messages = useNexubMessages();
    return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? messages.mainNavigation}
      className={cn('flex h-full w-20 shrink-0 flex-col items-center gap-3 py-4', className)}
      {...props}
    >
      {header && <div className="mb-3 flex flex-col items-center">{header}</div>}
      <ul className="flex w-full flex-col items-center gap-1" role="list">
        {children}
      </ul>
    </nav>
    );
  },
);
Root.displayName = 'NavigationRail.Root';

export interface NavigationRailItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  icon: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  /** Render your link (e.g. a router `<Link>`) as the item: pass it as the only child. */
  asChild?: boolean;
  children?: React.ReactElement;
}

const Item = React.forwardRef<HTMLAnchorElement, NavigationRailItemProps>(
  ({ className, icon, label, active, asChild, children, ...props }, ref) => {
    const inner = (
      <>
        {/* The indicator pill: active fill, plus a state layer driven by the item's hover/press. */}
        <span
          className={cn(
            'relative grid h-8 w-14 place-items-center rounded-full [&>svg]:h-5 [&>svg]:w-5',
            'before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-0',
            'before:transition-opacity before:duration-effects-fast before:ease-effects-fast',
            'group-hover:before:opacity-[var(--state-hover)] group-active:before:opacity-[var(--state-pressed)]',
            active
              ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]'
              : 'text-[var(--color-on-surface-variant)]',
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            'text-label-md',
            active ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-variant)]',
          )}
        >
          {label}
        </span>
      </>
    );
    const shared = {
      ref,
      'aria-current': active ? ('page' as const) : undefined,
      className: cn(
        'group flex w-full flex-col items-center gap-1 rounded-shape-container py-1 no-underline select-none outline-offset-0',
        className,
      ),
      ...props,
    };
    return (
      <li className="w-full px-1">
        {asChild && React.isValidElement(children) ? (
          <Slot {...shared}>{React.cloneElement(children, undefined, inner)}</Slot>
        ) : (
          <a {...shared}>{inner}</a>
        )}
      </li>
    );
  },
);
Item.displayName = 'NavigationRail.Item';

export const NavigationRail = { Root, Item };
