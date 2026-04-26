import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toggle } from './Toggle.js';

describe('Toggle', () => {
  it('renders', () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Toggle className="custom-class">Bold</Toggle>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Toggle ref={ref}>Bold</Toggle>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('toggles pressed state on click', () => {
    render(<Toggle>Bold</Toggle>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-state', 'off');
    fireEvent.click(button);
    expect(button).toHaveAttribute('data-state', 'on');
  });
});
