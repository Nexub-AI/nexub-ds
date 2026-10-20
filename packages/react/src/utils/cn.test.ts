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
});
