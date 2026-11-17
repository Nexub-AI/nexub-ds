# Illustration

A spot illustration for an empty, error or full-page state, drawn in code so it follows the theme, dark mode and the product accent.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { Illustration } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/illustration

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` (required) | `'noData' \| 'noResults' \| 'noAccess' \| 'serverError' \| 'offline' \| 'notFound' \| 'maintenance'` |  | Which drawing to show. |
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

const kinds = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance'] as const;

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

Related: [empty-state](empty-state.md), [error-state](error-state.md)
