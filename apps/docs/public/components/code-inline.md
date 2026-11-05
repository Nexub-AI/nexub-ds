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
import { Code } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Code>npm install</Code>
      <Code>useTheme()</Code>
      <Code>@nexub/react</Code>
    </div>
  );
}
```

## Example: In prose

```tsx
import { Text, Code } from '@nexub/react';

export default function Example() {
  return (
    <Text>
      Use the <Code>useTheme()</Code> hook to access the current theme from any component.
    </Text>
  );
}
```
