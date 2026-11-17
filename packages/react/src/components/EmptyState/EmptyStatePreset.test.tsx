import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyStatePreset } from './EmptyStatePreset.js';

describe('EmptyStatePreset', () => {
  it('renders localised text and actions per kind', () => {
    const { rerender } = render(<EmptyStatePreset kind="noResults" actions={<button type="button">Clear filters</button>} />);
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    rerender(<EmptyStatePreset kind="serverError" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    rerender(<EmptyStatePreset kind="noAccess" title="Billing is admin-only" />);
    expect(screen.getByRole('heading', { name: 'Billing is admin-only' })).toBeInTheDocument();
  });

  it('notFound and maintenance have text; illustrated swaps the icon for the drawing', () => {
    const { container, rerender } = render(<EmptyStatePreset kind="notFound" />);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(container.querySelector('[data-nx="illustration"]')).toBeNull();
    rerender(<EmptyStatePreset kind="maintenance" illustrated size="sm" />);
    expect(screen.getByRole('heading', { name: 'Down for maintenance' })).toBeInTheDocument();
    const art = container.querySelector('[data-nx="illustration"]')!;
    expect(art).toHaveAttribute('data-kind', 'maintenance');
    expect(art).toHaveAttribute('aria-hidden', 'true');
    expect(art).toHaveClass('w-20');
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });
});
