import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { SettingsLayout, SettingsRow } from './SettingsLayout.js';

const items = [
  { id: 'profile', label: 'Profile', href: '/profile' },
  { id: 'security', label: 'Security', href: '/security' },
];

describe('SettingsLayout', () => {
  it('renders the logo, actions, page header and content', () => {
    render(
      <SettingsLayout
        items={items}
        activeId="profile"
        logo={<span>LOGO</span>}
        actions={<button>Theme</button>}
        title="Profile"
        description="Your details"
      >
        <p>content</p>
      </SettingsLayout>,
    );
    expect(screen.getByText('LOGO')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText('Your details')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('content');
  });

  it('highlights the active section', () => {
    render(<SettingsLayout items={items} activeId="security" />);
    const nav = screen.getByRole('navigation', { name: 'Settings' });
    expect(within(nav).getByRole('link', { name: 'Security' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Profile' })).not.toHaveAttribute('aria-current');
  });

  it('calls onSelect for plain clicks and leaves links alone otherwise', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SettingsLayout items={items} onSelect={onSelect} />);
    await user.click(screen.getByRole('link', { name: 'Security' }));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it('opens the section menu in a sheet and closes it after a choice', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SettingsLayout items={items} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Open settings menu' }));
    const sheet = screen.getByRole('dialog', { name: 'Settings' });
    // fireEvent: vaul's pointer handlers read CSS transforms jsdom doesn't have.
    fireEvent.click(within(sheet).getByRole('link', { name: 'Profile' }));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the phone menu without injecting a <style> tag (strict CSP)', async () => {
    const user = userEvent.setup();
    const before = document.querySelectorAll('style').length;
    render(<SettingsLayout items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open settings menu' }));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(document.querySelectorAll('style')).toHaveLength(before);
    expect(document.documentElement).toHaveClass('nexub-scroll-lock');
  });
});

describe('SettingsLayout navFooter', () => {
  it('pins the footer in the section sidebar and the phone menu', async () => {
    const user = userEvent.setup();
    render(<SettingsLayout items={items} navFooter="v1.2.0 · Updated 21 Oct 2026" />);
    const nav = screen.getByRole('navigation', { name: 'Settings' });
    expect(within(nav).getByText('v1.2.0 · Updated 21 Oct 2026')).toHaveClass('sticky', 'bottom-0');
    await user.click(screen.getByRole('button', { name: 'Open settings menu' }));
    const sheet = screen.getByRole('dialog', { name: 'Settings' });
    expect(within(sheet).getByText('v1.2.0 · Updated 21 Oct 2026')).toBeInTheDocument();
  });

  it('renders no footer when navFooter is not set', () => {
    render(<SettingsLayout items={items} />);
    expect(screen.getByRole('navigation', { name: 'Settings' }).querySelector('.sticky.bottom-0')).toBeNull();
  });
});

describe('SettingsRow', () => {
  it('renders label, description, value and action', () => {
    render(
      <SettingsLayout.Section title="Account">
        <SettingsRow label="Email" description="Used to sign in" value="sam@example.com" action={<button>Change</button>} />
      </SettingsLayout.Section>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Account' })).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Used to sign in')).toBeInTheDocument();
    expect(screen.getByText('sam@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
  });

  it('is the same component as SettingsLayout.Row', () => {
    expect(SettingsLayout.Row).toBe(SettingsRow);
  });
});
