'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

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
      <span role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {copied ? 'Copied to clipboard' : ''}
      </span>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy code'}
        aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        background: 'var(--docs-copy-btn-bg, rgba(255,255,255,0.08))',
        border: '1px solid var(--docs-copy-btn-border, rgba(255,255,255,0.12))',
        borderRadius: 'var(--radius-md)',
        color: copied ? 'var(--color-semantic-success-default)' : 'var(--color-text-muted)',
        cursor: 'pointer',
        transition: 'color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
      }}
    >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </>
  );
}
