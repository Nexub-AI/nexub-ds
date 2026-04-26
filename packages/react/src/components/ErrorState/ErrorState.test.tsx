import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorState } from './ErrorState.js';

describe('ErrorState', () => {
  it('renders title', () => {
    render(<ErrorState title="Something went wrong" />);
    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ErrorState title="Error" description="Please try again later." />,
    );
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<ErrorState title="Error" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState title="Error" onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState title="Error" />);
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('clicking retry button calls onRetry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Error" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('forwards className to root div', () => {
    render(<ErrorState title="Error" className="custom-error" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-error');
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ErrorState title="Error" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
