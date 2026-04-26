import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContextMenu } from './ContextMenu.js';

function TestContextMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div data-testid="context-target">Right-click me</div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Label>Actions</ContextMenu.Label>
          <ContextMenu.Item onSelect={onItemClick}>Copy</ContextMenu.Item>
          <ContextMenu.Item onSelect={onItemClick}>Paste</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={onItemClick} disabled>
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

describe('ContextMenu', () => {
  it('renders trigger element', () => {
    render(<TestContextMenu />);
    expect(screen.getByText('Right-click me')).toBeInTheDocument();
  });

  it('opens menu on right-click', async () => {
    render(<TestContextMenu />);

    const trigger = screen.getByTestId('context-target');
    fireEvent.contextMenu(trigger);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
  });

  it('shows all menu items after right-click', async () => {
    render(<TestContextMenu />);

    fireEvent.contextMenu(screen.getByTestId('context-target'));

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Paste')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('fires onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestContextMenu onItemClick={onItemClick} />);

    fireEvent.contextMenu(screen.getByTestId('context-target'));

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Copy'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestContextMenu />);

    fireEvent.contextMenu(screen.getByTestId('context-target'));

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  it('disabled item has data-disabled attribute', async () => {
    render(<TestContextMenu />);

    fireEvent.contextMenu(screen.getByTestId('context-target'));

    await waitFor(() => {
      expect(screen.getByText('Delete').closest('[data-disabled]')).toBeTruthy();
    });
  });
});
