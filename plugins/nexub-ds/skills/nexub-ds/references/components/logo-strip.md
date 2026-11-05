# LogoStrip

A row of customer logos under the hero, scrolling sideways (paused on hover and focus) or wrapped. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { LogoStrip } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/logo-strip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` |  | e.g. "Trusted by 2,000+ teams". |
| `scroll` | `boolean` | `true` | Scroll the logos (marketing mode only); off gives a wrapped row. |
| `children` (required) | `React.ReactNode` |  | The logos. Give each its alt text. |

## Example: Default

```tsx
import { LogoStrip } from '@nexub/marketing';

const customers = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Vandelay'];

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <LogoStrip label="Trusted by 2,000+ teams">
        {customers.map((name) => (
          <span key={name} className="text-title-lg text-[var(--color-on-surface-muted)]">{name}</span>
        ))}
      </LogoStrip>
    </div>
  );
}
```
