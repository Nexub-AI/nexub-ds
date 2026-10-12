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

describe('Link rel hardening', () => {
  it('callers cannot drop noopener on external links', () => {
    render(<Link href="https://x.io" external rel="author">x</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'author noopener noreferrer');
  });

  it('adds noopener to target=_blank without `external`', () => {
    render(<Link href="https://x.io" target="_blank">x</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
