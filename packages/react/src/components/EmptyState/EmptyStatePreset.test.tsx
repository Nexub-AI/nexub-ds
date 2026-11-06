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
});
