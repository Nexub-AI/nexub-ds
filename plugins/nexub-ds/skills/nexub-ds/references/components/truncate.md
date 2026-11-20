# Truncate

Text clipped to one or more lines, with the full text in a tooltip only while it is clipped.

- Package: `@nexub/react` · Category: Typography · Status: alpha
- Import: `import { Truncate } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/truncate

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `lines` | `number` | `1` | Lines shown before the text is clipped. |
| `as` | `React.ElementType` | `'span'` | The element to render. |
| `tooltip` | `boolean` | `true` | Show the full text in a tooltip while it is clipped. Needs string children. |

## Example: Default

```tsx
import { Truncate } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-56 max-w-full flex-col gap-2 text-body-md">
      <Truncate>Quarterly infrastructure invoice for the Singapore and Frankfurt regions</Truncate>
      <Truncate>Short text</Truncate>
    </div>
  );
}
```

## Example: Several lines

```tsx
import { Truncate } from '@nexub/react';

export default function Example() {
  return (
    <Truncate lines={2} as="p" className="w-56 text-body-md">
      Quarterly infrastructure invoice for the Singapore and Frankfurt regions, including premium support, data transfer and reserved capacity.
    </Truncate>
  );
}
```

## Accessibility

- Clipped text is a tab stop, so keyboard users can read the tooltip. Text that fits adds no tab stop and no tooltip.
- The tooltip needs string children; other children are clipped only.

Related: [text](text.md), [tooltip](tooltip.md)
