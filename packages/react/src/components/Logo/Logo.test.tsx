import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from './Logo.js';

describe('Logo', () => {
  it('renders in full variant by default', () => {
    render(<Logo />);
    expect(screen.getByText('nexub')).toBeInTheDocument();
  });

  it('does not render wordmark in mark variant', () => {
    render(<Logo variant="mark" />);
    expect(screen.queryByText('nexub')).not.toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Logo className="custom" />);
    expect(screen.getByLabelText('Nexub')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Logo ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has aria-label Nexub', () => {
    render(<Logo />);
    expect(screen.getByLabelText('Nexub')).toBeInTheDocument();
  });
});
