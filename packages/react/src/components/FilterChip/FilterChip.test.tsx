import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChip } from './FilterChip.js';

describe('FilterChip', () => {
  it('renders children', () => {
    render(<FilterChip>Category</FilterChip>);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<FilterChip className="custom-class">Category</FilterChip>);
    expect(screen.getByRole('button', { name: /category/i })).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<FilterChip ref={ref}>Category</FilterChip>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders count badge when count is provided', () => {
    render(<FilterChip count={5}>Category</FilterChip>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders remove button when onRemove is provided', () => {
    render(<FilterChip onRemove={() => {}}>Category</FilterChip>);
    expect(screen.getByRole('button', { name: /remove filter/i })).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    render(<FilterChip onRemove={onRemove}>Category</FilterChip>);
    fireEvent.click(screen.getByRole('button', { name: /remove filter/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles', () => {
    render(<FilterChip selected>Category</FilterChip>);
    expect(screen.getByRole('button', { name: /category/i })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('FilterChip 10.4 consistent controls', () => {
  it('sizes: md is the default, sm and lg change the height', () => {
    const { rerender } = render(<FilterChip count={3}>Category</FilterChip>);
    const shell = () => screen.getByRole('button', { name: /category/i }).parentElement;
    expect(shell()).toHaveClass('h-8', 'px-3', 'text-label-lg');
    rerender(<FilterChip count={3} size="sm">Category</FilterChip>);
    expect(shell()).toHaveClass('h-6', 'px-2', 'text-label-md');
    rerender(<FilterChip count={3} size="lg">Category</FilterChip>);
    expect(shell()).toHaveClass('h-10', 'px-4', 'text-label-lg');
    expect(screen.getByText('3')).toHaveClass('tabular-nums');
  });
});
