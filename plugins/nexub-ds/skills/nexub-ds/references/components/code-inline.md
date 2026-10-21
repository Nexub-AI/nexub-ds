# Code

Inline code span for technical terms and short code snippets.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { CodeInline } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/code-inline

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.HTMLAttributes<HTMLElement>` |  | All standard span/code HTML attributes are forwarded. |

## Example: Default

```tsx
<Code>npm install @nexub/react</Code>
```

## Example: In prose

```tsx
<Text>Use the <Code>useTheme()</Code> hook to access the current theme.</Text>
```
