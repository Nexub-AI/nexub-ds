import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuccessCheck } from './SuccessCheck.js';

describe('SuccessCheck', () => {
  it('is decorative without a label and draws the tick', () => {
    const { container } = render(<SuccessCheck />);
    const mark = container.firstElementChild!;
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(mark.className).toContain('nx-success-check');
    expect(container.querySelector('path.nx-check-draw')).toBeTruthy();
  });

  it('is a named image with a label', () => {
    render(<SuccessCheck label="Payment sent" size="lg" />);
    expect(screen.getByRole('img', { name: 'Payment sent' }).className).toContain('size-16');
  });
});
