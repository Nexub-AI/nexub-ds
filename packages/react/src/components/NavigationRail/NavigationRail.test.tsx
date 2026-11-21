import axe from 'axe-core';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavigationRail } from './NavigationRail.js';

describe('NavigationRail', () => {
  it('is a labelled nav landmark with a list of links', () => {
    render(
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="/home" icon={<svg />} label="Home" active />
        <NavigationRail.Item href="/files" icon={<svg />} label="Files" />
      </NavigationRail.Root>,
    );
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Files' })).not.toHaveAttribute('aria-current');
  });

  it('renders a router link via asChild, keeping the icon and label inside it', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
      (props, ref) => <a ref={ref} data-router="" {...props} />,
    );
    render(
      <NavigationRail.Root>
        <NavigationRail.Item asChild icon={<svg data-testid="icon" />} label="Settings" active>
          <RouterLink href="/settings" />
        </NavigationRail.Item>
      </NavigationRail.Root>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toContainElement(screen.getByTestId('icon'));
  });
});

describe('NavigationRail 10.3', () => {
  it('marks the active pill for the expression layers', () => {
    const { container } = render(
      <NavigationRail.Root>
        <NavigationRail.Item href="/a" icon={<svg />} label="Home" active />
        <NavigationRail.Item href="/b" icon={<svg />} label="Pay" />
      </NavigationRail.Root>,
    );
    const pills = container.querySelectorAll('[data-nx="rail-pill"]');
    expect(pills).toHaveLength(2);
    expect(pills[0]!.hasAttribute('data-active')).toBe(true);
    expect(pills[1]!.hasAttribute('data-active')).toBe(false);
  });
});

describe('NavigationRail sliding pill (10.5)', () => {
  it('measures the active pill; the pill keeps its own fill until the indicator is ready', () => {
    const { container } = render(
      <NavigationRail.Root>
        <NavigationRail.Item href="/a" icon={<svg />} label="Home" active />
        <NavigationRail.Item href="/b" icon={<svg />} label="Pay" />
      </NavigationRail.Root>,
    );
    expect(container.querySelectorAll('[data-nx="rail-indicator"]')).toHaveLength(1);
    expect(screen.getByRole('navigation').style.getPropertyValue('--nx-ind-o')).toBe('1');
    const pill = container.querySelector('[data-nx="rail-pill"][data-active]')!;
    expect(pill).toHaveClass('bg-[var(--nav-active-bg,var(--color-secondary-container))]', 'group-data-[nx-indicator=ready]/rail:bg-transparent');
  });
});

describe('NavigationRail 11.5', () => {
  it('orientation="bottom" is a tab bar row with safe-area padding and no header', () => {
    render(
      <NavigationRail.Root orientation="bottom" header={<button type="button">Compose</button>}>
        <NavigationRail.Item href="/a" icon={<svg />} label="Home" active />
        <NavigationRail.Item href="/b" icon={<svg />} label="Inbox" />
      </NavigationRail.Root>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-orientation', 'bottom');
    expect(nav.className).toContain('sticky');
    expect(nav.className).toContain('env(safe-area-inset-bottom)');
    expect(screen.getByRole('list').className).toContain('flex-row');
    expect(screen.queryByRole('button', { name: 'Compose' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' }).className).toContain('min-h-12');
  });

  it('badge: a count or a dot, with an accessible label', () => {
    const { container } = render(
      <NavigationRail.Root>
        <NavigationRail.Item href="/a" icon={<svg />} label="Inbox" badge={3} />
        <NavigationRail.Item href="/b" icon={<svg />} label="Feed" badge />
        <NavigationRail.Item href="/c" icon={<svg />} label="Chat" badge={120} />
        <NavigationRail.Item href="/d" icon={<svg />} label="Builds" badge={2} badgeLabel="2 failed" />
        <NavigationRail.Item href="/e" icon={<svg />} label="Files" badge={0} />
      </NavigationRail.Root>,
    );
    expect(screen.getByRole('link', { name: 'Inbox, 3 unread' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Feed, New' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Builds, 2 failed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Files' })).toBeInTheDocument();
    const badges = container.querySelectorAll('[data-nx="rail-badge"]');
    expect(Array.from(badges, (b) => b.textContent)).toEqual(['3', '', '99+', '2']);
  });
});

it('bottom bar with badges has no axe violations', async () => {
  const { container } = render(
    <NavigationRail.Root orientation="bottom">
      <NavigationRail.Item href="/a" icon={<svg aria-hidden="true" />} label="Home" active />
      <NavigationRail.Item href="/b" icon={<svg aria-hidden="true" />} label="Inbox" badge={4} />
      <NavigationRail.Item href="/c" icon={<svg aria-hidden="true" />} label="Feed" badge />
    </NavigationRail.Root>,
  );
  const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  expect(violations.map((v) => v.id)).toEqual([]);
});
