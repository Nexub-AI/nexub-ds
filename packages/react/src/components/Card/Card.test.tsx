import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card.js';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Card className="custom-class">Card</Card>);
    expect(screen.getByText('Card')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies interactive variant', () => {
    render(<Card variant="interactive">Card</Card>);
    expect(screen.getByText('Card')).toHaveClass('cursor-pointer');
  });

  it('applies surface variant', () => {
    render(<Card variant="surface">Card</Card>);
    expect(screen.getByText('Card')).toHaveClass('shadow-[var(--shadow-card,0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1))]');
  });

  it('renders as child element with asChild', () => {
    render(
      <Card asChild>
        <section>Card content</section>
      </Card>,
    );
    expect(screen.getByText('Card content').tagName).toBe('SECTION');
  });

  it('applies tone data attribute', () => {
    render(<Card tone="success">Card</Card>);
    expect(screen.getByText('Card')).toHaveAttribute('data-tone', 'success');
  });
});
