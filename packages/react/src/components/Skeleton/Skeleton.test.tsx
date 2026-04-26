import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton.js';

describe('Skeleton', () => {
  it('renders as a span', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.querySelector('span')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('applies animate-pulse by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('span')).toHaveClass('animate-pulse');
  });

  it('does not apply animate-pulse when animated=false', () => {
    const { container } = render(<Skeleton animated={false} />);
    expect(container.querySelector('span')).not.toHaveClass('animate-pulse');
  });

  it('applies circle shape', () => {
    const { container } = render(<Skeleton shape="circle" />);
    expect(container.querySelector('span')).toHaveClass('rounded-full');
  });

  it('applies width and height as inline style', () => {
    const { container } = render(<Skeleton width={200} height={20} />);
    const el = container.querySelector('span') as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('sets aria-hidden', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
  });
});
