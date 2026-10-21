# Checkbox Card

A checkbox drawn as a whole card: title, description and optional icon. Pick any number.

- Package: `@nexub/react` · Category: Form Controls · Status: beta
- Import: `import { CheckboxCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/checkbox-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The card’s accessible name. |
| `description` | `ReactNode` |  | Secondary text, exposed as the accessible description. |
| `icon` | `ReactNode` |  | Leading icon. Turns primary when checked. |
| `checked / defaultChecked` | `boolean` |  | Controlled or initial state. No indeterminate state. |
| `onCheckedChange` | `(checked: boolean) => void` |  | Called with a plain boolean. |
| `children` | `ReactNode` |  | Extra content under the description. Keep it non-interactive. |
| `disabled` | `boolean` | `false` | Disables the card. |

## Example: Features

Lay checkbox cards out with any grid; there is no group component.

```tsx
<fieldset className="grid gap-3 sm:grid-cols-3">
  <legend className="sr-only">Add-ons</legend>
  <CheckboxCard icon={<Bell />} title="Alerts" description="Email and push notifications." defaultChecked />
  <CheckboxCard icon={<Shield />} title="Audit log" description="Keep a year of activity." />
  <CheckboxCard icon={<Zap />} title="Automations" description="Run rules on new records." />
</fieldset>
```

## Example: Disabled

```tsx
<CheckboxCard title="SSO" description="Available on Enterprise." disabled />
<CheckboxCard title="Data residency" description="Included in your plan." defaultChecked disabled />
```

## Accessibility

- Roles: checkbox
- `Tab`: Moves focus to the card.
- `Space`: Toggles the card.
- The title is the accessible name and the description is the accessible description.
- Wrap related cards in a `fieldset` with a `legend` so the set has a name.

Related: [checkbox](checkbox.md), [radio-card](radio-card.md), [card](card.md)
