import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Link } from './Link.js';

describe('Link', () => {
  it('renders children', () => {
    render(<Link href="#">Click me</Link>);
    expect(screen.getByRole('link', { name: /click me/i })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Link href="#" className="custom">link</Link>);
    expect(screen.getByRole('link')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="#">link</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('sets target and rel for external links', () => {
    render(<Link href="https://example.com" external>External</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not set target/rel by default', () => {
    render(<Link href="#">Internal</Link>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
  });
});
