import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card, CardLink } from './Card.js';

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
    expect(screen.getByText('Card')).toHaveClass('shadow-elevation-1');
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

  it('activates the glass material with surface="glass"', () => {
    render(<Card surface="glass">Card</Card>);
    const el = screen.getByText('Card');
    expect(el).toHaveAttribute('data-material', 'glass');
    expect(el).toHaveClass('bg-[var(--glass-bg)]');
  });

  it('omits data-material for the default solid surface', () => {
    render(<Card>Card</Card>);
    expect(screen.getByText('Card')).not.toHaveAttribute('data-material');
  });
});

describe('Card effects and links', () => {
  it('interactive cards lift with nx-lift', () => {
    render(<Card variant="interactive">Lift</Card>);
    expect(screen.getByText('Lift')).toHaveClass('nx-lift', 'nx-state-layer');
  });

  it('sheen is opt-in and tracks the pointer through CSS variables', async () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    render(<Card effect="sheen">Shine</Card>);
    const el = screen.getByText('Shine');
    expect(el).toHaveClass('nx-sheen');
    fireEvent.pointerMove(el, { clientX: 30, clientY: 12, pointerType: 'mouse' });
    expect(el.style.getPropertyValue('--nx-mx')).toBe('30px');
    expect(el.style.getPropertyValue('--nx-my')).toBe('12px');
    raf.mockRestore();
  });

  it('ignores touch pointers and has no sheen by default', () => {
    render(<Card>Plain</Card>);
    const el = screen.getByText('Plain');
    expect(el).not.toHaveClass('nx-sheen');
    fireEvent.pointerMove(el, { clientX: 5, clientY: 5, pointerType: 'mouse' });
    expect(el.style.getPropertyValue('--nx-mx')).toBe('');
  });

  it('CardLink stretches over the card as one named link', () => {
    render(
      <Card variant="interactive">
        <h3><CardLink href="/plan">Pro plan</CardLink></h3>
        <p>Details</p>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Pro plan' });
    expect(link).toHaveAttribute('data-card-link');
    expect(link.className).toContain('after:absolute');
  });
});
