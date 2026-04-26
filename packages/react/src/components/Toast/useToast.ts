'use client';

import { useState, useEffect } from 'react';

export type ToastTone = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

type Listener = (items: ToastItem[]) => void;

// Store state on globalThis so it survives HMR in development.
type ToastGlobal = {
  __nexub_toast_items: ToastItem[];
  __nexub_toast_listeners: Set<Listener>;
  __nexub_toast_counter: number;
};
const g = globalThis as typeof globalThis & ToastGlobal;
g.__nexub_toast_items ??= [];
g.__nexub_toast_listeners ??= new Set();
g.__nexub_toast_counter ??= 0;

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

function dismiss(id?: string) {
  g.__nexub_toast_items = id ? g.__nexub_toast_items.filter((i) => i.id !== id) : [];
  notify();
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
  dismiss,
};
