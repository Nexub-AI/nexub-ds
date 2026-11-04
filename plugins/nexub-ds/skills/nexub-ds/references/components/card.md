# Card

Surface container for grouping related content. Supports flat, surface, and interactive variants.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Card } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'flat' \| 'surface' \| 'interactive'` | `'flat'` | `interactive` lifts 2px on hover (spatial spring, elevation 1 → 2), sinks to 0.99 on press and adds a state layer. Use it for cards that are links or buttons. |
| `effect` | `'none' \| 'sheen'` | `'none'` | Opt-in. `sheen` is a soft light that follows the pointer, with a brighter rim near the edge. Off for touch, reduced motion and reduced transparency. |
| `tone` | `ToneValue` | `undefined` | Applies a semantic left-border accent. |
| `asChild` | `boolean` | `false` | Merges props onto the immediate child element. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Liquid-glass material treatment — see Foundations → Materials. |
| `CardLink` | `AnchorHTMLAttributes & { asChild?: boolean }` |  | Put it around the card title to make the whole card one link. Its ::after covers the card and the card shows the focus ring. Give other controls inside the card `relative z-[1]`. Use `asChild` for a router link. |

## Example: Default

```tsx
import { Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[280px]">
      <Card>
        <div className="font-semibold mb-1 text-[var(--color-on-surface)]">Card title</div>
        <Text size="body-sm" tone="muted">Cards group related content on a raised surface.</Text>
      </Card>
    </div>
  );
}
```

## Example: Variants

```tsx
import { Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2.5 items-start w-[280px]">
      <Card variant="flat"><Text size="body-sm">Flat</Text></Card>
      <Card variant="surface"><Text size="body-sm">Surface</Text></Card>
      <Card variant="interactive"><Text size="body-sm">Interactive</Text></Card>
    </div>
  );
}
```

## Example: Card link

The whole card is one link named by its title. The button sits above the link with `relative z-[1]`.

```tsx
import * as React from 'react';
import { Card, Heading, CardLink, Text, Button } from '@nexub/react';

export default function Example() {
  const [starred, setStarred] = React.useState(false);
  return (
    <div className="w-[280px]">
      <Card variant="interactive" className="p-4">
        <Heading level={3} size="h5">
          <CardLink href="#">Atlas</CardLink>
        </Heading>
        <Text size="body-sm" tone="muted">Updated 2 hours ago</Text>
        <Button size="sm" variant="text" className="relative z-[1] mt-2" onClick={() => setStarred((v) => !v)}>
          {starred ? 'Starred' : 'Star'}
        </Button>
      </Card>
    </div>
  );
}
```

## Example: Sheen

Move the pointer over the card.

```tsx
import { Card, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[280px]">
      <Card variant="surface" effect="sheen" className="p-6">
        <Heading level={3} size="h5">Pro</Heading>
        <Text size="body-sm" tone="muted">Everything in Team, plus audit logs.</Text>
      </Card>
    </div>
  );
}
```

## Accessibility

- Roles: region (when used as a landmark)
- `Tab`: Focuses interactive children. The card itself is never focusable; with a CardLink, the link is.
- With a CardLink inside, the focus ring is drawn on the card, not around the title.
- Prefer CardLink over wrapping the whole card in `<a>`: the link’s accessible name stays the title instead of every word on the card.
- Group related content with a heading inside the Card so AT users can navigate by heading level.

Related: [media-card](media-card.md), [radio-card](radio-card.md), [callout](callout.md)
