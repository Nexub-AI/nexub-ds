// 11.6: the packages the docs registry documents, and everything that depends on which
// one a page belongs to: its URL kind (/components or /patterns), its group in the AI
// docs and llms.txt, and the setup lines its page shows. No imports, so the docs tests
// and scripts/build-ai-docs.mjs can load it with type stripping alone.

export type DocsPackage = '@nexub/react' | '@nexub/patterns' | '@nexub/marketing' | '@nexub/diagram' | '@nexub/elements' | '@nexub/genui';

export interface PackageInfo {
  /** URL kind: /components/<slug> or /patterns/<slug>, and the examples folder. */
  kind: 'components' | 'patterns';
  /** Heading in the AI component index and llms.txt. */
  group: string;
}

export const PACKAGES: Record<DocsPackage, PackageInfo> = {
  '@nexub/react': { kind: 'components', group: 'Components' },
  '@nexub/patterns': { kind: 'patterns', group: 'Patterns' },
  '@nexub/marketing': { kind: 'patterns', group: 'Marketing' },
  // Optional packages with their own install: component pages, listed apart in the AI docs.
  '@nexub/diagram': { kind: 'components', group: 'Diagram' },
  '@nexub/elements': { kind: 'components', group: 'Web components' },
  // 12.8: generative UI, documented on one page under AI.
  '@nexub/genui': { kind: 'components', group: 'Generative UI' },
};

export const docsKind = (pkg: DocsPackage): PackageInfo['kind'] => PACKAGES[pkg]?.kind ?? 'components';

export interface SetupSnippet {
  /** One line each; shown in the page's copy strip. */
  lines: string[];
  /** The install command, when the page needs more than `npm install <its package>` says. */
  install?: string;
  /** One more line under it; `backticks` render as code. */
  note?: string;
  /** `html` for the web components, which load from a script tag. */
  lang: 'tsx' | 'html';
}

/**
 * The import a page shows under its title (and the AI docs' "Import:" line). `name` is the
 * export to import: the title without spaces by default (the AI docs pass their own).
 */
export function setupSnippet(meta: { title: string; package: DocsPackage; element?: string }, name = meta.title.replace(/\s+/g, '')): SetupSnippet {
  if (meta.package === '@nexub/elements') {
    return {
      lang: 'html',
      lines: [`<script type="module" src="https://cdn.jsdelivr.net/npm/@nexub/elements/dist/define.js"></script>`],
      install: 'npm install @nexub/elements',
      note: `No build step: the script tag above registers \`<${meta.element ?? 'nx-…'}>\`. With a bundler, \`import '@nexub/elements/define';\` once does the same.`,
    };
  }
  if (meta.package === '@nexub/diagram') {
    return {
      lang: 'tsx',
      lines: [`import { ${name} } from '@nexub/diagram';`, `import '@nexub/diagram/styles.css';`],
      install: 'npm install @nexub/diagram @xyflow/react',
      note: '`@xyflow/react` (React Flow) is a peer dependency: install it next to `@nexub/diagram`. Load the stylesheet after `@nexub/react`’s.',
    };
  }
  if (meta.package === '@nexub/genui') {
    return {
      lang: 'tsx',
      lines: [`import { ${name} } from '@nexub/genui';`],
      install: 'npm install @nexub/genui',
      note: '`@nexub/react` is a peer dependency, and its stylesheet styles the answer. Servers import `validate` and the schema from `@nexub/genui/schema` (no React).',
    };
  }
  return { lang: 'tsx', lines: [`import { ${name} } from '${meta.package}';`] };
}
