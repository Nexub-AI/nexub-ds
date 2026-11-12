'use client'; // docs preview: server pages import every example

import { EmptyState, Button } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <rect width="80" height="80" rx="40" fill="var(--color-surface-container-low)" />
          <rect x="24" y="28" width="32" height="24" rx="4" stroke="var(--color-outline)" strokeWidth="2" />
          <path d="M24 36h32" stroke="var(--color-outline)" strokeWidth="2" />
          <circle cx="40" cy="48" r="4" fill="color-mix(in srgb, var(--color-on-surface) 38%, transparent)" />
        </svg>
      </EmptyState.Illustration>
      <EmptyState.Title>No documents yet</EmptyState.Title>
      <EmptyState.Description>Upload your first document to get started.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="filled">Upload document</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}
