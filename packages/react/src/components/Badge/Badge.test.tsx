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

  it('dot alone is decorative, or an image when labelled', () => {
    const { container, rerender } = render(<Badge dot tone="success" />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<Badge dot tone="success" aria-label="Online" />);
    expect(screen.getByRole('img', { name: 'Online' })).toHaveClass('rounded-full');
  });

  it('dot sits before the label', () => {
    render(<Badge dot variant="soft">Live</Badge>);
    expect(screen.getByText('Live').querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('count caps at max but reads the full number', () => {
    const { rerender } = render(<Badge count={120} />);
    expect(screen.getByText('99+')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('120')).toHaveClass('sr-only');
    rerender(<Badge count={7} max={9} />);
    expect(screen.getByText('7')).toHaveClass('nx-tick');
    rerender(<Badge count={10} max={9} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });
});
