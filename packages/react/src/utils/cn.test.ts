import { describe, it, expect } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('keeps a type-role size next to a text color', () => {
    expect(cn('text-label-lg', 'text-[var(--color-on-primary)]')).toBe('text-label-lg text-[var(--color-on-primary)]');
  });

  it('lets a later utility override token-scale classes', () => {
    expect(cn('rounded-shape-control', 'rounded-md')).toBe('rounded-md');
    expect(cn('h-control-md', 'h-9')).toBe('h-9');
    expect(cn('shadow-elevation-1', 'shadow-elevation-3')).toBe('shadow-elevation-3');
    expect(cn('text-body-md', 'text-label-sm')).toBe('text-label-sm');
  });

  it('keeps a bare outline (Tailwind 3: the style) next to an outline width', () => {
    expect(cn('outline outline-[3px] outline-offset-2')).toBe('outline outline-[3px] outline-offset-2');
    expect(cn('outline-2', 'outline-[3px]')).toBe('outline-[3px]');
    expect(cn('outline-dashed', 'outline')).toBe('outline');
  });
});
