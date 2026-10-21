import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CheckboxCard } from './CheckboxCard.js';

describe('CheckboxCard', () => {
  it('uses title as name and description as description', () => {
    render(<CheckboxCard title="Analytics" description="Usage dashboards" />);
    expect(screen.getByRole('checkbox', { name: 'Analytics' })).toHaveAccessibleDescription(
      'Usage dashboards',
    );
  });

  it('toggles on click and space, reporting a boolean', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<CheckboxCard title="Analytics" onCheckedChange={onCheckedChange} />);
    const card = screen.getByRole('checkbox', { name: 'Analytics' });
    await user.click(card);
    expect(card).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.keyboard(' ');
    expect(card).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('is controllable', () => {
    render(<CheckboxCard title="Analytics" checked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('cannot toggle when disabled', async () => {
    render(<CheckboxCard title="Analytics" disabled />);
    const card = screen.getByRole('checkbox');
    expect(card).toBeDisabled();
    await userEvent.click(card);
    expect(card).toHaveAttribute('data-state', 'unchecked');
  });

  it('server-renders no style attribute of its own', () => {
    // Radix's hidden form input is the only inline style.
    const html = renderToString(<CheckboxCard title="Analytics" defaultChecked />).replace(/<input [^>]*>/g, '');
    expect(html).toContain('data-state="checked"');
    expect(html).not.toMatch(/\sstyle=/);
  });
});
