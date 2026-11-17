import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Pagination } from './Pagination.js';

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    totalItems: 100,
    pageSize: 10,
    onPageChange: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation element', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('clicking next calls onPageChange with page + 1', async () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('previous button is disabled when on page 1', () => {
    render(<Pagination {...defaultProps} page={1} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
  });

  it('current page button has aria-current="page"', () => {
    render(<Pagination {...defaultProps} page={3} />);
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('forwards className to nav', () => {
    render(<Pagination {...defaultProps} className="custom-pagination" />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass(
      'custom-pagination',
    );
  });

  it('forwards ref to nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <Pagination page={1} totalItems={5} pageSize={10} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('Pagination sliding indicator (10.5)', () => {
  it('follows the current page, also when its button is newly mounted', () => {
    const props = { totalItems: 400, pageSize: 10, onPageChange: vi.fn() };
    const { container, rerender } = render(<Pagination {...props} page={1} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(container.querySelectorAll('[data-nx="page-indicator"]')).toHaveLength(1);
    expect(nav.style.getPropertyValue('--nx-ind-o')).toBe('1');
    expect(nav.querySelector('[aria-current="page"]')).toHaveClass('bg-[var(--color-primary)]', 'group-data-[nx-indicator=ready]/pg:bg-transparent');
    // Page 20 was behind an ellipsis: its button is new, and it is still the one measured.
    const set = vi.spyOn(nav.style, 'setProperty');
    rerender(<Pagination {...props} page={20} />);
    expect(set).toHaveBeenCalledWith('--nx-ind-o', '1');
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent('20');
  });
});
