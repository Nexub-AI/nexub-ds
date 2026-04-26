import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { FilterBar } from './FilterBar.js';

describe('FilterBar', () => {
  it('renders the search input', () => {
    render(<FilterBar />);
    expect(screen.getByRole('searchbox')).toBeDefined();
  });

  it('renders custom placeholder', () => {
    render(<FilterBar searchPlaceholder="Find something…" />);
    const input = screen.getByRole('searchbox');
    expect(input.getAttribute('placeholder')).toBe('Find something…');
  });

  it('uses default placeholder when not provided', () => {
    render(<FilterBar />);
    const input = screen.getByRole('searchbox');
    expect(input.getAttribute('placeholder')).toBe('Search…');
  });

  it('renders searchValue as controlled input value', () => {
    render(<FilterBar searchValue="hello" onSearch={() => {}} />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.value).toBe('hello');
  });

  it('calls onSearch with the typed value', async () => {
    const onSearch = vi.fn();
    render(<FilterBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'abc');
    expect(onSearch).toHaveBeenCalledWith(expect.stringContaining('a'));
  });

  it('renders filters slot when provided', () => {
    render(
      <FilterBar
        filters={<span data-testid="filter-chip">Status</span>}
      />,
    );
    expect(screen.getByTestId('filter-chip')).toBeDefined();
  });

  it('does not render filters container when filters is omitted', () => {
    const { container } = render(<FilterBar />);
    // Only one child: the search input (no filters wrapper div)
    const root = container.firstElementChild!;
    expect(root.children.length).toBe(1);
  });

  it('renders actions slot when provided', () => {
    render(
      <FilterBar
        actions={<button data-testid="action-btn">Export</button>}
      />,
    );
    expect(screen.getByTestId('action-btn')).toBeDefined();
  });

  it('does not render actions container when actions is omitted', () => {
    const { container } = render(<FilterBar />);
    const root = container.firstElementChild!;
    expect(root.querySelectorAll('.ml-auto').length).toBe(0);
  });

  it('forwards className to root element', () => {
    const { container } = render(<FilterBar className="custom-bar" />);
    expect(container.firstElementChild?.classList.contains('custom-bar')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<FilterBar ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('renders filters and actions together', () => {
    render(
      <FilterBar
        filters={<span data-testid="chip">Active</span>}
        actions={<button data-testid="btn">New</button>}
      />,
    );
    expect(screen.getByTestId('chip')).toBeDefined();
    expect(screen.getByTestId('btn')).toBeDefined();
  });
});
