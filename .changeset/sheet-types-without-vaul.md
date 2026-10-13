---
"@nexub/react": minor
---

**`Sheet` / `Drawer` are fully typed without `vaul`.** The published types imported `vaul`, which isn't a dependency (it's bundled), so `Sheet.Root` and its props resolved to `any` in apps. They're now declared in `@nexub/react` itself (new `DrawerRootProps` export), so `onOpenChange={(open) => …}` infers `boolean` with no extra installs. Apps can drop their `(open: boolean)` annotations. The build now fails if a `.d.ts` file imports `vaul`.
