'use client'; // docs preview: server pages import every example

import { EmptyState, Button } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="var(--color-outline-variant)" strokeWidth="2" />
          <path d="M18 24h12M24 18v12" stroke="var(--color-on-surface-muted)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </EmptyState.Illustration>
      <EmptyState.Title>No results found</EmptyState.Title>
      <EmptyState.Description>Try adjusting your search or filters to find what you&apos;re looking for.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="filled" size="sm">Clear filters</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}
