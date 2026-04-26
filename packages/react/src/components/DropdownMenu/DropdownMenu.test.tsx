import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu.js';

function TestDropdownMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item onSelect={onItemClick}>Edit</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={onItemClick}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={onItemClick} disabled>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    render(<TestDropdownMenu />);
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
  });

  it('fires onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestDropdownMenu onItemClick={onItemClick} />);

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Edit'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('renders label and separator', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('disabled item is not interactive', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<TestDropdownMenu onItemClick={onItemClick} />);

    await user.click(screen.getByText('Open Menu'));
    const deleteItem = screen.getByText('Delete');
    expect(deleteItem.closest('[data-disabled]')).toBeTruthy();
  });
});
