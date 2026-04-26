import { createHighlighter, type Highlighter } from 'shiki';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

// Module-level singleton — created once per server process, reused for every
// subsequent CodeBlock render. Eliminates the per-render grammar + wasm reload.
let _highlighter: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!_highlighter) {
    _highlighter = createHighlighter({
      themes: ['github-dark'],
      langs: ['tsx', 'typescript', 'javascript', 'html', 'bash', 'css', 'json'],
    });
  }
  return _highlighter;
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
