import * as React from 'react';
import { CopyButton } from './CopyButton';

const LANG_LABEL: Record<string, string> = {
  tsx: 'TSX',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  html: 'HTML',
  bash: 'Terminal',
  css: 'CSS',
  json: 'JSON',
};

interface CodeFrameProps {
  /** Raw source, for the copy button. */
  code: string;
  /** Filename shown in the header; falls back to the language name. */
  title?: string;
  lang?: string;
  /** Line numbers in the gutter (CSS counters on `.line`). */
  lineNumbers?: boolean;
  className?: string;
  /** The code body: Shiki HTML (CodeBlock) or a plain <pre> (client snippets). */
  children: React.ReactNode;
}

/**
 * The one editor surface every docs code sample sits on: its own code surface
 * token (not surface-container, so blocks never read as inline code), a
 * hairline border, and a header bar carrying the filename/language and the
 * copy button. Server-safe: used by the Shiki CodeBlock and by client snippets.
 */
export function CodeFrame({ code, title, lang, lineNumbers, className, children }: CodeFrameProps) {
  const label = title ?? (lang ? (LANG_LABEL[lang] ?? lang) : undefined);
  return (
    <figure className={'docs-code m-0 ' + (lineNumbers ? 'docs-code-lines ' : '') + (className ?? '')}>
      <figcaption className="docs-code-header">
        <span className="docs-code-label">{label}</span>
        <CopyButton text={code} />
      </figcaption>
      <div className="docs-code-body">{children}</div>
    </figure>
  );
}

/** A plain (un-highlighted) snippet on the same surface, for client components. */
export function CodeSnippet({ code, ...rest }: Omit<CodeFrameProps, 'children'>) {
  return (
    <CodeFrame code={code} {...rest}>
      <pre>
        <code>{code}</code>
      </pre>
    </CodeFrame>
  );
}
