# Text Gradient

Renders text with a brand gradient fill.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { TextGradient } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/text-gradient

## Example: Default

```tsx
import { TextGradient } from '@nexub/react';

export default function Example() {
  return <TextGradient className="text-headline-sm font-bold">Design system for ambitious teams</TextGradient>;
}
```

## Example: In heading

```tsx
import { Heading, TextGradient } from '@nexub/react';

export default function Example() {
  return (
    <Heading size="h2">
      <TextGradient>Build faster, ship consistently</TextGradient>
    </Heading>
  );
}
```
