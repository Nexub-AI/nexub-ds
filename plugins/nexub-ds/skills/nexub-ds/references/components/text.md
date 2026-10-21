# Text

Paragraph text component with size, tone, and weight variants.

- Package: `@nexub/react` · Category: Typography · Status: stable
- Import: `import { Text } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/text

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'body-lg' \| 'body' \| 'body-sm' \| 'caption' \| 'label'` | `'body'` | Controls the font size and line height. |
| `tone` | `'default' \| 'secondary' \| 'muted' \| 'subtle' \| 'inverse'` |  | Color tone applied to the text. |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold'` |  | Font weight of the text. |
| `truncate` | `boolean` |  | Truncates text with an ellipsis when it overflows. |
| `lineClamp` | `number` |  | Clamps the text to a maximum number of lines. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
<Text>The Nexub design system provides accessible, token-driven components.</Text>
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Text size="body-lg">Body large — ideal for introductory paragraphs.</Text>
  <Text size="body">Body — the default reading size.</Text>
  <Text size="body-sm">Body small — secondary content and descriptions.</Text>
  <Text size="caption">Caption — metadata and timestamps.</Text>
</div>
```

## Example: Tones

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Text tone="default">Default tone</Text>
  <Text tone="secondary">Secondary tone</Text>
  <Text tone="muted">Muted tone</Text>
</div>
```
