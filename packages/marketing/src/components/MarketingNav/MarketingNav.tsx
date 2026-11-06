'use client';

import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';
import { Drawer } from '@nexub/react/Drawer';
import { DropdownMenu } from '@nexub/react/DropdownMenu';
import { Flag } from '@nexub/react/Flag';
import { IconButton } from '@nexub/react/IconButton';
import { NavigationMenu } from '@nexub/react/NavigationMenu';
import { TopNav } from '@nexub/react/TopNav';
import { ChevronDown, Menu } from '@nexub/icons';

export interface MarketingNavLink {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

export type MarketingNavItem = MarketingNavLink | { label: string; items: MarketingNavLink[] };

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
  /** Top-level links; an item with `items` opens a mega-menu. */
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

const linkClass =
  'nx-state-layer flex flex-col gap-0.5 rounded-shape-control p-3 text-[var(--color-on-surface)] no-underline';

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
    return (
      <TopNav.Root ref={ref} surface="glass" scrollEdge="soft" className={cn('border-x-0 border-t-0 px-0', className)} {...props}>
        <Container size="marketing" className="flex items-center gap-6">
          {/* Without logoLabel the link takes the logo's own name ("Nexub"), so the visible
              wordmark is the accessible name (WCAG 2.5.3 Label in Name). */}
          <a href={logoHref} aria-label={logoLabel} className="flex shrink-0 items-center no-underline">
            {logo}
          </a>

          <NavigationMenu.Root className="hidden lg:flex" aria-label="Main">
            <NavigationMenu.List>
              {items.map((item) =>
                hasItems(item) ? (
                  <NavigationMenu.Item key={item.label}>
                    <NavigationMenu.Trigger>{item.label}</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      <ul className="m-0 grid w-[min(36rem,90vw)] list-none grid-cols-2 gap-1 p-2">
                        {item.items.map((link) => (
                          <li key={link.href}>
                            <NavigationMenu.Link href={link.href} className={linkClass}>
                              <span className="flex items-center gap-2 text-title-sm">
                                {link.icon && <span aria-hidden="true">{link.icon}</span>}
                                {link.label}
                              </span>
                              {link.description && (
                                <span className="text-body-sm text-[var(--color-on-surface-variant)]">{link.description}</span>
                              )}
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={item.href}>
                    <NavigationMenu.Link href={item.href}>{item.label}</NavigationMenu.Link>
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
                    <a href={c.href} aria-current={c.code === current.code ? 'true' : undefined}>
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
                  {items.map((item) =>
                    hasItems(item) ? (
                      <div key={item.label} className="flex flex-col gap-1">
                        <p className="m-0 px-3 text-label-md text-[var(--color-on-surface-muted)]">{item.label}</p>
                        {item.items.map((link) => (
                          <a key={link.href} href={link.href} className={linkClass}>
                            <span className="text-title-sm">{link.label}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <a key={item.href} href={item.href} className={cn(linkClass, 'text-title-sm')}>
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
