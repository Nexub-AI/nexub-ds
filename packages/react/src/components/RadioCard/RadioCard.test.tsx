import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioCardGroup, RadioCard } from './RadioCard.js';

const Plans = (props: React.ComponentProps<typeof RadioCardGroup>) => (
  <RadioCardGroup aria-label="Plan" {...props}>
    <RadioCard value="free" title="Free" description="For trying things out" />
    <RadioCard value="pro" title="Pro" description="For teams" />
    <RadioCard value="ent" title="Enterprise" disabled />
  </RadioCardGroup>
);

describe('RadioCard', () => {
  it('uses title as name and description as description', () => {
    render(<Plans />);
    const pro = screen.getByRole('radio', { name: 'Pro' });
    expect(pro).toHaveAccessibleDescription('For teams');
    expect(screen.getByRole('radio', { name: 'Enterprise' })).not.toHaveAttribute('aria-describedby');
  });

  it('selects on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });

  it('moves selection with arrow keys, skipping disabled cards', async () => {
    const user = userEvent.setup();
    render(<Plans defaultValue="free" />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
    // Hold the key: Radix moves focus on a timer and selects only while an arrow is down.
    await user.keyboard('{ArrowDown>}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('data-state', 'checked');
    await user.keyboard('{/ArrowDown}{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
  });

  it('cannot select a disabled card', async () => {
    render(<Plans />);
    const ent = screen.getByRole('radio', { name: 'Enterprise' });
    expect(ent).toBeDisabled();
    await userEvent.click(ent);
    expect(ent).toHaveAttribute('data-state', 'unchecked');
  });

  it('lays out columns with literal classes, sized by a query container around the grid (10.6)', () => {
    const { unmount } = render(<Plans columns={3} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveClass('grid', '@xl:grid-cols-3');
    expect(group.parentElement).toHaveClass('@container', 'w-full');
    unmount();
    // One column never changes with width: no wrapper.
    render(<Plans columns={1} />);
    expect(screen.getByRole('radiogroup').parentElement).not.toHaveClass('@container');
  });

  it('server-renders no style attribute of its own', () => {
    // Radix's hidden form inputs and roving-focus outline:none are the only inline styles.
    const html = renderToString(<Plans defaultValue="pro" />)
      .replace(/<input [^>]*>/g, '')
      .replace(/ style="outline:none"/g, '');
    expect(html).toContain('data-state="checked"');
    expect(html).not.toMatch(/\sstyle=/);
  });
});

describe('RadioCard 10.4 consistent controls', () => {
  it('invalid on the group marks the group and each card', () => {
    render(<Plans invalid />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('invalid');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('readOnly keeps the selection', async () => {
    const onValueChange = vi.fn();
    render(<Plans defaultValue="free" readOnly onValueChange={onValueChange} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    const pro = screen.getByRole('radio', { name: 'Pro' });
    expect(pro).not.toBeDisabled();
    await userEvent.click(pro);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(pro).toHaveAttribute('data-state', 'unchecked');
  });
});
