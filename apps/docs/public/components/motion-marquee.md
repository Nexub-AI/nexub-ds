# Marquee

A row that scrolls sideways forever (logo strips, tool lists), in marketing mode. Pauses on hover and while focus is inside, stands still under reduced motion; the repeated copy is hidden from assistive tech and can’t be focused. Server component.

- Package: `@nexub/react` · Category: Motion · Status: beta
- Import: `import { MotionMarquee } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-marquee

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Loop length: 44s, 28s or 18s. |
| `rowClassName` | `string` | `'gap-12 pe-12 items-center'` | Classes for each copy of the row. |
| `children` (required) | `React.ReactNode` |  | The items. |

## Example: Default

```tsx
import { Marquee } from '@nexub/react';

const tools = ['Slack', 'Xero', 'Google Workspace', 'Stripe', 'QuickBooks', 'WhatsApp'];

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <Marquee>
        {tools.map((t) => (
          <span key={t} className="text-title-md text-[var(--color-on-surface-variant)]">{t}</span>
        ))}
      </Marquee>
    </div>
  );
}
```
