import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { startViewTransition } from './viewTransition.js';

describe('startViewTransition', () => {
  afterEach(() => {
    delete (document as { startViewTransition?: unknown }).startViewTransition;
  });

  it('runs the update directly when the API is missing, and resolves', async () => {
    const update = vi.fn();
    await expect(startViewTransition(update)).resolves.toBeUndefined();
    expect(update).toHaveBeenCalledOnce();
  });

  it('hands the update to document.startViewTransition and returns its finished promise', async () => {
    const finished = Promise.resolve();
    const native = vi.fn((cb: () => void) => {
      cb();
      return { finished };
    });
    (document as { startViewTransition?: unknown }).startViewTransition = native;
    const update = vi.fn();
    await expect(startViewTransition(update)).resolves.toBeUndefined();
    expect(native).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
  });

  it('flushes React state inside the callback, so the snapshot sees the new DOM', () => {
    let seen = '';
    (document as { startViewTransition?: unknown }).startViewTransition = (cb: () => void) => {
      cb();
      seen = screen.getByTestId('v').textContent ?? '';
      return { finished: Promise.resolve() };
    };
    let set!: (v: string) => void;
    function V() {
      const [v, setV] = React.useState('old');
      set = setV;
      return React.createElement('span', { 'data-testid': 'v' }, v);
    }
    render(React.createElement(V));
    act(() => {
      void startViewTransition(() => set('new'));
    });
    expect(seen).toBe('new');
  });
});
