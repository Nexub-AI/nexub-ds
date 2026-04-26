import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from './Kbd.js';

describe('Kbd', () => {
  it('renders children', () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
  });

  it('renders a <kbd> element', () => {
    const { container } = render(<Kbd>Enter</Kbd>);
    expect(container.querySelector('kbd')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Kbd className="custom">Tab</Kbd>);
    expect(container.querySelector('kbd')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Kbd ref={ref}>Shift</Kbd>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
