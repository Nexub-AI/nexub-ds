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
            'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-shape-container bg-[var(--color-inverse-surface)] py-3 pl-4 pr-2 text-[var(--color-inverse-on-surface)] shadow-elevation-2',
            'duration-spatial-default ease-spatial-default data-[state=closed]:duration-effects-fast',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
            toneMap[t.tone ?? 'neutral'],
          )}
          duration={t.duration ?? 5000}
        >
          <div className="grid gap-1">
            <RadixToast.Title className="text-title-sm">{t.title}</RadixToast.Title>
            {t.description && (
              <RadixToast.Description className="text-body-sm text-[color-mix(in_srgb,var(--color-inverse-on-surface)_80%,transparent)]">
                {t.description}
              </RadixToast.Description>
            )}
          </div>
          {t.action && (
            <RadixToast.Action
              altText={t.action.label}
              onClick={t.action.onClick}
              className="shrink-0 rounded-md border border-[var(--color-border-default)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--color-bg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring-default)]"
            >
              {t.action.label}
            </RadixToast.Action>
          )}
          {/* Hidden until hover only on hover-capable devices; always visible on touch. */}
          <RadixToast.Close className="rounded-md p-1 transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring-default)]">
            <X size="sm" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed top-0 right-0 z-[var(--z-toast,2000)] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-sm gap-2" />
    </RadixToast.Provider>
  );
}

Toaster.displayName = 'Toaster';
