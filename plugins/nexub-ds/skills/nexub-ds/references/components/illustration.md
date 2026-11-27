# Illustration

A spot illustration for an empty, error, offline, success or full-page state, drawn in code so it follows the theme, dark mode and the product accent.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { Illustration } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/illustration

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` (required) | `'noData' \| 'noResults' \| 'noAccess' \| 'serverError' \| 'offline' \| 'notFound' \| 'maintenance' \| 'success'` |  | Which drawing to show. Empty: noData or noResults; error: serverError, noAccess or notFound; offline; success (12.3). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 80, 120 or 160 CSS px wide. |
| `title` | `string` |  | Names the drawing for assistive technology. Without it the drawing is decorative. |

## Example: Default

```tsx
import { Illustration } from '@nexub/react';

export default function Example() {
  return <Illustration kind="noData" />;
}
```

## Example: Kinds

```tsx
import { Illustration } from '@nexub/react';

const kinds = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance', 'success'] as const;

export default function Example() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {kinds.map((kind) => (
        <Illustration key={kind} kind={kind} title={kind} />
      ))}
    </div>
  );
}
```

## Example: In a state

Opt in on the surfaces that already exist: put it in `EmptyState.Illustration`, set `illustrated` on `EmptyStatePreset`, or pass it as `illustration` to `StatusPage`. On native, `EmptyState`, `ErrorState` and `ResultScreen` take it as `illustration`.

```tsx
import { Button, EmptyState, Illustration } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <Illustration kind="success" />
      </EmptyState.Illustration>
      <EmptyState.Title>Payment sent</EmptyState.Title>
      <EmptyState.Description>We emailed the receipt to you.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="tonal">View receipt</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}
```

## Accessibility

- Roles: img (only with a `title`)
- Decorative by default: the svg has `aria-hidden`, so the state is read from its title and description alone.
- With `title` it is one image named by the title (`role="img"`, `aria-label`).
- Colours are roles only, so light, dark and product themes recolour it. Under forced colours every shape takes a system colour (Canvas / CanvasText), so the outline stays legible.
- Each drawing is a handful of shapes, well under 1 kB gzipped; no asset is fetched.

Related: [empty-state](empty-state.md), [error-state](error-state.md)
