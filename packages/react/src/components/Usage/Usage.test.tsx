import * as React from 'react';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, it, expect } from 'vitest';
import { UsageBar, UsageTile, usageLevel } from './Usage.js';

const axeClean = async (el: Element) => {
  const { violations } = await axe.run(el, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
};

describe('usageLevel', () => {
  it('is ok, warning from warnAt, danger at and over the limit, unlimited without one', () => {
    expect(usageLevel(10, 50).level).toBe('ok');
    expect(usageLevel(40, 50).level).toBe('warning');
    expect(usageLevel(30, 50, 0.5).level).toBe('warning');
    expect(usageLevel(50, 50).level).toBe('danger');
    expect(usageLevel(60, 50)).toMatchObject({ level: 'danger', percent: 120 });
    expect(usageLevel(5, null).level).toBe('unlimited');
    expect(usageLevel(5, Infinity).level).toBe('unlimited');
    expect(usageLevel(1, 0).level).toBe('danger');
    expect(usageLevel(0, 0).level).toBe('ok');
  });
});

describe('UsageTile', () => {
  it('shows value, limit, a meter and the share used', async () => {
    const { container } = render(<UsageTile label="Seats" used={12} limit={50} note="Resets monthly" action={<a href="#up">Upgrade</a>} />);
    const meter = screen.getByRole('meter', { name: 'Seats' });
    expect(meter).toHaveAttribute('aria-valuenow', '24');
    expect(meter).toHaveAttribute('aria-valuetext', '12 of 50, 24% used');
    expect(screen.getByText('24% used')).toBeInTheDocument();
    expect(screen.getByText('Resets monthly')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Upgrade' })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-level', 'ok');
    await axeClean(container);
  });

  it('warns near the limit and says when it is reached, in text', () => {
    const { rerender, container } = render(<UsageTile label="Storage" used={8} limit={10} />);
    expect(container.firstElementChild).toHaveAttribute('data-level', 'warning');
    expect(screen.getByText('80% used')).toHaveClass('text-warning');
    rerender(<UsageTile label="Storage" used={12} limit={10} />);
    expect(screen.getByText('Limit reached')).toHaveClass('text-error');
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
  });

  it('formats with valueFormat', () => {
    render(<UsageTile label="Storage" used={2.5} limit={10} valueFormat={(n) => `${n} GB`} />);
    expect(screen.getByText('2.5 GB')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '2.5 GB of 10 GB, 25% used');
  });

  it('shows "Unlimited" and no bar without a limit', () => {
    render(<UsageTile label="Projects" used={1200} limit={null} />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(screen.queryByRole('meter')).toBeNull();
  });

  it('takes the data states', () => {
    const { rerender, container } = render(<UsageTile label="Seats" used={1} limit={5} loading />);
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('meter')).toBeNull();
    rerender(<UsageTile label="Seats" used={null} limit={5} emptyState="No seats yet" />);
    expect(screen.getByText('No seats yet')).toBeInTheDocument();
    rerender(<UsageTile label="Seats" used={1} limit={5} errorState="Could not load" />);
    expect(screen.getByText('Could not load')).toBeInTheDocument();
    expect(screen.queryByRole('meter')).toBeNull();
  });
});

describe('UsageBar', () => {
  it('draws a meter with the inline label', async () => {
    const { container } = render(<UsageBar used={42} limit={50} aria-label="Seats" />);
    const meter = screen.getByRole('meter', { name: 'Seats' });
    expect(meter).toHaveAttribute('aria-valuetext', '42 of 50, 84% used');
    expect(meter).toHaveAttribute('data-level', 'warning');
    expect(screen.getByText('42 / 50')).toBeInTheDocument();
    await axeClean(container);
  });

  it('is named by its value without aria-label; label can be replaced or hidden', () => {
    const { rerender } = render(<UsageBar used={50} limit={50} label="Full" size="md" />);
    expect(screen.getByRole('meter', { name: '50 of 50, Limit reached' })).toBeInTheDocument();
    expect(screen.getByText('Full')).toHaveClass('text-error');
    rerender(<UsageBar used={5} limit={50} label={false} />);
    expect(screen.queryByText('5 / 50')).toBeNull();
  });

  it('shows the value and "Unlimited" without a limit', async () => {
    const { container } = render(<UsageBar used={7} limit={Infinity} />);
    expect(screen.queryByRole('meter')).toBeNull();
    expect(screen.getByText('7 · Unlimited')).toBeInTheDocument();
    await axeClean(container);
  });
});
