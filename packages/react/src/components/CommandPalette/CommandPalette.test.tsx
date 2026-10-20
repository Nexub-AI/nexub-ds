import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
