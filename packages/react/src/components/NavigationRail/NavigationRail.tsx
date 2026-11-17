'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

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
  ({ className, header, children, 'aria-label': ariaLabel, ...props }, forwardedRef) => {
    const messages = useNexubMessages();
    const ref = React.useRef<HTMLElement>(null);
    // 10.5: one pill slides to the active item's pill.
    useSlidingIndicator(ref, '[aria-current="page"] [data-nx="rail-pill"]');
    return (
    <nav
      ref={useMergedRefs(ref, forwardedRef)}
      aria-label={ariaLabel ?? messages.mainNavigation}
      className={cn('group/rail relative flex h-full w-20 shrink-0 flex-col items-center gap-3 py-4', className)}
      {...props}
    >
      {/* Hidden until the hook has measured (server HTML, no JS): until then the active pill paints its own fill. */}
      <span
        aria-hidden="true"
        data-nx="rail-indicator"
        className={cn(
          'pointer-events-none absolute left-0 top-0 hidden rounded-full bg-[var(--nav-active-bg,var(--color-secondary-container))]',
          'h-[var(--nx-ind-h,0px)] w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] translate-y-[var(--nx-ind-y,0px)] opacity-[var(--nx-ind-o,0)]',
          '[[data-nx-indicator=ready]>&]:block [[data-nx-indicator=ready]>&]:transition-transform [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
        )}
      />
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
          data-nx="rail-pill"
          data-active={active ? '' : undefined}
          className={cn(
            'relative grid h-8 w-14 place-items-center rounded-full [&>svg]:h-5 [&>svg]:w-5',
            'transition-[color] duration-effects-fast ease-effects-fast',
            'before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-0',
            'before:transition-opacity before:duration-effects-fast before:ease-effects-fast',
            'group-hover:before:opacity-[var(--state-hover)] group-active:before:opacity-[var(--state-pressed)]',
            active
              ? 'bg-[var(--nav-active-bg,var(--color-secondary-container))] text-[var(--nav-active-fg,var(--color-on-secondary-container))] group-data-[nx-indicator=ready]/rail:bg-transparent'
              : 'text-[var(--color-on-surface-variant)]',
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            'text-label-md transition-[color] duration-effects-fast ease-effects-fast',
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
