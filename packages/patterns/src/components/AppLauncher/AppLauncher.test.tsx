import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { AppLauncher, type AppLauncherApp } from './AppLauncher.js';

const apps: AppLauncherApp[] = [
  { id: 'hub', name: 'Command Hub', href: '/hub', icon: '/hub.svg', current: true },
  { id: 'account', name: 'Account', href: '/account', icon: '/account.svg' },
  { id: 'books', name: 'Bookub', href: '/books' },
  { id: 'pay', name: 'Payub', href: '/pay' },
];

async function open() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Nexub apps' }));
  return user;
}

describe('AppLauncher', () => {
  it('renders nothing when there are no apps', () => {
    const { container } = render(<AppLauncher apps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens a menu with one link per app and marks the current one', async () => {
    render(<AppLauncher apps={apps} />);
    await open();
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Command Hub' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Account' })).not.toHaveAttribute('aria-current');
  });

  it('shows initials when the icon is missing or fails to load', async () => {
    render(<AppLauncher apps={apps} />);
    await open();
    expect(screen.getByText('B')).toBeInTheDocument(); // Bookub, no icon
    const img = screen.getByRole('link', { name: 'Account' }).querySelector('img')!;
    fireEvent.error(img);
    expect(screen.getByRole('link', { name: 'Account' }).querySelector('img')).toBeNull();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('moves focus through the grid with arrow keys', async () => {
    render(<AppLauncher apps={apps} />);
    const user = await open();
    const [hub, account, , pay] = screen.getAllByRole('link');
    expect(hub).toHaveFocus(); // opens on the current app
    await user.keyboard('{ArrowRight}');
    expect(account).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('link').at(-1)).toHaveFocus(); // clamps to the last tile
    await user.keyboard('{Home}');
    expect(hub).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(pay).toHaveFocus();
  });

  it('calls onNavigate instead of following the link, then closes', async () => {
    const onNavigate = vi.fn();
    render(<AppLauncher apps={apps} onNavigate={onNavigate} />);
    const user = await open();
    await user.click(screen.getByRole('link', { name: 'Account' }));
    expect(onNavigate).toHaveBeenCalledWith(apps[1]);
    expect(screen.queryByRole('link', { name: 'Account' })).not.toBeInTheDocument();
  });

  it('applies the glass material', async () => {
    render(<AppLauncher apps={apps} surface="glass" />);
    await open();
    expect(screen.getByRole('dialog', { name: 'Nexub apps' })).toHaveAttribute('data-material', 'glass');
  });
});
