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
  /** Optional slot above the items, e.g. a primary action or logo. Not shown when `orientation="bottom"`. */
  header?: React.ReactNode;
  /**
   * 11.5: `bottom` is a phone tab bar: a row stuck to the bottom of the
   * viewport with safe-area padding. Put it after the page content.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'bottom';
}

const Bottom = React.createContext(false);

/**
 * Navigation for medium-width windows (M3 navigation rail): between TopNav
 * (compact) and Sidebar (expanded). Icons over labels, an active pill behind the icon.
 */
const Root = React.forwardRef<HTMLElement, NavigationRailRootProps>(
  ({ className, header, orientation = 'vertical', children, 'aria-label': ariaLabel, ...props }, forwardedRef) => {
    const bottom = orientation === 'bottom';
    const messages = useNexubMessages();
    const ref = React.useRef<HTMLElement>(null);
    // 10.5: one pill slides to the active item's pill.
    useSlidingIndicator(ref, '[aria-current="page"] [data-nx="rail-pill"]');
    return (
    <nav
      ref={useMergedRefs(ref, forwardedRef)}
      aria-label={ariaLabel ?? messages.mainNavigation}
      data-orientation={orientation}
      className={cn(
        'group/rail relative flex h-full w-20 shrink-0 flex-col items-center gap-3 py-4',
        bottom &&
          'sticky bottom-0 z-[var(--z-sticky,100)] h-auto w-full gap-0 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]',
        className,
      )}
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
      {header && !bottom && <div className="mb-3 flex flex-col items-center">{header}</div>}
      <ul className={cn('flex w-full items-center', bottom ? 'flex-row' : 'flex-col gap-1')} role="list">
        <Bottom.Provider value={bottom}>{children}</Bottom.Provider>
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
  /**
   * 11.5: a count (99+ above 99; nothing at 0) or `true` for a dot. Read after
   * the label as "3 unread" / "New"; set `badgeLabel` for other wording.
   */
  badge?: number | boolean;
  /** Accessible text for the badge, e.g. "3 failed builds". */
  badgeLabel?: string;
}

const Item = React.forwardRef<HTMLAnchorElement, NavigationRailItemProps>(
  ({ className, icon, label, active, asChild, children, badge, badgeLabel, ...props }, ref) => {
    const bottom = React.useContext(Bottom);
    const messages = useNexubMessages();
    const count = typeof badge === 'number' && badge > 0 ? badge : 0;
    const showBadge = count > 0 || badge === true;
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
          {showBadge && (
            <span
              aria-hidden="true"
              data-nx="rail-badge"
              className={cn(
                'absolute start-1/2 rounded-full bg-[var(--color-error)] text-[var(--color-on-error)]',
                count
                  ? 'top-0 ms-1 grid h-4 min-w-4 place-items-center px-1 text-label-sm leading-none tabular-nums'
                  : 'top-1 ms-2 size-1.5',
              )}
            >
              {count ? (count > 99 ? '99+' : count) : null}
            </span>
          )}
        </span>
        <span
          className={cn(
            'text-label-md transition-[color] duration-effects-fast ease-effects-fast',
            bottom && 'max-w-full truncate',
            active ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-variant)]',
          )}
        >
          {label}
          {showBadge && (
            <span className="sr-only">
              {`, ${badgeLabel ?? (count ? messages.unreadNotifications(count) : messages.newBadge)}`}
            </span>
          )}
        </span>
      </>
    );
    const shared = {
      ref,
      'aria-current': active ? ('page' as const) : undefined,
      className: cn(
        'group flex w-full flex-col items-center gap-1 rounded-shape-container py-1 no-underline select-none outline-offset-0',
        bottom && 'min-h-12 justify-center gap-0.5',
        className,
      ),
      ...props,
    };
    return (
      <li className={cn('w-full px-1', bottom && 'min-w-0 flex-1')}>
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
