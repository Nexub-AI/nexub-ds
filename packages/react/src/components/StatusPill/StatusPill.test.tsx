import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusPill } from './StatusPill.js';

describe('StatusPill', () => {
  it('renders label', () => {
    render(<StatusPill label="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<StatusPill label="Active" className="custom-class" />);
    expect(screen.getByText('Active').closest('span')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<StatusPill ref={ref} label="Active" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders dot when dot=true', () => {
    const { container } = render(<StatusPill label="Active" dot />);
    expect(container.querySelectorAll('span').length).toBeGreaterThan(1);
  });

  it('applies pulse animation for success tone with dot', () => {
    const { container } = render(<StatusPill label="Active" dot tone="success" />);
    expect(container.querySelector('.animate-ping')).toBeInTheDocument();
  });

  it('does not pulse for neutral tone', () => {
    const { container } = render(<StatusPill label="Active" dot tone="neutral" />);
    expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
  });
});
