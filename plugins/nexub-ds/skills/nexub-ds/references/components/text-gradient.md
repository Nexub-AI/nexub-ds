# Text Gradient

Renders text with a brand gradient fill.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { TextGradient } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/text-gradient

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `string` |  | Starting color of the gradient (CSS color value or token). |
| `to` | `string` |  | Ending color of the gradient (CSS color value or token). |
| `direction` | `'to-r' \| 'to-br' \| 'to-b'` |  | Direction of the gradient. |

## Example: Default

```tsx
<TextGradient>Design system for ambitious teams</TextGradient>
```

## Example: In heading

```tsx
<Heading size="h1">
  Build with{' '}
  <TextGradient>Nexub</TextGradient>
</Heading>
```
