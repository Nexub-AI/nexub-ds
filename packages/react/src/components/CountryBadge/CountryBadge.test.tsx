import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CountryBadge } from './CountryBadge.js';

describe('CountryBadge', () => {
  it('renders the flag and label', () => {
    render(<CountryBadge code="SG" label="Singapore" />);
    expect(screen.getByText('Singapore')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'SG' })).toBeInTheDocument();
  });

  it('falls back to code as label when label is not provided', () => {
    render(<CountryBadge code="IN" />);
    expect(screen.getByText('IN')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<CountryBadge code="US" className="custom" />);
    // the root span wraps both flag and label
    const spans = document.querySelectorAll('span');
    const root = Array.from(spans).find((el) => el.classList.contains('custom'));
    expect(root).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<CountryBadge ref={ref} code="GB" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
