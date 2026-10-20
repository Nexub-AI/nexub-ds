import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AspectRatio } from './AspectRatio.js';

describe('AspectRatio', () => {
  it('renders children', () => {
    const { getByText } = render(<AspectRatio><div>content</div></AspectRatio>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<AspectRatio className="custom">x</AspectRatio>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref}>x</AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('uses a class for the default 16/9 ratio (no style attribute)', () => {
    const { container } = render(<AspectRatio>x</AspectRatio>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('aspect-video');
    expect(el).not.toHaveAttribute('style');
  });

  it('uses a class for common ratios', () => {
    const { container } = render(<AspectRatio ratio={4 / 3}>x</AspectRatio>);
    expect(container.firstChild).toHaveClass('aspect-[4/3]');
  });

  it('falls back to inline style for other ratios', () => {
    const { container } = render(<AspectRatio ratio={1.9}>x</AspectRatio>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.aspectRatio).toMatch(/^1\.9/);
  });
});
