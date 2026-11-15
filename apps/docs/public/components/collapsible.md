# Collapsible

Toggle visibility of content with smooth animation.

- Package: `@nexub/react` · Category: Disclosure · Status: stable
- Import: `import { Collapsible } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/collapsible

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Collapsible.Root open` | `boolean` |  | Controlled open state. |
| `Collapsible.Root defaultOpen` | `boolean` | `false` | Whether the collapsible is open by default (uncontrolled). |
| `Collapsible.Root onOpenChange` | `(open: boolean) => void` |  | Callback fired when the open state changes. |
| `Collapsible.Root disabled` | `boolean` | `false` | Prevents the user from toggling the collapsible. |
| `Collapsible.Trigger asChild` | `boolean` | `false` | Merges props onto the immediate child element (Radix Slot). |
| `Collapsible.Content forceMount` | `boolean` | `false` | Keeps the content mounted in the DOM even when closed. |

## Example: Default

```tsx
import * as React from 'react';
import { Collapsible, Button } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button variant="outlined">{open ? 'Hide details' : 'Show details'}</Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pt-3 text-[var(--color-on-surface-variant)] text-body-sm">
          Hidden content revealed on toggle. This section can hold any content.
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```

## Example: Controlled

```tsx
import * as React from 'react';
import { Collapsible, Button, Switch, Label } from '@nexub/react';

export default function Example() {
  const [open2, setOpen2] = React.useState(false);
  return (
    <Collapsible.Root open={open2} onOpenChange={setOpen2}>
      <div className="flex items-center gap-2">
        <span className="font-medium text-[var(--color-on-surface)] text-body-sm">Advanced settings</span>
        <Collapsible.Trigger asChild>
          <Button variant="text" size="sm">{open2 ? 'Collapse' : 'Expand'}</Button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div className="pt-3 flex flex-col gap-3">
          {[
            { id: 'notif', label: 'Enable notifications' },
            { id: 'autosave', label: 'Auto-save drafts' },
            { id: 'tooltips', label: 'Show tooltips' },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <Switch id={id} />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```
