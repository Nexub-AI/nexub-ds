import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
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
