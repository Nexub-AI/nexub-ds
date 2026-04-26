import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { toast, useToastStore } from './useToast.js';

// Reset module-level state before each test by dismissing all toasts
beforeEach(() => {
  act(() => {
    toast.dismiss();
  });
});

describe('useToastStore', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useToastStore());
    expect(result.current).toHaveLength(0);
  });

  it('toast.success adds an item with tone=success', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success('Operation succeeded');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]!.title).toBe('Operation succeeded');
    expect(result.current[0]!.tone).toBe('success');
    expect(result.current[0]!.id).toBeTruthy();
  });

  it('toast.error adds an item with tone=error', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.error('Something went wrong');
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]!.tone).toBe('error');
  });

  it('toast.info adds an item with tone=info', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.info('Heads up');
    });

    expect(result.current[0]!.tone).toBe('info');
  });

  it('toast.warning adds an item with tone=warning', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.warning('Be careful');
    });

    expect(result.current[0]!.tone).toBe('warning');
  });

  it('toast.custom adds an item with tone=neutral', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.custom('Custom message');
    });

    expect(result.current[0]!.tone).toBe('neutral');
  });

  it('multiple toasts accumulate', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success('First');
      toast.error('Second');
      toast.info('Third');
    });

    expect(result.current).toHaveLength(3);
  });

  it('toast.dismiss(id) removes a specific toast', () => {
    const { result } = renderHook(() => useToastStore());

    let id: string;
    act(() => {
      id = toast.success('To be dismissed');
      toast.error('Keep me');
    });

    act(() => {
      toast.dismiss(id!);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]!.title).toBe('Keep me');
  });

  it('toast.dismiss() without id removes all toasts', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success('One');
      toast.error('Two');
    });

    act(() => {
      toast.dismiss();
    });

    expect(result.current).toHaveLength(0);
  });

  it('supports optional description and duration', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      toast.success('With extras', { description: 'More detail', duration: 3000 });
    });

    expect(result.current[0]!.description).toBe('More detail');
    expect(result.current[0]!.duration).toBe(3000);
  });
});
