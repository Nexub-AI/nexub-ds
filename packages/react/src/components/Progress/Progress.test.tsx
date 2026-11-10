import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Progress } from './Progress.js';

describe('Progress', () => {
  it('renders as progressbar', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Progress className="custom-class" value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets aria-valuenow', () => {
    render(<Progress value={75} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemax', () => {
    render(<Progress value={5} max={10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  });

  it('clamps value to 0-max range', () => {
    render(<Progress value={150} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('renders fill at correct percentage', () => {
    const { container } = render(<Progress value={50} max={100} />);
    const fill = container.querySelector('[data-part="fill"]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('is indeterminate without a value', () => {
    const { container } = render(<Progress />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    const fill = container.querySelector('[data-part="fill"]') as HTMLElement;
    expect(fill).toHaveAttribute('data-indeterminate');
    expect(fill.className).toContain('nx-progress-indeterminate');
  });

  it('is determinate at value 0', () => {
    const { container } = render(<Progress value={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    const fill = container.querySelector('[data-part="fill"]') as HTMLElement;
    expect(fill).not.toHaveAttribute('data-indeterminate');
    expect(fill.style.width).toBe('0%');
  });

  it('applies size variant', () => {
    render(<Progress size="lg" value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-3');
  });

  it('circular: one progressbar, ring fill follows value, spins when indeterminate', () => {
    const { container, rerender } = render(<Progress variant="circular" value={30} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30');
    expect(container.querySelector('[data-part="fill"]')).toHaveAttribute('stroke-dasharray', '30 100');
    rerender(<Progress variant="circular" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    expect(container.querySelector('svg')).toHaveClass('animate-spin');
  });

  it('segments: N steps filled up to value, still one progressbar', () => {
    const { container } = render(<Progress segments={5} value={3} max={5} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(container.querySelectorAll('[data-part="segment"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-filled]')).toHaveLength(3);
  });
});
