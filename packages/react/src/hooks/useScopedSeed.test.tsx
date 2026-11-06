import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScopedSeed } from './useScopedSeed.js';

function Box({ seed }: { seed: string | null }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useScopedSeed(ref, seed);
  return <div ref={ref} data-testid="box" />;
}

describe('useScopedSeed', () => {
  it('sets the seeded roles on the element and clears them with the seed', async () => {
    const { getByTestId, rerender } = render(<Box seed="#e4572e" />);
    const box = getByTestId('box');
    await waitFor(() => expect(box.style.getPropertyValue('--color-primary')).toMatch(/^light-dark\(#/));
    rerender(<Box seed={null} />);
    expect(box.style.getPropertyValue('--color-primary')).toBe('');
  });
});
