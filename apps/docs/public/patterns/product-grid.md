# ProductGrid

Product cards in a grid; each card is one link with the product's accent. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { ProductGrid } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/product-grid

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `React.ReactNode` |  | A SectionHeader, usually. |
| `ProductCard name` (required) | `string` |  | Product name, the card's link text. |
| `ProductCard description` (required) | `React.ReactNode` |  | One line on what it does. |
| `ProductCard href` (required) | `string` |  | The product page. |
| `ProductCard icon` | `React.ReactNode` |  | The product mark. |
| `ProductCard accent` | `ProductKey \| DivisionKey` |  | Coloured top edge and tint in marketing mode. Keys beyond the four original apps need `@nexub/themes/products` or `@nexub/themes/divisions`. |
| `ProductCard division` | `DivisionKey` |  | The card's division: sets `data-division` and, without `accent`, tints the card. |
| `division` | `DivisionKey` |  | Sets `data-division` on the grid. |
| `ProductCard linkLabel` | `string` | `'Learn more'` | The visual link cue. |

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

## Example: Divisions

`division` tints a card with one of the five division colours. Load `@nexub/themes/divisions`.

```tsx
import { ProductCard, ProductGrid, SectionHeader } from '@nexub/marketing';

// Needs @nexub/themes/divisions.
export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <ProductGrid header={<SectionHeader eyebrow="Divisions" title="Five divisions, one account" />}>
        <ProductCard name="Nexub OS" description="Run the company: people, payroll, books and contracts." href="#os" division="os" />
        <ProductCard name="Nexub Commerce" description="Sell online and in store." href="#commerce" division="commerce" />
        <ProductCard name="Nexub Fintech" description="Accounts and credit for growing companies." href="#fintech" division="fintech" />
        <ProductCard name="Nexub Intelligence" description="AI that knows your business." href="#intelligence" division="intelligence" />
        <ProductCard name="Nexub Autonomous" description="Agents that run the routine work." href="#autonomous" division="autonomous" />
      </ProductGrid>
    </div>
  );
}
```
