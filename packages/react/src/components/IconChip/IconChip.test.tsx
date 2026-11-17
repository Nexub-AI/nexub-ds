import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconChip } from './IconChip.js';

describe('IconChip', () => {
  it('is decorative by default and carries its category', () => {
    const { container } = render(<IconChip category="violet"><svg /></IconChip>);
    const chip = container.firstElementChild!;
    expect(chip.getAttribute('aria-hidden')).toBe('true');
    expect(chip.getAttribute('data-category')).toBe('violet');
  });

  it('becomes an image when labelled; without a category it is neutral', () => {
    render(<IconChip aria-label="Payments" shape="circle" size="lg"><svg /></IconChip>);
    const chip = screen.getByRole('img', { name: 'Payments' });
    expect(chip.hasAttribute('data-category')).toBe(false);
    expect(chip.className).toContain('rounded-full');
    expect(chip.className).toContain('size-12');
  });
});
