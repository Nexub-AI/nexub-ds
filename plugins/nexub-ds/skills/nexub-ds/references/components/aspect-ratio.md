# Aspect Ratio

Keeps its content at a fixed width-to-height ratio, for images, video and embeds.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { AspectRatio } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/aspect-ratio

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number` |  | Width divided by height, e.g. `16 / 9` or `1`. Common ratios (1, 16/9, 4/3, 3/2, 21/9, 9/16, 3/4, 2/3) use a class and are strict-CSP safe; any other ratio sets an inline `aspect-ratio` style. |
| `children` | `ReactNode` |  | Fills the box; give an image `h-full w-full object-cover`. |

## Example: Image

```tsx
import { AspectRatio } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[400px]">
      <AspectRatio ratio={16 / 9} className="rounded-shape-container">
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-label-lg">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  );
}
```

## Example: Ratios

```tsx
import { AspectRatio } from '@nexub/react';

const ratios = [
  { ratio: 1, label: '1 : 1' },
  { ratio: 4 / 3, label: '4 : 3' },
  { ratio: 3 / 4, label: '3 : 4' },
];

export default function Example() {
  return (
    <div className="grid w-full max-w-[480px] grid-cols-3 items-start gap-3">
      {ratios.map(({ ratio, label }) => (
        <AspectRatio key={label} ratio={ratio} className="rounded-shape-container">
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-container-high)] text-label-md text-[var(--color-on-surface-variant)]">
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  );
}
```

Related: [media-card](media-card.md), [box](box.md)
