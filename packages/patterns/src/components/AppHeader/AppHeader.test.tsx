import { describe, it, expect, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AppShell, ThemeProvider } from '@nexub/react';
import { AppHeader, type AppHeaderProps } from './AppHeader.js';
import { SettingsLayout } from '../SettingsLayout/SettingsLayout.js';

const orgs = [
  { id: 'acme', name: 'Acme' },
  { id: 'globex', name: 'Globex' },
];

function setup(props: Partial<AppHeaderProps> = {}) {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <AppHeader productName="Command Hub" {...props} />
      <input aria-label="Notes" />
    </ThemeProvider>,
  );
  return user;
}

const items = (onSelect = vi.fn()) => [
  {
    label: 'Projects',
    items: [
      { id: 'p1', label: 'Apollo', hint: 'Project', onSelect },
      { id: 'p2', label: 'Gemini', onSelect },
    ],
  },
];

describe('AppHeader', () => {
  it('is a banner with a nav, a home link and a spacer', async () => {
    const onNavigate = vi.fn();
    const user = setup({ homeHref: '/home', onNavigate });
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('fixed');
    expect(within(banner).getByRole('navigation', { name: 'Account and apps' })).toBeInTheDocument();
    const home = within(banner).getByRole('link', { name: 'Nexub Command Hub' });
    expect(home).toHaveAttribute('href', '/home');
    await user.click(home);
    expect(onNavigate).toHaveBeenCalledWith('/home');
    expect(banner.nextElementSibling).toHaveClass('h-[var(--app-header-height,64px)]');
  });

  it('renders the menu slot', () => {
    setup({ menu: <button>Open menu</button> });
    expect(screen.getByRole('button', { name: 'Open menu' }).parentElement).toHaveClass('md:hidden');
  });

  describe('organization', () => {
    it('renders nothing with no orgs', () => {
      setup({ showThemeSwitch: false });
      expect(screen.getByRole('navigation')).toBeEmptyDOMElement();
    });

    it('shows one org as plain text', () => {
      setup({ orgs: [orgs[0]!] });
      expect(screen.getByText('Acme').tagName).toBe('SPAN');
      expect(screen.queryByRole('button', { name: /switch organization/ })).not.toBeInTheDocument();
    });

    it('switches between several orgs by keyboard', async () => {
      const onOrgChange = vi.fn();
      const user = setup({ orgs, currentOrgId: 'globex', onOrgChange });
      screen.getByRole('button', { name: 'Globex, switch organization' }).focus();
      await user.keyboard('{Enter}');
      const current = screen.getByRole('menuitemradio', { name: 'Globex' });
      expect(current).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('menuitemradio', { name: 'Acme' })).toHaveAttribute('aria-checked', 'false');
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('menuitemradio', { name: 'Acme' })).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(onOrgChange).toHaveBeenCalledWith('acme');
    });
  });

  describe('search', () => {
    it('opens from the button, filters, selects with Enter and returns focus', async () => {
      const onSelect = vi.fn();
      const user = setup({ searchItems: items(onSelect) });
      const [field] = screen.getAllByRole('button', { name: 'Search Command Hub' });
      expect(field).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K /');
      expect(field).toHaveAccessibleDescription(/^Keyboard shortcut: (Command|Control) K$/);
      await user.click(field!);
      expect(screen.getByRole('dialog', { name: 'Search Command Hub' })).toBeInTheDocument();
      await user.keyboard('gem');
      expect(screen.queryByText('Apollo')).not.toBeInTheDocument();
      await user.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(field).toHaveFocus());
    });

    it('closes on Escape and returns focus', async () => {
      const user = setup({ searchItems: items() });
      const [field] = screen.getAllByRole('button', { name: 'Search Command Hub' });
      await user.click(field!);
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(field).toHaveFocus());
    });

    it('opens with Ctrl+K anywhere, and with / outside text fields', async () => {
      const user = setup({ searchItems: items() });
      await user.keyboard('{Control>}k{/Control}');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.keyboard('{Escape}');

      await user.click(screen.getByRole('textbox', { name: 'Notes' }));
      await user.keyboard('/');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('/');

      screen.getByRole('textbox', { name: 'Notes' }).blur();
      await user.keyboard('/');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('debounces async search and shows loading, results and empty states', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const onSearch = vi.fn(async (q: string) => (q === 'apo' ? items() : []));
      const user = setup({ onSearch });
      await user.keyboard('{Control>}k{/Control}');
      await user.keyboard('apo');
      expect(screen.getByRole('status')).toHaveTextContent('Searching…');
      await act(() => vi.advanceTimersByTimeAsync(250));
      // One call for the final query, not one per keystroke.
      expect(onSearch).toHaveBeenLastCalledWith('apo');
      expect(onSearch.mock.calls.filter(([q]) => q !== '')).toHaveLength(1);
      expect(screen.getByRole('option', { name: /Apollo/ })).toBeInTheDocument();
      await user.keyboard('x');
      await act(() => vi.advanceTimersByTimeAsync(250));
      expect(screen.getByText('No results for “apox”')).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe('account menu', () => {
    const user = { name: 'Sam Lee', email: 'sam@example.com' };

    it('shows name, email, links and sign out; legal links only when set', async () => {
      const u = setup({ user, accountHref: '/account', privacyHref: '/privacy', accountMenuItems: <span>Extra</span>, onSignOut: vi.fn() });
      await u.click(screen.getByRole('button', { name: 'Account: Sam Lee' }));
      const menu = screen.getByRole('menu');
      expect(within(menu).getByText('Sam Lee')).toHaveClass('text-title-sm');
      expect(within(menu).getByText('sam@example.com')).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Manage your Nexub Account' })).toHaveAttribute('href', '/account');
      expect(within(menu).getByRole('menuitem', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
      expect(within(menu).queryByText('Terms of service')).not.toBeInTheDocument();
      expect(within(menu).getAllByRole('separator')).toHaveLength(2);
      expect(within(menu).getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
    });

    it('offers the glass intensity dial only on a glass header', async () => {
      const u = setup({ user, surface: 'glass' });
      await u.click(screen.getByRole('button', { name: 'Account: Sam Lee' }));
      const solid = within(screen.getByRole('menu')).getByRole('menuitemradio', { name: 'Solid' });
      await u.click(solid);
      expect(document.documentElement.getAttribute('data-glass')).toBe('off');
      expect(solid).toHaveAttribute('aria-checked', 'true');
    });

    it('has no glass dial on a solid header', async () => {
      const u = setup({ user });
      await u.click(screen.getByRole('button', { name: 'Account: Sam Lee' }));
      expect(within(screen.getByRole('menu')).queryByRole('menuitemradio', { name: 'Solid' })).not.toBeInTheDocument();
    });

    it('disables Sign out while it is pending', async () => {
      let resolve!: () => void;
      const onSignOut = vi.fn(() => new Promise<void>((r) => (resolve = r)));
      const u = setup({ user, onSignOut });
      screen.getByRole('button', { name: 'Account: Sam Lee' }).focus();
      await u.keyboard('{Enter}');
      await u.click(screen.getByRole('menuitem', { name: 'Sign out' }));
      const item = screen.getByRole('menuitem', { name: 'Signing out…' });
      expect(item).toHaveAttribute('aria-disabled', 'true');
      await u.click(item);
      expect(onSignOut).toHaveBeenCalledTimes(1);
      await act(async () => resolve());
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('switches theme through useTheme', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('opens search, org and account menus without injecting a <style> tag (strict CSP)', async () => {
    const before = document.querySelectorAll('style').length;
    const user = setup({ searchItems: items(), orgs, user: { name: 'Sam Lee' }, onSignOut: vi.fn() });
    await user.click(screen.getAllByRole('button', { name: 'Search Command Hub' })[0]!);
    expect(document.documentElement).toHaveClass('nexub-scroll-lock');
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: /switch organization/ }));
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Account: Sam Lee' }));
    expect(document.querySelectorAll('style')).toHaveLength(before);
    expect(screen.getByRole('banner').querySelectorAll('[style]')).toHaveLength(0);
  });

  it('sits in AppShell.Header with Body below it', () => {
    render(
      <AppShell.Root>
        <AppShell.Header>
          <AppHeader showThemeSwitch={false} />
        </AppShell.Header>
        <AppShell.Body>body</AppShell.Body>
      </AppShell.Root>,
    );
    // The spacer gives the auto-height header row the header's height.
    const slot = screen.getByRole('banner').parentElement!;
    expect(slot.lastElementChild).toHaveClass('h-[var(--app-header-height,64px)]');
  });

  it('takes SettingsLayout\'s phone menu button in its menu slot', async () => {
    const user = userEvent.setup();
    render(
      <SettingsLayout
        items={[{ id: 'profile', label: 'Profile', href: '#' }]}
        header={(menu) => <AppHeader menu={menu} showThemeSwitch={false} />}
      />,
    );
    const banner = screen.getByRole('banner');
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    await user.click(within(banner).getByRole('button', { name: 'Open settings menu' }));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  });
});
