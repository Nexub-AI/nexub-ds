# Float

Gently bobs its content (floating cards over a hero visual), in marketing mode. Server component; still under reduced motion.

- Package: `@nexub/react` · Category: Motion · Status: beta
- Import: `import { MotionFloat } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-float

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `'normal' \| 'slow'` | `'normal'` | `slow` drifts on a longer, reversed loop, so two floating cards don’t move in step. |
| `asChild` | `boolean` | `false` | Merge onto the child element instead of a div. |

## Example: Default

```tsx
import { Card, Float } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex gap-8 p-6">
      <Float>
        <Card variant="showcase" className="nx-mkt-float-card p-5">Payroll approved</Card>
      </Float>
      <Float speed="slow">
        <Card variant="showcase" className="nx-mkt-float-card p-5">Books closed</Card>
      </Float>
    </div>
  );
}
```
