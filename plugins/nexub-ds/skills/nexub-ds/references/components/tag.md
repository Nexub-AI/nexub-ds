# Tag

> **Deprecated.** Do not use in new code. Deprecated — use Badge. Non-interactive label tag for categorisation.

- Package: `@nexub/react` · Category: Labels & Badges · Status: deprecated
- Import: `import { Tag } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/tag

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | Visual style of the tag. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Semantic colour tone of the tag. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls tag size. |

## Example: Default

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <Tag>Frontend</Tag>
  <Tag tone="info">Backend</Tag>
  <Tag tone="success">Deployed</Tag>
</div>
```
