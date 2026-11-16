# CTABand

The closing call to action on a primary band: the hero gradient in marketing mode. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { CtaBand } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/cta-band

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | The heading (h2). |
| `description` | `React.ReactNode` |  | One supporting line. |
| `actions` | `React.ReactNode` |  | Buttons. On the band use `variant="filled" tone="neutral"` or an outlined button. |
| `division` | `DivisionKey` |  | Sets `data-division` on the section: the band takes the division fill. Load `@nexub/themes/divisions`. |

## Example: Default

```tsx
import { Button } from '@nexub/react';
import { CTABand } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <CTABand
        title="Start running your company on Nexub"
        description="Free for 30 days. No card needed."
        actions={<Button variant="filled" tone="neutral" size="lg">Create an account</Button>}
      />
    </div>
  );
}
```

## Example: Divisions

With `division` the band takes the division fill and a SectionHeader eyebrow the division colour. Load `@nexub/themes/divisions`.

```tsx
import { Button } from '@nexub/react';
import { CTABand, SectionHeader } from '@nexub/marketing';

const divisions = [
  ['os', 'Nexub OS'],
  ['commerce', 'Nexub Commerce'],
  ['fintech', 'Nexub Fintech'],
  ['intelligence', 'Nexub Intelligence'],
  ['autonomous', 'Nexub Autonomous'],
] as const;

// Needs @nexub/themes/divisions. Each division page sets `division` on its sections.
export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      {divisions.map(([key, name]) => (
        <div key={key} className="pt-10">
          <SectionHeader division={key} eyebrow={name} title={`Start with ${name}`} level={3} />
          <CTABand
            division={key}
            title={`Try ${name} free for 30 days`}
            actions={<Button variant="filled" tone="neutral" size="lg">Create an account</Button>}
          />
        </div>
      ))}
    </div>
  );
}
```
