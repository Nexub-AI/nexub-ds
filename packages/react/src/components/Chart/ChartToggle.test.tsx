import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartToggle } from './ChartToggle.js';

const series = [{ key: 'a', label: 'Web' }, { key: 'b', label: 'iOS' }];

describe('ChartToggle', () => {
  it('toggles series with pressed buttons, keeps colours stable and never hides the last one', () => {
    const seen: string[][] = [];
    render(
      <ChartToggle series={series}>
        {(visible) => {
          seen.push(visible.map((s) => `${s.key}:${s.color}`));
          return null;
        }}
      </ChartToggle>,
    );
    const web = screen.getByRole('button', { name: 'Web' });
    expect(web.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(web);
    expect(web.getAttribute('aria-pressed')).toBe('false');
    expect(seen.at(-1)).toEqual(['b:2']);
    fireEvent.click(screen.getByRole('button', { name: 'iOS' }));
    expect(screen.getByRole('button', { name: 'iOS' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('group', { name: 'Series' })).toBeTruthy();
  });
});
