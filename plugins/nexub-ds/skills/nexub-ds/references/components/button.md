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
| `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'glass' \| 'subtle' \| 'link' \| 'destructive' \| 'accent'` | `'primary'` | Visual style of the button. Legacy aliases still work: primary = filled, secondary = tonal, outline = outlined, ghost = text. |
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
<Button variant="primary">Click me</Button>
```

## Example: Variants

```tsx
<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  <Button variant="primary">Primary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="subtle">Subtle</Button>
  <Button variant="link">Link</Button>
</div>
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <Button size="xs" variant="primary">XSmall</Button>
  <Button size="sm" variant="primary">Small</Button>
  <Button size="md" variant="primary">Medium</Button>
  <Button size="lg" variant="primary">Large</Button>
</div>
```

## Example: States

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <Button variant="primary" loading>Loading</Button>
  <Button variant="outline" disabled>Disabled</Button>
</div>
```

## Example: Async

Drive `status` from the request. Each click here moves to the next status.

```tsx
function SaveButton() {
  const [status, setStatus] = React.useState<ButtonStatus>('idle');

  async function save() {
    setStatus('loading');
    try {
      await saveProfile();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <Button status={status} loadingLabel="Saving" successLabel="Saved" errorLabel="Couldn't save" onClick={save}>
      Save
    </Button>
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
