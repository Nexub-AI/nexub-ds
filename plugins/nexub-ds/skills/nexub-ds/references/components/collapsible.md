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
<Collapsible.Root>
  <Collapsible.Trigger asChild>
    <Button variant="outline">Toggle details</Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div style={{ paddingTop: '12px', color: 'var(--color-text-secondary)' }}>
      Hidden content revealed on toggle.
    </div>
  </Collapsible.Content>
</Collapsible.Root>
```

## Example: Controlled

```tsx
function ControlledExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 500 }}>Advanced settings</span>
        <Collapsible.Trigger asChild>
          <IconButton
            aria-label={open ? 'Collapse' : 'Expand'}
            variant="ghost"
            size="sm"
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="notif" />
            <Label htmlFor="notif">Enable notifications</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="autosave" />
            <Label htmlFor="autosave">Auto-save drafts</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="tooltips" />
            <Label htmlFor="tooltips">Show tooltips</Label>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
```
