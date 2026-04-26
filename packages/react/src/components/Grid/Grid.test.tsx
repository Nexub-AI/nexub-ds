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

  it('sets gridTemplateColumns via inline style for numeric cols', () => {
    const { container } = render(<Grid cols={3}>x</Grid>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('sets gap via inline style for numeric gap', () => {
    const { container } = render(<Grid gap={4}>x</Grid>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('1rem');
  });
});
