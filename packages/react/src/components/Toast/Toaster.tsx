import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useToastStore } from './useToast.js';

const toneMap: Record<string, string> = {
  success: 'border-l-4 border-[var(--color-semantic-success-default)]',
  error: 'border-l-4 border-[var(--color-semantic-error-default)]',
  warning: 'border-l-4 border-[var(--color-semantic-warning-default)]',
  info: 'border-l-4 border-[var(--color-semantic-info-default)]',
  neutral: '',
};

export function Toaster() {
  const toasts = useToastStore();
  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map((t) => (
        <RadixToast.Root
          key={t.id}
          className={cn(
            'group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-4 shadow-md transition-all',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
            toneMap[t.tone ?? 'neutral'],
          )}
          duration={t.duration ?? 5000}
        >
          <div className="grid gap-1">
            <RadixToast.Title className="text-sm font-semibold">{t.title}</RadixToast.Title>
            {t.description && (
              <RadixToast.Description className="text-sm text-[var(--color-text-muted)]">
                {t.description}
              </RadixToast.Description>
            )}
          </div>
          <RadixToast.Close className="rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring-default)]">
            <X size="sm" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed top-0 right-0 z-[var(--z-toast,2000)] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-sm gap-2" />
    </RadixToast.Provider>
  );
}
