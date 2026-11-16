'use client';

import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { safeHref } from '@nexub/react/safeHref';
import { Container } from '@nexub/react/Container';
import { Drawer } from '@nexub/react/Drawer';
import { DropdownMenu } from '@nexub/react/DropdownMenu';
import { Flag } from '@nexub/react/Flag';
import { IconButton } from '@nexub/react/IconButton';
import { NavigationMenu } from '@nexub/react/NavigationMenu';
import { TopNav } from '@nexub/react/TopNav';
import type { DivisionKey } from '@nexub/react/Card';
import { ChevronDown, Menu } from '@nexub/icons';

export interface MarketingNavLink {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  /** Short status after the label, e.g. "Coming soon". Part of the link's accessible name. */
  badge?: React.ReactNode;
}

export interface MarketingNavColumn {
  title: string;
  /** Makes the column heading a link, e.g. to the division page. */
  href?: string;
  description?: string;
  /** Tints the heading with a division's colour (sets `data-division`; needs `@nexub/themes/divisions`). */
  accent?: DivisionKey;
  links: MarketingNavLink[];
}

export interface MarketingNavGroup {
  label: string;
  /** Up to 5 columns in a panel as wide as the container. */
  columns: MarketingNavColumn[];
  /** A strip of links under the columns, e.g. "All products". */
  footer?: MarketingNavLink[];
  /** One promo card: beside up to 3 columns, under 4 or 5. */
  feature?: React.ReactNode;
}

export type MarketingNavItem = MarketingNavLink | { label: string; items: MarketingNavLink[] } | MarketingNavGroup;

export interface MarketingCountry {
  /** ISO 3166-1 alpha-2, e.g. 'SG'. */
  code: string;
  label: string;
  href: string;
}

export interface MarketingNavProps extends React.HTMLAttributes<HTMLElement> {
  /** e.g. <Logo />, wrapped in a link to `logoHref`. */
  logo: React.ReactNode;
  logoHref?: string;
  /** Accessible name for the logo link. Defaults to the logo's own name; set it only if it still contains the visible wordmark. */
  logoLabel?: string;
  /** Top-level links; an item with `items` opens a mega-menu, one with `columns` a grouped mega-menu. */
  items: MarketingNavItem[];
  countries?: MarketingCountry[];
  /** Current country code. */
  country?: string;
  /** @default 'Choose country' */
  countryLabel?: string;
  /** Sign in / Get started. */
  actions?: React.ReactNode;
  /** @default 'Open menu' */
  menuLabel?: string;
}

const hasItems = (i: MarketingNavItem): i is { label: string; items: MarketingNavLink[] } => 'items' in i;
const hasColumns = (i: MarketingNavItem): i is MarketingNavGroup => 'columns' in i;

// NavigationMenu.Link drops the outline (outline-none), so the focus ring is restated here: the
// same ring as everywhere else, in the division's colour inside a tinted column.
const linkClass =
  'nx-state-layer flex flex-col gap-0.5 rounded-shape-control p-3 text-[var(--color-on-surface)] no-underline focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring-default)]';
const headingClass = 'px-3 text-label-lg text-[var(--color-on-surface)] [[data-division]_&]:text-[var(--color-tertiary)]';
// Static class names (Tailwind reads them from the source). 5 columns wrap 3 + 2 below xl.
const columnGrid = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-3 xl:grid-cols-5'];

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-[var(--color-surface-container-high)] px-2 py-0.5 text-label-sm font-medium text-[var(--color-on-surface-variant)] ring-1 ring-inset ring-[var(--color-outline-variant)]">
    {children}
  </span>
);

/** Label row + description, shared by the panel and the drawer. */
const LinkBody = ({ link, compact }: { link: MarketingNavLink; compact?: boolean }) => (
  <>
    <span className="flex flex-wrap items-center gap-2 text-title-sm">
      {link.icon && <span aria-hidden="true">{link.icon}</span>}
      {link.label}
      {/* The space keeps label and badge apart in the accessible name ("Forms Early access"). */}
      {link.badge && <>{' '}<Badge>{link.badge}</Badge></>}
    </span>
    {!compact && link.description && (
      <span className="text-body-sm text-[var(--color-on-surface-variant)]">{link.description}</span>
    )}
  </>
);

