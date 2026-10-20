import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GradientDivider } from './GradientDivider.js';

describe('GradientDivider', () => {
  it('renders a separator', () => {
    render(<GradientDivider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<GradientDivider className="custom-class" />);
    expect(screen.getByRole('separator')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<GradientDivider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies default height of 3px', () => {
    render(<GradientDivider />);
    expect(screen.getByRole('separator')).toHaveStyle({ height: '3px' });
  });

  it('applies custom height', () => {
    render(<GradientDivider height={6} />);
    expect(screen.getByRole('separator')).toHaveStyle({ height: '6px' });
  });

  it('has horizontal aria-orientation by default', () => {
    render(<GradientDivider />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('applies vertical orientation', () => {
    render(<GradientDivider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('contains brand gradient colours', () => {
    render(<GradientDivider />);
    const style = screen.getByRole('separator').style.background;
    // jsdom may serialise the colours as hex or rgb().
    expect(style).toMatch(/#4099f1|rgb\(64, 153, 241\)/i);
    expect(style).toMatch(/#1cce66|rgb\(28, 206, 102\)/i);
  });
});
