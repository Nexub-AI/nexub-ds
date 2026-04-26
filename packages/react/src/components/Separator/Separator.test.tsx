import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from './Separator.js';

describe('Separator', () => {
  it('renders horizontal separator as hr by default', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders vertical separator as div', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards className', () => {
    render(<Separator className="custom-class" />);
    expect(screen.getByRole('separator')).toHaveClass('custom-class');
  });

  it('forwards ref for horizontal', () => {
    const ref = React.createRef<HTMLHRElement>();
    render(<Separator ref={ref as React.Ref<HTMLHRElement | HTMLDivElement>} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  it('sets aria-orientation for vertical', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies tone style class', () => {
    render(<Separator tone="success" />);
    const el = screen.getByRole('separator');
    expect(el.className).toMatch(/semantic-success/);
  });
});
