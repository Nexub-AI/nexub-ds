# ProductGrid

Product cards in a grid; each card is one link with the product's accent. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { ProductGrid } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/product-grid

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `React.ReactNode` |  | ProductGrid: a SectionHeader, usually. |
| `name` (required) | `string` |  | ProductCard: product name, the card's link text. |
| `description` (required) | `React.ReactNode` |  | ProductCard: one line on what it does. |
| `href` (required) | `string` |  | ProductCard: the product page. |
| `icon` | `React.ReactNode` |  | ProductCard: the product mark. |
| `accent` | `'leap' \| 'bookub' \| 'payub' \| 'founderub'` |  | ProductCard: coloured top edge and tint in marketing mode. |
| `linkLabel` | `string` | `'Learn more'` | ProductCard: the visual link cue. |

## Example: Default

```tsx
import { BookubMark, FounderubMark, LeapMark, PayubMark } from '@nexub/icons';
import { ProductCard, ProductGrid, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <ProductGrid header={<SectionHeader eyebrow="Platform" title="One account, four products" />}>
        <ProductCard name="Leap" description="Incorporate and stay compliant." href="#leap" accent="leap" icon={<LeapMark size={24} />} />
        <ProductCard name="Bookub" description="Bookkeeping that closes itself." href="#bookub" accent="bookub" icon={<BookubMark size={24} />} />
        <ProductCard name="Payub" description="Payroll and HR in one place." href="#payub" accent="payub" icon={<PayubMark size={24} />} />
        <ProductCard name="Founderub" description="Cap table and fundraising." href="#founderub" accent="founderub" icon={<FounderubMark size={24} />} />
      </ProductGrid>
    </div>
  );
}
```
