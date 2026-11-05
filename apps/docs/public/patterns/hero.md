# Hero

The page hero: ambient backdrop, eyebrow, display headline (the page's one h1), lead, actions and a visual. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { Hero } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/hero

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | The headline, rendered as the h1. |
| `eyebrow` | `React.ReactNode` |  | A string becomes a gradient EyebrowChip. |
| `description` | `React.ReactNode` |  | The lead paragraph. |
| `actions` | `React.ReactNode` |  | One `Button variant="hero"` and one outlined button, usually. |
| `visual` | `React.ReactNode` |  | Product shot or illustration. Beside the text on wide screens with `align="start"`. |
| `align` | `'center' \| 'start'` | `'center'` | Text alignment and layout. |

## Example: Default

```tsx
import { Button } from '@nexub/react';
import { Hero } from '@nexub/marketing';
import { ArrowRight } from '@nexub/icons';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <Hero
        eyebrow="Now in Vietnam"
        title="Run your whole company in one place"
        description="Payroll, bookkeeping and compliance for growing teams across Southeast Asia and India."
        actions={
          <>
            <Button variant="hero" size="lg" trailingIcon={<ArrowRight size={16} />}>Start free</Button>
            <Button variant="outlined" size="lg">Book a demo</Button>
          </>
        }
      />
    </div>
  );
}
```
