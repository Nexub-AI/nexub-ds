'use client';

// "Copy as Markdown" / "View as Markdown" for a component or pattern page. The
// .md files are the same references the AI tools get (scripts/build-ai-docs.mjs),
// copied into public/ at build time by scripts/copy-ai-md.mjs.
import * as React from 'react';
import { Check, Copy, FileText } from '@nexub/icons';
import { Button } from '@nexub/react';

export function MarkdownActions({ href }: { href: string }) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'error'>('idle');

  const copy = async () => {
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState('copied');
    } catch {
      setState('error');
    }
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outlined" onClick={copy} leadingIcon={state === 'copied' ? <Check /> : <Copy />}>
        {state === 'copied' ? 'Copied' : 'Copy as Markdown'}
      </Button>
      <Button size="sm" variant="text" asChild>
        <a href={href}>
          <FileText aria-hidden="true" className="size-4" />
          View as Markdown
        </a>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Page copied as Markdown' : state === 'error' ? 'Could not copy the page' : ''}
      </span>
    </div>
  );
}