/** One column: a labelled list. The title is a link when the column has an href. */
function Column({ column, id, link: Link }: { column: MarketingNavColumn; id: string; link: React.ElementType }) {
  return (
    <div data-division={column.accent} className="flex min-w-0 flex-col gap-1">
      {column.href ? (
        <Link id={id} href={safeHref(column.href)} className={cn(linkClass, headingClass, 'py-2')}>
          {column.title}
          {column.description && ' '}
          {column.description && <span className="text-body-sm font-normal text-[var(--color-on-surface-variant)]">{column.description}</span>}
        </Link>
      ) : (
        <p id={id} className={cn(headingClass, 'm-0 py-2')}>{column.title}</p>
      )}
      <ul aria-labelledby={id} className="m-0 flex list-none flex-col gap-0.5 p-0">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link href={safeHref(link.href)} className={linkClass}>
              <LinkBody link={link} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Drawer: one column as an accordion section. The title stays a link; the button beside it opens the list. */
function DrawerSection({ column, id }: { column: MarketingNavColumn; id: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div data-division={column.accent}>
      <div className="flex items-center">
        {column.href ? (
          <a id={id} href={safeHref(column.href)} className={cn(linkClass, headingClass, 'flex-1')}>{column.title}</a>
        ) : (
          <p id={id} className={cn(headingClass, 'm-0 flex-1 py-3')}>{column.title}</p>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-links`}
          aria-labelledby={id}
          onClick={() => setOpen((o) => !o)}
          className="nx-state-layer inline-flex size-11 shrink-0 items-center justify-center rounded-shape-control text-[var(--color-on-surface-variant)]"
        >
          <ChevronDown size={16} aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      <ul id={`${id}-links`} aria-labelledby={id} hidden={!open} className="m-0 list-none p-0 ps-3">
        {column.links.map((link) => (
          <li key={link.href}>
            <a href={safeHref(link.href)} className={linkClass}><LinkBody link={link} compact /></a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The site header: logo, links with mega-menus, country switcher and actions.
 * Below `lg` the links move into a side sheet.
 */
export const MarketingNav = React.forwardRef<HTMLElement, MarketingNavProps>(
  (
    {
      logo,
      logoHref = '/',
      logoLabel,
      items,
      countries,
      country,
      countryLabel = 'Choose country',
      actions,
      menuLabel = 'Open menu',
      className,
      ...props
    },
    ref,
  ) => {
    const current = countries?.find((c) => c.code === country) ?? countries?.[0];
    const uid = React.useId();
    // A grouped menu is as wide as the container: the menu's viewport is then placed
    // against the Container (not the link list) and starts at its content edge; the panel
    // measures the Container (cqw), so it also fits a header narrower than the viewport.
    const wide = items.some(hasColumns);
    // No scrollEdge="soft": with @nexub/themes/glass it is a mask on the header, and a mask
    // clips everything outside the box, the open mega-menu included.
    return (
      <TopNav.Root ref={ref} surface="glass" className={cn('border-x-0 border-t-0 px-0', className)} {...props}>
        <Container size="marketing" className={cn('relative flex items-center gap-6', wide && '@container')}>
          {/* Without logoLabel the link takes the logo's own name ("Nexub"), so the visible
              wordmark is the accessible name (WCAG 2.5.3 Label in Name). */}
          <a href={safeHref(logoHref)} aria-label={logoLabel} className="flex shrink-0 items-center no-underline">
            {logo}
          </a>

          <NavigationMenu.Root
            className={cn('hidden lg:flex', wide && 'static [&>div:last-child]:inset-x-0 [&>div:last-child]:justify-start [&>div:last-child]:px-8')}
            aria-label="Main"
          >
            <NavigationMenu.List>
              {items.map((item, i) =>
                hasColumns(item) ? (
                  <NavigationMenu.Item key={item.label}>
                    <NavigationMenu.Trigger>{item.label}</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      <div className="flex w-[100cqw] flex-col gap-2 p-3">
                        <div className={cn('flex gap-3', item.columns.length > 3 ? 'flex-col' : 'flex-row')}>
                          <div className={cn('grid min-w-0 flex-1 gap-x-2 gap-y-4', columnGrid[Math.min(item.columns.length, 5)])}>
                            {item.columns.slice(0, 5).map((column, c) => (
                              <Column key={column.title} column={column} id={`${uid}n${i}c${c}`} link={NavigationMenu.Link} />
                            ))}
                          </div>
                          {item.feature && <div className={cn('shrink-0', item.columns.length <= 3 && 'w-72')}>{item.feature}</div>}
                        </div>
                        {item.footer && (
                          <ul className="m-0 flex list-none flex-wrap gap-1 border-0 border-t border-solid border-[var(--color-outline-variant)] p-0 pt-2">
                            {item.footer.map((link) => (
                              <li key={link.href}>
                                <NavigationMenu.Link href={safeHref(link.href)} className={linkClass}>
                                  <LinkBody link={link} compact />
                                </NavigationMenu.Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : hasItems(item) ? (
                  <NavigationMenu.Item key={item.label}>
                    <NavigationMenu.Trigger>{item.label}</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      <ul className="m-0 grid w-[min(36rem,90vw)] list-none grid-cols-2 gap-1 p-2">
                        {item.items.map((link) => (
                          <li key={link.href}>
                            <NavigationMenu.Link href={safeHref(link.href)} className={linkClass}>
                              <LinkBody link={link} />
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={item.href}>
                    <NavigationMenu.Link href={safeHref(item.href)}>{item.label}</NavigationMenu.Link>
                  </NavigationMenu.Item>
                ),
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="flex-1" />

          {current && countries && countries.length > 1 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                // Starts with the visible code so the name contains the label (WCAG 2.5.3).
                aria-label={`${current.code}, ${countryLabel}: ${current.label}`}
                className="nx-state-layer inline-flex h-control-sm items-center gap-1.5 rounded-shape-control px-2 text-label-lg text-[var(--color-on-surface)]"
              >
                <Flag code={current.code} size="sm" aria-hidden="true" />
                <span>{current.code}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                {countries.map((c) => (
                  <DropdownMenu.Item key={c.code} asChild>
                    <a href={safeHref(c.href)} aria-current={c.code === current.code ? 'true' : undefined}>
                      <Flag code={c.code} size="sm" aria-hidden="true" />
                      {c.label}
                    </a>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}

          {actions && <div className="hidden items-center gap-2 sm:flex">{actions}</div>}

          <Drawer.Root direction="right">
            <Drawer.Trigger asChild>
              <IconButton label={menuLabel} className="lg:hidden">
                <Menu size={20} />
              </IconButton>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay />
              <Drawer.Content side="right" className="w-[min(22rem,88vw)] overflow-y-auto p-4">
                <Drawer.Title className="sr-only">{menuLabel}</Drawer.Title>
                <nav aria-label="Main" className="flex flex-col gap-4">
                  {items.map((item, i) =>
                    hasColumns(item) ? (
                      <div key={item.label} className="flex flex-col gap-1">
                        <p className="m-0 px-3 text-label-md text-[var(--color-on-surface-muted)]">{item.label}</p>
                        {item.columns.map((column, c) => (
                          <DrawerSection key={column.title} column={column} id={`${uid}d${i}c${c}`} />
                        ))}
                        {item.footer?.map((link) => (
                          <a key={link.href} href={safeHref(link.href)} className={linkClass}><LinkBody link={link} compact /></a>
                        ))}
                        {item.feature}
                      </div>
                    ) : hasItems(item) ? (
                      <div key={item.label} className="flex flex-col gap-1">
                        <p className="m-0 px-3 text-label-md text-[var(--color-on-surface-muted)]">{item.label}</p>
                        {item.items.map((link) => (
                          <a key={link.href} href={safeHref(link.href)} className={linkClass}>
                            <LinkBody link={link} compact />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <a key={item.href} href={safeHref(item.href)} className={cn(linkClass, 'text-title-sm')}>
                        {item.label}
                      </a>
                    ),
                  )}
                  {actions && <div className="flex flex-col gap-2 pt-2 sm:hidden">{actions}</div>}
                </nav>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </Container>
      </TopNav.Root>
    );
  },
);
MarketingNav.displayName = 'MarketingNav';
