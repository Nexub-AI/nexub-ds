# TestimonialGrid

Customer quotes in product-coloured cards, with an optional star rating. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { TestimonialGrid } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/testimonial-grid

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `React.ReactNode` |  | A SectionHeader, usually. |
| `TestimonialCard quote` (required) | `React.ReactNode` |  | The quote. |
| `TestimonialCard name` (required) | `string` |  | Who said it. |
| `TestimonialCard role` | `React.ReactNode` |  | Job title and company. |
| `TestimonialCard avatarSrc` | `string` |  | Photo; initials otherwise. |
| `TestimonialCard rating` | `number` |  | Stars out of 5, announced as "Rated n out of 5". |
| `TestimonialCard accent` | `'leap' \| 'bookub' \| 'payub' \| 'founderub'` |  | The product the customer uses. |

## Example: Default

```tsx
import { SectionHeader, TestimonialCard, TestimonialGrid } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <TestimonialGrid header={<SectionHeader eyebrow="Customers" title="Loved by finance teams" />}>
        <TestimonialCard accent="payub" rating={5} name="Priya Nair" role="Head of People, Kopi Labs" quote="Payroll used to take two days. Now it takes twenty minutes." />
        <TestimonialCard accent="bookub" rating={5} name="Daniel Tan" role="CFO, Harbourline" quote="Our books close on the third working day, every month." />
        <TestimonialCard accent="leap" rating={5} name="Linh Pham" role="Founder, Sonvo" quote="We incorporated in Singapore without leaving Hanoi." />
      </TestimonialGrid>
    </div>
  );
}
```
