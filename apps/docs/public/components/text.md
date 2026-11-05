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
import { Text } from '@nexub/react';

export default function Example() {
  return <Text>The Nexub design system provides accessible, token-driven components.</Text>;
}
```

## Example: Sizes

```tsx
import { Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <Text size="body-lg">Body Large — spacious reading.</Text>
      <Text size="body">Body — default paragraph.</Text>
      <Text size="body-sm">Body Small — compact content.</Text>
      <Text size="caption">Caption — supporting info.</Text>
    </div>
  );
}
```

## Example: Tones

```tsx
import { Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <Text tone="default">Default</Text>
      <Text tone="secondary">Secondary</Text>
      <Text tone="muted">Muted</Text>
      <Text tone="subtle">Subtle</Text>
    </div>
  );
}
```
