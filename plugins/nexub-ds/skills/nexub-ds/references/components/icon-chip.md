# Icon Chip

An icon on a tinted tile, in one of the category colours or the product accent.

- Package: `@nexub/react` · Category: Labels & Badges · Status: alpha
- Import: `import { IconChip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/icon-chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `category` | `'accent' \| 'blue' \| 'amber' \| 'emerald' \| 'pink' \| 'violet' \| 'cyan' \| 'red' \| 'lime'` |  | Colour of the chip. `accent` is the product accent. Without it the chip is neutral. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the tile and its icon. |
| `shape` | `'square' \| 'circle'` | `'square'` | Rounded square or circle. |

## Example: Default

```tsx
import { IconChip } from '@nexub/react';
import { CreditCard } from '@nexub/icons';

export default function Example() {
  return (
    <IconChip category="violet">
      <CreditCard />
    </IconChip>
  );
}
```

## Example: Category colours

```tsx
import { Avatar, Badge, CATEGORY_COLORS, IconChip } from '@nexub/react';
import { CreditCard } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      {CATEGORY_COLORS.map((c) => (
        <div key={c} className="flex items-center gap-4">
          <IconChip category={c}>
            <CreditCard />
          </IconChip>
          <Badge category={c} variant="soft">
            {c}
          </Badge>
          <Avatar category={c} name="Ada Lovelace" />
        </div>
      ))}
    </div>
  );
}
```

## Example: Sizes and shapes

```tsx
import { IconChip } from '@nexub/react';
import { Wallet } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <IconChip size="sm" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="md" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="lg" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="lg" category="emerald" shape="circle">
        <Wallet />
      </IconChip>
      <IconChip>
        <Wallet />
      </IconChip>
    </div>
  );
}
```

Related: [badge](badge.md), [avatar](avatar.md)
