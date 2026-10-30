'use client';

import * as React from 'react';
import { Check, Copy } from '@nexub/icons';
import { IconButton } from '@nexub/react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (non-HTTPS, permissions denied).
      // Fall back to the legacy execCommand approach.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-999px;left:-999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      {/* Screen-reader live region announces copy success */}
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
      <IconButton
        size="sm"
        variant="subtle"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy code'}
        label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        className={'nx-press !h-7 !w-7 ' + (copied ? '!text-[var(--color-success)]' : '')}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </IconButton>
    </>
  );
}
