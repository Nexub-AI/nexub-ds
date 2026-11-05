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
