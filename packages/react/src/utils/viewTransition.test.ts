import { describe, it, expect, vi, afterEach } from 'vitest';
import { startViewTransition } from './viewTransition.js';

describe('startViewTransition', () => {
  afterEach(() => {
    delete (document as { startViewTransition?: unknown }).startViewTransition;
  });

  it('runs the update directly when the API is missing', () => {
    const update = vi.fn();
    startViewTransition(update);
    expect(update).toHaveBeenCalledOnce();
  });

  it('hands the update to document.startViewTransition when present', () => {
    const native = vi.fn((cb: () => void) => cb());
    (document as { startViewTransition?: unknown }).startViewTransition = native;
    const update = vi.fn();
    startViewTransition(update);
    expect(native).toHaveBeenCalledWith(update);
    expect(update).toHaveBeenCalledOnce();
  });
});
