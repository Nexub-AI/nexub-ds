import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { PlanCard } from './PlanCard.js';

const baseProps = {
  name: 'Pro',
  price: '$49',
  features: ['Unlimited projects', '10 GB storage', 'Priority support'],
  cta: 'Get started',
};

describe('PlanCard', () => {
  it('renders the plan name', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.getByText('Pro')).toBeDefined();
  });

  it('renders the price', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.getByText('$49')).toBeDefined();
  });

  it('renders period when provided', () => {
    render(<PlanCard {...baseProps} period="/ month" />);
    expect(screen.getByText('/ month')).toBeDefined();
  });

  it('does not render period element when omitted', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.queryByText('/ month')).toBeNull();
  });

  it('renders description when provided', () => {
    render(<PlanCard {...baseProps} description="Best for growing teams" />);
    expect(screen.getByText('Best for growing teams')).toBeDefined();
  });

  it('renders all features', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.getByText('Unlimited projects')).toBeDefined();
    expect(screen.getByText('10 GB storage')).toBeDefined();
    expect(screen.getByText('Priority support')).toBeDefined();
  });

  it('renders the CTA button', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Get started' })).toBeDefined();
  });

  it('calls onSelect when CTA button is clicked', async () => {
    const onSelect = vi.fn();
    render(<PlanCard {...baseProps} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders badge when provided', () => {
    render(<PlanCard {...baseProps} badge="Most popular" />);
    expect(screen.getByText('Most popular')).toBeDefined();
  });

  it('does not render badge when omitted', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.queryByText('Most popular')).toBeNull();
  });

  it('adds ring class to root when highlighted', () => {
    const { container } = render(<PlanCard {...baseProps} highlighted />);
    const root = container.firstElementChild!;
    expect(root.className).toContain('ring-1');
  });

  it('does not add ring class when not highlighted', () => {
    const { container } = render(<PlanCard {...baseProps} />);
    const root = container.firstElementChild!;
    expect(root.className).not.toContain('ring-1');
  });

  it('forwards className to root element', () => {
    const { container } = render(<PlanCard {...baseProps} className="custom-plan" />);
    expect(container.firstElementChild?.classList.contains('custom-plan')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PlanCard {...baseProps} ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });
});
