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
  var __shikiHighlighter: Promise<Highlighter> | undefined;
}

function getHighlighter(): Promise<Highlighter> {
  if (!globalThis.__shikiHighlighter) {
    globalThis.__shikiHighlighter = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['tsx', 'typescript', 'javascript', 'html', 'bash', 'css', 'json'],
    }).catch((err) => {
      // Clear the cached rejected promise so the next render retries instead
      // of returning the same rejection forever for the process lifetime.
      globalThis.__shikiHighlighter = undefined;
      throw err;
    });
  }
  return globalThis.__shikiHighlighter;
}

export async function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    // Dual theme: tokens carry --shiki-light/--shiki-dark, picked in globals.css
    // by color-scheme so code reads on the tonal surface in both modes.
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });

  return (
    <div className="relative">
      <div className="absolute end-2 top-2 z-10">
        <CopyButton text={code} />
      </div>
      <div
        className="overflow-x-auto rounded-shape-container bg-[var(--docs-code-bg)] py-5 pe-14 ps-6 font-mono text-label-md leading-relaxed text-[var(--color-on-surface)]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
