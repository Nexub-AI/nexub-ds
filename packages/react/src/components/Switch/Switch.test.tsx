import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('renders', () => {
    render(<Switch aria-label="Toggle setting" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Switch aria-label="Toggle setting" className="custom-class" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Toggle setting" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('toggles on click', () => {
    render(<Switch aria-label="Toggle setting" />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'checked');
  });
});
