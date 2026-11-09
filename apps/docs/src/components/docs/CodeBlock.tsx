import { createHighlighter, type Highlighter } from 'shiki';
import { CodeFrame } from './CodeFrame';

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** Filename for the header bar (defaults to the language name). */
  title?: string;
  lineNumbers?: boolean;
  /** 1-based line numbers to highlight. */
  highlight?: number[];
}

// Persist the Shiki instance on globalThis so it survives Next.js hot-module
// replacement in dev mode. Without this, every file save re-imports the module,
// resets the module-level variable, and forces Shiki to reload its WASM + grammars
// (~800 ms cold start). globalThis persists for the lifetime of the Node process.
declare global {
  var __shikiHighlighter: Promise<Highlighter> | undefined;
}

// Primer's "default" GitHub themes are tuned for #fff / #0d1117 editors, which
// is what the docs code surface is (surface-container-lowest), so every token
// clears WCAG AA without per-colour patches (see scripts/check-code-contrast.mjs).
const THEMES = { light: 'github-light-default', dark: 'github-dark-default' } as const;

function getHighlighter(): Promise<Highlighter> {
  if (!globalThis.__shikiHighlighter) {
    globalThis.__shikiHighlighter = createHighlighter({
      themes: Object.values(THEMES),
      langs: ['tsx', 'typescript', 'javascript', 'html', 'bash', 'css', 'json', 'diff'],
    }).catch((err) => {
      // Clear the cached rejected promise so the next render retries instead
      // of returning the same rejection forever for the process lifetime.
      globalThis.__shikiHighlighter = undefined;
      throw err;
    });
  }
  return globalThis.__shikiHighlighter;
}

export async function CodeBlock({ code, lang = 'tsx', title, lineNumbers, highlight }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    // Dual theme: tokens carry --shiki-light/--shiki-dark, picked in globals.css
    // by color-scheme.
    themes: THEMES,
    defaultColor: false,
    transformers: highlight?.length
      ? [
          {
            line(node, line) {
              if (highlight.includes(line)) this.addClassToHast(node, 'highlighted');
            },
          },
        ]
      : [],
  });

  return (
    <CodeFrame code={code} lang={lang} title={title} lineNumbers={lineNumbers}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeFrame>
  );
}
