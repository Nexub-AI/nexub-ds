import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton, SkeletonText } from './Skeleton.js';

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

  it('animation="shimmer" swaps the pulse for the shimmer sweep', () => {
    const { container } = render(<Skeleton animation="shimmer" />);
    const el = container.querySelector('span');
    expect(el).toHaveClass('nx-skeleton-shimmer');
    expect(el).not.toHaveClass('animate-pulse');
  });

  it('no shimmer when animated=false', () => {
    const { container } = render(<Skeleton animation="shimmer" animated={false} />);
    expect(container.querySelector('span')).not.toHaveClass('nx-skeleton-shimmer');
  });
});

describe('SkeletonText', () => {
  it('renders N one-line-high lines, the last shorter', () => {
    const { container } = render(<SkeletonText lines={4} animation="shimmer" />);
    const rows = container.firstElementChild!.children;
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveClass('h-[1lh]');
    expect(rows[3]!.firstElementChild).toHaveClass('w-3/5', 'nx-skeleton-shimmer');
    expect(rows[0]!.firstElementChild).not.toHaveClass('w-3/5');
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('a single line is full width', () => {
    const { container } = render(<SkeletonText lines={1} />);
    expect(container.querySelector('.h-\\[1lh\\] > span')).toHaveClass('w-full');
  });
});
