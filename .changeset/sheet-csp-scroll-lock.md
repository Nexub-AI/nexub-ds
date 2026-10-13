---
"@nexub/react": minor
"@nexub/themes": minor
"@nexub/patterns": minor
---

**Strict CSP: `Sheet` / `Drawer` can lock scroll without an injected `<style>`.**
- New `scrollLock` prop on `Sheet.Root` / `Drawer.Root`: `"style"` (default, unchanged) or `"class"`. With `"class"`, page scroll is locked by the `nexub-scroll-lock` class from `@nexub/themes/base` on `<html>` (keeping the scrollbar's space, so nothing shifts) instead of Radix's injected `<style>` tag, which `style-src 'self'` blocks. The sheet stays modal: focus trap, hidden background for screen readers, Escape and outside-click still work.
- `SettingsLayout`'s phone menu uses `scrollLock="class"`, so it opens under a strict CSP with no console error and the page behind is locked.
- `@nexub/themes/base` also ships Radix's scrollbar-hiding rule for `ScrollArea` and `Select` viewports, so they look right when a strict CSP blocks Radix's `<style>` tag.
- New docs page, Getting Started → Strict CSP: which components are CSP-safe and how to use the others.
