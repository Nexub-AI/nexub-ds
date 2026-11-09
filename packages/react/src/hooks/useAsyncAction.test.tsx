import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAsyncAction } from './useAsyncAction.js';

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => ((resolve = res), (reject = rej)));
  return { promise, resolve, reject };
}

describe('useAsyncAction', () => {
  it('tracks pending and returns the result', async () => {
    const d = deferred<number>();
    const { result } = renderHook(() => useAsyncAction(() => d.promise));
    let out: Promise<number | undefined>;
    act(() => void (out = result.current.run()));
    expect(result.current.pending).toBe(true);
    await act(async () => d.resolve(7));
    expect(await out!).toBe(7);
    expect(result.current.pending).toBe(false);
  });

  it('catches errors into `error` without rejecting; reset clears it', async () => {
    const boom = new Error('boom');
    const { result } = renderHook(() => useAsyncAction(async () => { throw boom; }));
    await act(async () => expect(await result.current.run()).toBeUndefined());
    expect(result.current.error).toBe(boom);
    expect(result.current.pending).toBe(false);
    act(() => result.current.reset());
    expect(result.current.error).toBeUndefined();
  });

  it('the latest call wins', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const calls = [first, second];
    const { result } = renderHook(() => useAsyncAction(() => calls.shift()!.promise));
    let a: Promise<string | undefined>, b: Promise<string | undefined>;
    act(() => {
      a = result.current.run();
      b = result.current.run();
    });
    await act(async () => first.reject(new Error('stale')));
    expect(result.current.pending).toBe(true);
    expect(result.current.error).toBeUndefined();
    await act(async () => second.resolve('fresh'));
    expect(await a!).toBeUndefined();
    expect(await b!).toBe('fresh');
    expect(result.current.pending).toBe(false);
  });

  it('ignores calls that settle after unmount', async () => {
    const d = deferred<number>();
    const { result, unmount } = renderHook(() => useAsyncAction(() => d.promise));
    let out: Promise<number | undefined>;
    act(() => void (out = result.current.run()));
    unmount();
    d.resolve(1);
    expect(await out!).toBeUndefined();
  });
});
