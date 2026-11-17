import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Illustration, type IllustrationKind } from './Illustration.js';

const kinds: IllustrationKind[] = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance'];

describe('Illustration', () => {
  it.each(kinds)('%s is decorative, small and drawn with colour roles only', (kind) => {
    const { container } = render(<Illustration kind={kind} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-kind', kind);
    expect(svg.querySelectorAll('*').length).toBeGreaterThan(2);
    expect(svg.querySelectorAll('*').length).toBeLessThanOrEqual(25);
    expect(svg.outerHTML).not.toMatch(/#[0-9a-f]{3,6}\b|\bid=/i);
  });

  it('is an image when titled; size sets the box', () => {
    const { rerender } = render(<Illustration kind="notFound" title="Page not found" size="lg" className="mx-auto" />);
    const svg = screen.getByRole('img', { name: 'Page not found' });
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).toHaveClass('w-40', 'h-32', 'mx-auto');
    rerender(<Illustration kind="notFound" size="sm" />);
    expect(document.querySelector('svg')).toHaveClass('w-20', 'h-16');
  });
});
