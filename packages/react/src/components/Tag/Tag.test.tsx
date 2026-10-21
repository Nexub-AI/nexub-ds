import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tag } from './Tag.js';

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>Design</Tag>);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Tag className="custom-class">Design</Tag>);
    expect(screen.getByText('Design')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>Design</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('applies size variant', () => {
    render(<Tag size="lg">Design</Tag>);
    expect(screen.getByText('Design')).toHaveClass('text-sm');
  });

  it('applies tone', () => {
    render(<Tag tone="success">Design</Tag>);
    expect(screen.getByText('Design').className).toMatch(/color-success-container/);
  });
});
