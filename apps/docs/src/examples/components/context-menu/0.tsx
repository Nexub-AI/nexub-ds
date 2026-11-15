'use client'; // docs preview: server pages import every example

import { ContextMenu } from '@nexub/react';

export default function Example() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex h-32 w-64 select-none items-center justify-center rounded-shape-container border-2 border-dashed border-[var(--color-outline-variant)] text-body-sm text-[var(--color-on-surface-muted)]">
        Right-click here
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item>Rename</ContextMenu.Item>
          <ContextMenu.Item>Duplicate</ContextMenu.Item>
          <ContextMenu.Item>Copy link</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Move to trash</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
