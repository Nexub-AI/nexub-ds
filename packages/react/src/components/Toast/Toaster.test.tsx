import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, act, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Toaster } from './Toaster.js';
import { toast } from './useToast.js';

afterEach(() => {
  vi.useRealTimers();
  act(() => toast.dismiss());
});

const toastEl = (title: string) => screen.getByText(title).closest('li') as HTMLElement;
const viewport = () => document.querySelector('ol') as HTMLOListElement;
const region = () => screen.getByRole('region', { name: /Notifications/ });

function fire(n: number, opts?: { duration?: number }) {
  act(() => {
    for (let i = 0; i < n; i++) toast.custom(`T${i}`, opts);
  });
}

describe('Toaster', () => {
  it('renders the toast action and calls it', () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.custom('Message archived', { action: { label: 'Undo', onClick } });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('stacks newest first: index vars, front, and hidden beyond visibleToasts', async () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(50);
    render(<Toaster />);
    fire(5);
    // Newest (T4) is index 0.
    await waitFor(() => expect(toastEl('T4').style.getPropertyValue('--nx-toast-index')).toBe('0'));
    const expected: [string, number, string, string][] = [
      ['T4', 0, 'true', 'false'],
      ['T3', 1, 'false', 'false'],
      ['T2', 2, 'false', 'false'],
      ['T1', 3, 'false', 'true'],
      ['T0', 4, 'false', 'true'],
    ];
    for (const [title, i, front, hidden] of expected) {
      const el = toastEl(title);
      expect(el.style.getPropertyValue('--nx-toast-index')).toBe(String(i));
      expect(el.style.getPropertyValue('--nx-toast-offset')).toBe(`${i * 58}px`);
      expect(el).toHaveAttribute('data-front', front);
      expect(el).toHaveAttribute('data-hidden', hidden);
    }
    // Hidden toasts stay in the accessibility tree (no aria-hidden), just visually hidden.
    expect(toastEl('T0')).not.toHaveAttribute('aria-hidden');
    expect(toastEl('T0').className).toContain('data-[hidden=true]:opacity-0');
    expect(toastEl('T0').className).toContain('data-[hidden=true]:pointer-events-none');
    // Collapsed: the container is the front toast's height.
    expect(viewport()).toHaveAttribute('data-expanded', 'false');
    expect(viewport().style.getPropertyValue('--nx-front-height')).toBe('50px');
    expect(viewport().style.getPropertyValue('--nx-stack-height')).toBe('50px');
    spy.mockRestore();
  });

  it('respects visibleToasts', async () => {
    render(<Toaster visibleToasts={1} />);
    fire(2);
    await waitFor(() => expect(toastEl('T0')).toHaveAttribute('data-hidden', 'true'));
    expect(toastEl('T1')).toHaveAttribute('data-hidden', 'false');
  });

  it('expands on hover and collapses on leave', async () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
    render(<Toaster />);
    fire(3);
    fireEvent.pointerMove(viewport());
    expect(viewport()).toHaveAttribute('data-expanded', 'true');
    // Three visible toasts of 40px + two 8px gaps.
    await waitFor(() => expect(viewport().style.getPropertyValue('--nx-stack-height')).toBe('136px'));
    fireEvent.pointerLeave(region());
    expect(viewport()).toHaveAttribute('data-expanded', 'false');
    expect(viewport().style.getPropertyValue('--nx-stack-height')).toBe('40px');
    spy.mockRestore();
  });

  it('expands while focus is within and collapses when it leaves', () => {
    render(
      <>
        <button>outside</button>
        <Toaster />
      </>,
    );
    act(() => {
      toast.custom('Saved', { action: { label: 'Undo', onClick: () => {} } });
    });
    act(() => screen.getByRole('button', { name: 'Undo' }).focus());
    expect(viewport()).toHaveAttribute('data-expanded', 'true');
    act(() => screen.getByRole('button', { name: 'outside' }).focus());
    expect(viewport()).toHaveAttribute('data-expanded', 'false');
  });

  it('places the stack by position', () => {
    const { rerender } = render(<Toaster />);
    expect(viewport()).toHaveClass('top-0', 'end-0');
    rerender(<Toaster position="bottom-center" />);
    expect(viewport()).toHaveAttribute('data-position', 'bottom-center');
    expect(viewport()).toHaveClass('bottom-0', 'mx-auto');
    expect(viewport()).not.toHaveClass('top-0');
  });

  it('expand forces the list', () => {
    render(<Toaster expand />);
    fire(2);
    expect(viewport()).toHaveAttribute('data-expanded', 'true');
  });

  it('pauses auto-dismiss while expanded and resumes after', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    fire(1, { duration: 1000 });
    act(() => vi.advanceTimersByTime(400));
    fireEvent.pointerMove(viewport());
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('T0')).toBeInTheDocument();
    fireEvent.pointerLeave(region());
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText('T0')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('T0', { selector: 'li *' })).toBeNull();
  });

  it('a closed toast leaves the stack order', async () => {
    render(<Toaster />);
    fire(2);
    fireEvent.click(toastEl('T1').querySelector('button')!);
    await waitFor(() => expect(toastEl('T0')).toHaveAttribute('data-front', 'true'));
    expect(toastEl('T0').style.getPropertyValue('--nx-toast-index')).toBe('0');
  });

  it('keeps the labelled region and live announcement', async () => {
    render(<Toaster />);
    act(() => {
      toast.success('Profile saved');
    });
    expect(screen.getByRole('region', { name: /Notifications/ })).toBeInTheDocument();
    await waitFor(() => {
      const live = Array.from(document.querySelectorAll('[aria-live="assertive"], [aria-live="polite"]'));
      expect(live.some((n) => n.textContent?.includes('Profile saved'))).toBe(true);
    });
  });
});

