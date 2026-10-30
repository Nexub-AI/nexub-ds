'use client';

import Link from 'next/link';
import { Button, EmptyState } from '@nexub/react';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <EmptyState.Root>
        <EmptyState.Title>Page not found</EmptyState.Title>
        <EmptyState.Description>
          The page you&apos;re looking for doesn&apos;t exist or has moved. Search with ⌘K, or start from the home page.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    </main>
  );
}
