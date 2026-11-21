# Check List

A list with a success tick before each item, for features, plan inclusions and requirements met.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { CheckList } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/check-list

## When to use

- Listing what a plan or feature includes
- Confirming requirements that are already met

## When not to use

- Tasks the user can tick off: use `Checkbox`
- Steps with progress or failures: use `PlanTracker` or `Stepper`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(string \| { label: ReactNode; status?: CheckListStatus })[]` |  | Plain-text items. Shorthand for one `CheckListItem` each. 11.3: an object entry sets a status. |
| `children` | `ReactNode` |  | `CheckListItem`s, for items with markup. Rendered after `items`. |
| `CheckListItem children` (required) | `ReactNode` |  | The item text. The tick is decorative (hidden from screen readers). |
| `CheckListItem status` | `'done' \| 'pending'` |  | 11.3: `done` draws the tick, `pending` an empty ring with muted text. Either is read after the text ("Done" / "Pending"). Unset draws the tick with nothing read, as before. |
| `CheckListItem statusLabel` | `string` |  | 11.3: the words read for `status`, for other languages. |

## Example: From items

```tsx
import { CheckList } from '@nexub/react';

export default function Example() {
  return <CheckList items={['Unlimited projects', 'Priority support', 'Single sign-on (SAML)']} />;
}
```

## Example: With CheckListItem

```tsx
import { CheckList, CheckListItem } from '@nexub/react';

export default function Example() {
  return (
    <CheckList aria-label="Password requirements">
      <CheckListItem>At least 12 characters</CheckListItem>
      <CheckListItem>One number <span className="text-on-surface-muted">(0–9)</span></CheckListItem>
      <CheckListItem>Not used on another account</CheckListItem>
    </CheckList>
  );
}
```

## Example: Done and pending

Setup steps with a status each.

```tsx
import { CheckList } from '@nexub/react';

export default function Example() {
  return (
    <CheckList
      aria-label="Workspace setup"
      items={[
        { label: 'Create workspace', status: 'done' },
        { label: 'Connect bank account', status: 'done' },
        { label: 'Invite your team', status: 'pending' },
        { label: 'Send first invoice', status: 'pending' },
      ]}
    />
  );
}
```

Related: [plan-tracker](plan-tracker.md)