describe('Toaster strict CSP', () => {
  // The only style attribute is Radix's own viewport wrapper
  // (pointer-events: none while empty); the stack writes nothing inline.
  const styles = (html: string) => html.match(/ style="[^"]*"/g) ?? [];

  it('empty Toaster', () => {
    expect(styles(renderToString(<Toaster />))).toEqual([' style="pointer-events:none"']);
  });

  it('Toaster with an item', () => {
    toast.custom('Server toast');
    const html = renderToString(<Toaster />);
    expect(styles(html)).toEqual([' style="pointer-events:none"']);
  });
});

describe('Toaster store cleanup', () => {
  it('removes a closed toast from the store after its exit animation', () => {
    vi.useFakeTimers();
    const t = toast;
    t.dismiss();
    render(<Toaster />);
    act(() => { t.info('Saved'); });
    const close = screen.getAllByRole('button', { name: /close|dismiss/i })[0]!;
    act(() => { close.click(); });
    act(() => { vi.advanceTimersByTime(1100); });
    expect((globalThis as { __nexub_toast_items?: unknown[] }).__nexub_toast_items ?? []).toHaveLength(0);
    vi.useRealTimers();
  });
});

describe('toast.undoable', () => {
  function setup(opts?: { duration?: number }) {
    vi.useFakeTimers();
    const onUndo = vi.fn();
    const onCommit = vi.fn();
    render(<Toaster />);
    act(() => { toast.undoable('Row deleted', { onUndo, onCommit, ...opts }); });
    return { onUndo, onCommit };
  }

  it('Undo calls onUndo, closes the toast, and never commits', () => {
    const { onUndo, onCommit } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText('Row deleted', { selector: 'li *' })).toBeNull();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('commits when the timer runs out', () => {
    const { onUndo, onCommit } = setup({ duration: 1000 });
    act(() => vi.advanceTimersByTime(999));
    expect(onCommit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(10));
    expect(onCommit).toHaveBeenCalledOnce();
    expect(onUndo).not.toHaveBeenCalled();
  });

  it('commits on the close button, exactly once through store cleanup', () => {
    const { onCommit } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCommit).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(5000)); // Toaster removes it from the store
    expect(onCommit).toHaveBeenCalledOnce();
  });

  it('commits once on programmatic dismiss', () => {
    const { onCommit } = setup();
    act(() => toast.dismiss());
    act(() => toast.dismiss());
    expect(onCommit).toHaveBeenCalledOnce();
  });

  it('uses undoLabel', () => {
    setup();
    act(() => { toast.undoable('Archived', { onUndo: () => {}, undoLabel: 'Restore' }); });
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument();
  });
});

