'use client';

// ToolCall's Retry (12.4): the only part of ToolCall that takes a callback, so
// it is its own small client module and ToolCall itself stays server-safe.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { pressable } from '../../utils/control.js';

export function ToolCallRetry({ retry, children }: { retry: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={retry}
      className={cn(pressable, 'nx-hit inline-flex h-control-sm items-center border border-[var(--color-outline-variant)] bg-transparent px-3.5 text-label-md text-[var(--color-on-surface)]')}
    >
      {children}
    </button>
  );
}
