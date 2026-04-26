import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from './Chip.js';

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>React</Chip>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Chip className="custom-class">React</Chip>);
    expect(screen.getByText('React').closest('span')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Chip ref={ref}>React</Chip>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders remove button when onRemove is provided', () => {
    render(<Chip onRemove={() => {}}>React</Chip>);
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>React</Chip>);
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when onRemove is not provided', () => {
    render(<Chip>React</Chip>);
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
  });
});
