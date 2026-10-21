import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StatCard } from './StatCard.js';

describe('StatCard', () => {
  it('renders the label', () => {
    render(<StatCard label="Total Revenue" value="$12,345" />);
    expect(screen.getByText('Total Revenue')).toBeDefined();
  });

  it('renders the value', () => {
    render(<StatCard label="Users" value="1,024" />);
    expect(screen.getByText('1,024')).toBeDefined();
  });

  it('renders delta text when provided', () => {
    render(<StatCard label="MRR" value="$5,000" delta="+12.5%" deltaType="increase" />);
    expect(screen.getByText('+12.5%')).toBeDefined();
  });

  it('applies increase delta color via data attribute', () => {
    render(<StatCard label="MRR" value="$5,000" delta="+12.5%" deltaType="increase" />);
    const span = screen.getByText('+12.5%').closest('[data-delta-type]');
    expect(span?.getAttribute('data-delta-type')).toBe('increase');
  });

  it('applies decrease delta color via data attribute', () => {
    render(<StatCard label="Churn" value="3%" delta="-2%" deltaType="decrease" />);
    const span = screen.getByText('-2%').closest('[data-delta-type]');
    expect(span?.getAttribute('data-delta-type')).toBe('decrease');
  });

  it('applies neutral delta type by default', () => {
    render(<StatCard label="Signups" value="42" delta="0%" />);
    const span = screen.getByText('0%').closest('[data-delta-type]');
    expect(span?.getAttribute('data-delta-type')).toBe('neutral');
  });

  it('renders description when provided', () => {
    render(<StatCard label="Active Users" value="800" description="vs last month" />);
    expect(screen.getByText('vs last month')).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(
      <StatCard label="Score" value="99" icon={<span data-testid="stat-icon">icon</span>} />,
    );
    expect(screen.getByTestId('stat-icon')).toBeDefined();
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <StatCard label="Test" value="1" className="custom-class" />,
    );
    expect(container.firstElementChild?.classList.contains('custom-class')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<StatCard label="Test" value="1" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('does not render delta/description row when neither is provided', () => {
    const { container } = render(<StatCard label="Test" value="0" />);
    expect(container.querySelectorAll('.flex.items-center.gap-2').length).toBe(0);
  });

  it('derives sentiment from deltaType by default', () => {
    render(<StatCard label="MRR" value="$5,000" delta="+12%" deltaType="increase" />);
    const delta = screen.getByText('+12%');
    expect(delta).toHaveAttribute('data-sentiment', 'positive');
    expect(delta.className).toContain('--color-success');
  });

  it('sentiment sets the colour independently of the arrow', () => {
    render(<StatCard label="Churn" value="3%" delta="-2%" deltaType="decrease" sentiment="positive" />);
    const delta = screen.getByText('-2%');
    expect(delta).toHaveAttribute('data-delta-type', 'decrease');
    expect(delta).toHaveAttribute('data-sentiment', 'positive');
    expect(delta.className).toContain('--color-success');
    expect(delta.className).not.toContain('--color-error');
  });
});
