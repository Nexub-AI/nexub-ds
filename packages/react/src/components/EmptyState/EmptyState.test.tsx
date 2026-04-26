import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState.js';

describe('EmptyState', () => {
  it('renders title', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Title>No results found</EmptyState.Title>
      </EmptyState.Root>,
    );
    expect(screen.getByRole('heading', { name: 'No results found' })).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Description>Try adjusting your filters.</EmptyState.Description>
      </EmptyState.Root>,
    );
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('renders illustration slot', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Illustration data-testid="illustration">
          <svg aria-hidden="true" />
        </EmptyState.Illustration>
        <EmptyState.Title>Empty</EmptyState.Title>
      </EmptyState.Root>,
    );
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Title>Empty</EmptyState.Title>
        <EmptyState.Actions>
          <button type="button">Add item</button>
        </EmptyState.Actions>
      </EmptyState.Root>,
    );
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('forwards className to Root', () => {
    render(<EmptyState.Root className="custom-empty" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-empty');
  });

  it('forwards ref to Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<EmptyState.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
