import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppShell } from './AppShell.js';

describe('AppShell', () => {
  it('Main is a positioning context, so absolute children and sr-only labels stay inside it (12.2)', () => {
    render(<AppShell.Main className="p-4">Page</AppShell.Main>);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('relative', 'flex-1', 'overflow-y-auto', 'p-4');
  });

  it('renders root element', () => {
    render(<AppShell.Root data-testid="root" />);
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });

  it('renders header slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Header data-testid="header">Header content</AppShell.Header>
      </AppShell.Root>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders sidebar slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Sidebar data-testid="sidebar">Sidebar content</AppShell.Sidebar>
        </AppShell.Body>
      </AppShell.Root>,
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });

  it('renders main slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Main data-testid="main">Page content</AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(<AppShell.Root className="custom-class" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-class');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AppShell.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('mobile navigation drawer (10.6)', () => {
    const shell = (props: React.ComponentProps<typeof AppShell.Root> = {}) => (
      <AppShell.Root {...props}>
        <AppShell.Header>
          <AppShell.NavTrigger label="Open navigation" drawerBelow="lg" />
        </AppShell.Header>
        <AppShell.Body>
          <AppShell.Sidebar data-testid="slot" drawerBelow="lg" drawerLabel="Navigation">
            <a href="#reports">Reports</a>
            <button type="button">Not a link</button>
          </AppShell.Sidebar>
        </AppShell.Body>
      </AppShell.Root>
    );

    it('without drawerBelow the slot is unchanged and there is no drawer', () => {
      render(
        <AppShell.Root>
          <AppShell.Sidebar data-testid="slot">Nav</AppShell.Sidebar>
        </AppShell.Root>,
      );
      expect(screen.getByTestId('slot').className).toBe('shrink-0 overflow-y-auto');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hides the slot and shows the trigger below the breakpoint only (CSS)', () => {
      render(shell());
      expect(screen.getByTestId('slot')).toHaveClass('max-lg:hidden');
      const trigger = screen.getByRole('button', { name: 'Open navigation' });
      expect(trigger).toHaveClass('lg:hidden');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('the trigger opens the sidebar in a drawer; a link inside closes it', async () => {
      const onOpenChange = vi.fn();
      render(shell({ onOpenChange }));
      fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
      const dialog = await screen.findByRole('dialog', { name: 'Navigation' });
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(dialog).toHaveClass('lg:hidden');

      const inDrawer = (name: string, role: 'link' | 'button') =>
        screen.getAllByRole(role, { name, hidden: true }).find((el) => dialog.contains(el))!;
      fireEvent.click(inDrawer('Not a link', 'button'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      fireEvent.click(inDrawer('Reports', 'link'));
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'));
    });

    it('open on Root controls the drawer', async () => {
      const { rerender } = render(shell({ open: true }));
      const dialog = await screen.findByRole('dialog', { name: 'Navigation' });
      expect(dialog).toHaveAttribute('data-state', 'open');
      rerender(shell({ open: false }));
      await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'));
    });
  });
});
