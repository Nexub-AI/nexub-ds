import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SplitButton } from './SplitButton.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';

function setup(props: Partial<React.ComponentProps<typeof SplitButton>> = {}) {
  const onClick = vi.fn();
  const onDraft = vi.fn();
  render(
    <SplitButton
      onClick={onClick}
      menuLabel="More save options"
      menu={<DropdownMenu.Item onSelect={onDraft}>Save as draft</DropdownMenu.Item>}
      {...props}
    >
      Save
    </SplitButton>,
  );
  return { onClick, onDraft, user: userEvent.setup() };
}

describe('SplitButton', () => {
  it('runs the primary action', async () => {
    const { onClick, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('opens the secondary actions from the labelled toggle', async () => {
    const { onDraft, onClick, user } = setup();
    await user.click(screen.getByRole('button', { name: 'More save options' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Save as draft' }));
    expect(onDraft).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as one connected group and disables both halves', () => {
    setup({ disabled: true });
    expect(screen.getByRole('group')).toHaveAttribute('data-attached');
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More save options' })).toBeDisabled();
  });

  it('disables the menu toggle while status="loading"', () => {
    setup({ status: 'loading' });
    expect(screen.getByRole('button', { name: 'More save options' })).toBeDisabled();
  });
});
