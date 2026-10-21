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
| `Toaster position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'bottom-right'` | Where toasts appear on screen. |
| `Toaster richColors` | `boolean` | `false` | Enables fully coloured backgrounds for success, error, warning, and info toasts. |
| `Toaster closeButton` | `boolean` | `false` | Renders a close button on each toast. |
| `toast.success(title, opts?)` (required) | `string` |  | Show a success toast with an optional options object. |
| `toast.error(title, opts?)` (required) | `string` |  | Show an error toast. |
| `toast.warning(title, opts?)` (required) | `string` |  | Show a warning toast. |
| `toast.info(title, opts?)` (required) | `string` |  | Show an info toast. |
| `toast.custom(title, opts?)` (required) | `string` |  | Show a default/custom toast. |
| `opts.description` | `string` |  | Secondary supporting text below the title. |
| `opts.duration` | `number` | `4000` | Time in ms before auto-dismiss. Use Infinity to persist. |
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
      <Toaster richColors />
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
