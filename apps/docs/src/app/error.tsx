'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button, EmptyState } from '@nexub/react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[docs error boundary]', error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center p-8">
      <EmptyState.Root>
        <EmptyState.Title>Something went wrong</EmptyState.Title>
        <EmptyState.Description>
          An unexpected error occurred. Try again or go back home.{error.digest ? ` Error ID: ${error.digest}` : ''}
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outlined">
            <Link href="/">Home</Link>
          </Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    </main>
  );
}
