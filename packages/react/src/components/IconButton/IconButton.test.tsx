import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from './IconButton.js';

describe('IconButton', () => {
  it('renders with aria-label', () => {
    render(<IconButton label="Close" />);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<IconButton label="Test" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('is disabled when disabled prop is true', () => {
    render(<IconButton label="Test" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders children', () => {
    render(
      <IconButton label="Search">
        <span data-testid="icon" />
      </IconButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('loading: spinner replaces the icon, aria-busy, clicks blocked', async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Save" loading onClick={onClick}>
        <svg data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('tooltip={true} shows the label without a Provider', async () => {
    render(<IconButton label="Delete" tooltip />);
    // The tooltip is a lazy chunk: wait until the trigger is wired (Radix sets data-state).
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-state'));
    act(() => screen.getByRole('button').focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Delete');
  });
});
