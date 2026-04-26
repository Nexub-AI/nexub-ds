import { createHighlighter, type Highlighter } from 'shiki';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

// Persist the Shiki instance on globalThis so it survives Next.js hot-module
// replacement in dev mode. Without this, every file save re-imports the module,
// resets the module-level variable, and forces Shiki to reload its WASM + grammars
// (~800 ms cold start). globalThis persists for the lifetime of the Node process.
declare global {
  // eslint-disable-next-line no-var
  var __shikiHighlighter: Promise<Highlighter> | undefined;
}

function getHighlighter(): Promise<Highlighter> {
  if (!globalThis.__shikiHighlighter) {
    globalThis.__shikiHighlighter = createHighlighter({
      themes: ['github-dark'],
      langs: ['tsx', 'typescript', 'javascript', 'html', 'bash', 'css', 'json'],
    });
  }
  return globalThis.__shikiHighlighter;
}

export async function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark',
  });

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 10,
        }}
      >
        <CopyButton text={code} />
      </div>
      <div
        style={{
          background: 'var(--docs-code-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          overflowX: 'auto',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          fontFamily: 'var(--font-family-mono)',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
