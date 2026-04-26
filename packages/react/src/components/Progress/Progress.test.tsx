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
    const fill = container.querySelector('[style]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('applies size variant', () => {
    render(<Progress size="lg" value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-3');
  });
});
