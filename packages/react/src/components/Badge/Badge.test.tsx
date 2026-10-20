import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge.js';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Badge className="custom-class">Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders leadingIcon', () => {
    render(<Badge leadingIcon={<span data-testid="icon" />}>Badge</Badge>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies size variant', () => {
    render(<Badge size="lg">Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveClass('px-3');
  });

  it('applies tone', () => {
    render(<Badge tone="success" variant="solid">Badge</Badge>);
    const el = screen.getByText('Badge');
    expect(el.className).toMatch(/color-success/);
  });
});
