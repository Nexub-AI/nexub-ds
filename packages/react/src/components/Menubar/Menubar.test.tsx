import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Menubar } from './Menubar.js';

function TestMenubar({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item onSelect={onItemClick}>New</Menubar.Item>
            <Menubar.Item onSelect={onItemClick}>Open</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item onSelect={onItemClick} disabled>
              Save
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item onSelect={onItemClick}>Undo</Menubar.Item>
            <Menubar.Item onSelect={onItemClick}>Redo</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

describe('Menubar', () => {
  it('renders menubar root', () => {
    render(<TestMenubar />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('renders all menu triggers', () => {
    render(<TestMenubar />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestMenubar />);

    expect(screen.queryByText('New')).not.toBeInTheDocument();
    await user.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('fires onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestMenubar onItemClick={onItemClick} />);

    await user.click(screen.getByText('File'));
    await user.click(screen.getByText('New'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestMenubar />);

    await user.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });

  it('only one menu is open at a time', async () => {
    const user = userEvent.setup();
    render(<TestMenubar />);

    await user.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });

  it('disabled item has data-disabled attribute', async () => {
    const user = userEvent.setup();
    render(<TestMenubar />);

    await user.click(screen.getByText('File'));
    await waitFor(() => {
      expect(screen.getByText('Save').closest('[data-disabled]')).toBeTruthy();
    });
  });
});
