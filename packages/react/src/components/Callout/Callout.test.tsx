import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Callout } from './Callout.js';

describe('Callout', () => {
  it('renders children', () => {
    render(<Callout>Callout content</Callout>);
    expect(screen.getByText('Callout content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Callout className="custom-class">Callout</Callout>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Callout ref={ref}>Callout</Callout>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders icon when provided', () => {
    render(<Callout icon={<span data-testid="icon" />}>Callout</Callout>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies tone styles', () => {
    render(<Callout tone="warning">Callout</Callout>);
    const el = screen.getByText('Callout').closest('[data-tone]');
    expect(el).toHaveAttribute('data-tone', 'warning');
  });
});
