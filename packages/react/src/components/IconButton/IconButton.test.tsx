import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconButton } from './IconButton.js';

describe('IconButton', () => {
  it('renders with aria-label', () => {
    render(<IconButton label="Close" />);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<IconButton label="Test" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('is disabled when disabled prop is true', () => {
    render(<IconButton label="Test" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders children', () => {
    render(
      <IconButton label="Search">
        <span data-testid="icon" />
      </IconButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
