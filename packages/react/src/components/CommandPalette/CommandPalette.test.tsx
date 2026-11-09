import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './CommandPalette.js';

describe('CommandPalette', () => {
  it('renders without crashing when closed', () => {
    // CommandPalette.Root wraps RadixDialog which renders nothing in the DOM
    // when open=false (the default). This smoke test verifies the component
    // tree can be constructed without throwing.
    expect(() =>
      render(
        <CommandPalette.Root open={false}>
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Empty>No results.</CommandPalette.Empty>
            <CommandPalette.Group heading="Suggestions">
              <CommandPalette.Item>Item one</CommandPalette.Item>
            </CommandPalette.Group>
          </CommandPalette.List>
        </CommandPalette.Root>,
      ),
    ).not.toThrow();
  });

  it('renders content when open', () => {
    const { getByPlaceholderText } = render(
      <CommandPalette.Root open>
        <CommandPalette.Input placeholder="Type a command..." />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>,
    );
    expect(getByPlaceholderText('Type a command...')).toBeInTheDocument();
  });

  it('renders items when open', () => {
    const { getByText } = render(
      <CommandPalette.Root open>
        <CommandPalette.List>
          <CommandPalette.Group heading="Actions">
            <CommandPalette.Item>Create project</CommandPalette.Item>
            <CommandPalette.Item>Open settings</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.List>
      </CommandPalette.Root>,
    );
    expect(getByText('Create project')).toBeInTheDocument();
    expect(getByText('Open settings')).toBeInTheDocument();
  });

  it('scrollLock="class" injects no <style> and locks with a class on <html>', () => {
    const before = document.querySelectorAll('style').length;
    const { getByRole, unmount } = render(
      <CommandPalette.Root open scrollLock="class" label="Search">
        <CommandPalette.Input placeholder="Search" />
      </CommandPalette.Root>,
    );
    expect(getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
    expect(document.querySelectorAll('style')).toHaveLength(before);
    expect(document.documentElement).toHaveClass('nexub-scroll-lock');
    unmount();
    expect(document.documentElement).not.toHaveClass('nexub-scroll-lock');
  });

  it('returns focus to the element focused before it opened', async () => {
    function Example() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <CommandPalette.Root open={open} onOpenChange={setOpen}>
            <CommandPalette.Input placeholder="Search" />
          </CommandPalette.Root>
        </>
      );
    }
    const user = userEvent.setup();
    const { getByRole, queryByRole } = render(<Example />);
    await user.click(getByRole('button', { name: 'Open' }));
    expect(getByRole('combobox')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('shortcut toggles the palette with Cmd or Ctrl', () => {
    render(
      <CommandPalette.Root shortcut="k">
        <CommandPalette.Input />
      </CommandPalette.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'K', ctrlKey: true });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(document, { key: 'k' }); // no modifier
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  describe('pages', () => {
    function Paged() {
      return (
        <CommandPalette.Root open>
          <CommandPalette.Input placeholder="Search" />
          <CommandPalette.List>
            <CommandPalette.Page>
              <CommandPalette.Item page="projects">Projects</CommandPalette.Item>
            </CommandPalette.Page>
            <CommandPalette.Page id="projects" title="All projects">
              <CommandPalette.Item>Nexub</CommandPalette.Item>
            </CommandPalette.Page>
          </CommandPalette.List>
        </CommandPalette.Root>
      );
    }

    it('an item opens its page, with a breadcrumb; Backspace on empty goes back', async () => {
      const user = userEvent.setup();
      render(<Paged />);
      expect(screen.queryByText('Nexub')).toBeNull();
      await user.type(screen.getByRole('combobox'), 'proj');
      await user.click(screen.getByText('Projects'));
      expect(screen.getByText('Nexub')).toBeInTheDocument();
      expect(screen.getByText('All projects')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue(''); // query cleared
      await user.type(screen.getByRole('combobox'), 'x{Backspace}');
      expect(screen.getByText('Nexub')).toBeInTheDocument(); // deleting text doesn't pop
      await user.keyboard('{Backspace}');
      expect(screen.queryByText('Nexub')).toBeNull();
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });
  });

  it('loading shows a loading row instead of Empty', () => {
    render(
      <CommandPalette.Root open loading>
        <CommandPalette.List>
          <CommandPalette.Empty>No results.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>,
    );
    expect(screen.getByRole('progressbar', { name: 'Loading…' })).toBeInTheDocument();
    expect(screen.queryByText('No results.')).toBeNull();
  });

  describe('recents', () => {
    beforeEach(() => localStorage.clear());

    function Recents({ onSelect }: { onSelect?: (v: string) => void }) {
      return (
        <CommandPalette.Root open recentKey="test-recents" recentLimit={2}>
          <CommandPalette.Input placeholder="Search" />
          <CommandPalette.List>
            <CommandPalette.Item onSelect={onSelect}>Alpha</CommandPalette.Item>
            <CommandPalette.Item>Beta</CommandPalette.Item>
            <CommandPalette.Item>Gamma</CommandPalette.Item>
          </CommandPalette.List>
        </CommandPalette.Root>
      );
    }

    it('keeps the last picks in localStorage and shows them while the query is empty', async () => {
      const user = userEvent.setup();
      const picked: string[] = [];
      const { unmount } = render(<Recents onSelect={(v) => picked.push(v)} />);
      expect(screen.queryByText('Recent')).toBeNull();
      await user.click(screen.getByText('Alpha'));
      await user.click(screen.getByText('Beta'));
      await user.click(screen.getByText('Gamma'));
      expect(JSON.parse(localStorage.getItem('test-recents')!).map((r: { label: string }) => r.label)).toEqual(['Gamma', 'Beta']);
      unmount();

      render(<Recents onSelect={(v) => picked.push(v)} />);
      const group = await screen.findByRole('group', { name: 'Recent' });
      expect(group).toHaveTextContent('GammaBeta');
      await user.type(screen.getByRole('combobox'), 'a');
      expect(screen.queryByRole('group', { name: 'Recent' })).toBeNull();
    });

    it('a recent row runs the real item', async () => {
      localStorage.setItem('test-recents', JSON.stringify([{ value: 'Alpha', label: 'Alpha' }]));
      const user = userEvent.setup();
      const picked: string[] = [];
      render(<Recents onSelect={(v) => picked.push(v)} />);
      const group = await screen.findByRole('group', { name: 'Recent' });
      await user.click(group.querySelector('[cmdk-item]')!);
      expect(picked).toEqual(['Alpha']);
    });

    it('ignores corrupt storage', () => {
      localStorage.setItem('test-recents', '{not json');
      expect(() => render(<Recents />)).not.toThrow();
    });
  });
});
