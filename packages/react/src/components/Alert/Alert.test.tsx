import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert.js';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Alert title="Warning!">Details here</Alert>);
    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Alert className="custom-class">Alert</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Alert</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders close button when onClose is provided', () => {
    render(<Alert onClose={() => {}}>Alert</Alert>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Alert</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders icon when provided', () => {
    render(<Alert icon={<span data-testid="icon" />}>Alert</Alert>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<Alert action={<button>Undo</button>}>Alert</Alert>);
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('has role alert', () => {
    render(<Alert>Alert</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
