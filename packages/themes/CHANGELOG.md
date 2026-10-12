# @nexub/themes

## 1.0.0

### Minor Changes

- 099ed36: Add the Liquid Glass material layer.
  - `@nexub/themes/glass` — a translucent material, orthogonal to light/dark, with a backdrop blur, hairline border, specular highlight, and a solid fallback under `prefers-reduced-transparency` / `prefers-contrast`.
  - `surface="glass"` on Card, Dialog, Popover, Drawer, and TopNav opts a surface into the material (defaults to `solid`, so existing usage is unchanged).
  - Fix: the `tone` prop now actually paints on Button, HelperText, and Label (previously a no-op).

### Patch Changes

- @nexub/tokens@1.0.0
