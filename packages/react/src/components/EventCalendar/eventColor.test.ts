import { describe, it, expect, vi } from 'vitest';
import { contrastRatio } from '../ColorPicker/contrast.js';
import { SURFACE, TIME_OPACITY, composite, eventColorScheme, eventColorVars, parseColor } from './eventColor.js';

// Company colours in every syntax we read, from pale to dark, saturated to grey.
const brands = [
  '#ffd400', // yellow
  '#00a86b', // jade
  '#e4002b', // red
  '#0b1f4d', // navy
  '#ff7a00', // orange
  '#7c3aed', // violet
  '#9ca3af', // grey
  '#ffffff',
  '#000000',
  'rgb(0, 174, 239)',
  'rgb(255 105 180 / 0.8)',
  'hsl(160 84% 39%)',
  'oklch(0.7 0.15 200)',
  'oklch(62% 0.25 29)',
  'oklab(0.85 -0.05 0.1)',
];

describe('eventColor', () => {
  it('parses hex, rgb(), hsl(), oklab() and oklch()', () => {
    const bytes = (c: string) => {
      const rgb = parseColor(c);
      return rgb && rgb.map((n) => Math.round(n * 255));
    };
    expect(bytes('#f80')).toEqual([255, 136, 0]);
    expect(bytes('#FF8800cc')).toEqual([255, 136, 0]);
    expect(bytes('rgb(255, 136, 0)')).toEqual([255, 136, 0]);
    expect(bytes('rgba(100% 0% 0% / 50%)')).toEqual([255, 0, 0]);
    expect(bytes('hsl(120, 100%, 25%)')).toEqual([0, 128, 0]);
    expect(bytes('oklch(1 0 0)')).toEqual([255, 255, 255]);
    expect(bytes('oklab(0 0 0)')).toEqual([0, 0, 0]);
    // oklch(62.8% 0.2577 29.23) is sRGB red.
    expect(bytes('oklch(62.8% 0.2577 29.23deg)')).toEqual([255, 0, 0]);
    for (const bad of ['red', 'var(--x)', '#12', 'rgb(1, 2)', 'url(x)', 'rgb(a b c)']) expect(parseColor(bad)).toBeNull();
  });

  it.each(brands)('%s reaches AA text on its container in light and dark', (color) => {
    for (const theme of ['light', 'dark'] as const) {
      const s = eventColorScheme(color, theme)!;
      expect(contrastRatio(s.onContainer, s.container)).toBeGreaterThanOrEqual(4.5);
      // The start time is drawn at 80% opacity, and still passes.
      expect(contrastRatio(composite(s.onContainer, s.container, TIME_OPACITY), s.container)).toBeGreaterThanOrEqual(4.5);
      // The marker stands out from the surface (3:1, non-text).
      expect(contrastRatio(s.marker, SURFACE[theme])).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the dark container dark and the light one light', () => {
    for (const color of brands) {
      const light = eventColorScheme(color, 'light')!;
      const dark = eventColorScheme(color, 'dark')!;
      expect(contrastRatio(dark.container, '#ffffff')!).toBeGreaterThan(contrastRatio(dark.container, '#000000')!);
      expect(contrastRatio(light.container, '#000000')!).toBeGreaterThan(contrastRatio(light.container, '#ffffff')!);
    }
  });

  it('gives light-dark() variables mixed into the surface token, and warns once for an unreadable colour', () => {
    const vars = eventColorVars('#00a86b')!;
    expect(vars['--nx-event-bg']).toBe(
      'light-dark(color-mix(in oklab, #00a86b 20%, var(--color-surface)), color-mix(in oklab, #00a86b 30%, var(--color-surface)))',
    );
    expect(vars['--nx-event-fg']).toMatch(/^light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(eventColorVars('brand-blue')).toBeNull();
    expect(eventColorVars('brand-blue')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]![0])).toContain('"brand-blue"');
    warn.mockRestore();
  });
});
