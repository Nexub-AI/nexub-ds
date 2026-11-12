// packages/react/src/utils/xss-corpus.ts, aliased for tests in vitest.config.ts.
declare module 'xss-corpus' {
  export const XSS_URLS: string[];
  export const XSS_TEXT: string[];
  export function auditDom(root?: ParentNode): string[];
}
