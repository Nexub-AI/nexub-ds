---
"@nexub/react": minor
---

**`CommandPalette.Root`**: new props and a focus fix.

- `scrollLock="class"` locks page scroll with the `nexub-scroll-lock` class instead of Radix's injected `<style>`, so the palette opens under `style-src 'self'`.
- `shouldFilter={false}` for results that are already filtered (async search), and `label` for the dialog's accessible name (default "Command palette"; also silences Radix's missing-title warning).
- Closing now returns focus to the element focused before it opened. Without a `Dialog.Trigger`, focus used to drop to `<body>`.
- The dialog keeps a 1rem margin each side on phones.
