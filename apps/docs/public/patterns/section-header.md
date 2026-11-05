# SectionHeader

Eyebrow, headline and lead that open a section. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { SectionHeader } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/section-header

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | The section heading (h2 by default). |
| `eyebrow` | `React.ReactNode` |  | A string becomes a gradient EyebrowChip. |
| `description` | `React.ReactNode` |  | The lead paragraph. |
| `align` | `'center' \| 'start'` | `'center'` | Alignment. |
| `level` | `2 \| 3` | `2` | Heading level. |

## Example: Default

```tsx
import { SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full py-10">
      <SectionHeader
        eyebrow="Platform"
        title="Everything your company needs"
        description="Four products on one account, one login and one bill."
      />
    </div>
  );
}
```
