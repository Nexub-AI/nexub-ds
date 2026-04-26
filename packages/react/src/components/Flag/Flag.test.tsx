import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flag } from './Flag.js';

describe('Flag', () => {
  it('renders a flag emoji for a country code', () => {
    render(<Flag code="SG" />);
    // The SG flag emoji is 🇸🇬
    const el = screen.getByRole('img', { name: 'SG' });
    expect(el).toBeInTheDocument();
  });

  it('has role img with aria-label of the code', () => {
    render(<Flag code="IN" />);
    expect(screen.getByRole('img', { name: 'IN' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Flag code="US" className="custom" />);
    expect(screen.getByRole('img', { name: 'US' })).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Flag ref={ref} code="GB" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
