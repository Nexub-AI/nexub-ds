# Button

Triggers an action or event. Supports multiple variants, sizes, and semantic tones.

- Package: `@nexub/react` · Category: Actions · Status: stable
- Import: `import { Button } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/button

## When to use

- Triggering a primary or secondary action (submit, save, confirm)
- Navigating users to another page or step in a flow
- Opening a dialog, drawer, or modal overlay
- Destructive actions that need a visible, labelled control

## When not to use

- Inline text navigation — use a Link instead
- Icon-only controls — use IconButton for touch target compliance
- Selecting among multiple options — use ToggleGroup or SegmentedControl
- Passive information display with no action

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'glass' \| 'hero' \| 'subtle' \| 'link' \| 'destructive' \| 'accent'` | `'primary'` | Visual style of the button. `hero` is the marketing-mode main button (gradient, glow, spring lift): a filled button outside `data-mode="marketing"`; one per screen. Legacy aliases still work: primary = filled, secondary = tonal, outline = outlined, ghost = text. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Control height and padding. |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | `'idle'` | Async feedback (beta, 1.7.0). `loading` shows a spinner and blocks clicks but keeps focus; `success` draws a check; `error` shakes once. The label stays in flow, so the width holds. |
| `loading` | `boolean` | `false` | Alias for `status="loading"`. |
| `loadingLabel` | `string` | `'Loading'` | Announced when `status` becomes `loading`. |
| `successLabel` | `string` | `'Done'` | Announced on `success`. When set, it also replaces the visible label (with a check) instead of showing the check alone. |
| `errorLabel` | `string` | `'Something went wrong'` | Announced on `error`. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `fullWidth` | `boolean` | `false` | Stretches the button to fill its container. |
| `leadingIcon` | `React.ReactNode` |  | Icon rendered before the label. |
| `trailingIcon` | `React.ReactNode` |  | Icon rendered after the label. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Semantic colour tone — overrides the variant colour with a semantic palette. |
| `asChild` | `boolean` | `false` | Merges props onto the immediate child element (Radix Slot). `status` and `loading` have no effect with `asChild`. |

## Example: Default

```tsx
import { Button } from '@nexub/react';

export default function Example() {
  return <Button variant="primary">Click me</Button>;
}
```

## Example: Variants

```tsx
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

## Example: Sizes

```tsx
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button size="xs" variant="primary">XSmall</Button>
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  );
}
```

## Example: States

```tsx
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="primary" loading>Loading</Button>
      <Button variant="outline" disabled>Disabled</Button>
    </div>
  );
}
```

## Example: Async

Drive `status` from the request. Each click here moves to the next status.

```tsx
import * as React from 'react';
import { type ButtonStatus, Button } from '@nexub/react';

const NEXT_STATUS: Record<ButtonStatus, ButtonStatus> = { idle: 'loading', loading: 'success', success: 'error', error: 'idle' };

export default function Example() {
  const [status, setStatus] = React.useState<ButtonStatus>('idle');
  // Clicks are ignored while loading, so loading moves on by itself.
  React.useEffect(() => {
    if (status !== 'loading') return;
    const t = setTimeout(() => setStatus('success'), 1200);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <div className="flex flex-col gap-2 items-start">
      <Button status={status} loadingLabel="Saving" successLabel="Saved" errorLabel="Couldn't save" onClick={() => setStatus(NEXT_STATUS[status])}>
        Save
      </Button>
      <span className="text-body-sm text-[var(--color-on-surface-variant)]">status: {status}</span>
    </div>
  );
}
```

## Example: Hero (marketing mode)

Inside `data-mode="marketing"` with `@nexub/themes/marketing` loaded. The focus ring sits outside the gradient.

```tsx
import { Button } from '@nexub/react';
import { ArrowRight } from '@nexub/icons';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex flex-wrap items-center gap-3">
      <Button variant="hero" size="lg" trailingIcon={<ArrowRight size={16} />}>Start free</Button>
      <Button variant="outlined" size="lg">Book a demo</Button>
    </div>
  );
}
```

## Accessibility

- Roles: button
- `Space`: Activates the focused button.
- `Enter`: Activates the focused button.
- `Tab`: Moves focus to the button in document order.
- Receives focus in document order; `disabled` removes it from the tab sequence.
- Visible focus ring uses `--color-border-focus` and meets WCAG 2.4.7 contrast.
- Announces the visible label plus the implicit "button" role.
- While loading the button sets `aria-busy` and `aria-disabled` (not `disabled`), so focus stays on it and clicks are ignored.
- A button with `status` or `loading` renders a polite `role="status"` region next to it that announces `loadingLabel`, `successLabel` or `errorLabel` as the status changes.
- Pair icon-only triggers with `IconButton` for a 44×44 touch target.

Related: [icon-button](icon-button.md), [button-group](button-group.md), [link](link.md)
