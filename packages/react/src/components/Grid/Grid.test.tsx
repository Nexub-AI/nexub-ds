import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid } from './Grid.js';

describe('Grid', () => {
  it('renders children', () => {
    const { getByText } = render(<Grid><span>item</span></Grid>);
    expect(getByText('item')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Grid className="custom">x</Grid>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Grid ref={ref}>x</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies grid class', () => {
    const { container } = render(<Grid>x</Grid>);
    expect(container.firstChild).toHaveClass('grid');
  });

  it('uses classes for on-scale cols and gap (no style attribute)', () => {
    const { container } = render(<Grid cols={3} gap={4}>x</Grid>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('grid-cols-3', 'gap-4');
    expect(el).not.toHaveAttribute('style');
  });

  it('falls back to inline style for off-scale values', () => {
    const { container } = render(<Grid cols={13} gap="13px">x</Grid>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe('repeat(13, minmax(0, 1fr))');
    expect(el.style.gap).toBe('13px');
  });
});
