import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextGradient } from './TextGradient.js';

describe('TextGradient', () => {
  it('renders children', () => {
    render(<TextGradient>Hello</TextGradient>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<TextGradient className="custom">text</TextGradient>);
    expect(screen.getByText('text')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<TextGradient ref={ref}>gradient</TextGradient>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('applies bg-clip-text class', () => {
    render(<TextGradient>clip</TextGradient>);
    expect(screen.getByText('clip')).toHaveClass('bg-clip-text');
  });
});