describe('7.4 feedback', () => {
  it('toast.promise: loading, then the same toast settles to success and is announced once', async () => {
    let resolve!: (v: number) => void;
    const p = new Promise<number>((r) => { resolve = r; });
    render(<Toaster />);
    let returned: Promise<number> | undefined;
    act(() => { returned = toast.promise(p, { loading: 'Saving…', success: (n) => `Saved ${n}`, error: 'Failed' }); });
    expect(returned).toBe(p);
    const li = toastEl('Saving…');
    expect(li.querySelector('.animate-spin')).toBeInTheDocument();
    expect(within(li).getByRole('status')).toHaveTextContent('');
    await act(async () => { resolve(3); await p; });
    expect(screen.getByText('Saved 3', { selector: '.text-title-sm' }).closest('li')).toBe(li); // same element, no remount
    expect(within(li).getByRole('status')).toHaveTextContent('Saved 3');
    expect(li.className).toContain('border-[var(--color-success)]');
  });

  it('toast.promise: error, from a function of the error', async () => {
    const p = Promise.reject(new Error('nope'));
    render(<Toaster />);
    act(() => { toast.promise(p, { loading: 'Saving…', success: 'ok', error: (e) => (e as Error).message }).catch(() => {}); });
    await waitFor(() => expect(screen.getByText('nope', { selector: '.text-title-sm' })).toBeInTheDocument());
  });

  it('a loading toast never auto-dismisses; updating it starts the timer', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    let id = '';
    act(() => {
      id = toast.custom('Working', { duration: 1000 });
      toast.update(id, { tone: 'loading' });
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('Working')).toBeInTheDocument();
    act(() => toast.update(id, { title: 'Done', tone: 'success' }));
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.queryByText('Done', { selector: 'li *' })).toBeNull();
  });

  it('tone icons: default per tone, icon={false} hides, custom replaces', () => {
    render(<Toaster />);
    act(() => {
      toast.success('A');
      toast.success('B', { icon: false });
      toast.info('C', { icon: <i data-testid="custom" /> });
      toast.custom('D');
    });
    expect(toastEl('A').querySelector('svg[aria-hidden="true"]:not(button svg)')).toBeInTheDocument();
    expect(toastEl('B').querySelector('svg:not(button svg)')).toBeNull();
    expect(within(toastEl('C')).getByTestId('custom')).toBeInTheDocument();
    expect(toastEl('D').querySelector('svg:not(button svg)')).toBeNull();
  });

  it('showProgress renders a countdown bar that pauses with the timer', () => {
    render(<Toaster />);
    act(() => { toast.info('Bar', { showProgress: true, duration: 3000 }); });
    const bar = toastEl('Bar').querySelector('span[aria-hidden="true"].origin-left') as HTMLElement;
    expect(bar.style.animationDuration).toBe('3000ms');
    expect(bar.className).toContain('group-data-[paused]:[animation-play-state:paused]');
    fireEvent.pointerMove(viewport());
    expect(toastEl('Bar')).toHaveAttribute('data-paused');
    fireEvent.pointerLeave(region());
    expect(toastEl('Bar')).not.toHaveAttribute('data-paused');
  });

  it('a fast short flick toward the edge dismisses; a slow one snaps back', () => {
    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
    proto.setPointerCapture = () => {};
    proto.hasPointerCapture = () => false;
    proto.releasePointerCapture = () => {};
    const now = vi.spyOn(performance, 'now');
    render(<Toaster />);
    fire(2);
    const swipe = (li: HTMLElement, ms: number) => {
      now.mockReturnValue(0);
      fireEvent.pointerDown(li, { button: 0, clientX: 0, clientY: 0 });
      fireEvent.pointerMove(li, { clientX: 5, clientY: 0 });
      now.mockReturnValue(ms);
      fireEvent.pointerMove(li, { clientX: 20, clientY: 0 });
      fireEvent.pointerUp(li, { clientX: 20, clientY: 0 });
    };
    swipe(toastEl('T1'), 1000); // 20px in 1s: below threshold and slow
    expect(toastEl('T1')).toHaveAttribute('data-state', 'open');
    expect(toastEl('T1')).toHaveAttribute('data-swipe', 'cancel');
    swipe(toastEl('T1'), 50); // 20px in 50ms: a flick (jsdom has no exit animation, so it unmounts)
    expect(screen.queryByText('T1', { selector: 'li *' })).toBeNull();
    expect(screen.getByText('T0', { selector: 'li *' })).toBeInTheDocument();
    now.mockRestore();
  });
});
