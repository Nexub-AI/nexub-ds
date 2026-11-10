'use client';

import { useState, useEffect, type ReactNode } from 'react';

/** `loading` shows a spinner and never auto-dismisses; update it (or use `toast.promise`) to settle it. */
export type ToastTone = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'loading';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  /** Leading icon. Defaults to the tone's icon (none for neutral); `false` hides it. */
  icon?: ReactNode | false;
  /** A thin bar counting down the time left before auto-dismiss; pauses with the timer. */
  showProgress?: boolean;
  action?: { label: string; onClick: () => void };
  /** An Undo action; its label defaults to the `undo` message. Set by `toast.undoable`. */
  undo?: { label?: string; onUndo: () => void };
  /** Called once when the toast closes, however it closes (timer, swipe, close, action, dismiss). */
  onClose?: () => void;
}

export interface UndoableToastOptions {
  /** Called when Undo is clicked; the toast then closes. */
  onUndo: () => void;
  /** Called once when the toast closes any other way — the change is final. */
  onCommit?: () => void;
  /** @default the `undo` message ('Undo') */
  undoLabel?: string;
  description?: string;
  duration?: number;
}

type Listener = (items: ToastItem[]) => void;

// Store state so it survives HMR in development.
// On the CLIENT we attach to globalThis so that multiple mounted <Toaster>
// instances share the same queue (cross-component communication).
// On the SERVER each module evaluation gets a fresh local object — this
// prevents toast state from leaking across concurrent SSR requests, which
// share the same Node.js process and therefore the same globalThis.
type ToastGlobal = {
  __nexub_toast_items: ToastItem[];
  __nexub_toast_listeners: Set<Listener>;
  __nexub_toast_counter: number;
};

const g: ToastGlobal =
  typeof window !== 'undefined'
    ? (() => {
        const _g = globalThis as typeof globalThis & ToastGlobal;
        _g.__nexub_toast_items ??= [];
        _g.__nexub_toast_listeners ??= new Set();
        _g.__nexub_toast_counter ??= 0;
        return _g;
      })()
    : { __nexub_toast_items: [], __nexub_toast_listeners: new Set(), __nexub_toast_counter: 0 };

function notify() {
  g.__nexub_toast_listeners.forEach((l) => l([...g.__nexub_toast_items]));
}

function add(item: Omit<ToastItem, 'id'>): string {
  const id = String(++g.__nexub_toast_counter);
  g.__nexub_toast_items = [...g.__nexub_toast_items, { ...item, id }];
  notify();
  return id;
}

export function useToastStore(): ToastItem[] {
  const [state, setState] = useState<ToastItem[]>([...g.__nexub_toast_items]);
  useEffect(() => {
    g.__nexub_toast_listeners.add(setState);
    return () => {
      g.__nexub_toast_listeners.delete(setState);
    };
  }, []);
  return state;
}

// Ids whose onClose already ran (closed in the Toaster, not yet removed from the store).
const closeFired = new Set<string>();

/** Runs a toast's onClose at most once. Internal: the Toaster calls it when Radix closes a toast. */
export function fireToastClose(item: ToastItem) {
  if (closeFired.has(item.id)) return;
  closeFired.add(item.id);
  item.onClose?.();
}

function dismiss(id?: string) {
  const removed = id ? g.__nexub_toast_items.filter((i) => i.id === id) : g.__nexub_toast_items;
  g.__nexub_toast_items = id ? g.__nexub_toast_items.filter((i) => i.id !== id) : [];
  notify();
  for (const item of removed) {
    fireToastClose(item);
    closeFired.delete(item.id);
  }
}

/** Changes an open toast in place (same element; a settled tone is announced once). No-op if it's gone. */
function update(id: string, patch: Partial<Omit<ToastItem, 'id'>>) {
  g.__nexub_toast_items = g.__nexub_toast_items.map((i) => (i.id === id ? { ...i, ...patch } : i));
  notify();
}

export interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
}

/** Shows a loading toast, then turns that same toast into success or error. Returns `promise` as is. */
function promise<T>(promise: Promise<T>, { loading, success, error }: PromiseToastOptions<T>): Promise<T> {
  const id = add({ title: loading, tone: 'loading' });
  promise.then(
    (v) => update(id, { title: typeof success === 'function' ? success(v) : success, tone: 'success' }),
    (e) => update(id, { title: typeof error === 'function' ? error(e) : error, tone: 'error' }),
  );
  return promise;
}

function undoable(title: string, { onUndo, onCommit, undoLabel, description, duration }: UndoableToastOptions) {
  let undone = false;
  return add({
    title,
    tone: 'neutral',
    description,
    duration,
    undo: { label: undoLabel, onUndo: () => { undone = true; onUndo(); } },
    onClose: () => { if (!undone) onCommit?.(); },
  });
}

export const toast = {
  success: (title: string, opts?: Partial<Omit<ToastItem, 'id' | 'title' | 'tone'>>) =>
    add({ title, tone: 'success', ...opts }),
  error: (title: string, opts?: Partial<Omit<ToastItem, 'id' | 'title' | 'tone'>>) =>
    add({ title, tone: 'error', ...opts }),
  info: (title: string, opts?: Partial<Omit<ToastItem, 'id' | 'title' | 'tone'>>) =>
    add({ title, tone: 'info', ...opts }),
  warning: (title: string, opts?: Partial<Omit<ToastItem, 'id' | 'title' | 'tone'>>) =>
    add({ title, tone: 'warning', ...opts }),
  custom: (title: string, opts?: Partial<Omit<ToastItem, 'id' | 'title' | 'tone'>>) =>
    add({ title, tone: 'neutral', ...opts }),
  /** A toast with an Undo action: Undo calls `onUndo`; any other close calls `onCommit`, once. */
  undoable,
  update,
  promise,
  dismiss,
};
