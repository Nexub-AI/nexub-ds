# Radio Card

A radio group where each option is a whole card: title, description and optional icon, one choice.

- Package: `@nexub/react` · Category: Form Controls · Status: beta
- Import: `import { RadioCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/radio-card

## When to use

- Two to six options that each need a sentence of explanation, like plans or regions.
- A choice important enough to deserve the space.

## When not to use

- Short labels with no description: use RadioGroup.
- More than six options: use Select or Combobox.
- Cards that hold links or buttons: the whole card is the control, so use Card with CardLink.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `RadioCardGroup columns` | `1 \| 2 \| 3 \| 4` | `1` | Grid columns. Collapses to one column on narrow screens. |
| `RadioCardGroup value / defaultValue / onValueChange` | `string` |  | Radix RadioGroup props; the group also takes `disabled`, `name`, `required`. |
| `value` (required) | `string` |  | The option this card selects. |
| `title` (required) | `ReactNode` |  | The card’s accessible name. |
| `description` | `ReactNode` |  | Secondary text, exposed as the accessible description. |
| `icon` | `ReactNode` |  | Leading icon. Turns primary when selected. |
| `children` | `ReactNode` |  | Extra content under the description. Keep it non-interactive: the whole card is the control. |
| `disabled` | `boolean` | `false` | Disables this card only. |

## Example: Plan picker

```tsx
const [plan, setPlan] = React.useState('team');

<RadioCardGroup aria-label="Plan" columns={3} value={plan} onValueChange={setPlan}>
  <RadioCard value="solo" icon={<User />} title="Solo" description="One seat, core features.">
    <span className="text-sm font-medium">$0 / month</span>
  </RadioCard>
  <RadioCard value="team" icon={<Users />} title="Team" description="Up to 20 seats, shared workspaces.">
    <span className="text-sm font-medium">$12 / seat</span>
  </RadioCard>
  <RadioCard value="enterprise" icon={<Building2 />} title="Enterprise" description="SSO, audit logs, priority support.">
    <span className="text-sm font-medium">Contact sales</span>
  </RadioCard>
</RadioCardGroup>
```

## Example: Columns

Two columns from the sm breakpoint up, one below.

```tsx
<RadioCardGroup aria-label="Billing" columns={2} defaultValue="yearly">
  <RadioCard value="monthly" title="Monthly" description="Billed every month." />
  <RadioCard value="yearly" title="Yearly" description="Two months free." />
</RadioCardGroup>
```

## Example: Disabled

Disable one card, or pass `disabled` to the group to disable all of them.

```tsx
<RadioCardGroup aria-label="Region" columns={2} defaultValue="eu">
  <RadioCard value="eu" title="Europe" description="Frankfurt" />
  <RadioCard value="us" title="United States" description="Virginia" />
  <RadioCard value="ap" title="Asia Pacific" description="Coming soon" disabled />
</RadioCardGroup>
```

## Accessibility

- Roles: radiogroup, radio (each card)
- `Tab`: Moves focus into the group, to the selected card.
- `Arrow keys`: Move between cards and select.
- `Space`: Selects the focused card.
- The title is the accessible name and the description is the accessible description.
- Give the group an `aria-label` or `aria-labelledby`.

Related: [radio-group](radio-group.md), [checkbox-card](checkbox-card.md), [card](card.md)
