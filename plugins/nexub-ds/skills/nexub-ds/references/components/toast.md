# Toast

Imperative toast notifications using the toast object. Render <Toaster /> once in your layout.

- Package: `@nexub/react` · Category: Feedback · Status: stable
- Import: `import { Toast } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/toast

## When to use

- Confirming a non-blocking action (file saved, message sent)
- Reporting a background event the user should know about
- Providing brief feedback that disappears automatically
- Offering an undo action immediately after a destructive operation

## When not to use

- Critical errors that block the user — use Alert or AlertDialog
- Information the user must read and acknowledge — use Dialog
- Persistent status that should remain visible — use Banner or Alert
- Long messages with multiple lines of text

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Toaster expand` | `boolean` | `false` | Always show toasts as a list. By default they collapse into a stack that fans out on hover or focus, which also pauses their timers. |
| `Toaster visibleToasts` | `number` | `3` | How many toasts show at once. Older ones are hidden visually but stay in the live region. |
| `toast.success(title, opts?)` (required) | `string` |  | Show a success toast with an optional options object. |
| `toast.error(title, opts?)` (required) | `string` |  | Show an error toast. |
| `toast.warning(title, opts?)` (required) | `string` |  | Show a warning toast. |
| `toast.info(title, opts?)` (required) | `string` |  | Show an info toast. |
| `toast.custom(title, opts?)` (required) | `string` |  | Show a default/custom toast. |
| `toast.undoable(title, opts)` (required) | `UndoableToastOptions` |  | A toast with an Undo action (beta, 1.7.0). Undo calls `opts.onUndo`; any other close (timer, swipe, close button, `toast.dismiss`) calls `opts.onCommit`, exactly once. Returns the toast id. |
| `undoable opts` | `{ onUndo; onCommit?; undoLabel?; description?; duration? }` |  | `undoLabel` defaults to the `undo` message ("Undo"). Commit the change in `onCommit`, not before showing the toast. |
| `opts.description` | `string` |  | Secondary supporting text below the title. |
| `opts.duration` | `number` | `5000` | Time in ms before auto-dismiss. Use Infinity to persist. |
| `opts.action` | `{ label: string; onClick: () => void }` |  | Renders an action button inside the toast. |

## Example: Default

```tsx
function DefaultToast() {
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast.custom('Changes saved', { description: 'Your profile has been updated.' })}
      >
        Show toast
      </Button>
    </>
  );
}
```

## Example: Variants

```tsx
function ToastVariants() {
  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outline" onClick={() => toast.custom('Default notification')}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success('Saved successfully')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Proceed with caution')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('New update available')}>
          Info
        </Button>
      </div>
    </>
  );
}
```

## Example: With action

```tsx
function ToastWithAction() {
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.custom('Message sent', {
            description: 'Your message has been delivered to the team.',
            action: {
              label: 'Undo',
              onClick: () => {},
            },
          })
        }
      >
        Send message
      </Button>
    </>
  );
}
```

## Example: Undoable delete

Hide the item right away; delete it for real only when the toast closes without Undo.

```tsx
function UndoableDelete() {
  const [hidden, setHidden] = React.useState(false);

  function remove() {
    setHidden(true);
    toast.undoable('Invoice deleted', {
      description: 'INV-2041',
      onUndo: () => setHidden(false),
      onCommit: () => deleteInvoice('INV-2041'),
    });
  }

  return (
    <>
      <Toaster />
      {hidden ? (
        <Button variant="text" onClick={() => setHidden(false)}>Restore demo</Button>
      ) : (
        <Button variant="outline" tone="danger" onClick={remove}>Delete INV-2041</Button>
      )}
    </>
  );
}
```
